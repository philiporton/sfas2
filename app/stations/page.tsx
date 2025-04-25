"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Form } from "react-bootstrap";
//import { getCurrentEpoch, timestampToStringISO } from "@/app/lib/date";
import useSFASStations from "../hooks/useSFASStations";
import Image from "next/image";
import { isValid, add, sub, format, compareDesc, differenceInDays  } from "date-fns";

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

    const [stationId, setStationId] = useState(suppliedStationId);

    const { state } = useSFASStations();
    const { stations, loading, error } = state;

    const station = stationId
        ? stations?.find((elem) => elem.did === stationId)
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

    const allForecastOptions = ["OPSE01", "ENS02", "ESTOFS", "ETSS", "AHPS", "ALL"]; //"SNAP-Ex" = "ENS02", "NYHOPS-E" = "OPSE01"
    const unitsOptions = ["english", "metric"];
    const timeZoneOptions = ["ET", "GMT"];

    /*const initialStartDate = timestampToStringISO(
        getCurrentEpoch() - 1000 * 60 * 60 * 24 * 1
    ); // one day in the past, by default
    const initialEndDate = timestampToStringISO(
        getCurrentEpoch() + 1000 * 60 * 60 * 24 * 4
    ); // four days in the future, by default*/

    const initialStartDate = format(sub(Date.now(), { days: 1 }), 'yyyy-MM-dd');

    const initialEndDate = format(add(Date.now(), { days: 4 }), 'yyyy-MM-dd');

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [datum, setDatum] = useState(datumOptions[0]);
    //const [offset, setOffset] = useState(`navd88_offset`);
    const [forecast, setForecast] = useState(station?.sfas_model);
    const [units, setUnits] = useState(unitsOptions[0]);
    const [timeZone, setTimeZone] = useState(timeZoneOptions[0]);

    
    const buildPlotString = useCallback(
        () => 
            //Future: some of these should throw errors
        
            /*if(station === null || station === undefined) {
                return null;
            }
                
            if(stationId === null || stationId === undefined ) {
                return null;
            }

            if(startDate === null || startDate === undefined) {
                return null;
            }
                
            if(endDate === null || endDate === undefined) {
                return null;
            }

            if(datum === null || datum === undefined) {
                return null;
            }

            if(forecast === null || forecast === undefined) {
                return null;
            }
            if(units === null || units === undefined) {
                return null;
            }
            if(timeZone === null || timeZone === undefined) {
                return null;
            } 

            const plotStringURL = new URL("https://hudson.dl.stevens-tech.edu/sfas/d/pfas_plot.php");

            const offsetNum = Number(station[`${forecast.toLowerCase()}_diff` as keyof typeof station]);
            
            const diff = (station.diff - offsetNum).toString();
            const mdiff = (station.mdiff - offsetNum).toString();
            const tide_diff = (station.ext_tide_shift - offsetNum).toString();

            const plotStringParams = [["id", stationId], ["did", stationId], ["diff", diff], ["mid", station.mid], ["mdiff", mdiff], ["units", units], ["start", startDate], ["end", endDate], ["time", timeZone], ["blowout_level", station.blowout_level.toString()], ["near_flood_level", station.near_flood_level.toString()], 
                ["minor_flood_level", station.minor_flood_level.toString()], ["moderate_flood_level", station.moderate_flood_level.toString()], ["major_flood_level", station.major_flood_level.toString()], ["offset", datum], ["off", offsetNum.toString()], ["tide_diff", tide_diff], ["forecast", forecast], ["station_type", station.station_type], ["nothing", "1"]
            ]
            
            for(const param of plotStringParams) {
                plotStringURL.searchParams.append(param.at(0), param.at(1));
            }

            return plotStringURL.toString();*/

            station && stationId && datum && endDate && startDate && timeZone && units && forecast
                ? `https://hudson.dl.stevens-tech.edu/sfas/d/pfas_plot.php?&id=${stationId}&did=${stationId}&diff=${station.diff - Number(station[`${forecast.toLowerCase()}_diff` as keyof typeof station])}&mid=${station.mid}&mdiff=${station.mdiff - Number(station[`${forecast.toLowerCase()}_diff` as keyof typeof station])}&units=${units}&start=${startDate}&end=${endDate}&time=${timeZone}&blowout_level=${station.blowout_level}&near_flood_level=${station.near_flood_level}&minor_flood_level=${station.minor_flood_level}&moderate_flood_level=${station.moderate_flood_level}&major_flood_level=${station.major_flood_level}&offset=${datum}&off=${station[`${forecast.toLowerCase()}_diff` as keyof typeof station]}&tide_diff=${station.ext_tide_shift - Number(station[`${forecast.toLowerCase()}_diff` as keyof typeof station])}&forecast=${forecast}&station_type=${station.station_type}&nothing=1`
                : null,
        [
            station,
            stationId,
            datum,
            endDate,
            startDate,
            timeZone,
            units,
            forecast
        ]
    );
    
    const buildDiffString = useCallback(
        () =>
            station && stationId && datum && endDate && startDate && forecast && units && timeZone
                ? `https://hudson.dl.stevens-tech.edu/sfas/d/pfas_diff.php?&id=${stationId}&did=${stationId}&diff=${station.diff - Number(station[`${forecast.toLowerCase()}_diff` as keyof typeof station])}&mid=${station.mid}&mdiff=${station.mdiff - Number(station[`${forecast.toLowerCase()}_diff` as keyof typeof station])}&units=${units}&start=${startDate}&end=${endDate}&time=${timeZone}&offset=${datum}&off=${station[`${forecast.toLowerCase()}_diff` as keyof typeof station]}&tide_diff=${station.ext_tide_shift - Number(station[`${forecast.toLowerCase()}_diff` as keyof typeof station])}&forecast=${forecast}&station_type=${station.station_type}&nothing=2`
                : null,
        [
            datum,
            endDate,
            startDate,
            station,
            stationId,
            timeZone,
            units,
            forecast
        ]
    );

    const [plotString, setPlotString] = useState(buildPlotString()); // set based on initial values, will be updated whenever form is submitted
    const [diffString, setDiffString] = useState(buildDiffString());

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setPlotString(buildPlotString()); // build new plot and diff urls based on what is in the form at time of submission
        setDiffString(buildDiffString());
        //setNothingPlot(nothingPlot + 1);
        //setNothingDiff(nothingDiff + 1);
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

    //Returns true for isInvalid check
    function dateValidation(startDate: string, endDate: string): boolean {
        //check if the dates are even actual dates
        if(isValid(startDate) === false || isValid(endDate) === false) {
            return false;
        }
        //check if the start date is before the end date
        if(compareDesc(startDate, endDate) !== 1) {
            return false;
        }
        //check if the plot is greater than 7 days
        if(differenceInDays(endDate, startDate) > 7) {
            return false;
        }
        //check if the end date is more than 4 days in the future
        if(differenceInDays(endDate, Date.now()) > 4) {
            return false;
        }


        return true;
    }

    // runs on initial load to set the plot string, since it's not going to be set until stations have loaded
    useEffect(() => {
        if (stations && !loading && error === null) {
            setPlotString(buildPlotString());
            setDiffString(buildDiffString());
        }
    }, [loading, error, stations, buildPlotString, buildDiffString]);

    return (
        <main>
            {station && stations && stationIds && !loading && error === null && (
                <div className="grid grid-cols-1 auto-cols-max md:grid-cols-5">
                    <div className="col-span-2 container p-5  text-center bg-[#e4e5e6] py-6 order-2">
                        <Form onSubmit={onFormSubmit}>
                            <h3 className="text-[#A32638]">
                                SELECT YOUR CRITERIA:
                            </h3>

                            <Form.Group className="m-3" id="station-group">
                                <p>Stations are listed from North and South</p>
                                <Form.Label htmlFor="station">
                                    Station
                                </Form.Label>
                                <Form.Select
                                    id="station"
                                    defaultValue={suppliedStationId ?? ""}
                                    onChange={(e) => {
                                        setStationId(e.target.value);
                                    }}
                                    required
                                >
                                    <option disabled value="">
                                        Select a station to display time series
                                        plot
                                    </option>
                                    {stationIds.map(({ did, title }) => (
                                        <option key={did} value={did}>
                                            {title}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                        <Form.Group className="row m-3" id="dates-group">
                            <div className="col">
                                <Form.Label htmlFor="start-date">
                                    Start Date
                                </Form.Label>
                                <Form.Control
                                    id="start-date"
                                    type="date"
                                    defaultValue={initialStartDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                    }}
                                    required
                                    isInvalid={dateValidation(startDate, endDate)}
                                />
                                <Form.Control.Feedback type="invalid"> Invalid Start Date </Form.Control.Feedback>
                            </div>
                            <div className="col">
                                <Form.Label htmlFor="end-date">End Date</Form.Label>
                                <Form.Control
                                    id="end-date"
                                    type="date"
                                    defaultValue={initialEndDate}
                                    onChange={(e) => { 
                                        setEndDate(e.target.value);
                                    }}
                                    required
                                    isInvalid={dateValidation(startDate, endDate)}
                                />
                                <Form.Control.Feedback type="invalid"> Invalid End Date </Form.Control.Feedback>
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
                                    {allForecastOptions.map((forecast) => {
                                        if(station[`${forecast.toLowerCase()}_diff` as keyof typeof station] !== 9999 || forecast === "ALL") {
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
                    {stationId && station && plotString && diffString && (
                        <div className="col-span-3 order-1">
                            <h2 className="text-[#363636] mt-6 text-center">
                                {station.title}
                            </h2>
                            <h5 className="text-[#363636] text-left ml-4">
                                Water Level Relative to {datum} Datum (ft).
                                Times in ET
                            </h5>
                            <div className="">
                                <Image
                                    className="mt-3"
                                    alt="graphic_img"
                                    src={plotString}
                                    sizes="100vw"
                                    style={{
                                        width: "100%",
                                        height: "auto"
                                    }}
                                    width={200}
                                    height={200}
                                ></Image>
                                <Image
                                    src={diffString}
                                    alt="difference_img"
                                    sizes="100vw"
                                    style={{
                                        width: "100%",
                                        height: "auto"
                                    }}
                                    width={200}
                                    height={200}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
