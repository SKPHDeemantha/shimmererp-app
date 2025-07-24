import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET all return orders
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM return_customer_order_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching return orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch return orders" },
      { status: 500 }
    );
  }
}