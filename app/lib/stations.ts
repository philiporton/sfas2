/**
 * functions for fetching station data
 * station type definition
 */

export type Station = {
    // typedef for station
    title: string;
    mid: string;
    did: string;
    mdiff: number;
    diff: number;
    lat: number;
    lon: number;
    map_visible: number;
    map_list: number;
    blowout_level: number;
    near_flood_level: number;
    minor_flood_level: number;
    moderate_flood_level: number;
    major_flood_level: number;
    alert_level: number;
    min_dt_model: string;
    max_dt_model: string;
    min_model: number;
    max_model: number;
    navd88_offset: number;
    ngvd29_offset: number;
    mlw_offset: number;
    mtl_offset: number;
    dtl_offset: number;
    mhw_offset: number;
    mhhw_offset: number;
    mllw_offset: number;
    msl_offset: number;
    observed_dt: string;
    observed_val: number;
    model_alert: number;
    observed_found: number;
    flag_model_alert: number;
    ext_tide_shift: number;
    advisory: number;
    agency: string;
    image_shape: string;
    station_type: string;
    registration_allowed: number;
    sfas_model: string;
    opse01_diff: number;
    ens02_diff: number;
    estofs_diff: number;
    etss_diff: number;
    ahps_diff: number;
    sbe1_diff: number;
};

/**
 * calculates the color style for a map glyph based on station flood data
 * @param station
 * @returns className with trailing space, to be used to style the map glyphs
 * (NOTE: this should be placed first in the className prop)
 */
export const calculateColor = (station: Station): string => {
    if (station.observed_found === 0) {
        // no observed data
        return "mapglyph-model ";
    } else if (station.observed_val <= station.blowout_level) {
        return "mapglyph-blowout ";
    } else if (station.observed_val < station.near_flood_level) {
        // > blowout, < near -> normal
        return "mapglyph-normal ";
    } else if (station.observed_val < station.minor_flood_level) {
        return "mapglyph-near ";
    } else if (station.observed_val < station.moderate_flood_level) {
        return "mapglyph-minor ";
    } else if (station.observed_val < station.major_flood_level) {
        return "mapglyph-moderate ";
    } else if (station.observed_val == 10000) { //used for registration page for unselected map markers
        return "mapglyph-unselected";
    }   else if (station.observed_val== 15000) { ////used for registration page for selected map markers
        return "mapglyph-selected";
    }
        else {
        // station.observedVal >= station.major_flood_level
        return "mapglyph-major ";
    }
};

/**
 * calculates the text for the observed forcase
 * @param station
 */
export const calculateObservedText = (station: Station): string => {
    if (station.observed_found === 0) {
        // no observed data
        return "No Current Observations";
    } else if (station.observed_val <= station.blowout_level) {
        return "Blowout";
    } else if (station.observed_val < station.near_flood_level) {
        // > blowout, < near -> normal
        return "Normal";
    } else if (station.observed_val < station.minor_flood_level) {
        return "Near";
    } else if (station.observed_val < station.moderate_flood_level) {
        return "Minor";
    } else {
        return "Major";
    }
};

/**
 * returns a new random value for a station's observed flood value
 * (NOTE: this is for testing purposes only)
 * @param station
 * @returns random number in `[station.blowout_level - 1, station.major_flood_level + 1]`
 */
export const generateRandomObservedValue = (station: Station): number => {
    const lowerBound = station.blowout_level - 1;
    const upperBound = station.major_flood_level + 1;

    return Math.random() * (upperBound - lowerBound);
};

/**
 * returns the name of the first model with offset value of 0, undefined if none exists
 * @param station station for which to determine the model
 * @returns 
 */
export const determineModel = (station: Station): string | undefined => {
    const models = {
        "navd88_offset": "navd88",
        "ngvd29_offset": "ngvd29",
        "mlw_offset": "mlw",
        "mtl_offset": "mtl",
        "dtl_offset": "dtl",
        "mhw_offset": "mhw",
        "mhhw_offset": "mhhw",
        "mllw_offset": "mllw",
        "msl_offset": "msl"
    };

    const key = Object.keys(models).find((k) => Object(station)[k] === 0);
    return key ? (Object(models)[key] as string).toUpperCase() : key;
};