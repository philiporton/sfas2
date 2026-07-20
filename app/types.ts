function getPDFURL(pdf: string): string {
    return pdf;
}

export type StationDataType = {
    observations: ObservationDataType[];
    forecasts: ForecastDataType[];
}

export type ObservationDataType = {
    sid: string;
    param: string;
    dt: string;
    val: number;
}

export type ForecastDataType = {
    sid: string;
    param: string;
    dt: string;
    val: number;
    upper: number;
    lower: number;
}

export type DatasetType = "05th" | "50th" | "95th";

export default getPDFURL;
