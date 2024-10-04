"use client";

import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function PopupButton() {
    const [show, setShow] = useState(false);

    const hidePopup = () => setShow(false);
    const showPopup = () => setShow(true);

    return (
        <>
            <Button 
                onClick={showPopup} 
                style={{ 
                    borderRadius: "50%", 
                    width: "30px", 
                    height: "30px", 
                    display: "flex", 
                    alignItems: "center", 
                    backgroundColor: show ? "red" : "blue",
                    justifyContent: "center" 
                }}>
                {show ? "X" : "?"}
            </Button>
            <Modal show={show} onHide={hidePopup} size="lg">
                
                <div className="modal-content" style={{ backgroundColor: 'rgba(0, 0, 255, 0.25)' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Overview & Control Panel Usage</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            The Stevens Flood Advisory System (SFAS) displays both current and forecast water levels at 
                            several locations, and compares them to "action" levels for flooding or blowout-tide, as 
                            available. Each SFAS location is displayed as a marker on the SFAS map. The marker will be 
                            either a square to indicate tidal stations, or a circle to indicate hydrological, non-tidal 
                            stations. The control box on the right displays a color legend for "action" levels.
                        </p>
                        <p>
                            The color of the markers indicates the current water level, as observed by real-time field 
                            instruments at these locations. If a location lacks such an instrument, or if for any reason 
                            no observations have been received over the past two hours, that location's marker is white 
                            with "M" indicating that only model forecasts are currently available. If flooding or a 
                            blowout-tide is predicted within 96 hours from now, the "forecast period" shown on the top of 
                            the main SFAS page, then the marker will blink.
                        </p>
                        <p>
                            If you click on a location marker, an "info window" will appear which notes the current observed 
                            water level and the most severe forecast level in the forecast period, along with the date/time 
                            when that event is expected. By default, an ensemble of forecast predictions created at the 
                            Davidson Laroratory is used in SFAS.
                        </p>
                        <p>
                            To display a time series plot, which includes 96 or more hours of forecast, with observed data 
                            when available, click on the 'Show Time Series Plot' in the info window, or use the Station drop 
                            down in the control panel to select a station. The Stevens ensemble for the selected location 
                            will be displayed first. Where available, you may select to display a different forecast time 
                            series from a number of forecast models.
                        </p>
                        <p>
                            If you would like to receive email notifications of predicted flooding, enter your primary email 
                            address in the control panel to the right, and click the 'Manage Email Notifications' button. On 
                            the page that appears, you may select the stations for which you'd like to receive notifications, 
                            and, optionally, provide an alternate email.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={hidePopup}>
                            Close this window
                        </Button>
                    </Modal.Footer>
                </div>

            </Modal>
        </>
    );
}