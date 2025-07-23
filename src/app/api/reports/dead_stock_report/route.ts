import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET Dead Stock Report
export async function GET() {
  try {
    const pool = await getDBConnection();

    const [rows] = await pool.query(`
      SELECT 
        imd.Item_Code,
        imd.Item_Name,
        imd.Available_Stock AS Quantity,
        MAX(d.Date) AS Last_Delivery_Date,
        DATEDIFF(CURDATE(), MAX(d.Date)) AS Days_Since_Movement
      FROM item_master_data imd
      LEFT JOIN delivery_data d ON imd.Item_Code = d.Item_Code
      GROUP BY imd.Item_Code, imd.Item_Name, imd.Available_Stock;
    `);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating dead stock report:", error);
    return NextResponse.json(
      { error: "Failed to generate dead stock report" },
      { status: 500 }
    );
  }
}
