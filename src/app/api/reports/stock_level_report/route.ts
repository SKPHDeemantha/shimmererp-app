import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET Inventory Valuation Report
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM item_master_data");
    return NextResponse.json(rows, { status: 200 });
  }
   
   catch (error) {
    console.error("Error generating stock level report:", error);
    return NextResponse.json(
      { error: "Failed to generate stock level  report" },
      { status: 500 }
    );
  }
}
