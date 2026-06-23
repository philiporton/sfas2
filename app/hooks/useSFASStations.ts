import { useState, useEffect } from "react";
import { type Station } from "@/app/lib/stations";
import { type ForecastRange } from "@/app/lib/date";

export type StationState = {
    stations: Array<Station> | null;
    loading: boolean;
    error: string | null;
};

type StationList = {
    sid: string;
    agency: string;
    agency_sid: string;
}

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
                const [stationDetailResponse] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_FLOOD_DATA_URL}/sfasjs/sfas_stations2.js`, { method: "GET", headers: { "Access-Control-Allow-Origin": "*" } })
                ]);

                //Due to how long and expensive the fetch is, the station list will be hardcoded here. Right now only sid is used
                const stationList = [{"sid": "N022", "agency": "NOS", "agency_sid": "8534720"}, {"sid": "U222", "agency": "USGS", "agency_sid": "01408168"}, {"sid": "U225", "agency": "USGS", "agency_sid": "01409125"}, {"sid": "U226", "agency": "USGS", "agency_sid": "01409146"}, {"sid": "U227", "agency": "USGS", "agency_sid": "01409335"}, {"sid": "U228", "agency": "USGS", "agency_sid": "01410510"}, {"sid": "U229", "agency": "USGS", "agency_sid": "01410560"}, {"sid": "U249", "agency": "USGS", "agency_sid": "01408048"}]

                if (!stationDetailResponse.ok) {
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

                const [stationDetails] = await Promise.all([
                    stationDetailResponse.text(),
                ]);

                function extractVar(name: string) {
                    const regex = new RegExp(`var\\s+${name}\\s*=\\s*([\\s\\S]*?);`);
                    const match = stationDetails.match(regex);
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
                    const stations = presentSources.filter((station) => stationList.map((x: StationList) => x.sid).includes(station.did));

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