/**
 * functions for date formatting and processing
 */

export type DateRange = [number, number];

/**
 * returns current time in unix epoch milliseconds
 * @returns {number} milliseconds since 01 January 1970 00:00
 */
export const getCurrentEpoch = (): number => Date.now();

/**
 * returns the number of days in a given month, accounting for leap years
 * @param monthInd 0-index of month
 * @param year used for leap year
 * @returns {number} days in month
 * @throws if month is not in [0, 11] (inclusive)
 */
export const getDaysInMonth = (monthInd: number, year: number): number => {
    switch (monthInd) {
        case 1:
            return year % 4 === 0 ? 29 : 28;
        case 3:
        case 5:
        case 8:
        case 10:
            return 30;
        case 0:
        case 2:
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:
            return 31;
        default:
            throw `ERROR: ${monthInd} is not a valid month index in [0, 11]`;
    }
};

/**
 * given a timestamp, returns a tuple of that timestamp and the one 24 hours after that
 * @param timestamp
 * @returns {DateRange} tuple of timestamps
 */
export const calculateForecastPeriod = (timestamp: number): DateRange => {
    const currDate = new Date(timestamp);
    let [day, monthInd, year, hour] = [
        currDate.getDate(),
        currDate.getMonth(),
        currDate.getFullYear(),
        currDate.getHours()
    ];
    if (day === getDaysInMonth(monthInd, year)) {
        // if at last day in given month...
        day = 1; // reset day
        if (monthInd === 11) {
            // if december...
            monthInd = 0; // reset month
            year += 1; // and increment year
        } else monthInd += 1; // ...otherwise increment month
    } else day += 1; // ...otherwise increment dat
    const nextDay = new Date(year, monthInd, day, hour);
    return [timestamp, nextDay.getTime()]; // returns the given timestamp with the timestamp of one day later
};

/**
 * converts a timestamp to a formatted date string
 * @param timestamp
 * @returns {string} yyyy/mm/dd, h<am | pm>
 */
export const timestampToString = (timestamp: number): string => {
    const date = new Date(timestamp);
    let [day, monthInd, year, hour] = [
        date.getDate(),
        date.getMonth(),
        date.getFullYear(),
        date.getHours()
    ];
    const amPm = hour < 12 ? "am" : "pm";
    if (hour !== 12) hour = hour % 12;
    return `${year}/${(monthInd + 1).toString().length === 1 ? "0" : ""}${monthInd + 1}/${day.toString().length === 1 ? "0" : ""}${day}, ${hour}${amPm}`;
};
