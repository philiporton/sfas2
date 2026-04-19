"use client";

import Image from "next/image";
import StevensLogo from "@/public/Stevens.png";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function SecondNavigation() {
    return (
        <Navbar expand="md" sticky="top" className="sfim-nav" style={{ backgroundColor: '#A32638', minHeight: '80px' }}>
            <style>{`
                .sfim-nav .navbar-collapse {
                    background-color: #A32638;
                }

                .sfim-nav .navbar-nav .nav-link {
                    color: #ffffff !important;
                    font-weight: 700;
                }

                @media (max-width: 767px) {
                    .sfim-nav .navbar-collapse {
                        background-color: transparent;
                        margin-top: 0;
                        padding: 8px 12px 10px 12px;
                        border-top: 0;
                    }

                    .sfim-nav .navbar-nav .nav-link {
                        color: #A32638 !important;
                        padding: 12px 14px;
                    }

                    .sfim-nav .navbar-nav {
                        background-color: #ffffff;
                        border: 1px solid rgba(163, 38, 56, 0.35);
                        border-radius: 10px;
                        overflow: hidden;
                    }

                    .sfim-nav .navbar-nav .nav-link + .nav-link {
                        border-top: 1px solid rgba(163, 38, 56, 0.2);
                    }
                }
            `}</style>
            <Container fluid className="h-full p-0 m-0">
                <Navbar.Brand 
                    href="https://www.stevens.edu" 
                    target="_blank"
                    className="h-full p-0 m-0 flex items-center"
                    style={{ height: '80px' }} // Explicit height for brand container
                >
                    <div style={{
                        height: '96px',
                        width: '70px',
                        position: 'relative',
                        aspectRatio: '1/1' // Adjust this based on your logo's aspect ratio
                    }}>
                        <Image 
                            src={StevensLogo}
                            alt="Logo"
                            fill // This makes the image fill the parent container
                            style={{ 
                                objectFit: 'contain',
                                padding: '5px',
                                backgroundColor: 'white'
                            }}
                            priority
                            sizes="(max-width: 768px) 100px, 150px" // Adjust these values as needed
                        />
                    </div>
                </Navbar.Brand>
                <Navbar.Brand 
                    href="https://hudson.dl.stevens-tech.edu/sfas/" 
                    target="_blank"
                    className="text-white flex items-center text-xl font-bold pl-4"
                    style={{ height: '80px' }}
                >
                    SFIM
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link className="px-3 text-lg" href="/osm-test">SFIM HOME</Nav.Link>
                        <Nav.Link
                            className="px-3 text-lg"
                            href="https://www.stevens.edu/davidson-laboratory"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            DAVIDSON LABORATORY
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}