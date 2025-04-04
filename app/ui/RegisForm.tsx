"use client";
import React, { FormEvent, useState } from "react";

export default function RegisForm() {
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
            } 
        }
    
    return (
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
            <br />
            <input
                name="name"
                required
                className="h-5 w-7/8 m-1 p-3"
                placeholder="Name*"
            />
            <br />
            <input
                name="primaryEmail"
                required
                className="h-5 w-7/8 m-1 p-3"
                placeholder="Primary Email*"
            />
            <br />
            <input
                name="verifyPrimaryEmail"
                required
                className="h-5 w-7/8 m-1 p-3"
                placeholder="Verify Primary Email*"
            />
            <br />
            <input
                name="secondaryEmail"
                className="h-5 w-7/8 m-1 p-3"
                placeholder="Secondary Email"
            />
            <br />
            <input
                name="verifySecondaryEmail"
                className="h-5 w-7/8 m-1 p-3"
                placeholder="Verify Secondary Email"
            />
            <br />

            <p
                className="items-left justify-left text-left m-1 pl-12"
                style={{ color: "#991B1B" }}
            >
                *Required Field
            </p>

            <button
                type="submit"
                className="text-red-800 hover:bg-red-800 hover:text-black m-2 w-7/8 mt-4"
                style={{
                    border: "2px solid #991B1B",
                    backgroundColor: "transparent",
                    color: "#991B1B"
                }}
            >
                <div
                    className="text-center p-2 m-1 font-bold"
                    style={{
                        border: "2px solid #000000",
                        backgroundColor: "transparent",
                        color: "#991B1B"
                    }}
                >
                    SUBSCRIBE
                </div>
            </button>
            <br />
            <button
                type="submit"
                className="text-red-800 hover:bg-red-800 hover:text-black m-2 w-7/8 mb-3"
                style={{
                    border: "2px solid #991B1B",
                    backgroundColor: "transparent",
                    color: "#991B1B"
                }}
            >
                <div
                    className="text-center p-2 m-1 font-bold"
                    style={{
                        border: "2px solid #000000",
                        backgroundColor: "transparent",
                        color: "#991B1B"
                    }}
                >
                    UNSUBSCRIBE
                </div>
            </button>
        </div>
    </form> 
    );
}