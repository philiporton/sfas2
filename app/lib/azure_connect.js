import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();
let pool = null;

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || "1433"),
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

export async function getAllRows(tableName) {
    try {
        pool = await sql.connect(config);

        const result = await pool.query(`SELECT * FROM ${tableName}`);
        console.log(result.recordset);

        return result.recordset;
    } catch (err) {
        console.error("DB Error:", err);
        throw err;
    } finally {
        await pool.close();
        pool = null;
    }
}

export async function getFloodMapData(tableName) {
    const rows = await getAllRows(tableName);

    const features = rows.map((row) => {
        let geometry = null;

        // Assume row.geometry.STAsText is stored as string
        const wkt = row.geometry?.STAsText || row.wkt; // fallback if using wkt column

        if (wkt && wkt.startsWith("POLYGON")) {
            const coords = wkt
                .replace("POLYGON((", "")
                .replace("))", "")
                .split(",")
                .map((pt) => pt.trim().split(" ").map(Number).reverse()); // Leaflet: [lat, lon]
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

export async function getDepthLookup(tableName = "Flood_Depth_Data") {
    return await getAllRows(tableName);
}

console.log("test");
getAllRows("Flood_Map_Data_05");
