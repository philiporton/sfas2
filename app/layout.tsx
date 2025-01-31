import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import Navigation from "@/app/ui/navigation/Navigation";
import SponsorsDropdown from "./ui/navbar/sponsors/SponsorsDropdown";

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

export const metadata: Metadata = {
    title: "Stevens Flood Advisory System"
};

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
                <Navigation />
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
