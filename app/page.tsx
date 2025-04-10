import {
    getCurrentEpoch,
    calculateForecastPeriod,
    timestampToString
} from "@/app/lib/date";
import GoogleMapsReact from "./ui/map/GoogleMapsReact";
import StormReport from "./ui/stormReports";
import Image from "next/image";
import sponsorsPic from "../app/images/sponsorLogos/sponsors.png"
import StationSelect from "./ui/stationDropdown";
import PopupButton from "./ui/PopupButton";
import Link from "next/link";

export default function App() {
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
available, select "Show Time Series Plot." You can also select a station from the drop down menu on the Stevens
Flood Advisory System Stations box. The Stevens ensemble for the selected location will be displayed first.
Where available, you may select to display a different forecast time series from a number of forecast models.`,
`To display a time series plot, which includes 96 or more hours of forecast, with observed data when available, click 
on the 'Show Time Series Plot' in the info window, or use the Station drop down in the control panel to select a station. 
The Stevens ensemble for the selected location will be displayed first. Where available, you may select to display a 
different forecast time series from a number of forecast models.`,
`If you would like to receive email notifications of predicted flooding, enter your primary email address in the control 
panel to the right, and click the 'Manage Email Notifications' button. On the page that appears, you may select the 
stations for which you'd like to receive notifications, and, optionally, provide an alternate email.`
    ];

    return (
        <main>
             <div className="absolute top-32 left-0 m-4">
                <a href="https://www.stevens.edu" target="_blank">
                <Image
                    src="/Stevens.png" 
                    alt="Logo"
                    sizes="100vw"
                    className="rounded-lg"
                    style={{
                        height: 'auto',
                      }}
                    width={200}
                    height={100}
                />
                </a>
            </div>
            <div className="container px-4 py-5 text-center">
                <h1 className="display-3 fw-bold text-body-emphasis">
                    Stevens Flood Advisory System
                </h1>
                <p className="lead">
                    Forecast Period: {timestampToString(today)} through{" "}
                    {timestampToString(tomorrow)}
                </p>
            </div>

            <div className="container font-sans">
                {/* First row with overview and email signup */}
                <div className="row align-items-center">
                    <div className="col-lg-8 col-md-12">
                        <h2 className="text-[#A32638]">STEVENS FLOOD ADVISORY SYSTEM OVERVIEW</h2>
                        <div className="pb-8 mb-3">
                            <p>{overviewTextBody.at(0)}</p>
                            <PopupButton
                                title="Overview & Control Panel Usage"
                                body={overviewTextBody}
                            />
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12">
                        <div className="text-center bg-[#e4e5e6] py-6">
                            <h3 className="text-[#A32638]"><strong>RECEIVE EMAIL</strong> NOTIFICATIONS</h3>
                            <p>or update your information:</p>
                            <input type="email" placeholder="Your Email Address" className="m-2 w-7/8 mt-4"></input>
                            <button
                                type="submit"
                                className="stevens-red m-2 w-7/8 mt-4"
                                style={{ border: '2px solid #A32638', backgroundColor: 'transparent', color: '#A32638' }}>
                                <Link href="/registration">
                                <div
                                    className="text-center p-2 m-1 font-bold"
                                    style={{ border: '2px solid #7F7F7F', backgroundColor: 'transparent', color: '#A32638' }}>
                                    SIGN UP
                                </div>
                                </Link>
                            </button>
                            <br />
                            <button
                                type="submit"
                                className="stevens-red m-2 w-7/8 mb-3"
                                style={{ border: '2px solid #A32638', backgroundColor: 'transparent', color: '#A32638' }}>
                                <Link href="/registration">
                                <div
                                    className="text-center p-2 m-1 font-bold"
                                    style={{ border: '2px solid #7F7F7F', backgroundColor: 'transparent', color: '#A32638' }}>
                                    MANAGE YOUR INFO
                                </div>
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Second row with map and sidebar */}
                <div className="row">
                    {/* Map column - takes full width on mobile, 8 columns on medium+ */}
                    <div className="col-lg-8 col-md-12 order-lg-1 order-md-1 order-2">
                        <h2 className="text-[#A32638]">CURRENT FLOOD MAP</h2>
                        <GoogleMapsReact mapsAPIKey={mapsAPIKey} />
                        <p className="text-black">DISCLAIMER: Stevens Flood Advisory System adheres to <a className="text-black" href="https://www.noaa.gov/organization/information-technology/policy-oversight/information-quality/information-quality-guidelines">NOAA standards and guidelines</a> for use and reliability of
                            our forecasts.</p>
                    </div>
                    
                    {/* Sidebar column - takes full width on mobile, 4 columns on medium+ */}
                    <div className="col-lg-4 col-md-12 order-lg-2 order-md-2 order-1">
                        <div className="py-4">
                            <StationSelect />
                        </div>
                        <div className="text-center bg-[#e4e5e6] px-4 py-2 mb-4">
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

                        <div className="py-4">
                            <StormReport />
                        </div>
                    </div>
                </div>

                {/* Footer - outside the main content row */}
                <footer className="mt-4">
                    <h1 className="text-[#A32638]">OUR SPONSORS</h1>
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