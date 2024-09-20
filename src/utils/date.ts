/**
 * functions for date formatting and processing
 */

export type DateRange = [number, number];

/**
 * returns current time in unix epoch milliseconds 
 * @returns {number} milliseconds since 01 January 1970 00:00 
 */
export const getCurrentEpoch = (): number => Date.now();

export const getDaysInMonth = (monthInd: number, year: number): number => {
    switch (monthInd) {
        case 1:
            return year % 4 === 0 ? 29 : 28;
        case 3:
        case 5:
        case 8:
        case 9:
            return 30;
        default:
            return 31;
    }
}

const calculateForecastPeriod = (timestamp: number): DateRange => {
    const currDate = new Date(timestamp);
    const [day, monthInd, year] = [currDate.getDate(), currDate.getMonth(), currDate.getFullYear()];
    return [0, 0];
}
