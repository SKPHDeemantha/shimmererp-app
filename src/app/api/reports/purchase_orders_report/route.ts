import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET purchase orders within a date range
export async function GET(req: Request) {
  try {
    const pool = await getDBConnection();
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validate date inputs
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing startDate or endDate in query parameters" },
        { status: 400 }
      );
    }

    // Query with date range filter
    const [rows] = await pool.query(
      `SELECT * FROM purchase_order WHERE Created_Date BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchase orders" },
      { status: 500 }
    );
  }
}
