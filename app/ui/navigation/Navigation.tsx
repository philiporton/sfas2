"use client";

import Link from "next/link";
import { Navbar, Nav, Container } from "react-bootstrap";
import NavLink from "@/app/ui/navigation/NavLink";

export default function Navigation() {
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
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
