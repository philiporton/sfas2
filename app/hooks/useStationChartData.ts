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

    // flood ranges
    const floodMarkAreas = [
        {
          name: "Minor flood",
          itemStyle: { color: "rgba(221, 245, 255, 0.30)" },
          yAxis: [convert(station.near_flood_level), convert(station.minor_flood_level)]
        },
        {
          name: "Minor flood",
          itemStyle: { color: "rgba(123, 193, 233, 0.30)" },
          yAxis: [convert(station.minor_flood_level), convert(station.moderate_flood_level)]
        },
        {
          name: "Moderate flood",
          itemStyle: { color: "rgba(51, 137, 235, 0.30)" },
          yAxis: [convert(station.moderate_flood_level), convert(station.major_flood_level)]
        },
        {
          name: "Major flood",
          itemStyle: { color: "rgba(26, 75, 165, 0.30)" },
          yAxis: [convert(station.major_flood_level), 100]
        }
      ].map(area => ([
        { yAxis: convert(area.yAxis[0]) },
        {
          yAxis: convert(area.yAxis[1]),
          itemStyle: area.itemStyle
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