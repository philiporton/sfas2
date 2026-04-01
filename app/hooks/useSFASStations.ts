import { useState, useEffect } from "react";
import { type Station } from "@/app/lib/stations";
import { type ForecastRange } from "@/app/lib/date";

export type AzureStation = {
    station_id: string;
    title: string;
};

export type StationState = {
    stations: Array<Station> | null;
    loading: boolean;
    error: string | null;
};

export default function useSFASStations(
    setForecastRange?: (forecastRange: ForecastRange | null) => void
): {
    state: StationState;
    triggerStationRefresh: () => void;
} {
    const [state, setState] = useState<StationState>({
        stations: null,
        loading: true,
        error: null
    });

    // set loading to true, which will trigger useEffect again and call the async fetch wrapper
    const triggerStationRefresh = () =>
        setState((curr) => ({ ...curr, loading: true }));

    useEffect(() => {
        const asyncWrapper = async () => {
            try {
                const [detailsResponse, stationsResponse] = await Promise.all([
                    fetch("/api/station-details", { method: "GET" }),
                    fetch("/api/stations", { method: "GET" })
                ]);

                if (!detailsResponse.ok || !stationsResponse.ok) {
                    setState({
                        stations: null,
                        loading: false,
                        error: "Failed to fetch stations"
                    });

                    if (setForecastRange) {
                        setForecastRange(null);
                    }
                    return;
                }

                // vars referenced in the returned javascript
                let presentSources: Array<Station> | null = null;
                let print_start_date: string | null = null;
                let print_end_date: string | null = null;

                const [detailsData, allowedStations] = await Promise.all([
                    detailsResponse.text(),
                    stationsResponse.json() as Promise<AzureStation[]>
                ]);

                function extractVar(name: string) {
                    const regex = new RegExp(`var\\s+${name}\\s*=\\s*([\\s\\S]*?);`);
                    const match = detailsData.match(regex);
                    if (!match) {
                        return null;
                    }

                    let value = match[1].trim();

                    // Replace single quotes with double quotes
                    value = value.replace(/'/g, '"');

                    // Quote unquoted keys in objects { id: 1 } → { "id": 1 }
                    value = value.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

                    return JSON.parse(value);
                }

                presentSources = extractVar("presentSources");
                print_start_date = extractVar("print_start_date");
                print_end_date = extractVar("print_end_date");

                if (presentSources) {
                    const stationIdByTitle = new Map<string, string>();
                    allowedStations.forEach((entry) => {
                        const title = (entry.title ?? "").trim();
                        const parsedId = (entry.station_id ?? "").trim();
                        if (title !== "" && parsedId !== "") {
                            stationIdByTitle.set(title, parsedId);
                        }
                    });

                    const stations = presentSources
                        .filter((entry) => stationIdByTitle.has((entry.title ?? "").trim()))
                        .map((entry) => ({
                            ...entry,
                            id: stationIdByTitle.get((entry.title ?? "").trim()) as string
                        }));

                    setState({ stations, loading: false, error: null });

                    if (
                        setForecastRange &&
                        print_start_date &&
                        print_end_date
                    ) {
                        // set the forecast range, if the strings are not null (this will display the forecast in the banner on the homepage)
                        setForecastRange([print_start_date, print_end_date]);
                    } else if (setForecastRange) {
                        setForecastRange(null);
                    }
                } else {
                    setState({
                        stations: null,
                        loading: false,
                        error: "Failed to fetch stations"
                    });

                    presentSources = null;
                    print_start_date = null;
                    print_end_date = null;
                }
            } catch {
                setState({
                    stations: null,
                    loading: false,
                    error: "Failed to fetch stations"
                });

                if (setForecastRange) {
                    setForecastRange(null);
                }
            }
        };

        if (state.loading) asyncWrapper(); // fetch stations if loading is true
    }, [state.loading, setForecastRange]);

    return { state, triggerStationRefresh };
}
