"use client";

import React from 'react';
import { Dropdown } from 'react-bootstrap';

const sponsorsList = [
    { name: 'National Oceanic and Atmospheric Association', url: 'https://www.noaa.gov/' },
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
    { name: 'NYC Environmental Protection', url: 'https://www.nyc.gov/site/dep/index.page' },
];

const Sponsors = () => {
    return (
        <>
            {sponsorsList.map((sponsor, index) => (
                <Dropdown.Item key={index} href={sponsor.url} target="_blank">
                    {sponsor.name}
                </Dropdown.Item>
            ))}
        </>
    );
};

export default Sponsors;