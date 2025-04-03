"use client";

import { Nav, Dropdown } from "react-bootstrap";
import Sponsors from "./Sponsors";
import { useState } from "react";

export default function SponsorsDropdown() {
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
                    id="sponsors-dropdown"
                    onMouseEnter={showDropdown}
                    onMouseLeave={hideDropdown}
                >
                    Our Sponsors
                </Dropdown.Toggle>
                <Dropdown.Menu
                    onMouseEnter={showDropdown}
                    onMouseLeave={hideDropdown}
                >
                    <Sponsors />
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}
