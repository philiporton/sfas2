"use client";

import { useState, Suspense, useCallback, FormEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Form } from "react-bootstrap";
import useSFASStations from "../hooks/useSFASStations";
import { isValid, add, sub, format, compareDesc, differenceInDays  } from "date-fns";
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

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60000); // update every minute

        return () => clearInterval(interval);
    }, []);

    const fetchStationData = useCallback(async() => {
        if(station === null || station === undefined) return null; 
        
        try {
            const response = await fetch(`/api/station-data/${station.did}/${startDate}/${endDate}`);
            
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

        //check if the dates are even actual dates
        if(isValid(convertedStartDate) === false || isValid(convertedEndDate) === false) {
            return {error: "Invalid date format.", bool: true};
        }
        //check if the start date is before the end date
        if(compareDesc(convertedStartDate, convertedEndDate) !== 1) {
            return {error: "Start date must be before the end date", bool: true};
        }
        //check if the plot is greater than 7 days
        if(differenceInDays(convertedEndDate, convertedStartDate) > 7) {
            return {error: "Time periods for plots are limited to 7 days.", bool: true};
        }

        return {error: "", bool: false};
    }, 
    [endDate]);

    const endDateValidation = useCallback((endDate: string) => {

        const convertedStartDate = new Date(startDate);
        const convertedEndDate = new Date(endDate);

        //check if the dates are even actual dates
        if(isValid(convertedStartDate) === false || isValid(convertedEndDate) === false) {
            return {error: "Invalid date format.", bool: true};
        }
        //check if the start date is before the end date
        if(compareDesc(convertedStartDate, convertedEndDate) !== 1) {
            return {error: "End date must be after the start date.", bool: true};
        }
        //check if the plot is greater than 7 days
        if(differenceInDays(convertedEndDate, convertedStartDate) > 7) {
            return {error: "Time periods for plots are limited to 7 days.", bool: true};
        }
        //check if the end date is more than 4 days in the future
        if(differenceInDays(convertedEndDate, Date.now()) > 4) {
            return {error: "Dates may not be more than 4 days in the future.", bool: true };
        }

        return {error: "", bool: false};
    },
    [startDate]);

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
             
            if(startDate === null || startDate === undefined) {
                 plotStringURL.searchParams.append("start", initialStartDate);
            }
            else {
                 plotStringURL.searchParams.append("start", startDate);
            }
             
            if(endDate === null || endDate === undefined) {
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
            
            if(startDate === null || startDate === undefined) {
                plotStringURL.searchParams.append("start", initialStartDate);
            }
            else {
                plotStringURL.searchParams.append("start", startDate);
            }
        
            
            if(endDate === null || endDate === undefined) {
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

        if(startDateValidation(startDate).bool === false && endDateValidation(endDate).bool === false) {
            setStartDateError(startDateValidation(startDate));
            setEndDateError(endDateValidation(endDate));
            
            setPlotString(buildPlotString()); // build new plot and diff urls based on what is in the form at time of submission
            setDiffString(buildDiffString());
            
            const loadData = async() => {
                const data = await fetchStationData();
                setStationData(data);
            };

            loadData();
        }
        else {
            setStartDateError(startDateValidation(startDate));
            setEndDateError(endDateValidation(endDate));
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

    const formatDate = (date: Date) => {
        return date.toLocaleString("en-US", {
            month: "numeric",
            day: "numeric",
            weekday: "short",
            hour: "numeric",
            minute: "2-digit"
        });
        };

    const { obsData, forecastData, lowerData, upperData, floodMarkLines, floodMarkAreas, min, max} = useStationChartData(stationData, station, units, datum, timeZone);

    // runs after any change to dependencies
    useEffect(() => {
        if (stations && !loading && error === null && startDateValidation(startDate).bool === false && endDateValidation(endDate).bool === false) {
            setStartDateError(startDateValidation(startDate));
            setEndDateError(endDateValidation(endDate));
            setPlotString(buildPlotString());
            setDiffString(buildDiffString());
            
            const loadData = async() => {
                const data = await fetchStationData();
                setStationData(data);
            };

            loadData();
        }
    }, [loading, error, stations, buildPlotString, buildDiffString, startDateError.bool, endDateError.bool, startDateValidation, startDate, endDateValidation, endDate, fetchStationData]);
    
    return (
        <main>
            {station && stations && stationIds && !loading && error === null &&
                <div className="container mx-auto mt-5 mb-5">
                    <div className="grid grid-cols-1 auto-cols-max md:grid-cols-5 gap-4">
                        <div className="col-span-2 container p-5 text-center bg-[#e4e5e6] py-6 order-2">
                            <Form onSubmit={onFormSubmit}>
                                <h3 className="text-[#A32638]">SELECT YOUR CRITERIA:</h3>
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
                                
                                <button
                                    type="submit"
                                    className="stevens-red m-2 w-7/8 mt-4"
                                    style={{
                                        border: "2px solid #A32638",
                                        backgroundColor: "transparent",
                                        color: "#A32638"
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
                                        PLOT
                                    </div>
                                </button>
                                <hr></hr>
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
                            // TODO: The diff plot will be replaced with a highcharts diff plot
                            <div className="col-span-3 flex flex-col items-left order-1">
                                <h2 className="text-[#363636] mt-6 text-left ml-4">{station.title}</h2>
                                <div className="w-full flex flex-col items-center">
                                    <ReactECharts
                                    option={{
                                        tooltip: { trigger: "axis" },
                                        legend: { data: ["Observations", "Forecast"] },
                                        xAxis: { type: "time", axisLabel: { formatter: (value: number) => formatDate(new Date(value))}, },
                                        yAxis: { type: "value", min: min, max: max },
                                        series: [
                                        // confidence band
                                        {
                                            type: "line",
                                            data: lowerData,
                                            stack: "confidence",
                                            lineStyle: { opacity: 0 },
                                            symbol: "none"
                                        },
                                        {
                                            type: "line",
                                            data: upperData,
                                            stack: "confidence",
                                            lineStyle: { opacity: 0 },
                                            areaStyle: { color: "rgba(150,150,150,0.4)" },
                                            symbol: "none"
                                        },
                                        // forecast
                                        {
                                            name: "Forecast",
                                            type: "line",
                                            data: forecastData,
                                            showSymbol: false
                                        },
                                        // observations
                                        {
                                            name: "Observations",
                                            type: "line",
                                            data: obsData,
                                            showSymbol: false
                                        },
                                        // flood overlays
                                        {
                                            type: "line",
                                            data: [],
                                            markArea: {
                                            silent: true,
                                            data: floodMarkAreas
                                            },
                                            markLine: {
                                            symbol: "none",
                                            data: [
                                                ...floodMarkLines,
                                                {
                                                    xAxis: now.getTime(),
                                                    name: formatDate(now),
                                                    label: {
                                                        formatter: () => formatDate(now)
                                                    }
                                                }
                                            ]
                                            }
                                        }
                                        ]
                                    }}
                                    style={{ height: '300px', width: '700px'}}
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
                                            width={800}
                                            height={800}
                                            loading="eager"
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
