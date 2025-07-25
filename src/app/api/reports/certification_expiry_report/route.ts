import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET certificates within a date range
export async function GET(req:Request) {
  try {
    const pool = await getDBConnection();
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing startDate or endDate in query parameters" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      `SELECT * FROM certification_report WHERE Expiry_Date BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}
