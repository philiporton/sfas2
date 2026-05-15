"use client";

import useSFASStations from "../hooks/useSFASStations";
import React from "react";
import Select, { GroupBase, OptionsOrGroups } from "react-select";


//TODO custom search filter so that NY finds new york, etc
export default function StationSelect() {
    const { state } = useSFASStations();
    const { stations, loading, error } = state;
    
    let options: OptionsOrGroups<unknown, GroupBase<unknown>> | undefined;
    if (stations != null) {
        options = stations.map(station => { return { value: station.did, label: station.title, } })
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        window.open(`/stations?stationId=${e.value}`)
    }
    return (
        <div className="text-center bg-[#e4e5e6] py-4">
            <h3 className="text-[#A32638]">Stevens Flood Inundation Mapper Stations</h3>
            {stations && !loading && error === null &&
                <Select
                    options={options} isSearchable={true} onChange={handleChange} />
            }
        </div>
    );
}