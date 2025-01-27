"use client";

import { Nav, Dropdown } from "react-bootstrap";
import { useState } from "react";

export default function TimeSeries() {
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
                    id="time-series"
                    onMouseEnter={showDropdown}
                    onMouseLeave={hideDropdown}
                    show={showSponsors}
                >
                    Time Series
                </Dropdown.Toggle>
            </Dropdown>
        </>
    );
}
