import { useState, useEffect } from "react";
import { type Station } from "@/app/lib/stations";
import { type ForecastRange } from "@/app/lib/date";

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

    const stationsURL = "/api/stations";

    useEffect(() => {
        const asyncWrapper = async () => {
            try {
                console.log("Fetching stations from:", stationsURL);
                const response = await fetch(stationsURL, {
                    method: "GET",
                    headers: {
                        "Access-Control-Allow-Origin": "*" // CORS
                    }
                });

                console.log("Response status:", response.status);

                if (response.ok) {
                    // vars referenced in the returned javascript
                    let presentSources: Array<Station> | null = null;
                    let print_start_date: string | null = null;
                    let print_end_date: string | null = null;

                    const data = await response.text();
                    console.log("Response data length:", data.length);

                    function extractVar(name: string) {
                        const regex = new RegExp(`var\\s+${name}\\s*=\\s*([\\s\\S]*?);`);
                        const match = data.match(regex);
                        if (!match) {
                            console.warn(`Could not find variable: ${name}`);
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

                    console.log("Extracted stations count:", presentSources?.length || 0);
                    if (presentSources) {
                        // presentSources should be set with current station data
                        console.log(print_start_date);
                        console.log(print_end_date);

                        const stations = [...presentSources] as Array<Station>;
                        setState({ stations, loading: false, error: null });
                        console.log("Successfully set", stations.length, "stations");

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
                        const errorMsg = "Failed to extract stations from response";
                        console.error(errorMsg);
                        setState({
                            stations: null,
                            loading: false,
                            error: errorMsg
                        });

                        presentSources = null;
                        print_start_date = null;
                        print_end_date = null;
                    }
                } else {
                    const errorMsg = `API returned status ${response.status}`;
                    console.error(errorMsg);
                    setState({
                        stations: null,
                        loading: false,
                        error: errorMsg
                    });
                }
            } catch (error) {
                const errorMsg = `Fetch failed: ${error instanceof Error ? error.message : String(error)}`;
                console.error(errorMsg);
                setState({
                    stations: null,
                    loading: false,
                    error: errorMsg
                });
            }
        };

        if (state.loading) asyncWrapper(); // fetch stations if loading is true
    }, [state.loading, setForecastRange]);

    return { state, triggerStationRefresh };
}
