import sql, { config as SqlConfig, IResult } from "mssql";
import dotenv from "dotenv";

dotenv.config();
let pool: sql.ConnectionPool | null = null;

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

interface GeoJSONFeature {
    type: "Feature";
    geometry: any | null;
    properties: {
        polygon_id: number;
        flooded: boolean;
        depth_class: number;
        depth_min_m?: number | null;
        depth_max_m?: number | null;
        area_sq_km?: number | null;
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

export async function getAllRows<T = any>(query: string): Promise<T[]> {
    try {
        pool = await sql.connect(config);
        const result: IResult<T> = await pool.query<T>(query);
        return result.recordset;
    } catch (err) {
        console.error("DB Error:", err);
        throw err;
    } finally {
        if (pool) {
            await pool.close();
            pool = null;
        }
    }
}

export async function getFloodMapData(
    tableName: string
): Promise<GeoJSONFeatureCollection> {
    // 🔒 prevent SQL injection (VERY IMPORTANT)
    const allowedTables = [
        "Flood_Map_Data_05",
        "Flood_Map_Data_50",
        "Flood_Map_Data_95",
        "Flood_Map_Data"
    ];

    if (!allowedTables.includes(tableName)) {
        throw new Error("Invalid table name");
    }

    const query = `
        SELECT 
            polygon_id, 
            flooded, 
            depth_class,
            depth_min,
            depth_max,
            area_sq_km,
            geometry.STAsText() AS wkt
        FROM ${tableName}
    `;

    let rows: any[] = [];

    try {
        rows = await getAllRows<any>(query);
    } catch (err) {
        console.error("GeoJSON query failed. Trying fallback...", err);

        const fallbackQuery = `
            SELECT 
                polygon_id, 
                flooded, 
                depth_class,
                depth_min,
                depth_max,
                area_sq_km,
                geometry.STAsText() AS wkt
            FROM ${tableName}
        `;

        rows = await getAllRows<any>(fallbackQuery);
    }

    function parseWKT(wkt: string | undefined): any {
        if (!wkt) return null;

        const parsePoint = (pt: string) => {
            const parts = pt.trim().split(/\s+/).map(Number);

            const lng = parts[0];
            const lat = parts[1];

            if (lng === null || lat === null || isNaN(lng) || isNaN(lat)) {
                return null;
            }

            return [lng, lat];
        };

        if (wkt.startsWith("POLYGON")) {
            const coords = wkt
                .replace("POLYGON((", "")
                .replace("))", "")
                .split(",")
                .map(parsePoint)
                .filter(Boolean);

            return { type: "Polygon", coordinates: [coords] };
        }

        if (wkt.startsWith("MULTIPOLYGON")) {
            const polys = wkt
                .replace("MULTIPOLYGON(((", "")
                .replace(")))", "")
                .split(")),((")
                .map((poly) => poly.split(",").map(parsePoint).filter(Boolean));

            return { type: "MultiPolygon", coordinates: polys };
        }

        return null;
    }

    const features: GeoJSONFeature[] = rows.map((row) => ({
        type: "Feature",
        geometry: parseWKT(row.wkt),
        properties: {
            polygon_id: row.polygon_id,
            flooded: row.flooded,
            depth_class: row.depth_class,
            depth_min_m: row.depth_min ?? null,
            depth_max_m: row.depth_max ?? null,
            area_sq_km: row.area_sq_km ?? null
        }
    }));

    return {
        type: "FeatureCollection",
        features
    };
}
