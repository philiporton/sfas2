"use client";

import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";
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
        <Navbar expand="md" sticky="top" className="px-1 navbar">
            <Container className="m-0" fluid>
                <Navbar.Brand as={Link} className="fw-bold" href="/">
                    SFAS
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink
                            pathName="/registration"
                            displayName="Registration"
                        />
                        <GoogleEarth />
                        <NyhopsForecast />
                        <SurfaceCurrents />
                        <NyhopsTraces />
                        <MobileStations />
                        <SponsorsDropdown />
                        <TimeSeries />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
