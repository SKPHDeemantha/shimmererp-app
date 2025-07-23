import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET all quotations
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM quatation_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}
