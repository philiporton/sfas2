"use client";

import { Nav, Dropdown } from "react-bootstrap";
import { useState } from "react";

export default function SurfaceCurrents() {
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
                    id="surface-currents"
                    onMouseEnter={showDropdown}
                    onMouseLeave={hideDropdown}
                    show={showSponsors}
                >
                    Surface Currents
                </Dropdown.Toggle>
            </Dropdown>
        </>
    );
}
