import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import NavLink, { isActive } from "./NavLink";



export default function Navigation() {
    return (
        <Navbar expand="md" sticky="top" className="px-1">
            <Container className="m-0" fluid>
                <Navbar.Brand as={Link} className="fw-bold" to={isActive(window.location.pathname, "/") ? "#" : "/"}>
                    SFAS
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink pathName="/embed-map-test" displayName="Embed" />
                        <NavLink pathName="/react-map-test" displayName="React" />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
