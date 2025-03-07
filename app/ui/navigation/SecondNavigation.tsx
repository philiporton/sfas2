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

export default function SecondNavigation() {
    return (
        <Navbar expand="md" sticky="top" className="px-1 bg-[#363d45]" style={{ backgroundColor: '#A32638' }}>
            <Container className="m-0" fluid>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link className="text-white" href="/">STEVENS FLOOD ADVISORY HOME</Nav.Link>
                        <Nav.Link className="text-white" href="/registration">NOTIFICATIONS</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>

        </Navbar>
    );
}
