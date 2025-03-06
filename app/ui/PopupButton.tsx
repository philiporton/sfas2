"use client";

import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function PopupButton({
    title,
    body
}: {
    title: string;
    body: string[];
}) {
    const [show, setShow] = useState(false);

    const hidePopup = () => setShow(false);
    const showPopup = () => setShow(true);

    const paragraphs = body.map((elem, ind) => (
        <p key={title + ind.toString()}>{elem}</p>
    )); // wrap each paragraph in a p tag

    return (
        <>
            <Button
                onClick={showPopup}
                style={{
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: show ? "blue" : "red",
                    justifyContent: "center"
                }}
            >
                {show ? "Less" : "More"}
            </Button>
            <Modal show={show} onHide={hidePopup} size="lg">
                <div
                    className="modal-content"
                    style={{ backgroundColor: "rgba(0, 0, 255, 0.25)" }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/JNcue34vS-g?si=HMj7OVsTuKj7nHwW" 
                            title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
                            gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
                        </iframe> <br />
                        {paragraphs}
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
