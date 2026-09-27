import { useMemo } from "react";
import { StationDataType } from "../types";
import { Station } from "../lib/stations";

export const useStationChartData = (
  stationData: StationDataType | null,
  station: Station | null | undefined,
  units: string,
  datum: string,
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
      };
    }

    const convertNums = (val: number) => {
      if(units === "english") return val * 3.28084

      return val;
    }

    const convert = (val: number) => {
      return convertNums(val) - convertNums(Number(station[`${datum.toLowerCase()}_offset` as keyof typeof station]));
    };

    const obsData = stationData.observations.map(d => [d.dt, convert(d.val)]);
    const forecastData = stationData.forecasts.map(d => [d.dt, convert(d.val)]);
    const lowerData = stationData.forecasts.map(d => [d.dt, convert(d.lower)]);
    const upperData = stationData.forecasts.map(d => [d.dt, convert(d.upper)]);

    const levels = [
        { key: "blowout_level", label: "Blowout"},
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

    const rawFloodAreas = [
      {
        name: "Blowout",
        itemStyle: { color: "#808080"},
        yAxis: [-100, station.blowout_level]
      },
      {
        name: "Near flood",
        itemStyle: { color: "#ffff66" },
        yAxis: [station.near_flood_level, station.minor_flood_level]
      },
      {
        name: "Minor flood",
        itemStyle: { color: "#ffb74d" },
        yAxis: [station.minor_flood_level, station.moderate_flood_level]
      },
      {
        name: "Moderate flood",
        itemStyle: { color: "#f44336" },
        yAxis: [station.moderate_flood_level, station.major_flood_level]
      },
      {
        name: "Major flood",
        itemStyle: { color: "#b53ef5" },
        yAxis: [station.major_flood_level, 100]
      }
    ];

    const floodMarkAreas = rawFloodAreas.map(area => ([
      { yAxis: convert(area.yAxis[0]) },
      {
        yAxis: convert(area.yAxis[1]),
        itemStyle: { color: area.itemStyle.color, opacity: 0.7 }
      }
    ]));

    return {
      obsData,
      forecastData,
      lowerData,
      upperData,
      floodMarkLines,
      floodMarkAreas
    };
  }, [stationData, station, units, datum]);
};