"use client";

import useSFASStations from "../hooks/useSFASStations";
import React, { useEffect, useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";

type StationOption = {
    value: string;
    label: string;
};

type AzureStation = { id: string; title: string };


//TODO custom search filter so that NY finds new york, etc
export default function StationSelect() {
    const { state } = useSFASStations();
    const { stations, loading, error } = state;

    const [allowedStationIds, setAllowedStationIds] = useState<Set<string>>(new Set());
    const [allowedStationTitles, setAllowedStationTitles] = useState<Set<string>>(new Set());
    const [idsLoading, setIdsLoading] = useState(true);

    useEffect(() => {
        const fetchStationIds = async () => {
            try {
                const response = await fetch("/api/stations", {
                    method: "GET"
                });

                if (!response.ok) {
                    setAllowedStationTitles(new Set());
                    return;
                }

                const payload = (await response.json()) as AzureStation[];
                const titles = payload
                    .map((entry) => entry.title ?? "")
                    .filter((title) => title !== "");

                setAllowedStationTitles(new Set(titles));
            } catch {
                setAllowedStationTitles(new Set());
            } finally {
                setIdsLoading(false);
            }
        };

        fetchStationIds();
    }, []);

    const options = useMemo(() => {
        if (stations == null || allowedStationTitles.size === 0) {
            return [] as StationOption[];
        }

        return stations
            .filter((station) => allowedStationTitles.has(station.title))
            .map((station) => ({
                value: station.did,
                label: station.title,
            }));
    }, [stations, allowedStationTitles]);
    
    const handleChange = (selectedOption: SingleValue<StationOption>) => {
        if (!selectedOption) {
            return;
        }

        window.open(`/stations?stationId=${selectedOption.value}`);
    };

    return (
        <div className="text-center bg-[#e4e5e6] py-4">
            <h3 className="text-[#A32638]">STEVENS FLOOD ADVISORY SYSTEM STATIONS</h3>
            {stations && !loading && error === null && !idsLoading &&
                <Select
                    options={options}
                    isSearchable={true}
                    onChange={handleChange}
                />
            }
        </div>
    );
}
