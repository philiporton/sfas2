"use client";

import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function PopupButton({
    title,
    body
}: {
    title: string;
    body: Array<string>;
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
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: show ? "blue" : "red",
                    justifyContent: "center"
                }}
            >
                {show ? "X" : "?"}
            </Button>
            <Modal show={show} onHide={hidePopup} size="lg">
                <div
                    className="modal-content"
                    style={{ backgroundColor: "rgba(0, 0, 255, 0.25)" }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{paragraphs}</Modal.Body>
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
