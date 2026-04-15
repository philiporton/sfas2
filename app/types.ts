function getPDFURL(pdf: string): string {
    return pdf;
}

export type StationDataType = {
    station: string;
    parameter: string;
    value: number;
    unit: string;
    time: string;
};

export default getPDFURL;
