"use client";

import React from "react";
import { Dropdown } from "react-bootstrap";

//currently the logos are from the internet. There is a local version but I'm currently trying to figure out why it won't work
const sponsorsList = [
    { name: 'National Oceanic and Atmospheric Association', url: 'https://www.noaa.gov/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/702px-NOAA_logo.svg.png' },
    { name: 'NOAA Climate Adaptation Partnerships Program', url: 'https://www.noaa.gov/', logo: 'https://www.noaa.gov/sites/default/files/2022-03/noaa_digital_logo-2022.png' },
    { name: 'Port Authority NY NJ', url: 'https://www.panynj.gov/port-authority/en/index.html', logo: 'https://enterprisetraining.com/wp-content/uploads/2021/12/PANYNJ.jpg' },
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
                    <div style={{display: 'flex', alignItems:'center' }}>
                        <img src={sponsor.logo} alt={sponsor.name} style={{ width: '20px', marginRight: '10px'}} />
                        <h6 style={{ marginRight: '20px' }}>{sponsor.name}</h6>
                    </div>
                </Dropdown.Item>
            ))}
        </>
    );
};

export default Sponsors;
