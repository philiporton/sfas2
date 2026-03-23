import sql, { config as SqlConfig, IResult } from "mssql";
import dotenv from "dotenv";

dotenv.config();

interface DbConfig extends SqlConfig {
    user: string;
    password: string;
    server: string;
    database: string;
    port: number;
    options: {
        encrypt: boolean;
        trustServerCertificate: boolean;
    };
}

interface FloodRow {
    polygon_id: number;
    flooded: boolean;
    depth_class: string;
    geometry?: { STAsText?: string };
    wkt?: string;
}

interface GeoJSONFeature {
    type: "Feature";
    geometry: any | null;
    properties: {
        polygon_id: number;
        flooded: boolean;
        depth_class: string;
    };
}

interface GeoJSONFeatureCollection {
    type: "FeatureCollection";
    features: GeoJSONFeature[];
}

const config: DbConfig = {
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    server: process.env.DB_SERVER || "",
    database: process.env.DB_DATABASE || "",
    port: parseInt(process.env.DB_PORT || "1433", 10),
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

export async function getAllRows<T = any>(tableName: string): Promise<T[]> {
    try {
        await sql.connect(config);
        const result: IResult<T> = await sql.query<T>(
            `SELECT * FROM ${tableName}`
        );
        console.log(result.recordset);
        return result.recordset;
    } catch (err) {
        console.error("DB Error:", err);
        throw err;
    } finally {
        await sql.close();
    }
}

export async function getFloodMapData(
    tableName: string
): Promise<GeoJSONFeatureCollection> {
    const rows = await getAllRows<FloodRow>(tableName);

    const features: GeoJSONFeature[] = rows.map((row) => {
        let geometry = null;
        const wkt = row.geometry?.STAsText || row.wkt;

        if (wkt && wkt.startsWith("POLYGON")) {
            const coords = wkt
                .replace("POLYGON((", "")
                .replace("))", "")
                .split(",")
                .map((pt) => pt.trim().split(" ").map(Number).reverse());
            geometry = { type: "Polygon", coordinates: [coords] };
        } else if (wkt && wkt.startsWith("MULTIPOLYGON")) {
            const coords = wkt
                .replace("MULTIPOLYGON(((", "")
                .replace(")))", "")
                .split("),(")
                .map((poly) =>
                    poly
                        .split(",")
                        .map((pt) => pt.trim().split(" ").map(Number).reverse())
                );
            geometry = { type: "MultiPolygon", coordinates: coords };
        }

        return {
            type: "Feature",
            geometry,
            properties: {
                polygon_id: row.polygon_id,
                flooded: row.flooded,
                depth_class: row.depth_class
            }
        };
    });

    return { type: "FeatureCollection", features };
}

export async function getDepthLookup(
    tableName = "Flood_Depth_Data"
): Promise<FloodRow[]> {
    return await getAllRows<FloodRow>(tableName);
}

// Example test
console.log("test");
getAllRows("Flood_Map_Data_05").catch(console.error);
