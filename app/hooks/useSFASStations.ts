import { useState, useEffect } from "react";
import { Station } from "@/app/lib/stations";

export type StationState = {
    stations: Array<Station> | null;
    loading: boolean;
    error: string | null;
};

export default function useSFASStations(): {
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

     // const stationsURL = "https://flood.dl.stevens-tech.edu/cgi-bin/get_sfas_stations.py"
    const stationsURL = "http://localhost:4000/cgi-bin/get_sfas_stations.py";

    useEffect(() => {
        const asyncWrapper = async () => {
            const response = await fetch(stationsURL, {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*" // CORS
                }
            });

            if (response.ok) {
                let strBuf = "";
                const reader = response.body?.getReader();
                if (reader) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        strBuf += new TextDecoder().decode(value);
                    }
                }

                // vars referenced in the returned javascript
                let presentSources: Array<Station> | null = null;
                let print_start_date: string | null = null;
                let print_end_date: string | null = null;

                eval(strBuf);

                if (presentSources) {
                    // presentSources should be set with current station data
                    console.log(print_start_date);
                    console.log(print_end_date);

                    const stations = [...presentSources] as Array<Station>;
                    setState({ stations, loading: false, error: null });
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
            } else {
                setState({
                    stations: null,
                    loading: false,
                    error: "Failed to fetch stations"
                });
            }
        };

        if (state.loading) asyncWrapper(); // fetch stations if loading is true
    }, [state.loading]);

    return { state, triggerStationRefresh };
}
