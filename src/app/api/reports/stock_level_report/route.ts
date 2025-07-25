import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET Inventory Valuation Report with date range filter
export async function GET(req: Request) {
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
        Created_Date
      FROM item_master_data
    `;

    const params: any[] = [];

    if (startDate && endDate) {
      query += ` WHERE Created_Date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    const [rows] = await pool.query(query, params);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating stock level report:", error);
    return NextResponse.json(
      { error: "Failed to generate stock level report" },
      { status: 500 }
    );
  }
}
