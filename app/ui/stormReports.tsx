"use client";

import { DropdownButton, DropdownItem } from "react-bootstrap";
import getPDFURL from "../types";
const assess2021 = getPDFURL("SFAS_Forecast2021_publicreport.pdf");
const assess2020 = getPDFURL("SFAS_Forecast2020_publicreport.pdf");
const survey2024 = getPDFURL("SFAS users survey report 2024 -V4.pdf");

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
                <DropdownItem href={survey2024} target="_blank">
                    User Survey 2024
                </DropdownItem>
            </DropdownButton>
        </div>
    );
}
