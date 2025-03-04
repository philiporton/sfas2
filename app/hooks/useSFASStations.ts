import { useState, useEffect } from "react";
import { Station } from "@/app/lib/stations";

export type StationState = {
    stations: Array<Station> | null;
    loading: boolean;
    error: string | null;
};

export default function useSFASStations(): StationState {
    const [state, setState] = useState<StationState>({
        stations: null,
        loading: true,
        error: null
    });

    // const stationsURL = "https://hudson.dl.stevens-tech.edu/cgi-bin/get_sfas_stations.pl?nothing=0"
    const stationsURL = "http://localhost:4000/cgi-bin/get_sfas_stations.py";

    useEffect(() => {
        setState((curr) => ({ stations: curr.stations, loading: true, error: null }));

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

                const extractJSON = strBuf.match(/.*(\[.*\]).*/s); // get the stations array
                const stations = JSON.parse(extractJSON![1]) as Array<Station>;
                setState({ stations, loading: false, error: null });
            } else {
                setState({ stations: null, loading: false, error: "Failed to fetch stations" });
            }
        };

        asyncWrapper();

        
        // const markerRequester = new XMLHttpRequest();
        // markerRequester.open("GET", stationsURL, true);
        // markerRequester.setRequestHeader("Access-Control-Allow-Origin", "*");
        // markerRequester.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        // markerRequester.onload = () => {
        //     const fileVal = markerRequester.responseText;
        //     console.log(fileVal);
        // };

        // markerRequester.send(null);

        

        // fetch(stationsURL, {
        //     method: "GET",
        //     mode: "no-cors",
        //     headers: {
        //         "Access-Control-Allow-Origin": "*" // CORS
        //     }
        // })
        //     .then((response) => console.log(response), (err) => console.log(err));
    }, []);

    return state;
}