import { useMemo } from "react";
import { StationDataType } from "../types";
import { Station } from "../lib/stations";

export const useStationChartData = (
  stationData: StationDataType | null,
  station: Station | null | undefined,
  units: string,
  datum: string,
  timezone: string
) => {
  return useMemo(() => {
    if (!stationData || !station) {
      return {
        obsData: [],
        forecastData: [],
        lowerData: [],
        upperData: [],
        floodMarkLines: [],
        floodMarkAreas: [],
        min: -10,
        max: 10
      };
    }

    const convert = (val: number) => {
      const convertedVal = units === "english" ? val * 3.28084 : val;
      return convertedVal - Number(station[`${datum.toLowerCase()}_offset` as keyof typeof station]);
    };

    const min = Math.floor(convert(station.blowout_level));
    const max = Math.ceil(convert(station.major_flood_level));

    // series data
    const obsData = stationData.observations.map(d => [d.dt, convert(d.val)]);

    const forecastData = stationData.forecasts.map(d => [d.dt, convert(d.val)]);

    const lowerData = stationData.forecasts.map(d => [d.dt, convert(d.lower)]);

    const upperData = stationData.forecasts.map(d => [d.dt, convert(d.upper)]);

    // flood levels
    const levels = [
        { key: "near_flood_level", label: "Near flood" },
        { key: "minor_flood_level", label: "Minor flood" },
        { key: "moderate_flood_level", label: "Moderate flood" },
        { key: "major_flood_level", label: "Major flood" }
    ] as const;

    const floodMarkLines = levels.map(level => ({
      yAxis: convert(station[level.key]),
      name: level.label,
      label: {
        position: "end",
        distance: 10,
        color: "#22356f",
        formatter: level.label
      },
      lineStyle: {
        type: "solid",
        color: "#22356f",
        width: 1
      }
    }));

    // flood ranges (use station raw values here and convert once when mapping)
    const rawFloodAreas = [
      {
        name: "Near flood",
        // exact hex: #ffff66 -> rgba(255,255,102,0.3)
        itemStyle: { color: "rgba(255,255,102,0.3)" },
        yAxis: [station.near_flood_level, station.minor_flood_level]
      },
      {
        name: "Minor flood",
        // exact hex: #ffb74d -> rgba(255,183,77,0.3)
        itemStyle: { color: "rgba(255,183,77,0.3)" },
        yAxis: [station.minor_flood_level, station.moderate_flood_level]
      },
      {
        name: "Moderate flood",
        // exact hex: #f44336 -> rgba(244,67,54,0.3)
        itemStyle: { color: "rgba(244,67,54,0.3)" },
        yAxis: [station.moderate_flood_level, station.major_flood_level]
      },
      {
        name: "Major flood",
        // exact hex: #b53ef5 -> rgba(181,62,245,0.3)
        itemStyle: { color: "rgba(181,62,245,0.3)" },
        yAxis: [station.major_flood_level, 100]
      }
    ];

    const floodMarkAreas = rawFloodAreas.map(area => ([
      { yAxis: convert(area.yAxis[0]) },
      {
        yAxis: convert(area.yAxis[1]),
        itemStyle: { color: area.itemStyle.color }
      }
    ]));

    return {
      obsData,
      forecastData,
      lowerData,
      upperData,
      floodMarkLines,
      floodMarkAreas,
      min,
      max
    };
  }, [stationData, station, units]);
};