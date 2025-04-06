"use client";

import { Nav, Dropdown } from "react-bootstrap";
import { useState } from "react";

export default function GoogleEarth() {
    const [showSponsors, setShowSponsors] = useState(false);
    const showDropdown = () => {
        setShowSponsors(true);
    };
    const hideDropdown = () => {
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
                    id="google-earth"
                    onMouseEnter={showDropdown}
                    onMouseLeave={hideDropdown}
                    show={showSponsors}
                >
                    Google Earth
                </Dropdown.Toggle>
            </Dropdown>
        </>
    );
}
