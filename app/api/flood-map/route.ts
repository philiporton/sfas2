import { NextResponse } from "next/server";
import { getFloodMapData } from "@/app/lib/azure_connect.ts";

export async function GET() {
    console.log("api/flood-map GET");
    try {
        const data = await getFloodMapData("Flood_Map_Data_95");
        return NextResponse.json(data);
    } catch (err) {
        console.error("Error in api/flood-map GET:", err);
        return NextResponse.json({ error: "DB Error", details: err });
    }
}
