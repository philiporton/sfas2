"use client";

import React, { FormEvent, useState } from "react";

import { registerNewUser } from "@/app/lib/actions";

import blueBox from "../images/solid_blue_box_white_border.png";
import whiteBox from "../images/white_box_blue_border.png";
import redBox from "../images/white_box_red_border.png";
import emptyBox from "../images/black_border_box.gif";

export default function registration() {
    const [isShowingError, setIsShowingError] = useState(false);
    const [errorContent, setErrorContent] = useState<Array<React.JSX.Element>>(
        []
    );

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
        } else e.preventDefault();
    };

    return (
        <main>
            <div className="container px-4 py-5 text-center">
                <h1 className="display-5 text-body-emphasis">
                    Davidson Laboratory SFAS Registration
                </h1>
            </div>
            <div className="flex">
                <div className=" border  w-50 flex-none">
                    <p>Map component</p>
                </div>
                <div className=" text-center  border  w-50 flex-1 bg-slate-300">
                    <p className="bg-emerald-500 italic">Registration</p>
                    <p>Marker color legend:</p>
                    <div className="grid grid-cols-2 content-between">
                        <img
                            src={blueBox.src}
                            alt="blueBox"
                            className="pl-24 mt-3"
                        ></img>
                        <p className="pr-6">
                            You wish to receive email alerts for this station
                        </p>
                        <img
                            src={whiteBox.src}
                            alt="whiteBox"
                            className="pl-24 mt-3"
                        ></img>
                        <p className="pr-6">
                            You do NOT wish to receive email alerts for this
                            station
                        </p>
                        <img
                            src={redBox.src}
                            alt="redBox"
                            className="pl-24 mt-3"
                        ></img>
                        <p className="pr-6">
                            Your previous choice for alerts for this station
                            will be removed
                        </p>
                        <img
                            src={emptyBox.src}
                            alt="emptyBox"
                            className="pl-24 mt-3"
                        ></img>
                        <p className="pr-6">
                            There are no defined flood levels for this station
                        </p>
                    </div>
                    <form
                        onSubmit={(e) => {
                            validateUserInput(e);
                        }}
                        action={registerNewUser}
                    >
                        <p>* (required)</p>
                        <div id="error" hidden={!isShowingError}>
                            <p>
                                There are some errors that prevented your
                                registration.
                            </p>
                            {errorContent}
                        </div>
                        <div className="grid grid-cols-2 content-between">
                            <p className="text-sm">
                                Verification Code (6 digits):*
                            </p>
                            <input
                                name="verificationCode"
                                required
                                className="h-5"
                            />
                            <p className="text-sm">Name:*</p>
                            <input name="name" required className="h-5" />
                            <p className="text-sm">Primary Email:*</p>
                            <input
                                name="primaryEmail"
                                required
                                className="h-5"
                            />
                            <p className="text-sm">Verify Primary Email:*</p>
                            <input
                                name="verifyPrimaryEmail"
                                required
                                className="h-5"
                            />
                            <p className="text-sm">Secondary Email:</p>
                            <input name="secondaryEmail" className="h-5" />
                            <p className="text-sm">Verify Secondary Email:</p>
                            <input
                                name="verifySecondaryEmail"
                                className="h-5"
                            />
                            <button
                                type="submit"
                                className="bg-amber-400 hover:bg-amber-100"
                            >
                                Save registration
                            </button>
                            <button
                                type="submit"
                                className="bg-amber-400 hover:bg-amber-100"
                            >
                                Remove registration
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
