"use client";

import { DropdownButton, DropdownItem } from "react-bootstrap";
import useSFASStations from "../hooks/useSFASStations";

//TODO add searchability
export default function StationSelect() {
    const { state } = useSFASStations();
    const { stations, loading, error } = state;

    return (
        <div className="text-center bg-[#e4e5e6] py-4">
            <h3 className="text-[#A32638]"><strong>STEVENS FLOOD ADVISORY SYSTEM</strong> STATIONS</h3>
            {stations && !loading && error === null &&
                <DropdownButton
                    id="dropdown-basic-button"
                    title="Select a station to display time series plot"
                >
                    {stations.map((station) => <DropdownItem href={`/stations?stationId=${station.did}`} target="_blank">
                        {station.title}
                    </DropdownItem>)}
                </DropdownButton>
            }
        </div>
    );
}
