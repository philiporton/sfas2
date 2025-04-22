"use client";

import localFont from "next/font/local";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import SecondNavigation from "@/app/ui/navigation/SecondNavigation";
import SponsorsDropdown from "./ui/navbar/sponsors/SponsorsDropdown";
import React from "react";


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
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {/*{isAtTop && <Navigation />}
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >        
                    {(isHovering && !isAtTop) && <Navigation />}
                    <div
                        className={!isAtTop && !isHovering ? "fixed-top" : ""}
                    >
                        <SecondNavigation />
                    </div>
                </div>*/}
                <SecondNavigation />
                {children}
            </body>
        </html>
    );
}

/*
                                

                {
                    isAtTop ? <Navigation /><SecondNavigation /> 
                    : isHovering ? <Navigation /><SecondNavigation /> 
                        : <div className={"fixed-top"}> <SecondNavigation /> </div> 
                }
                        {isAtTop ? (
                    <>
                        <Navigation />
                        <SecondNavigation />
                    </>
                ) : isHovering ? (
                    <>
                        <Navigation />
                        <SecondNavigation />
                        <p>heyyyy</p>
                    </>
                ) : (
                    <div 
                        className={!isAtTop && !isHovering ? "fixed-top" : ""}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <SecondNavigation />
                    </div>
                )}

                */
