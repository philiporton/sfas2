"use client";

import React from "react";
import Image from "next/image";
import { Dropdown } from "react-bootstrap";
import NOAALogo from "@/app/images/sponsorLogos/NOAA-logo.png";
import NOAAPartnershipLogo from "@/app/images/sponsorLogos/NOAA-partnerships-logo.png";
import PATHLogo from "@/app/images/sponsorLogos/port-authority-ny-nj-logo.jpg";

const sponsorsList = [
    {
        name: "National Oceanic and Atmospheric Association",
        url: "https://www.noaa.gov/",
        logo: NOAALogo
    },
    {
        name: "NOAA Climate Adaptation Partnerships Program",
        url: "https://www.noaa.gov/",
        logo: NOAAPartnershipLogo
    },
    {
        name: "Port Authority NY NJ",
        url: "https://www.panynj.gov/port-authority/en/index.html",
        logo: PATHLogo
    }
];

//The names and links of all the sponsors. commenting these out for easy access later on
/*{ name: 'National Oceanic and Atmospheric Association', url: 'https://www.noaa.gov/' },
{ name: 'NOAA Climate Adaptation Partnerships Program', url: 'https://www.noaa.gov/' },
{ name: 'Port Authority NY NJ', url: 'https://www.panynj.gov/port-authority/en/index.html' },
{ name: 'USGS', url: 'https://www.usgs.gov/' },
{ name: 'Department of Environmental Protection', url: 'https://dep.nj.gov/' },
{ name: 'Department of Transportation', url: 'https://www.nj.gov/transportation/' },
{ name: 'RISA', url: 'https://cpo.noaa.gov/Meet-the-Divisions/Climate-and-Societal-Interactions/RISA' },
{ name: 'Sustainable Shorelines', url: 'https://hrnerr.org/hudson-river-sustainable-shorelines/' },
{ name: 'Sea Grant NJ', url: 'https://njseagrant.org/' },
{ name: 'Sea Grant NY', url: 'https://njseagrant.org/' },
{ name: 'OEM', url: 'https://www.nyc.gov/site/em/index.page' },
{ name: 'United States Coast Guard', url: 'https://www.uscg.mil/' },
{ name: 'NYC Environmental Protection', url: 'https://www.nyc.gov/site/dep/index.page' },*/

const Sponsors = () => {
    return (
        <>
            {sponsorsList.map((sponsor, index) => (
                <Dropdown.Item key={index} href={sponsor.url} target="_blank">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Image
                            src={sponsor.logo.src}
                            alt={sponsor.name}
                            style={{ width: "20px", marginRight: "10px" }}
                        />
                        <h6 style={{ marginRight: "20px" }}>{sponsor.name}</h6>
                    </div>
                </Dropdown.Item>
            ))}
        </>
    );
};

export default Sponsors;
