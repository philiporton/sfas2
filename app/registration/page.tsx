import Navigation from "@/app/ui/navigation/Navigation";
import blueBox from "../images/solid_blue_box_white_border.png";
import whiteBox from "../images/white_box_blue_border.png";
import redBox from "../images/white_box_red_border.png";
import emptyBox from "../images/black_border_box.gif";

export default function registration() {
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
                    <form action="">
                        <p>* (required)</p>
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
                            <input
                                name="verificationCode"
                                required
                                className="h-5"
                            />
                            <p className="text-sm">Primary Email:*</p>
                            <input
                                name="verificationCode"
                                required
                                className="h-5"
                            />
                            <p className="text-sm">Verify Primary Email:*</p>
                            <input
                                name="verificationCode"
                                required
                                className="h-5"
                            />
                            <p className="text-sm">Secondary Email:</p>
                            <input
                                name="verificationCode"
                                required
                                className="h-5"
                            />
                            <p className="text-sm">Verify Secondary Email:</p>
                            <input
                                name="verificationCode"
                                required
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
