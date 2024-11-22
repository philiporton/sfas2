"use client";

import { Nav, Dropdown } from "react-bootstrap";
import { useState } from "react";

export default function FloodForecast() {
    const [showSponsors, setShowSponsors] = useState(false);
    const showDropdown = (e: React.MouseEvent) => {
        setShowSponsors(true);
    };
    const hideDropdown = (e: React.MouseEvent) => {
        setShowSponsors(false);
    };

    return (
        <>
            <Dropdown
                onMouseEnter={showDropdown}
                onMouseLeave={hideDropdown}
                show={showSponsors}
            >
                <Dropdown.Toggle
                    as={Nav.Link}
                    id="flood-forecast"
                    onMouseEnter={showDropdown}
                    onMouseLeave={hideDropdown}
                    show={showSponsors}
                >
                    Flood Forecast
                </Dropdown.Toggle>
            </Dropdown>
        </>
    );
}
