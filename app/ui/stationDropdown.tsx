"use client";

import { DropdownButton, DropdownItem } from "react-bootstrap";


export default function StationSelect() {
    return (
        <div className="text-center bg-[#e4e5e6] py-4">
            <h3 className="text-[#A32638]"><strong>STEVENS FLOOD ADVISORY SYSTEM</strong> STATIONS</h3>
            <DropdownButton
                id="dropdown-basic-button"
                title="Select a station to display time series plot"
            >
                <DropdownItem href="/stations?stationId=SPBRMTP1" target="_blank">
                    New York Harbor
                </DropdownItem>
                <DropdownItem href="/stations?stationId=U002" target="_blank">
                    Hudson River
                </DropdownItem>
                <DropdownItem href="/stations?stationId=U207" target="_blank">
                    Atlantic Beach
                </DropdownItem>
            </DropdownButton>
        </div>
    );
}
