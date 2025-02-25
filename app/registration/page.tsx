"use client";

import React, { FormEvent, useState } from "react";

import blueBox from "../images/solid_blue_box_white_border.png";
import whiteBox from "../images/white_box_blue_border.png";
import redBox from "../images/white_box_red_border.png";
import emptyBox from "../images/black_border_box.gif";
import GoogleMapsReactRegis from "./../ui/GoogleMapsReactRegis";

export default function Registration() {
    const [isShowingError, setIsShowingError] = useState(false);
    const [errorContent, setErrorContent] = useState<Array<React.JSX.Element>>(
        []
    );
    const mapsAPIKey = process.env.GOOGLE_MAPS_API_KEY!;

    const validateUserInput = (e: FormEvent<HTMLFormElement>) => {
        setIsShowingError(false);
        setErrorContent([]);

        const formData = new FormData(e.currentTarget);
        const rawFormData = {
            verificationCode: formData
                .get("verificationCode")!
                .toString()
                .trim(),
            name: formData.get("name")!.toString().trim(),
            primaryEmail: formData.get("primaryEmail")!.toString().trim(),
            verifyPrimaryEmail: formData
                .get("verifyPrimaryEmail")!
                .toString()
                .trim(),
            secondaryEmail: formData.get("secondaryEmail")?.toString().trim(),
            verifySecondaryEmail: formData
                .get("verifySecondaryEmail")
                ?.toString()
                .trim()
        };

        const nameValidPattern = /^[\w- ]{2,32}$/; // [a-zA-Z0-9_\- ], at least 2 and at most 32
        const emailValidPattern =
            /^[\w!#\$%&'\*\+\-\/=\?\^`\{|\}~]{1,64}@[a-zA-Z0-9\-]{1,64}\.[a-zA-Z]{2,64}$/;

        let hasErrors = false;
        const newErrors: Array<React.JSX.Element> = [];

        if (!nameValidPattern.test(rawFormData.name)) {
            hasErrors = true;
            newErrors.push(
                <p key="invalidName">
                    Invalid name. (Can only include letters, numbers, spaces,
                    and dashes (-)
                </p>
            );
        }
        if (!emailValidPattern.test(rawFormData.primaryEmail)) {
            hasErrors = true;
            newErrors.push(
                <p key="invalidPrimaryEmailFormat">
                    Invalid primary email format.
                </p>
            );
        }
        if (rawFormData.primaryEmail !== rawFormData.verifyPrimaryEmail) {
            hasErrors = true;
            newErrors.push(
                <p key="mismatchPrimaryEmail">
                    Primary email doesn't match verify field.
                </p>
            );
        }
        if (rawFormData.secondaryEmail) {
            if (!emailValidPattern.test(rawFormData.secondaryEmail)) {
                hasErrors = true;
                newErrors.push(
                    <p key="invalidSecondaryEmailFormat">
                        Invalid secondary email format.
                    </p>
                );
            }
            if (
                !rawFormData.verifySecondaryEmail ||
                rawFormData.secondaryEmail !== rawFormData.verifySecondaryEmail
            ) {
                hasErrors = true;
                newErrors.push(
                    <p key="mismatchSecondaryEmail">
                        Secondary email doesn't match verify field.
                    </p>
                );
            }
        }

        if (hasErrors) {
            setIsShowingError(true);
            setErrorContent(newErrors);
            e.preventDefault();
        }
    };

    return (
        <main>
            <div className="container px-4 py-5 text-center">
                <h1 className="display-5 text-body-emphasis">
                    MANAGE YOUR EMAIL NOTIFICATIONS
                </h1>
            </div>
            <div className="items-start justify-left px-32">
                <h2 className="text-red-800">STEVENS FLOOD ADVISTORY SYSTEM OVERVIEW</h2>
                <p>
                    The  Davidson Laboratory Flood Advisory System Registration page allows you to register for email notifications when flooding is predicted for those stations for which
                    we have official flooding levels. (There are stations for which we predict flooding based on our determination of flood levels, but we only support email notifications for
                    those with official flooding levels.)
                </p>
                <p>
                    Every six hours, SFAS determines which, if any, of the stations is expecting flooding in the coming eight-hour period, and sends an email to registrants. Regardless of
                    the number of stations for which you register, you will receive only one email. If you registered for notifications for, say, five stations, the email will list each of those
                    five for which flooding is predicted. Thus, there will be a max of four emails per day, and the email you receive will list only those stations in which you are interested,
                    and for which flooding is expected.
                </p>
                <p>
                    This page shows the same stations on a Google map that appear on the main Flood Advisory page. White markers indicate those stations for which you may register
                    for emails. If you have already registered, then those stations for which you've already signed up for email will appear in blue. Transparent boxes with yellow borders
                    indicate stations for which you cannot register. If you no longer wish to receive notification for a particular station, click on the blue box and it will turn white with a red
                    border.
                </p>
                <br/>
                <br/>
                <h2 className="text-red-800">HOW TO REGISTER FOR FLOOD ADVISORY ALERTS</h2>
                <p>
                    Enter your contact information in the fields below (unless you are already registered). You can opt to have emails sent both to primary and alternate email addresses.
                    Next, click on the markers on the map to specify which stations you wish to select or remove, then click ‘subscribe’ to update or add new registration information.
                    Clicking on 'Unsubscribe' completely removes you from receiving email notifications. If you wish to change your Primary Email addresses, you will need to
                    ‘Unsubscribe’ for that email address, then complete a new registration with the new Primary Email information. However, you can change (or add) an Alternate Email
                    address as an update.
                </p>
                <p>
                    When you enter your mail email address, a 6-digit Verification Code will be sent to your specified email address. The code is valid for 30 minutes so that you have time
                    to decide which stations you are interested in and enter the information. If it takes you longer than 30 minutes you will be told that in a popup and return to the main
                    SFAS page and must re-enter this page which will generate a new SFAS code good for another 30 minutes.
                </p>
            </div>
            <div className="flex items-start justify-center">
                <div className="flex-none w-1/2 p-8 aspect-w-1 aspect-h-1">
                    <p className="text-red-800 font-bold">Click on the markers below to select or remove stations.</p>
                    <GoogleMapsReactRegis mapsAPIKey={mapsAPIKey} />
                </div>

                <div className="flex flex-col w-3/8 p-8">
                    <div className="text-center border bg-slate-300 mb-4">
                        <h2 className="text-red-800 pt-3">SELECT YOUR STATIONS</h2>
                        <p className="text-red-800 text-2xl">ALERTS KEY</p>
                        <div className="grid grid-cols-2 content-between">
                            <div className="flex flex-row items-start justify-left">
                                <img
                                    src={blueBox.src}
                                    alt="blueBox"
                                    className="pl-6 mt-1"
                                ></img>
                                <p className="pl-2 pr-6">
                                    Alerts Activated
                                </p>
                            </div>
                            <div className="flex flex-row items-start justify-left">
                                <img
                                    src={whiteBox.src}
                                    alt="whiteBox"
                                    className="pl-6 mt-1"
                                ></img>
                                <p className="pl-2 pr-6">
                                    Alerts Will Be Removed
                                </p>
                            </div>
                            <div className="flex flex-row items-start justify-left">
                                <img
                                    src={redBox.src}
                                    alt="redBox"
                                    className="pl-6 mt-1"
                                ></img>
                                <p className="pl-2 pr-6">
                                    No Alerts Activated
                                </p>
                            </div>
                            <div className="flex flex-row items-start justify-left">                     
                                <img
                                    src={emptyBox.src}
                                    alt="emptyBox"
                                    className="pl-6 mt-1"
                                ></img>
                                <p className="pl-2 pr-6">
                                    No Flood Levels Defined
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row items-start justify-center">
                            <img
                                src={emptyBox.src}
                                alt="emptyBox"
                                className="pl-6 mt-1"
                            ></img>
                            <p className="pl-2 pr-6">
                                Select All Stations
                            </p>
                        </div>
                    </div>
                    <div className="text-center border bg-slate-300">
                        <h2 className="text-red-800 pt-3">REGISTRATION</h2>
                        <form
                            onSubmit={(e) => {
                                validateUserInput(e);
                            }}
                        >
                            <div id="error" hidden={!isShowingError}>
                                <p>
                                    There are some errors that prevented your
                                    registration.
                                </p>
                                {errorContent}
                            </div>
                            <div className="items-center">
                                <input
                                    name="verificationCode"
                                    required
                                    className="h-5 w-7/8 m-1 p-3"
                                    placeholder="Enter Verification Code*"
                                />
                                <br/>
                                <input 
                                    name="name" 
                                    required 
                                    className="h-5 w-7/8 m-1 p-3"
                                    placeholder="Name*"
                                />
                                <br/>
                                <input
                                    name="primaryEmail"
                                    required
                                    className="h-5 w-7/8 m-1 p-3"
                                    placeholder="Primary Email*"
                                />
                                <br/>
                                <input
                                    name="verifyPrimaryEmail"
                                    required
                                    className="h-5 w-7/8 m-1 p-3"
                                    placeholder="Verify Primary Email*"
                                />
                                <br/>
                                <input 
                                    name="secondaryEmail" 
                                    className="h-5 w-7/8 m-1 p-3"
                                    placeholder="Secondary Email"
                                />
                                <br/>
                                <input
                                    name="verifySecondaryEmail"
                                    className="h-5 w-7/8 m-1 p-3"
                                    placeholder="Verify Secondary Email"
                                />
                                <br/>
                                
                                <p 
                                    className="items-left justify-left text-left m-1 pl-12"
                                    style={{ color: '#991B1B' }}
                                >*Required Field</p>
    
                                <button
                                    type="submit"
                                    className="text-red-800 hover:bg-red-800 hover:text-black m-2 w-7/8 mt-4"
                                    style={{ border: '2px solid #991B1B', backgroundColor: 'transparent', color: '#991B1B' }}
                                >
                                    <div 
                                        className="text-center p-2 m-1 font-bold"
                                        style={{ border: '2px solid #000000', backgroundColor: 'transparent', color: '#991B1B' }}
                                    >
                                        SUBSCRIBE
                                    </div>
                                </button>
                                <br/>
                                <button
                                    type="submit"
                                    className="text-red-800 hover:bg-red-800 hover:text-black m-2 w-7/8 mb-3"
                                    style={{ border: '2px solid #991B1B', backgroundColor: 'transparent', color: '#991B1B' }}
                                >
                                    <div 
                                        className="text-center p-2 m-1 font-bold"
                                        style={{ border: '2px solid #000000', backgroundColor: 'transparent', color: '#991B1B' }}
                                    >
                                        UNSUBSCRIBE
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

//get updated images for the squares
//find out what exact font it used for the text
//copy and paste inforomation for the two sections
//work with emma about the marker styling