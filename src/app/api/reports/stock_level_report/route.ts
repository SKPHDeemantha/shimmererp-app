import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET Inventory Valuation Report
export async function GET() {
  try {
    const pool = await getDBConnection();

    const [rows] = await pool.query(`
      SELECT 
        Item_Code,
        Item_Name,
        Available_Stock,
        Price AS Unit_Price,
        (Available_Stock * Price) AS Total,
        (SELECT SUM(Available_Stock * Price) FROM item_master_data) AS Net_Total
      FROM item_master_data;
    `);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating inventory valuation report:", error);
    return NextResponse.json(
      { error: "Failed to generate inventory valuation report" },
      { status: 500 }
    );
  }
}
