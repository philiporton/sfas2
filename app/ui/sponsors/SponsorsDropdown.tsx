"use client";

import { Nav, Dropdown } from "react-bootstrap"
import Sponsors from "./Sponsors";
import { useState } from "react";

export default function SponsorsDropdown() {
    const [showSponsors, setShowSponsors] = useState(false);
    const showDropdown = (e: React.MouseEvent) => {
        setShowSponsors(true);
    }
    const hideDropdown = (e: React.MouseEvent) => {
        setShowSponsors(false);
    }

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
                    show={showSponsors}
                >
                    Our Sponsors
                </Dropdown.Toggle>
                <Dropdown.Menu
                    onMouseEnter={showDropdown}
                    onMouseLeave={hideDropdown}
                    show={showSponsors}
                >
                    <Sponsors />
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}
