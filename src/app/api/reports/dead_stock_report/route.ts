import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET Dead Stock Report with optional date range
export async function GET(req :Request) {
  try {
    const pool = await getDBConnection();
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = `
      SELECT 
        imd.Item_Code,
        imd.Item_Name,
        imd.Available_Stock AS Quantity,
        MAX(d.Date) AS Last_Delivery_Date,
        DATEDIFF(CURDATE(), MAX(d.Date)) AS Days_Since_Movement
      FROM item_master_data imd
      LEFT JOIN deliver_data d ON imd.Item_Code = d.Item_Code
    `;

    const queryParams = [];

    if (startDate && endDate) {
      query += ` WHERE d.Date BETWEEN ? AND ? `;
      queryParams.push(startDate, endDate);
    }

    query += ` GROUP BY imd.Item_Code, imd.Item_Name, imd.Available_Stock;`;

    const [rows] = await pool.query(query, queryParams);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating dead stock report:", error);
    return NextResponse.json(
      { error: "Failed to generate dead stock report" },
      { status: 500 }
    );
  }
}
