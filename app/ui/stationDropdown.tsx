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
        <div className="text-center bg-[#e4e5e6] py-4">
            <h3 className="text-[#A32638]">SFIM STATIONS</h3>
            {stations && !loading && error === null &&
                <Select
                    options={options}
                    isSearchable={true}
                    onChange={handleChange}
                />
            }
        </div>
    );
}
