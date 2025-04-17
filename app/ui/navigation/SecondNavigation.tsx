"use client";

import { Navbar, Nav, Container } from "react-bootstrap";

export default function SecondNavigation() {
    return (
        <Navbar expand="md" sticky="top" className="px-1 bg-[#363d45]" style={{ backgroundColor: '#A32638' }}>
            <Container className="m-0" fluid>
                <Navbar.Brand href="https://www.stevens.edu" target="_blank">
                    <img src="/Stevens.png"
                        alt="Logo"
                        className="-mt-2 w-20"
                        style={{ backgroundColor: "white" }} />
                </Navbar.Brand>
                <Navbar.Brand href="https://hudson.dl.stevens-tech.edu/sfas/" target="_blank">
                    SFAS
                </Navbar.Brand>
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
