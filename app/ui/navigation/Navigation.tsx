"use client";

import Link from "next/link";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import NavLink from "@/app/ui/navigation/NavLink";
import Sponsors from "../sponsors/Sponsors";
import { useState } from "react";

export default function Navigation() {
    const [showSponsors, setShowSponsors] = useState(false);
    const showDropdown = (e: React.MouseEvent) => {
        setShowSponsors(true);
    }
    const hideDropdown = (e: React.MouseEvent) => {
        setShowSponsors(false);
    }

    return (
        <Navbar expand="md" sticky="top" className="px-1">
            <Container className="m-0" fluid>
                <Navbar.Brand as={Link} className="fw-bold" href="/">
                    SFAS
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink pathName="/registration" displayName="Registration" />
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
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
