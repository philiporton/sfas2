import { NextResponse } from "next/server";
import { getFloodMapData } from "@/app/lib/azure_connect.ts";

export async function GET(request: Request) {
    console.log("api/flood-map GET");

    try {
        // Get query param (e.g. /api/flood-map?level=95)
        const { searchParams } = new URL(request.url);
        const level = searchParams.get("level");

        const validLevels = ["05", "50", "95"];
        if (!level || !validLevels.includes(level)) {
            return NextResponse.json(
                { error: "Invalid level. Use 05, 50, or 95." },
                { status: 400 }
            );
        }

\        const tableName = `Flood_Map_Data_${level}`;

        const data = await getFloodMapData(tableName);

        return NextResponse.json(data);
    } catch (err) {
        console.error("Error in api/flood-map GET:", err);
        return NextResponse.json(
            { error: "DB Error", details: err },
            { status: 500 }
        );
    }
}
