import {
    getCurrentEpoch,
    calculateForecastPeriod,
    timestampToString
} from "@/app/lib/date";
//import { presentSources } from "@/utils/testdata";            //Remove comments when test data is set up
import PopupButton from "@/app/ui/PopupButton";
import TooltipHover from "@/app/ui/TooltipHover";
import CustomTooltipHover from "@/app/ui/CustomTooltipHover";
import GoogleMapsReact from "./ui/GoogleMapsReact";
import StormReport from "./ui/stormReports";
import Image from "next/image";
import sponsorsPic from "../app/images/sponsorLogos/sponsors.png"
import StationSelect from "./ui/stationDropdown";
import Station from "./stations/[stationId]/page";

export default function App() {
    //   const testData = presentSources;    //Our Test Data
    const timeAtRender = getCurrentEpoch();
    const [today, tomorrow] = calculateForecastPeriod(timeAtRender);

    const mapsAPIKey = process.env.GOOGLE_MAPS_API_KEY!;

    const overviewTextBody = [
        `The Stevens Flood Advisory System (SFAS)
displays both current and forecast water levels
at several locations, and compares them to
"action" levels for flooding or blowout-tide, as
available. Each location is displayed as a marker
on the map below. The marker will be either a
square to indicate tidal stations, or a circle to
indicate hydrological, non-tidal stations. The
Action Level Key box displays a color legend for
"action" levels.`,
        `The color of the markers indicates the current
water level, as observed by real-time field
instruments at these locations. If a location
lacks such an instrument, or if for any reason no
observations have been received over the past
two hours, that location's marker is white with
"M" indicating that only model forecasts are
currently available. If flooding or a blowout-tide
is predicted within 96 hours from now, the
"forecast period" shown on the top of the main
Stevens Flood Advisory System page, then the
marker will blink.`,
        `If you click on a location marker, an "info window" will appear which notes the current observed water level and
the most severe forecast level in the forecast period, along with the date/time when that event is expected. By
default, an ensemble of forecast predictions created at the Davidson Laboratory is used in the flood advisory
system. To display a time series plot, which includes 96 or more hours of forecast, with observed data when
available, select “Show Time Series Plot.
” You can also select a station from the drop down menu on the Stevens
Flood Advisory System Stations box. The Stevens ensemble for the selected location will be displayed first.
Where available, you may select to display a different forecast time series from a number of forecast models.`
    ];

    return (
        <main>
            <div className="container px-4 py-5 text-center">
                <h1 className="display-3 fw-bold text-body-emphasis ">
                    Stevens Flood Advisory System
                </h1>
                <p className="lead">
                    Forecast Period: {timestampToString(today)} through{" "}
                    {timestampToString(tomorrow)}
                </p>
            </div>

            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h2 className="text-[#A32638] font-[Bitter]">STEVENS FLOOD ADVISORY SYSTEM OVERVIEW</h2>
                        <div className="pb-8">
                            {overviewTextBody.map((elem, ind) => <p key={ind}>{elem}</p>)}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="text-center bg-[#e4e5e6] py-6">
                            <h3 className="text-[#A32638]"><strong>RECEIVE EMAIL</strong> NOTIFICATIONS</h3>
                            <p>or update your information:</p>
                            <input type="text" placeholder="Your Email Address"></input>
                            <button
                                type="submit"
                                className="stevens-red m-2 w-7/8 mt-4"
                                style={{ border: '2px solid #A32638', backgroundColor: 'transparent', color: '#A32638' }}>
                                <div
                                    className="text-center p-2 m-1 font-bold"
                                    style={{ border: '2px solid #7F7F7F', backgroundColor: 'transparent', color: '#A32638' }}>
                                    SIGN UP
                                </div>
                            </button>
                            <br />
                            <button
                                type="submit"
                                className="stevens-red m-2 w-7/8 mb-3"
                                style={{ border: '2px solid #A32638', backgroundColor: 'transparent', color: '#A32638' }}>
                                <div
                                    className="text-center p-2 m-1 font-bold"
                                    style={{ border: '2px solid #7F7F7F', backgroundColor: 'transparent', color: '#A32638' }}>
                                    MANAGE YOUR INFO
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row align-items-center">
                    <div className="col-md-8 pb-8">
                        <h2 className="text-[#A32638]">CURRENT FLOOD MAP</h2>
                        <GoogleMapsReact mapsAPIKey={mapsAPIKey} />
                        <p className="text-black">DISCLAIMER: Stevens Flood Advisory System adheres to <a className="text-black" href="https://www.noaa.gov/organization/information-technology/policy-oversight/information-quality/information-quality-guidelines">NOAA standards and guidelines</a> for use and reliability of
                            our forecasts.</p>
                    </div>
                    <div className="col">
                        <div className="col py-4" >
                            <StationSelect />
                        </div>
                        {/* <div className="mb-3">
                            <PopupButton
                                title="Overview & Control Panel Usage"
                                body={overviewTextBody}
                            />
                        </div> */}
                        <div className="text-center bg-[#e4e5e6] px-4 py-2">
                            <h3 className="text-[#A32638]">ACTION LEVEL <strong>KEY</strong></h3>
                            <div>
                                <p className="col text-lg text-black font-bold bg-[#bc40f6]">MAJOR FLOOD</p>
                            </div>
                            <div>
                                <p className="col text-lg text-black font-bold bg-[#ea334b]">MODERATE FLOOD</p>
                            </div>
                            <div>
                                <p className="col text-lg text-black font-bold bg-[#f19e4b]">MINOR FLOOD</p>
                            </div>
                            <div>
                                <p className="col text-lg text-black font-bold bg-[#ffff54]">NEAR FLOOD</p>
                            </div>
                            <div>
                                <p className="col text-lg text-black font-bold bg-[#75fb75]">NORMAL LEVELS</p>
                            </div>
                            <div>
                                <p className="col text-lg text-black font-bold bg-[#999999]">BLOWOUT</p>
                            </div>
                            <p className="text-lg text-black font-bold">*MODEL PREDICTIONS ONLY*</p>
                            <p>Marker color indicates current water level. Blinking markers indicate predicted flooding.</p>
                        </div>

                        <div className="col py-4" >
                            <StormReport />
                        </div>
                    </div>
                    <footer>
                        <h1 className="text-[#A32638]"> OUR SPONSORS</h1>
                        <p>Funding for the Stevens Flood Advisory Systems is provided by The Port Authority of New York and New Jersey</p>
                        <Image
                            src={sponsorsPic}
                            alt="Sponsor Logos"
                        />
                    </footer>
                </div>
            </div>
        </main>
    );
}
