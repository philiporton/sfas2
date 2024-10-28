import {
    getCurrentEpoch,
    calculateForecastPeriod,
    timestampToString
} from "@/app/lib/date";
//import { presentSources } from "@/utils/testdata";            //Remove comments when test data is set up
import PopupButton from "@/app/ui/PopupButton";
import TooltipHover from "@/app/ui/TooltipHover";
import GoogleMapsEmbed from "@/app/ui/maps/GoogleMapsEmbed";
import GoogleMapsReact from "./ui/GoogleMapsReact";
import StormReport from "./ui/stormReports";
export default function App() {
    //   const testData = presentSources;    //Our Test Data
    const timeAtRender = getCurrentEpoch();
    const [today, tomorrow] = calculateForecastPeriod(timeAtRender);

    const mapsAPIKey = process.env.GOOGLE_MAPS_API_KEY!;

    const overviewTextBody = [
        `The Stevens Flood Advisory System (SFAS) displays both current and forecast water levels at 
            several locations, and compares them to "action" levels for flooding or blowout-tide, as 
            available. Each SFAS location is displayed as a marker on the SFAS map. The marker will be 
            either a square to indicate tidal stations, or a circle to indicate hydrological, non-tidal 
            stations. The control box on the right displays a color legend for "action" levels.`,
        `The color of the markers indicates the current water level, as observed by real-time field 
            instruments at these locations. If a location lacks such an instrument, or if for any reason 
            no observations have been received over the past two hours, that location's marker is white 
            with "M" indicating that only model forecasts are currently available. If flooding or a 
            blowout-tide is predicted within 96 hours from now, the "forecast period" shown on the top of 
            the main SFAS page, then the marker will blink.`,
        `If you click on a location marker, an "info window" will appear which notes the current observed 
            water level and the most severe forecast level in the forecast period, along with the date/time 
            when that event is expected. By default, an ensemble of forecast predictions created at the 
            Davidson Laroratory is used in SFAS.`,
        `To display a time series plot, which includes 96 or more hours of forecast, with observed data 
            when available, click on the 'Show Time Series Plot' in the info window, or use the Station drop 
            down in the control panel to select a station. The Stevens ensemble for the selected location 
            will be displayed first. Where available, you may select to display a different forecast time 
            series from a number of forecast models.`,
        `If you would like to receive email notifications of predicted flooding, enter your primary email 
            address in the control panel to the right, and click the 'Manage Email Notifications' button. On 
            the page that appears, you may select the stations for which you'd like to receive notifications, 
            and, optionally, provide an alternate email.`
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

            <PopupButton
                title="Overview & Control Panel Usage"
                body={overviewTextBody}
            />
            <p>TOOLTIP BELOW</p>
            <TooltipHover text="Bello!" />

            {/* <GoogleMapsEmbed mapsAPIKey={mapsAPIKey}/> */}

            <GoogleMapsReact mapsAPIKey={mapsAPIKey} />
            <br />
            <StormReport></StormReport>
        </main>
    );
}
