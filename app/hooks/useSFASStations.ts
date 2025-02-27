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

    const stationsURL = "https://hudson.dl.stevens-tech.edu/cgi-bin/get_sfas_stations.pl?nothing=0"

    useEffect(() => {
        setState((curr) => ({ stations: curr.stations, loading: true, error: null }));

        const asyncWrapper = async () => {
            const response = await fetch(stationsURL, {
                method: "GET",
                mode: "no-cors",
                headers: {
                    "Access-Control-Allow-Origin": "*" // CORS
                }
            });

            if (response.ok) {
                console.log("response ok");
                const stations = await response.json();
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