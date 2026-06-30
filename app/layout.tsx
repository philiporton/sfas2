"use client";

import localFont from "next/font/local";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import SecondNavigation from "@/app/ui/navigation/SecondNavigation";
import Footer from "@/app/ui/Footer";
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
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
                <SecondNavigation />
                {children}
                <Footer />
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
