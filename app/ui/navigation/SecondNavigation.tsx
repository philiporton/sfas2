"use client";

import Image from "next/image";
import StevensLogo from "@/public/Stevens.png";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function SecondNavigation() {
    return (
        <Navbar expand="md" sticky="top" style={{ backgroundColor: '#A32638', minHeight: '80px' }}>
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
                    SFAS
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link className="text-white px-3 text-lg" href="/">STEVENS FLOOD ADVISORY HOME</Nav.Link>
                        <Nav.Link className="text-white px-3 text-lg" href="/registration">NOTIFICATIONS</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}