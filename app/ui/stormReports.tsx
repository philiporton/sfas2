"use client";

import { DropdownButton, DropdownItem } from "react-bootstrap";
import getPDFURL from "../types";
const assess2021 = getPDFURL("SFAS_Forecast2021_publicreport.pdf");
const assess2020 = getPDFURL("SFAS_Forecast2020_publicreport.pdf");
const assessApr2017 = getPDFURL(
    "SFAS Service Assessment for Spring Tidal Event of April 1st 2017.pdf"
);
const assessMar2017 = getPDFURL(
    "SFAS Service Assessment for NorEaster of March 14 2017.pdf"
);
const assessJan2017 = getPDFURL(
    "SFAS Service Assessment for NorEaster of January 23 2017.pdf"
);

export default function StormReport() {
    return (
        <div>
            <p>Storm & Assessment Reports:</p>
            <DropdownButton
                id="dropdown-basic-button"
                title="Please select report:"
            >
                <DropdownItem href={assess2021} target="_blank">
                    Forecast Assessment 2021
                </DropdownItem>
                <DropdownItem href={assess2020} target="_blank">
                    Forecast Assessment 2020
                </DropdownItem>
                <DropdownItem href={assessApr2017} target="_blank">
                    April 01, 2017
                </DropdownItem>
                <DropdownItem href={assessMar2017} target="_blank">
                    March 14, 2017
                </DropdownItem>
                <DropdownItem href={assessJan2017} target="_blank">
                    January 23, 2017
                </DropdownItem>
            </DropdownButton>
        </div>
    );
}
