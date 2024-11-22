/**
 * functions for determining the color of the glyphs on the map (determined by model data)
 */

import { Station } from "@/app/lib/stations";

/**
 * calculates the color style for a map glyph based on station flood data
 * @param station
 * @returns className with trailing space, to be used to style the map glyphs
 * (NOTE: this should be placed first in the className prop)
 */
export const calculateColor = (station: Station): string => {
    if (station.observed_val <= station.blowout_level) {
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
    } else {
        // station.observedVal >= station.major_flood_level
        return "mapglyph-major ";
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
