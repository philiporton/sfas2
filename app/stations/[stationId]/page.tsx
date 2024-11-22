"use client";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { getStationById } from "@/app/lib/stations";
import mapsLogo from "../../images/Google_Maps-Logo.wine.svg";

export default function Station({ params }: { params: { stationId: string } }) {
    const station = getStationById(params.stationId);

    return (
        <main>
            <div className="flex items-stretch">
                <form action="">
                    <div className="grid grid-cols-2 content-between">
                        <div className=" border  p-24 mt-3 text-center">
                            <p>Select Datum and other preferences below</p>
                            <div className="grid grid-cols-2 content-between">
                                <p>Station:</p>
                                <DropdownButton
                                    id="dropdown-basic-button"
                                    title="Dropdown button"
                                >
                                    <Dropdown.Item
                                        href="#/action-1"
                                        className="text-wrap"
                                    >
                                        Portland ME
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        Hudson River at Fort Edward NY
                                    </Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <p className="i text-xs pl-40">
                                Stations are listed from North to South
                            </p>
                            <div className="grid grid-cols-2 content-between">
                                <p>Start Date:</p>
                                <input
                                    type="date"
                                    name="startDate"
                                    placeholder="yyyy-mm-dd"
                                    value=""
                                    max="2030-01-01"
                                    required
                                    className="h-6"
                                />
                                <p>End Date:</p>
                                <input
                                    type="date"
                                    name="endDate"
                                    placeholder="yyyy-mm-dd"
                                    value=""
                                    max="2030-01-01"
                                    required
                                    className="h-6"
                                />
                                <p>Datum:</p>
                                <DropdownButton
                                    id="dropdown-datum"
                                    title="Dropdown Datum"
                                    style={{ maxHeight: "20px" }}
                                >
                                    <Dropdown.Item
                                        href="#/action-1"
                                        className="text-wrap"
                                    >
                                        NAVD88
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        NGVD29
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        MLLW
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        MLW
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        MSL
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        MTL
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        DTL
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        MHW
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        MHHW
                                    </Dropdown.Item>
                                </DropdownButton>
                                <p>Forecast:</p>
                                <DropdownButton
                                    id="dropdown-forecast"
                                    title="Dropdown Forecast"
                                    style={{ maxHeight: "20px" }}
                                >
                                    <Dropdown.Item
                                        href="#/action-1"
                                        className="text-wrap"
                                    >
                                        SNAP-Ex
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        ESTOFS
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        ETSS
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        All Models
                                    </Dropdown.Item>
                                </DropdownButton>
                                <p>Units:</p>
                                <DropdownButton
                                    id="dropdown-units"
                                    title="Dropdown Units"
                                    style={{ maxHeight: "20px" }}
                                >
                                    <Dropdown.Item
                                        href="#/action-1"
                                        className="text-wrap"
                                    >
                                        English
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        Metric
                                    </Dropdown.Item>
                                </DropdownButton>
                                <p>Time Zone:</p>
                                <DropdownButton
                                    id="dropdown-units"
                                    title="Dropdown Units"
                                    style={{ maxHeight: "20px" }}
                                >
                                    <Dropdown.Item
                                        href="#/action-1"
                                        className="text-wrap"
                                    >
                                        Eastern Local
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/action-2"
                                        className="text-wrap"
                                    >
                                        GMT
                                    </Dropdown.Item>
                                </DropdownButton>
                            </div>
                            <button
                                type="submit"
                                className=" hover:bg-amber-100 p-2"
                            >
                                Plot
                            </button>
                        </div>
                        <img  className="mt-3" id="graphic_img" src={`https://hudson.dl.stevens-tech.edu/sfas/d/pfas_plot.php?&id=${params.stationId}&did=${params.stationId}&diff=${station.diff}&mid=${station.mid}&mdiff=${station.mdiff}&units=english&start=2024-11-12&end=2024-11-17&time=ET&blowout_level=${station.blowout_level}&near_flood_level=${station.near_flood_level}&minor_flood_level=${station.minor_flood_level}&moderate_flood_level=${station.moderate_flood_level}&major_flood_level=${station.major_flood_level}&offset=NAVD88&off=0&tide_diff=${station.ext_tide_shift}&forecast=${station.sfas_model}&station_type=${station.station_type}&nothing=1`} ></img>
                    </div>
                </form>
            </div>
            <div className="flex items-stretch">
                <div className=" border mt-3 text-center w-1/2">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lon}`}>View Station {station.title} on Google Maps</a>
                    <img
                        src={mapsLogo.src}
                        alt="Google Maps Logo"
                        className="pl-24 mt-3"
                    ></img>
                </div>
                <div className="  mt-3 text-center w-1/2 ">
                <img id="difference_img" src={`https://hudson.dl.stevens-tech.edu/sfas/d/pfas_diff.php?&id=${params.stationId}&did=${params.stationId}&diff=${station.diff}&mid=${station.mid}&mdiff=${station.mdiff}&units=english&start=2024-11-12&end=2024-11-17&time=ET&offset=NAVD88&off=0&tide_diff=${station.ext_tide_shift}&forecast=${station.sfas_model}&station_type=${station.station_type}&nothing=2`} ></img>
                </div>
            </div>
        </main>
    );
}
