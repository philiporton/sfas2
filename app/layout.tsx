"use client";

import localFont from "next/font/local";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import Navigation from "@/app/ui/navigation/Navigation";
import SecondNavigation from "@/app/ui/navigation/SecondNavigation";
import SponsorsDropdown from "./ui/navbar/sponsors/SponsorsDropdown";
import React, { useEffect, useState } from "react";


const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900"
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900"
});

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [isAtTop, setIsAtTop] = useState(true);
    const [isHovering, setIsHovering] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.pageYOffset === 0);
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    
    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };
    
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {(isAtTop || isHovering) && <Navigation />}
                {isHovering && <SecondNavigation />}
                <div
                    className={!isAtTop && !isHovering ? "fixed-top" : ""}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {!isHovering && <SecondNavigation />}
                </div>
                {children}
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <div style={{ marginLeft: "20px" }}>
                    <SponsorsDropdown />
                </div>
            </body>
        </html>
    );
}
