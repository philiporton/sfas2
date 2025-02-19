"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DropdownButton, Dropdown, Form } from "react-bootstrap";

import { getCurrentEpoch, timestampToStringISO } from "@/app/lib/date";
import { getStationById } from "@/app/lib/stations";
import { stationIds } from "@/stationData";
import mapsLogo from "../images/Google_Maps-Logo.wine.svg";

export default function Station() {
    const params = useSearchParams();
    const suppliedStationId = params.get("stationId");

    const datumOptions = ["NAVD88", "NGVD29", "MLLW", "MLW", "MSL", "MTL", "DTL", "MHW", "MHHW"];
    const forecastOptions = ["SNAP-Ex", "ESTOFS", "ETSS", "ALL"];
    const unitsOptions = ["english", "metric"];
    const timeZomeOptions = ["ET", "GMT"];

    const [stationId, setStationId] = useState(suppliedStationId);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [datum, setDatum] = useState(datumOptions[0]);
    const [forecast, setForecast] = useState(forecastOptions[0]);
    const [units, setUnits] = useState(unitsOptions[0]);
    const [timeZone, setTimeZone] = useState(timeZomeOptions[0]);

    const station = stationId ? getStationById(stationId) : null;

    return (
        <main>
            <div className="container p-5 m-5">
                <Form>
                    <Form.Text className="h3 text-center">Select Datum & Preferences</Form.Text>
                    
                    <Form.Group className="m-3" id="station-group">
                        <Form.Label htmlFor="station">Station</Form.Label>

                        <Form.Select id="station" defaultValue={suppliedStationId ?? ""} onChange={(e) => setStationId(e.target.value)}>
                            <option disabled value="">Select a station</option>
                            {stationIds.map(({ did, title }) => <option key={did} value={did}>{title}</option>)}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="row m-3" id="dates-group"> {/* TODO: max and min dates */}
                        <div className="col">
                            <Form.Label htmlFor="start-date">Start Date</Form.Label>
                            <Form.Control id="start-date" type="date" onChange={(e) => setStartDate(e.target.value)} />
                        </div>

                        <div className="col">
                            <Form.Label htmlFor="end-date">End Date</Form.Label>
                            <Form.Control id="end-date" type="date" onChange={(e) => setEndDate(e.target.value)}/>
                        </div>
                    </Form.Group>
                    
                    <Form.Group className="m-3" id="options-group">
                        <Form.Label htmlFor="datum">Datum</Form.Label>
                        <Form.Select id="datum" defaultValue={datum[0]} onChange={(e) => setDatum(e.target.value)}>
                            {datumOptions.map((datum) => <option key={datum} value={datum}>{datum}</option>)}
                        </Form.Select>

                        <Form.Label htmlFor="forecast">Forecast</Form.Label>
                        <Form.Select id="forecast" defaultValue={forecast[0]} onChange={(e) => setForecast(e.target.value)}>
                            {forecastOptions.map((forecast) => <option key={forecast} value={forecast}>{forecast === "ALL" ? "All Models" : forecast}</option>)}
                        </Form.Select>

                        <Form.Label htmlFor="units">Units</Form.Label>
                        <Form.Select id="units" defaultValue={units[0]} onChange={(e) => setUnits(e.target.value)}>
                            {unitsOptions.map((unit) => <option key={unit} value={unit}>{`${unit.slice(0, 1).toUpperCase()}${unit.slice(1)}`}</option>)}
                        </Form.Select>

                        <Form.Label htmlFor="timezone">Time Zone</Form.Label>
                        <Form.Select id="timezone" defaultValue={timeZone[0]} onChange={(e) => setTimeZone(e.target.value)}>
                            {timeZomeOptions.map((tz) => <option key={tz} value={tz}>{tz === "ET" ? "Eastern Local" : tz}</option>)}
                        </Form.Select>
                    </Form.Group>

                    {/* TODO: button to submit, or just render plots as items change? */}
                </Form>
            </div>



            <div className="flex items-stretch">
                <img  className="mt-3" id="graphic_img" src={`https://hudson.dl.stevens-tech.edu/sfas/d/pfas_plot.php?&id=${stationId!}&did=${stationId!}&diff=${station!.diff}&mid=${station!.mid}&mdiff=${station!.mdiff}&units=${units}&start=2024-11-12&end=2024-11-17&time=${timeZone}&blowout_level=${station!.blowout_level}&near_flood_level=${station!.near_flood_level}&minor_flood_level=${station!.minor_flood_level}&moderate_flood_level=${station!.moderate_flood_level}&major_flood_level=${station!.major_flood_level}&offset=${datum}&off=0&tide_diff=${station!.ext_tide_shift}&forecast=${station!.sfas_model}&station_type=${station!.station_type}&nothing=1`} ></img>
                <img id="difference_img" src={`https://hudson.dl.stevens-tech.edu/sfas/d/pfas_diff.php?&id=${stationId!}&did=${stationId!}&diff=${station!.diff}&mid=${station!.mid}&mdiff=${station!.mdiff}&units=${units}&start=2024-11-12&end=2024-11-17&time=ET&offset=${datum}&off=0&tide_diff=${station!.ext_tide_shift}&forecast=${station!.sfas_model}&station_type=${station!.station_type}&nothing=2`} ></img>
            </div>

            <div className=" border mt-3 text-center w-1/2">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${station!.lat},${station!.lon}`}>View Station {station!.title} on Google Maps</a>
                    <img
                        src={mapsLogo.src}
                        alt="Google Maps Logo"
                        className="pl-24 mt-3"
                    ></img>
                </div>
        </main>
    );
}
