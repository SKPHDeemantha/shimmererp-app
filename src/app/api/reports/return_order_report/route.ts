import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET return customer orders within a date range
export async function GET(req :Request) {
  try {
    const pool = await getDBConnection();
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = `SELECT * FROM return_customer_order_data`;
    const params = [];

    if (startDate && endDate) {
      query += ` WHERE return_Date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    const [rows] = await pool.query(query, params);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching return orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch return orders" },
      { status: 500 }
    );
  }
}
