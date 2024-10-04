import {
    getCurrentEpoch,
    calculateForecastPeriod,
    timestampToString
} from "@/utils/date";
//import { presentSources } from "@/utils/testdata";            //Remove comments when test data is set up
import Navigation from "@/app/ui/navigation/Navigation";

export default function App() {
//   const testData = presentSources;    //Our Test Data
    const timeAtRender = getCurrentEpoch();
    const [today, tomorrow] = calculateForecastPeriod(timeAtRender);

    return (
        <main>
            <Navigation />
            <div className="container px-4 py-5 text-center">
                <h1 className="display-3 fw-bold text-body-emphasis">
                    Stevens Flood Advisory System
                </h1>
                <p className="lead">
                    Forecast Period: {timestampToString(today)} through{" "}
                    {timestampToString(tomorrow)}
                </p>
            </div>
        </main>
    );
}
