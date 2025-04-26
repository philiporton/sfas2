"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Form } from "react-bootstrap";
//import { getCurrentEpoch, timestampToStringISO } from "@/app/lib/date";
import useSFASStations from "../hooks/useSFASStations";
import Image from "next/image";
import { isValid, add, sub, format, compareDesc, differenceInDays  } from "date-fns";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
//import StationSelect from "../ui/stationDropdown";

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
    const [forecast, setForecast] = useState(station?.sfas_model);
    const [units, setUnits] = useState(unitsOptions[0]);
    const [timeZone, setTimeZone] = useState(timeZoneOptions[0]);

    
    const buildPlotString = useCallback(
        () => {
            //Future: some of these should throw errors
            const plotStringURL = new URL("https://hudson.dl.stevens-tech.edu/sfas/d/pfas_plot.php");

            if(stationId === null || stationId === undefined ) {
                return null;
            }
            
            plotStringURL.searchParams.append("id", stationId);
            plotStringURL.searchParams.append("did", stationId);
        
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

            //TODO: if the date validation fails, it should return an error or smth similar
            if(startDate === null || startDate === undefined || dateValidation(startDate, endDate) === false) {
                plotStringURL.searchParams.append("start", initialStartDate);
            }
            else {
                plotStringURL.searchParams.append("start", startDate);
            }
            
            //TODO: if the date validation fails, it should return an error or smth similar
            if(endDate === null || endDate === undefined || dateValidation(startDate, endDate) === false) {
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

            /*station && stationId && datum && endDate && startDate && timeZone && units
                ? `https://hudson.dl.stevens-tech.edu/sfas/d/pfas_plot.php?&id=${stationId}&did=${stationId}&diff=${station.diff - Number(station[`${datum.toLowerCase()}_diff` as keyof typeof station])}&mid=${station.mid}&mdiff=${station.mdiff - Number(station[`${datum.toLowerCase()}_diff` as keyof typeof station])}&units=${units}&start=${startDate}&end=${endDate}&time=${timeZone}&blowout_level=${station.blowout_level}&near_flood_level=${station.near_flood_level}&minor_flood_level=${station.minor_flood_level}&moderate_flood_level=${station.moderate_flood_level}&major_flood_level=${station.major_flood_level}&offset=${datum}&off=${station[`${datum.toLowerCase()}_diff` as keyof typeof station]}&tide_diff=${station.ext_tide_shift - Number(station[`${datum.toLowerCase()}_diff` as keyof typeof station])}&forecast=${forecast}&station_type=${station.station_type}&nothing=1`
                : null*/},
        [
            station,
            stationId,
            datum,
            endDate,
            startDate,
            timeZone,
            units,
            forecast,
            initialStartDate,
            initialEndDate,
        ]
    );
    
    const buildDiffString = useCallback(
        () => {
            const plotStringURL = new URL("https://hudson.dl.stevens-tech.edu/sfas/d/pfas_diff.php");

            if(stationId === null || stationId === undefined ) {
                return null;
            }
            
            plotStringURL.searchParams.append("id", stationId);
            plotStringURL.searchParams.append("did", stationId);
        
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

            //TODO: if the date validation fails, it should return an error or smth similar
            if(startDate === null || startDate === undefined || dateValidation(startDate, endDate) === false) {
                plotStringURL.searchParams.append("start", initialStartDate);
            }
            else {
                plotStringURL.searchParams.append("start", startDate);
            }
            
            //TODO: if the date validation fails, it should return an error or smth similar
            if(endDate === null || endDate === undefined || dateValidation(startDate, endDate) === false) {
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

            /*station && stationId && datum && endDate && startDate && units && timeZone
                ? `https://hudson.dl.stevens-tech.edu/sfas/d/pfas_diff.php?&id=${stationId}&did=${stationId}&diff=${station.diff - Number(station[`${datum.toLowerCase()}_diff` as keyof typeof station])}&mid=${station.mid}&mdiff=${station.mdiff - Number(station[`${datum.toLowerCase()}_diff` as keyof typeof station])}&units=${units}&start=${startDate}&end=${endDate}&time=${timeZone}&offset=${datum}&off=${station[`${datum.toLowerCase()}_diff` as keyof typeof station]}&tide_diff=${station.ext_tide_shift - Number(station[`${datum.toLowerCase()}_diff` as keyof typeof station])}&forecast=${forecast}&station_type=${station.station_type}&nothing=2`
                : null*/},
        [
            datum,
            endDate,
            startDate,
            station,
            stationId,
            timeZone,
            units,
            forecast,
            initialStartDate,
            initialEndDate
        ]
    );

    const [plotString, setPlotString] = useState(buildPlotString()); // set based on initial values, will be updated whenever form is submitted
    const [diffString, setDiffString] = useState(buildDiffString());

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setPlotString(buildPlotString()); // build new plot and diff urls based on what is in the form at time of submission
        setDiffString(buildDiffString());
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
            //console.log(differenceInDays(endDate, Date.now()));
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
    let options: OptionsOrGroups<unknown, GroupBase<unknown>> | undefined;
    if (stations != null) {
        options = stations.map(station => { return { value: station.did, label: station.title, } })
    }
    return (
        <main>
            {station && stations && stationIds && !loading && error === null &&
                <div className="container mx-auto mt-5 mb-5">
                    <div className="grid grid-cols-1 auto-cols-max md:grid-cols-5 gap-4">
                        <div className="col-span-2 container p-5 text-center bg-[#e4e5e6] py-6 order-2">
                            <Form onSubmit={onFormSubmit}>
                                <h3 className="text-[#A32638]">SELECT YOUR CRITERIA:</h3>
                                <Select
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    options={options} isSearchable={true} onChange={(e: any) => {
                                        setStationId(e?.value);
                                    }
                                    }
                                />
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
                                        if(forecast !== "ALL" && station[`${forecast.toLowerCase()}_diff` as keyof typeof station] !== 9999) {
                                            return (
                                                <option key={forecast} value={forecast}>
                                                    {forecastRemap(forecast)}
                                                </option>
                                            )
                                        }
                                        //TODO: Check if there is more than one option. If so, have an all models option. If not, don't
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
                        {stationId && station && plotString && diffString && (
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
                    </div>
                </div> 
                }
            </main>
    );
}