import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET all purchase orders
export async function GET() {
    try {
        const pool = await getDBConnection();
        const [rows] = await pool.query("SELECT * FROM purchase_order");
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch purchase orders" },
            { status: 500 }
        );
    }
}