import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

/**
 * returns true if the current path is the same as the target path (i.e. current path is active)
 *
 * @param {string} currPath
 * @param {string} target
 *
 * @returns {boolean}
 */
const isActive = (currPath: string, target: string): boolean => {
    if (currPath.endsWith("/") && currPath.length !== 1)
        currPath = currPath.slice(0, currPath.length - 1);
    return currPath === target; // check for trailing
};

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
                        <Nav.Link as={Link} className={
                                "px-2 mx-2" +
                                (isActive(window.location.pathname, "/newPage")
                                    ? " active"
                                    : "")
                            }
                            to={
                                isActive(window.location.pathname, "/newPage")
                                    ? "#"
                                    : "/newPage"
                            }
                            >
                            NewPage
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
