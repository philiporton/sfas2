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
