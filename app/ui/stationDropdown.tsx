"use client";

import useSFASStations from "../hooks/useSFASStations";
import React, { useMemo } from "react";
import Select, { SingleValue } from "react-select";

type StationOption = {
    value: string;
    label: string;
};


//TODO custom search filter so that NY finds new york, etc
export default function StationSelect() {
    const { state } = useSFASStations();
    const { stations, loading, error } = state;

    const options = useMemo(() => {
        if (stations == null) {
            return [] as StationOption[];
        }

        return stations
            .map((station) => ({
                value: station.did,
                label: station.title,
            }));
    }, [stations]);
    
    const handleChange = (selectedOption: SingleValue<StationOption>) => {
        if (!selectedOption) {
            return;
        }

        window.open(`/stations?stationId=${selectedOption.value}`);
    };

    return (
        <div className="w-full p-2 border border-gray-400 text-[#A32638] font-semibold text-sm focus:outline-none">
            {stations && !loading && error === null &&
                <Select
                    options={options}
                    isSearchable={true}
                    onChange={handleChange}
                    placeholder="Select a Station..."
                />
            }
        </div>
    );
}