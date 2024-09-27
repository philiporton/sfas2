import React from "react";

export default function EmbeddedMap() {
    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    return (
        <iframe
            width="600"
            height="450"
            style={{border:0}}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=Space+Needle,Seattle+WA`}>
        </iframe>
    );
}
