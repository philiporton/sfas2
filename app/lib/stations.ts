/**
 * functions for fetching station data
 * station type definition
 */

import stations from "@/stationData"; // not in source control, must place in root of project

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
 * fetches all stations
 * @returns {Array<Station>}
 */
export const getAllStations = (): Array<Station> => stations;

/**
 * returns the station with the matching title
 * @param did
 * @returns {Station}
 * @throws if station with `did` cannot be found
 */
export const getStationById = (did: string): Station => {
    did = did.trim();
    const matchingStation = stations.find((elem) => elem.did === did);
    if (!matchingStation) throw `ERROR: no station found with did '${did}'`;
    return matchingStation;
};
