"use client";

import { useState, Suspense, useCallback, FormEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Form } from "react-bootstrap";
import useSFASStations from "../hooks/useSFASStations";
import { isValid, add, sub, format, compareDesc, differenceInDays, differenceInHours, parseISO  } from "date-fns";
import StationSelect from "../ui/stationDropdown";
import Image from "next/image";
import ReactECharts from 'echarts-for-react';
import { StationDataType } from "../types";
import { useStationChartData } from "../hooks/useStationChartData";

export default function Station() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StationComponent />
        </Suspense>
    );
}

function StationComponent() {
    const params = useSearchParams();
    const suppliedStationId = params.get("stationId");

    const { state } = useSFASStations();
    const { stations, loading, error } = state;

    const station = suppliedStationId
        ? stations?.find((elem) => elem.did === suppliedStationId)
        : null;

    const stationIds = stations?.map((elem) => ({
        did: elem.did,
        title: elem.title
    }));

    const datumOptions = [
        "NAVD88", 
        "NGVD29",
        "MLLW",
        "MLW",
        "MSL",
        "MTL",
        "DTL",
        "MHW",
        "MHHW"
    ];

    const allForecastOptions = ["OPSE01", "ENS02", "ESTOFS", "ETSS", "AHPS"]; //"SNAP-Ex" = "ENS02", "NYHOPS-E" = "OPSE01"

    let forecastOptions : string[];
    if(station !== null && station !== undefined) {
        forecastOptions = allForecastOptions.filter((fc) => station[`${fc.toLowerCase()}_diff` as keyof typeof station] !== 9999);
    }
    else {
        forecastOptions = allForecastOptions;
    }
    
    if(forecastOptions.length > 1) {
        forecastOptions.push("ALL");
    }

    const unitsOptions = ["english", "metric"];
    const timeZoneOptions = ["ET", "GMT"];

    const initialStartDate = format(sub(Date.now(), { days: 1 }), 'yyyy-MM-dd');

    const initialEndDate = format(add(Date.now(), { days: 4 }), 'yyyy-MM-dd');

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [datum, setDatum] = useState(datumOptions[0]);
    const [forecast, setForecast] = useState(station?.sfas_model);
    const [units, setUnits] = useState(unitsOptions[0]);
    const [timeZone, setTimeZone] = useState(timeZoneOptions[0]);

    const [startDateError, setStartDateError] = useState({error: "", bool: false});
    const [endDateError, setEndDateError] = useState({error: "", bool: false});

    const [legacyPlotsEnabled, setLegacyPlotsEnabled] = useState(false);

    const getDefaultVisibleSpanMs = () => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return Math.max(0, end - start);
    };

    const [visibleSpanMs, setVisibleSpanMs] = useState<number>(getDefaultVisibleSpanMs);

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60000); // update every minute

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setVisibleSpanMs(getDefaultVisibleSpanMs());
    }, [startDate, endDate]);

    const fetchStationData = useCallback(async() => {
        if(station === null || station === undefined) return null; 

        //This is done to make the behavior the same as the legacy plots. When the legacy plots are given a date, such as 7/23, the plot includes everything on that day up til midnight.
        //For the azure function, it queries up to the end date, which would not include everything that happened on 7/23 for example. So the quick fix is to add a day to the end date and search there.
        const fixedEndDate = format(add(parseISO(endDate), { days: 1}), 'yyyy-MM-dd');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AZURE_FUNCTION_URL}/api/station-data/${station.did}/${startDate}/${fixedEndDate}`);
            
            if (!response.ok) return null;

            const data = await response.json();

            return data as StationDataType;
        } catch {
            return null;
        }
    }, [station, startDate, endDate]);

    const startDateValidation = useCallback((startDate: string) => {

        const convertedStartDate = new Date(startDate);
        const convertedEndDate = new Date(endDate);

        if(legacyPlotsEnabled === true) {
            if(isValid(convertedStartDate) === false || isValid(convertedEndDate) === false) {
                return {error: "Invalid date format.", bool: true};
            }
            
            if(compareDesc(convertedStartDate, convertedEndDate) !== 1) {
                return {error: "Start date must be before the end date", bool: true};
            }
            
            if(differenceInDays(convertedEndDate, convertedStartDate) > 7) {
                return {error: "Time periods for plots are limited to 7 days.", bool: true};
            }
        }
        else {
            if(isValid(convertedStartDate) === false || isValid(convertedEndDate) === false) {
                return {error: "Invalid date format.", bool: true};
            }
            
            if(compareDesc(convertedStartDate, convertedEndDate) === -1) {
                return {error: "Start date must be before the end date", bool: true};
            }
            
            if(differenceInDays(convertedEndDate, convertedStartDate) > 31) {
                return {error: "Time periods for plots are limited to 31 days.", bool: true};
            }
        }
        return {error: "", bool: false};
    }, 
    [endDate, legacyPlotsEnabled]);

    const endDateValidation = useCallback((endDate: string) => {

        const convertedStartDate = new Date(startDate);
        const convertedEndDate = new Date(endDate);

        if(legacyPlotsEnabled === true) {
            if(isValid(convertedStartDate) === false || isValid(convertedEndDate) === false) {
                return {error: "Invalid date format.", bool: true};
            }
            
            if(compareDesc(convertedStartDate, convertedEndDate) !== 1) {
                return {error: "End date must be after the start date.", bool: true};
            }
            
            if(differenceInDays(convertedEndDate, convertedStartDate) > 7) {
                return {error: "Time periods for plots are limited to 7 days.", bool: true};
            }
            
            if(differenceInDays(convertedEndDate, Date.now()) > 4) {
                return {error: "Dates may not be more than 4 days in the future.", bool: true };
            }
        }
        else {
            if(isValid(convertedStartDate) === false || isValid(convertedEndDate) === false) {
                return {error: "Invalid date format.", bool: true};
            }
        
            if(compareDesc(convertedStartDate, convertedEndDate) === -1) {
                return {error: "End date must be after the start date.", bool: true};
            }
            
            if(differenceInDays(convertedEndDate, convertedStartDate) > 31) {
                return {error: "Time periods for plots are limited to 31 days.", bool: true};
            }
        }

        return {error: "", bool: false};
    },
    [startDate, legacyPlotsEnabled]);

    const buildPlotString = useCallback(
        () => {
            const plotStringURL = new URL("https://hudson.dl.stevens-tech.edu/sfas/d/pfas_plot.php");

            if(station === null || station === undefined) {
                return null;
            }
            
            plotStringURL.searchParams.append("id", station.did);
            plotStringURL.searchParams.append("did", station.did);
        
            if(station === null || station === undefined) {
                return null;
            }

            if(datum === null || datum === undefined) {
                return null;
            }
            
            const offsetNum = Number(station[`${datum.toLowerCase()}_offset` as keyof typeof station]);
            
            const diff = station.diff - offsetNum;
            const mdiff = station.mdiff - offsetNum;
            const tide_diff = station.ext_tide_shift - offsetNum;

            plotStringURL.searchParams.append("diff", diff.toString());
            plotStringURL.searchParams.append("mid", station.mid);
            plotStringURL.searchParams.append("mdiff", mdiff.toString());

            if(units === null || units === undefined) {
                return null;
            }
            else {
                plotStringURL.searchParams.append("units", units);
            }
             
            if(startDate === null || startDate === undefined || startDateError.bool === true) {
                 plotStringURL.searchParams.append("start", initialStartDate);
            }
            else {
                 plotStringURL.searchParams.append("start", startDate);
            }
             
            if(endDate === null || endDate === undefined || endDateError.bool === true) {
                 plotStringURL.searchParams.append("end", initialEndDate);
            }
            else {
                 plotStringURL.searchParams.append("end", endDate);
            }

            
            if(timeZone === null || timeZone === undefined) {
                return null;
            }
            else {
                plotStringURL.searchParams.append("time", timeZone);
            }

            plotStringURL.searchParams.append("blowout_level", station.blowout_level.toString());
            plotStringURL.searchParams.append("near_flood_level", station.near_flood_level.toString());
            plotStringURL.searchParams.append("minor_flood_level", station.minor_flood_level.toString());
            plotStringURL.searchParams.append("moderate_flood_level", station.moderate_flood_level.toString());
            plotStringURL.searchParams.append("major_flood_level", station.major_flood_level.toString());

            if(forecast === null || forecast === undefined) {
                plotStringURL.searchParams.append("forecast", station.sfas_model);
            }
            else {
                plotStringURL.searchParams.append("forecast", forecast);
            }

            plotStringURL.searchParams.append("offset", datum);
            plotStringURL.searchParams.append("off", offsetNum.toString());
            plotStringURL.searchParams.append("tide_diff", tide_diff.toString());
            plotStringURL.searchParams.append("station_type", station.station_type);
            plotStringURL.searchParams.append("nothing", "1");
            
            return plotStringURL.toString();

            },
        [station, datum, units, startDate, endDate, timeZone, forecast, initialStartDate, initialEndDate]
    );
    
    const buildDiffString = useCallback(
        () => {
            const plotStringURL = new URL("https://hudson.dl.stevens-tech.edu/sfas/d/pfas_diff.php");

            if(station === null || station === undefined) {
                return null;
            }
            
            plotStringURL.searchParams.append("id", station.did);
            plotStringURL.searchParams.append("did", station.did);
        
            if(station === null || station === undefined) {
                return null;
            }

            if(datum === null || datum === undefined) {
                return null;
            }
            
            const offsetNum = Number(station[`${datum.toLowerCase()}_offset` as keyof typeof station]);
            
            const diff = station.diff - offsetNum;
            const mdiff = station.mdiff - offsetNum;
            const tide_diff = station.ext_tide_shift - offsetNum;

            plotStringURL.searchParams.append("diff", diff.toString());
            plotStringURL.searchParams.append("mid", station.mid);
            plotStringURL.searchParams.append("mdiff", mdiff.toString());

            if(units === null || units === undefined) {
                return null;
            }
            else {
                plotStringURL.searchParams.append("units", units);
            }
            
            if(startDate === null || startDate === undefined || startDateError.bool === true) {
                plotStringURL.searchParams.append("start", initialStartDate);
            }
            else {
                plotStringURL.searchParams.append("start", startDate);
            }
        
            
            if(endDate === null || endDate === undefined || endDateError.bool === true) {
                plotStringURL.searchParams.append("end", initialEndDate);
            }
            else {
                plotStringURL.searchParams.append("end", endDate);
            }

            if(timeZone === null || timeZone === undefined) {
                return null;
            }
            else {
                plotStringURL.searchParams.append("time", timeZone);
            }

            plotStringURL.searchParams.append("blowout_level", station.blowout_level.toString());
            plotStringURL.searchParams.append("near_flood_level", station.near_flood_level.toString());
            plotStringURL.searchParams.append("minor_flood_level", station.minor_flood_level.toString());
            plotStringURL.searchParams.append("moderate_flood_level", station.moderate_flood_level.toString());
            plotStringURL.searchParams.append("major_flood_level", station.major_flood_level.toString());

            if(forecast === null || forecast === undefined) {
                plotStringURL.searchParams.append("forecast", station.sfas_model);
            }
            else {
                plotStringURL.searchParams.append("forecast", forecast);
            }

            plotStringURL.searchParams.append("offset", datum);
            plotStringURL.searchParams.append("off", offsetNum.toString());
            plotStringURL.searchParams.append("tide_diff", tide_diff.toString());
            plotStringURL.searchParams.append("station_type", station.station_type);
            plotStringURL.searchParams.append("nothing", "2");
            
            return plotStringURL.toString();

            },
        [datum, endDate, startDate, station, timeZone, units, forecast, initialStartDate, initialEndDate]
    );

    const [plotString, setPlotString] = useState(buildPlotString()); // set based on initial values, will be updated whenever form is submitted
    const [diffString, setDiffString] = useState(buildDiffString());
    const [stationData, setStationData] = useState<StationDataType | null>(null);
    

    const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nextStartDateError = startDateValidation(startDate);
        const nextEndDateError = endDateValidation(endDate);

        setStartDateError(nextStartDateError);
        setEndDateError(nextEndDateError);

        if(nextStartDateError.bool === false && nextEndDateError.bool === false) {
            setPlotString(buildPlotString()); // build new plot and diff urls based on what is in the form at time of submission
            setDiffString(buildDiffString());
        }
    };

    function forecastRemap(fr: string): string {
        if (fr === "OPSE01") {
            return "SFAS NYHOPS-E";
        }
        else if (fr === "ENS02") {
            return "SFAS SNAP-Ex";
        } else if (fr === "ALL") {
            return "All Models";
        } else {
            return fr;
        }
    }

    function unitRemap(unit: string): string {
        if (unit === "english") {
            return "Imperial";
        } else if (unit === "metric") {
            return "Metric";
        }
        else {
            return unit;
        }
    }

    const HOUR = 60 * 60 * 1000;
    const DAY = 24 * HOUR;

    const interval = visibleSpanMs >= 72 * HOUR
            ? DAY
            : visibleSpanMs >= 48 * HOUR
                ? 12 * HOUR
                : visibleSpanMs >= 24 * HOUR
                    ? 6 * HOUR
                    : visibleSpanMs >= 6 * HOUR
                        ? HOUR
                        : undefined;

    const getTimeZoneId = (tz?: string) => tz === 'ET' ? 'America/New_York' : 'UTC';

    const formatTooltipDate = (date: Date, tz?: string) => {
        const timeZone = getTimeZoneId(tz);
        return new Intl.DateTimeFormat('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone,
            timeZoneName: 'shortGeneric'
        }).format(date);
    };

    const formatAxisDate = (date: Date, tz?: string, interval?: number) => {
        const timeZone = getTimeZoneId(tz);
        //const spanHours = spanMs ? Math.max(1, Math.round(spanMs / (1000 * 60 * 60))) : undefined;

        switch (interval) {
        case DAY:
            return new Intl.DateTimeFormat("en-US", {
                month: "numeric",
                day: "numeric",
                weekday: "short",
                timeZone
            }).format(date);

        case 12 * HOUR:
            return new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                hour12: true,
                timeZone
            }).format(date);

        case 6 * HOUR:
            return new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                hour12: true,
                timeZone
            }).format(date);

        case HOUR:
            return new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone
            }).format(date);

        default:
            return new Intl.DateTimeFormat("en-US", {
                minute: "2-digit",
                second: "2-digit",
                timeZone
            }).format(date);
        }
    };

    const chartEvents = {
        datazoom: (params: any) => {
            const batch = Array.isArray(params.batch) ? params.batch[0] : params;
            const startValue = batch?.startValue;
            const endValue = batch?.endValue;
            const start = batch?.start;
            const end = batch?.end;

            if (typeof startValue === 'number' && typeof endValue === 'number') {
                setVisibleSpanMs(Math.max(0, endValue - startValue));
                return;
            }

            if (typeof start === 'number' && typeof end === 'number' && start >= 0 && end <= 100) {
                const fullSpan = getDefaultVisibleSpanMs();
                setVisibleSpanMs(Math.max(0, (end - start) / 100 * fullSpan));
            }
        },
        restore: () => {
            setVisibleSpanMs(getDefaultVisibleSpanMs());
        }
    };

    const { obsData, forecastData, lowerData, upperData, floodMarkLines, floodMarkAreas, min, max} = useStationChartData(stationData, station, units, datum);

    useEffect(() => {
        if (stations && !loading && error === null) {
            const nextStartDateError = startDateValidation(startDate);
            const nextEndDateError = endDateValidation(endDate);

            setStartDateError(nextStartDateError);
            setEndDateError(nextEndDateError);

            if (nextStartDateError.bool === true || nextEndDateError.bool === true) {
                return;
            }

            setPlotString(buildPlotString());
            setDiffString(buildDiffString());
        }
    }, [stations, loading, error, startDateValidation, endDateValidation, startDate, endDate, buildPlotString, buildDiffString]);

    useEffect(() => {
        if (stations && !loading && error === null) {
            const nextStartDateError = startDateValidation(startDate);
            const nextEndDateError = endDateValidation(endDate);

            if (nextStartDateError.bool === true || nextEndDateError.bool === true) {
                return;
            }

            let isSubscribed = true;

            const loadData = async() => {
                const data = await fetchStationData();

                if (isSubscribed) {
                    setStationData(data);
                }
            };

            loadData();

            return () => {
                isSubscribed = false;
            };
        }
    }, [stations, loading, error, startDateValidation, endDateValidation, startDate, endDate, fetchStationData]);
    
    return (
        <main>
            {station && stations && stationIds && !loading && error === null &&
                <div className="container mx-auto mt-5 mb-5">
                    <div className="grid grid-cols-1 auto-cols-max md:grid-cols-5 gap-4">
                        <div className="col-span-2 container p-5 text-center bg-[#e4e5e6] py-6 order-2">
                            <Form onSubmit={onFormSubmit}>
                                <h3 className="text-[#A32638] font-bold text-center leading-tight">SELECT YOUR CRITERIA:</h3>
                                <br></br>
                                <StationSelect />
                                <Form.Group className="row m-3" id="dates-group">
                                    <div className="col">
                                        <Form.Label htmlFor="startDate">
                                            Start Date
                                        </Form.Label>
                                        <Form.Control
                                            id="startDate"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                setStartDateError(startDateValidation(e.target.value));
                                            }}
                                            required
                                            isInvalid={startDateError.bool}
                                        />
                                        <Form.Control.Feedback type="invalid"> {startDateError.error} </Form.Control.Feedback>
                                    </div>
                                    <div className="col">
                                        <Form.Label htmlFor="endDate">End Date</Form.Label>
                                        <Form.Control
                                            id="endDate"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => { 
                                                setEndDate(e.target.value);
                                                setEndDateError(endDateValidation(e.target.value));
                                            }}
                                            required
                                            isInvalid={endDateError.bool}
                                        />
                                        <Form.Control.Feedback type="invalid"> {endDateError.error} </Form.Control.Feedback>
                                    </div>
                                </Form.Group>

                                <Form.Group className="m-3" id="options-group">
                                    <Form.Label htmlFor="datum">Datum</Form.Label>
                                    <Form.Select
                                        id="datum"
                                        defaultValue={datumOptions[0]}
                                        onChange={(e) => {
                                            setDatum(e.target.value);
                                        }}
                                        required
                                    >
                                        {datumOptions.map((datum) => (
                                            <option key={datum} value={datum}>
                                                {datum}
                                            </option>
                                        ))}
                                    </Form.Select>

                                    <Form.Label htmlFor="forecast">
                                        Forecast
                                    </Form.Label>
                                    <Form.Select
                                        id="forecast"
                                        defaultValue={station.sfas_model}
                                        onChange={(e) => {
                                            setForecast(e.target.value);
                                        }}
                                        required
                                    >
                                        {forecastOptions.map((forecast) => {
                                            if(forecast !== "ALL" && station[`${forecast.toLowerCase()}_diff` as keyof typeof station] !== 9999) {
                                                return (
                                                    <option key={forecast} value={forecast}>
                                                        {forecastRemap(forecast)}
                                                    </option>
                                                )
                                            }
                                            else if(forecast === "ALL") {
                                                return (
                                                    <option key={forecast} value={forecast}>
                                                        {forecastRemap(forecast)}
                                                    </option>
                                                )
                                            }
                                        })}
                                    </Form.Select>

                                    <Form.Label htmlFor="units">Units</Form.Label>
                                    <Form.Select
                                        id="units"
                                        defaultValue={unitsOptions[0]}
                                        onChange={(e) => {
                                            setUnits(e.target.value);
                                        }}
                                        required
                                    >
                                        {unitsOptions.map((unit) => (
                                            <option
                                                key={unit}
                                                value={unit}
                                            >{unitRemap(unit)}</option>
                                        ))}
                                    </Form.Select>

                                    <Form.Label htmlFor="timezone">
                                        Time Zone
                                    </Form.Label>
                                    <Form.Select
                                        id="timezone"
                                        defaultValue={timeZoneOptions[0]}
                                        onChange={(e) => {
                                            setTimeZone(e.target.value);
                                        }}
                                        required
                                    >
                                        {timeZoneOptions.map((tz) => (
                                            <option key={tz} value={tz}>
                                                {tz === "ET" ? "Eastern Local" : tz}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <br></br>
                                <button
                                    type="button"
                                    className="stevens-red m-2 w-7/8 mb-4"
                                    style={{
                                            border: "2px solid #A32638",
                                            backgroundColor: "transparent",
                                            color: "#A32638"
                                    }}
                                    onClick={() => {
                                        if(legacyPlotsEnabled === false) {
                                            setLegacyPlotsEnabled(true);
                                        } else {
                                            setLegacyPlotsEnabled(false);
                                        }
                                    }}
                                >
                                    <div
                                        className="text-center p-2 m-1 font-bold"
                                        style={{
                                            border: "2px solid #7F7F7F",
                                            backgroundColor: "transparent",
                                            color: "#A32638"
                                        }}
                                    >
                                        ENABLE/DISABLE LEGACY PLOTS
                                    </div>
                                </button>
                            </Form>
                        </div>
                            {legacyPlotsEnabled === false && diffString && stationData && stationData !== null && (
                            <div className="col-span-3 flex flex-col items-start order-1">
                                <h2 className="text-[#363636] mt-6 text-left ml-1">{station.title}</h2>
                                <div className="w-full flex flex-col items-start ml-0">
                                    <ReactECharts
                                    onEvents={chartEvents}
                                    option={{
                                        tooltip: {
                                            trigger: "axis",
                                            triggerOn: "mousemove",
                                            axisPointer: {
                                                type: "line",
                                                snap: true,
                                                lineStyle: { color: "transparent" },
                                            },
                                            formatter: (params: any) => {
                                                // params is an array of series values for the hovered x
                                                const unitLabel = units === 'english' ? 'ft' : 'm';
                                                const findByName = (name: string) => params.find((p: any) => p.seriesName === name);
                                                const p5 = findByName('5% chance to exceed');
                                                const forecast = findByName('Forecast');
                                                const p95 = findByName('95% chance to exceed');
                                                const obs = findByName('Observations');

                                                const sample = p5 || forecast || p95 || obs || params[0];
                                                const timeLabel = formatTooltipDate(new Date(sample.data[0]), timeZone);

                                                const fmt = (p: any) => p ? `${Number(p.data[1]).toFixed(2)} ${unitLabel}` : '—';
                                                const marker = (p: any) => `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p?.color||'#000'};margin-right:6px"></span>`;

                                                let html = `<div style="font-weight:700;margin-bottom:6px">${timeLabel}</div>`;
                                                html += `<div>${marker(p5)}5%: ${fmt(p5)}</div>`;
                                                html += `<div>${marker(forecast)}Forecast: ${fmt(forecast)}</div>`;
                                                html += `<div>${marker(p95)}95%: ${fmt(p95)}</div>`;
                                                if (obs) html += `<div style="margin-top:6px">${marker(obs)}Observations: ${fmt(obs)}</div>`;
                                                return html;
                                            }
                                        },
                                        toolbox: {
                                            feature: {
                                                restore: {
                                                    show: true
                                                },
                                                saveAsImage: {
                                                    show: true,
                                                    name: `${station.title} at ${new Intl.DateTimeFormat("en-US", { dateStyle: 'short', timeStyle: 'long', timeZone: 'UTC'
                                                    }).format(now)}`
                                                },
                                            }
                                        },
                                        // enable inside zoom (mouse wheel + drag)
                                        dataZoom: [
                                            { type: 'inside', xAxisIndex: 0, zoomOnMouseWheel: true, moveOnMouseMove: true }
                                        ],
                                        legend: { data: ["Observations", "Forecast", "95% chance to exceed", "5% chance to exceed"], left: "center" },
                                        grid: { left: "8%", right: "16%", top: "10%", bottom: "60", containLabel: true },
                                        useUTC: timeZone === 'ET' ? false : true,
                                        xAxis: {
                                            type: "time",
                                            axisPointer: { snap: true },
                                            axisLabel: {
                                                formatter: (value: string) => formatAxisDate(new Date(value), timeZone, interval),
                                                align: "center",
                                                //rotate: visibleSpanMs < 48 * HOUR ? 45 : 0,
                                                //margin: 15,
                                                hideOverlap: true,
                                            },
                                            //interval: interval,
                                            axisTick: {
                                                show: true,
                                                alignWithLabel: true,
                                                inside: true,
                                                length: 10
                                            },
                                            splitLine: { show: false },
                                            minorTick: {
                                                show: false
                                            },
                                            position: 'bottom',
                                            axisLine: {
                                                onZero: false,
                                            },
                                        },
                                        yAxis: {
                                            type: "value",
                                            name: `water level (${units === 'english' ? 'ft' : 'm'} above ${datum})`,
                                            nameLocation: "end",
                                            //nameGap: 50,
                                            //nameRotate: 90,
                                            axisLabel: { formatter: (value: number) => `${value.toFixed(1)} ${units === 'english' ? 'ft' : 'm'}` },
                                            min: min,
                                            max: max
                                        },
                                        series: [
                                        // flood overlays
                                        {
                                            type: "line",
                                            data: [],
                                            silent: true,
                                            tooltip: { show: false },
                                            markArea: {
                                            silent: true,
                                            data: floodMarkAreas
                                            },
                                            markLine: {
                                            symbol: "none",
                                            label: { position: "end", color: "#22356f" },
                                            data: [
                                                ...floodMarkLines,
                                                {
                                                    xAxis: now.getTime(),
                                                    name: formatTooltipDate(now, timeZone),
                                                    label: {
                                                        formatter: () => formatTooltipDate(now, timeZone),
                                                        position: "end",
                                                        color: "#363636"
                                                    }
                                                }
                                            ]
                                            }
                                        },
                                        // forecast
                                        {
                                            name: "Forecast",
                                            type: "line",
                                            data: forecastData,
                                            showSymbol: false,
                                            tooltip: { show: true },
                                            lineStyle: { width: 2, color: "#0066cc" },
                                            itemStyle: { color: "#0066cc" }
                                        },
                                        // lower bound
                                        {
                                            name: "95% chance to exceed",
                                            type: "line",
                                            data: lowerData,
                                            showSymbol: false,
                                            tooltip: { show: true },
                                            lineStyle: { type: "dashed", width: 1.5, color: "#66b3ff" },
                                            itemStyle: { color: "#66b3ff" }
                                        },
                                        // upper bound
                                        {
                                            name: "5% chance to exceed",
                                            type: "line",
                                            data: upperData,
                                            showSymbol: false,
                                            tooltip: { show: true },
                                            lineStyle: { type: "dashed", width: 1.5, color: "#66b3ff" },
                                            itemStyle: { color: "#66b3ff" }
                                        },
                                        // observations (rendered last, on top)
                                        {
                                            name: "Observations",
                                            type: "line",
                                            data: obsData,
                                            showSymbol: false,
                                            tooltip: { show: true },
                                            lineStyle: { width: 4, color: "#ff6600" },
                                            itemStyle: { color: "#ff6600" },
                                            z: 10
                                        }
                                        ]
                                    }}
                                    style={{ height: '450px', width: '100%'}}
                                    />
                                </div>
                            </div>
                            )}
                            {plotString && diffString && legacyPlotsEnabled && (
                                <div className="col-span-3 flex flex-col items-left order-1">
                                    <h2 className="text-[#363636] mt-6 text-left ml-4">{station.title}</h2>
                                    <div className="w-full flex flex-col items-center">
                                        <Image
                                            className="mt-3"
                                            alt="graphic_img"
                                            src={plotString}
                                            sizes="100vw"
                                            style={{
                                            width: 'auto',
                                            height: 'auto',
                                            }}
                                            width={700}
                                            height={700}
                                            loading="eager"
                                        />
                                        <Image
                                            className="mt-3"
                                            src={diffString}
                                            alt="difference_img"
                                            sizes="100vw"
                                            style={{
                                            width: 'auto',
                                            height: 'auto',
                                            }}
                                            width={700}
                                            height={700}
                                            loading="eager"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div> 
                }
            </main>
    );
}
