"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Form, Button } from "react-bootstrap";

import { getCurrentEpoch, timestampToStringISO } from "@/app/lib/date";
import useSFASStations from "../hooks/useSFASStations";

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
    const forecastOptions = ["SNAP-Ex", "ESTOFS", "ETSS", "ALL"];
    const unitsOptions = ["english", "metric"];
    const timeZoneOptions = ["ET", "GMT"];

    const initialStartDate = timestampToStringISO(getCurrentEpoch());
    const initialEndDate = timestampToStringISO(getCurrentEpoch() + (1000 * 60 * 60 * 24 * 4)); // four days in the future, by default

    const [stationId, setStationId] = useState(suppliedStationId);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [datum, setDatum] = useState(datumOptions[0]);
    const [forecast, setForecast] = useState(forecastOptions[0]);
    const [units, setUnits] = useState(unitsOptions[0]);
    const [timeZone, setTimeZone] = useState(timeZoneOptions[0]);

    const { state } = useSFASStations();
    const { stations, loading, error } = state;

    const station = stationId ? stations?.find((elem) => elem.did === stationId) : null;
    const stationIds = stations?.map((elem) => ({ did: elem.did, title: elem.title }));

    const buildPlotString = () =>
        station && stationId ? `https://hudson.dl.stevens-tech.edu/sfas/d/pfas_plot.php?&id=${stationId!}&did=${stationId!}&diff=${station!.diff}&mid=${station!.mid}&mdiff=${station!.mdiff}&units=${units}&start=${startDate}&end=${endDate}&time=${timeZone}&blowout_level=${station!.blowout_level}&near_flood_level=${station!.near_flood_level}&minor_flood_level=${station!.minor_flood_level}&moderate_flood_level=${station!.moderate_flood_level}&major_flood_level=${station!.major_flood_level}&offset=${datum}&off=0&tide_diff=${station!.ext_tide_shift}&forecast=${station!.sfas_model}&station_type=${station!.station_type}&nothing=1` : ""; // TODO: forecast should be selected by user, or whatever is pulled from the stations?
    const buildDiffString = () =>
        station && stationId ? `https://hudson.dl.stevens-tech.edu/sfas/d/pfas_diff.php?&id=${stationId!}&did=${stationId!}&diff=${station!.diff}&mid=${station!.mid}&mdiff=${station!.mdiff}&units=${units}&start=${startDate}&end=${endDate}&time=${timeZone}&offset=${datum}&off=0&tide_diff=${station!.ext_tide_shift}&forecast=${station!.sfas_model}&station_type=${station!.station_type}&nothing=2` : "";

    const [plotString, setPlotString] = useState(buildPlotString()); // set based on initial values, will be updated whenever form is submitted
    const [diffString, setDiffString] = useState(buildDiffString());

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setPlotString(buildPlotString()); // build new plot and diff urls based on what is in the form at time of submission
        setDiffString(buildDiffString());
    };

    // runs on initial load to set the plot string, since it's not going to be set until stations have loaded
    useEffect(() => {
        if (stations && !loading && error === null) {
            setPlotString(buildPlotString());
            setDiffString(buildPlotString());
        }
    }, [loading]);

    return (
        <main>
            {stations && stationIds && !loading && error === null &&
            <div className="grid grid-cols-1 auto-cols-max md:grid-cols-5">
                <div className="col-span-2 container p-5  text-center bg-[#e4e5e6] py-6 order-2">
                    <Form onSubmit={onFormSubmit}>
                        <h3 className="text-[#A32638]">SELECT YOUR CRITERIA:</h3>

                        <Form.Group className="m-3" id="station-group">

                            <p>Stations are listed from North and South</p>
                            <Form.Label htmlFor="station">Station</Form.Label>
                            <Form.Select
                                id="station"
                                defaultValue={suppliedStationId ?? ""}
                                onChange={(e) => setStationId(e.target.value)}
                                required
                            >
                                <option disabled value="">
                                    Select a station to display time series plot
                                </option>
                                {stationIds.map(({ did, title }) => (
                                    <option key={did} value={did}>
                                        {title}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="row m-3" id="dates-group">
                            {" "}
                            {/* TODO: max and min dates */}
                            <div className="col">
                                <Form.Label htmlFor="start-date">
                                    Start Date
                                </Form.Label>
                                <Form.Control
                                    id="start-date"
                                    type="date"
                                    defaultValue={initialStartDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col">
                                <Form.Label htmlFor="end-date">End Date</Form.Label>
                                <Form.Control
                                    id="end-date"
                                    type="date"
                                    defaultValue={initialEndDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="m-3" id="options-group">
                            <Form.Label htmlFor="datum">Datum</Form.Label>
                            <Form.Select
                                id="datum"
                                defaultValue={datumOptions[0]}
                                onChange={(e) => setDatum(e.target.value)}
                                required
                            >
                                {datumOptions.map((datum) => (
                                    <option key={datum} value={datum}>
                                        {datum}
                                    </option>
                                ))}
                            </Form.Select>

                            <Form.Label htmlFor="forecast">Forecast</Form.Label>
                            <Form.Select
                                id="forecast"
                                defaultValue={forecastOptions[0]}
                                onChange={(e) => setForecast(e.target.value)}
                                required
                            >
                                {forecastOptions.map((forecast) => (
                                    <option key={forecast} value={forecast}>
                                        {forecast === "ALL"
                                            ? "All Models"
                                            : forecast}
                                    </option>
                                ))}
                            </Form.Select>

                            <Form.Label htmlFor="units">Units</Form.Label>
                            <Form.Select
                                id="units"
                                defaultValue={unitsOptions[0]}
                                onChange={(e) => setUnits(e.target.value)}
                                required
                            >
                                {unitsOptions.map((unit) => (
                                    <option
                                        key={unit}
                                        value={unit}
                                    >{`${unit.slice(0, 1).toUpperCase()}${unit.slice(1)}`}</option>
                                ))}
                            </Form.Select>

                            <Form.Label htmlFor="timezone">Time Zone</Form.Label>
                            <Form.Select
                                id="timezone"
                                defaultValue={timeZoneOptions[0]}
                                onChange={(e) => setTimeZone(e.target.value)}
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
                                style={{ border: '2px solid #A32638', backgroundColor: 'transparent', color: '#A32638' }}>
                                <div
                                    className="text-center p-2 m-1 font-bold"
                                    style={{ border: '2px solid #7F7F7F', backgroundColor: 'transparent', color: '#A32638' }}>
                                    PLOT
                                </div>
                        </button>
                        <br></br>
                        <a className=" stevens-red m-4 mt-4 w-7/8"
                            href={`https://www.google.com/maps/search/?api=1&query=${station!.lat},${station!.lon}`}
                            style={{ border: '2px solid #A32638', backgroundColor: 'transparent', color: '#A32638' }}>
                            View on Google Maps
                        </a>
                    </Form>
                </div>
                {stationId && station && (
                    <div className="col-span-3 order-1">
                        <h2 className="text-[#363636] mt-6 text-center">{station.title}</h2>
                        <h5 className="text-[#363636] text-left ml-4">Water Level Relative to {datum} Datum (ft). Times in ET</h5>
                        <div className="">
                            <img
                                className="mt-3"
                                id="graphic_img"
                                src={plotString}
                            ></img>
                            <img id="difference_img" src={diffString}></img>
                        </div>

                    </div>
                )}
            </div>
            }
        </main>
    );
}
