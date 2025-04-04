"use client";

import Link from "next/link";
import useSFASStations from "../hooks/useSFASStations";
import { useRouter } from "next/navigation";
import React from "react";
import Select, { GroupBase, OptionsOrGroups } from "react-select";


//TODO custom search filter so that NY finds new york, etc
export default function StationSelect() {
    const { state } = useSFASStations();
    const { stations, loading, error } = state;
    const router = useRouter();
    let options: OptionsOrGroups<unknown, GroupBase<unknown>> | undefined;
    if (stations != null) {
        options = stations.map(station => { return { value: station.did, label: station.title, } })
    }
    const handleChange = (e: any) => {
        router.push(`/stations?stationId=${e.value}`);
    }
    return (
        <div className="text-center bg-[#e4e5e6] py-4">
            <h3 className="text-[#A32638]"><strong>STEVENS FLOOD ADVISORY SYSTEM</strong> STATIONS</h3>
            {stations && !loading && error === null &&
                <Select
                    options={options} isSearchable={true} className="justify-center" onChange={handleChange} />
            }
        </div>
    );
}
