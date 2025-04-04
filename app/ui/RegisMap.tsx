"use client";
import GoogleMapsReactRegis from "../ui/map/registration/GoogleMapsReactRegis";

export default function RegisMap({
    mapsAPIKey
}: {
    mapsAPIKey: string;
}) {
    return (
    <GoogleMapsReactRegis mapsAPIKey={mapsAPIKey} />
    );
}