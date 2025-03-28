"use client";

import Link from "next/link";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import NavLink from "@/app/ui/navigation/NavLink";
import SponsorsDropdown from "../navbar/sponsors/SponsorsDropdown";
import FloodForecast from "../navbar/FloodForecast";
import GoogleEarth from "../navbar/GoogleEarth";
import MobileStations from "../navbar/MobileStations";
import NyhopsForecast from "../navbar/NyhopsForecast";
import NyhopsTraces from "../navbar/NyhopsTraces";
import TimeSeries from "../navbar/TimeSeries";
import { useState } from "react";
import SurfaceCurrents from "../navbar/SurfaceCurrents";

export default function Navigation() {
    return (
        <Navbar expand="md" sticky="top" className="px-1 bg-[#363d45]">
            <Container className="m-0" fluid>
                <Navbar.Brand as={Link} className="fw-bold text-right text-white" href="/">
                    SFAS
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link className="text-white" href="https://www.stevens.edu/corporate-relations" target="_blank">Corporate Relations</Nav.Link>
                        <Nav.Link className="text-white" href="https://www.stevens.edu/davidson-laboratory" target="_blank">Davidson Laboratory</Nav.Link>
                        <Nav.Link className="text-white" href="https://www.stevens.edu/school-engineering-science" target="_blank">School of Engineering & Science</Nav.Link>
                        <NavDropdown title="Research">
                            <NavDropdown.Item></NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>

        </Navbar>
    );
}
