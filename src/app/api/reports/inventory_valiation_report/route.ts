import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET Inventory Valuation Report with optional date range
export async function GET(req : Request) {
  try {
    const pool = await getDBConnection();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = `
      SELECT 
        Item_Code,
        Item_Name,
        Available_Stock,
        Price AS Unit_Price,
        (Available_Stock * Price) AS Total,
        (SELECT SUM(Available_Stock * Price) FROM item_master_data`;

    const queryParams = [];

    // Apply filtering in subquery as well
    if (startDate && endDate) {
      query += ` WHERE Created_Date BETWEEN ? AND ?`;
      queryParams.push(startDate, endDate);
    }

    query += `) AS Net_Total,
      Created_Date
      FROM item_master_data`;

    // Filter outer query too
    if (startDate && endDate) {
      query += ` WHERE Created_Date BETWEEN ? AND ?`;
      queryParams.push(startDate, endDate);
    }

    query += `;`;

    const [rows] = await pool.query(query, queryParams);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating inventory valuation report:", error);
    return NextResponse.json(
      { error: "Failed to generate inventory valuation report" },
      { status: 500 }
    );
  }
}
