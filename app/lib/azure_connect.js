import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

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
        await sql.connect(config);

        const result = await sql.query(`SELECT * FROM ${tableName}`);
        console.log(result.recordset);

        return result.recordset;
    } catch (err) {
        console.error("DB Error:", err);
        throw err;
    } finally {
        await sql.close();
    }
}

console.log("test");
getAllRows("Flood_Map_Data_05");
