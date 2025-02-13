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
                <h1 className="display-3 fw-bold text-body-emphasis">
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
                        <h2 className="text-[#A32638] ">STEVENS FLOOD ADVISORY SYSTEM OVERVIEW</h2>
                        <div>
                            {overviewTextBody.map((elem, ind) => <p key={ind}>{elem}</p>)}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="text-center bg-[#e4e5e6]">
                            <h3 className="text-[#A32638]">RECEIVE EMAIL NOTIFICATIONS</h3>
                            <input></input>
                            <input></input>
                            <button type="button" className="text-[#A32638] border-double font-bold text-2xl border-4 min-w-full border-[#A32638]">SIGN UP</button> <br />
                            <button type="button" className="text-[#A32638] border-double font-bold text-2xl border-4 min-w-full border-[#A32638]">MANAGE YOUR INFO</button>
                        </div>
                    </div>
                </div>

                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h2 className="text-[#A32638]">CURRENT FLOOD MAP</h2>
                        <GoogleMapsReact mapsAPIKey={mapsAPIKey} />
                        <p className="text-black">DISCLAIMER: Stevens Flood Advisory System adheres to <a className="text-black" href="https://www.noaa.gov/organization/information-technology/policy-oversight/information-quality/information-quality-guidelines">NOAA standards and guidelines</a> for use and reliability of
                            our forecasts.</p>
                    </div>
                    <div className="col-md-4">
                        {/* <div className="mb-3">
                            <PopupButton
                                title="Overview & Control Panel Usage"
                                body={overviewTextBody}
                            />
                        </div> */}
                        <div className="text-center bg-[#e4e5e6]">
                            <h3 className="text-[#A32638]">ACTION LEVEL KEY</h3>
                            <div className="row">
                                <div className="col flex-grow-0">
                                    <CustomTooltipHover
                                        tooltipText="Major"
                                        content={
                                            <div className="mapglyph-major mapglyph-base" />
                                        }
                                    />
                                </div>
                                <p className="col">Major</p>
                            </div>
                            <div className="row">
                                <div className="col flex-grow-0">
                                    <CustomTooltipHover
                                        tooltipText="Moderate"
                                        content={
                                            <div className="mapglyph-moderate mapglyph-base" />
                                        }
                                    />
                                </div>
                                <p className="col">Moderate</p>
                            </div>
                            <div className="row">
                                <div className="col flex-grow-0">
                                    <CustomTooltipHover
                                        tooltipText="Minor"
                                        content={
                                            <div className="mapglyph-minor mapglyph-base" />
                                        }
                                    />
                                </div>
                                <p className="col">Minor</p>
                            </div>
                            <div className="row">
                                <div className="col flex-grow-0">
                                    <CustomTooltipHover
                                        tooltipText="Near"
                                        content={
                                            <div className="mapglyph-near mapglyph-base" />
                                        }
                                    />
                                </div>
                                <p className="col">Near</p>
                            </div>
                            <div className="row">
                                <div className="col flex-grow-0">
                                    <CustomTooltipHover
                                        tooltipText="Normal"
                                        content={
                                            <div className="mapglyph-normal mapglyph-base" />
                                        }
                                    />
                                </div>
                                <p className="col">Normal</p>
                            </div>
                        </div>
                        <StormReport />
                    </div>
                </div>
                <footer>
                    <h1 className="text-[#A32638] text-center"> OUR SPONSORS</h1>
                    <p>Funding for the Stevens Flood Advisory Systems is provided by The Port Authority of New York and New Jersey</p>
                    <Image
                        src={sponsorsPic}
                        alt="Sponsor Logos"
                    />
                </footer>
            </div>
        </main>
    );
}
