"use client";

import { useState, useEffect, Suspense, useCallback, FormEvent, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Form } from "react-bootstrap";
import useSFASStations from "../hooks/useSFASStations";
import { isValid, add, sub, format, compareDesc, differenceInDays  } from "date-fns";
import StationSelect from "../ui/stationDropdown";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { StationData } from "../types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

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

    //const [stationId, setStationId] = useState(suppliedStationId);

    const { state } = useSFASStations();
    const { stations, loading, error } = state;

    const station = suppliedStationId
        ? stations?.find((elem) => elem.id.toString() === suppliedStationId)
        : null;
    const stationIds = stations?.map((elem) => ({
        id: elem.id,
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
    const [, setDatum] = useState(datumOptions[0]);
    const [, setForecast] = useState(station?.sfas_model);
    const [, setUnits] = useState(unitsOptions[0]);
    const [, setTimeZone] = useState(timeZoneOptions[0]);

    const [startDateError, setStartDateError] = useState({error: "", bool: false});
    const [endDateError, setEndDateError] = useState({error: "", bool: false});
    const [stationData, setStationData] = useState<StationData[] | null>(null);
    const [dataLoading, setDataLoading] = useState(false);
    const [dataError, setDataError] = useState<string | null>(null);
    const [hasFetchedStationData, setHasFetchedStationData] = useState(false);

    const fetchStationData = useCallback(async (stationId: string, start: string, end: string) => {
        setDataLoading(true);
        setHasFetchedStationData(false);
        setDataError(null);
        try {
            const url = `/api/station-data/${stationId}/${start}/${end}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json() as StationData[];
                setStationData(data);
            } else {
                setDataError("Failed to fetch station data");
                setStationData(null);
            }
        } catch {
            setDataError("Error fetching station data");
            setStationData(null);        }
        setDataLoading(false);
        setHasFetchedStationData(true);
    }, []);

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

    const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(startDateValidation(startDate).bool === false && endDateValidation(endDate).bool === false) {
            setStartDateError(startDateValidation(startDate));
            setEndDateError(endDateValidation(endDate));
            if (suppliedStationId) {
                fetchStationData(suppliedStationId, startDate, endDate);
            }
        }
    };

    function forecastRemap(fr: string): string {
        if (fr === "OPSE01") {
            return "NYHOPS-E";
        }
        else if (fr === "ENS02") {
            return "SNAP-Ex";
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

    const observationSeries = useMemo(() => {
        if (!stationData || stationData.length === 0) {
            return [] as Array<{ name: string; type: "line"; data: [number, number][] }>;
        }

        const grouped = new Map<string, [number, number][]>();
        stationData.forEach((point) => {
            const timestamp = new Date(point.time).getTime();
            const value = Number(point.value);

            if (Number.isNaN(timestamp) || Number.isNaN(value)) {
                return;
            }

            const key = point.parameter || "Observation";
            if (!grouped.has(key)) {
                grouped.set(key, []);
            }

            grouped.get(key)?.push([timestamp, value]);
        });

        return Array.from(grouped.entries()).map(([name, data]) => ({
            name,
            type: "line" as const,
            data: data.sort((a, b) => a[0] - b[0])
        }));
    }, [stationData]);

    const observationUnit = useMemo(() => {
        if (!stationData || stationData.length === 0) {
            return "";
        }

        const units = Array.from(new Set(stationData.map((point) => point.unit).filter(Boolean)));
        if (units.length === 1) {
            return units[0];
        }

        return units.length > 1 ? "mixed units" : "";
    }, [stationData]);

    const options = useMemo<ApexOptions>(() => ({
        chart: {
            type: "line",
            stacked: false,
            height: 400,
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: 'zoom'
            },
        },
        title: { text: "Observed Station Data", align: "left" },
        xaxis: {
            type: "datetime",
            title: { text: "Time (GMT)" },
            tooltip: { enabled: false },
        },
        yaxis: {
            title: { text: observationUnit ? `Value (${observationUnit})` : "Value" },
        },
        stroke: {
            curve: "straight",
            width: 2,
        },
        markers: { size: 0 },
        tooltip: {
            shared: true,
            intersect: false,
            x: { format: 'yyyy-MM-dd HH:mm:ss' }
        },
        legend: {
            show: true,
        },
    }), [observationUnit]);

    const hasObservationData = observationSeries.length > 0;
    const shouldRenderApexChart = Boolean(suppliedStationId) && hasFetchedStationData;

    // runs after any change to dependencies
    useEffect(() => {
        if (stations && !loading && error === null && startDateValidation(startDate).bool === false && endDateValidation(endDate).bool === false) {
            setStartDateError(startDateValidation(startDate));
            setEndDateError(endDateValidation(endDate));

            if (suppliedStationId) {
                fetchStationData(suppliedStationId, startDate, endDate);
            }
        }
    }, [loading, error, stations, startDateValidation, startDate, endDateValidation, endDate, suppliedStationId, fetchStationData]);
    
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
                                        defaultValue={forecastRemap(station.sfas_model)}
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
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${station!.lat},${station!.lon}`}
                                    target="_blank"
                                >
                                    <div
                                        className="stevens-red m-2  mt-4"
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
                                            VIEW LOCATION ON GOOGLE MAPS
                                        </div>
                                    </div>
                                </a>
                            </Form>
                        </div>
                        <div className="col-span-3 flex flex-col items-left order-1">
                            <h2 className="text-[#363636] mt-6 text-left ml-4">{station.title}</h2>
                            <div className="w-full flex flex-col items-center">
                                {dataLoading ? (
                                    <div>Loading data...</div>
                                ) : shouldRenderApexChart ? (
                                    <>
                                        <div className="mt-3 w-full">
                                            <ReactApexChart options={options} series={observationSeries} type="line" height={400} width="100%" />
                                        </div>
                                        {!hasObservationData && (
                                            <div className="mt-2 text-sm text-[#555]">No observed station data is available for the selected range.</div>
                                        )}
                                        {dataError && (
                                            <div className="mt-2 text-sm text-red-700">{dataError}</div>
                                        )}
                                    </>
                                ) : (
                                    <div>Loading data...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div> 
                }
            </main>
    );


    /**
     * {suppliedStationId && station && plotString && diffString && (
                            <div className="col-span-3 flex flex-col items-left order-1">
                                <h2 className="text-[#363636] mt-6 text-left ml-4">{station.title}</h2>
                                <div className="w-full flex flex-col items-center">
                                    <Image
                                        className="mt-3"
                                        alt="graphic_img"
                                        src={plotString}
                                        sizes="100vw"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                        }}
                                        width={800}
                                        height={800}
                                    />
                                    <Image
                                        className="mt-3"
                                        src={diffString}
                                        alt="difference_img"
                                        sizes="100vw"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                        }}
                                        width={800}
                                        height={800}
                                    />
                                </div>

                            </div>
                        )}
     */
}