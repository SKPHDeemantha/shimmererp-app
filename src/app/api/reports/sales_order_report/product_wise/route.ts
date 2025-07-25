import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../../lib/db";

// GET Product-wise Sales Order Report with optional date range
export async function GET(req: Request) {
  try {
    const pool = await getDBConnection();
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = `
      SELECT 
        sod.So_Id,
        imd.Item_Code,
        imd.Item_Name,
        sod.Total_Qty,
        sod.Unit_Price,
        sod.Discount,
        (sod.Total_Qty * sod.Unit_Price - sod.Discount) AS Amount,
        sod.Order_Date,
        sod.Order_Status,
        sod.Delivery_Date,
        sod.Payment_Status
      FROM sales_order_deta sod
      INNER JOIN item_master_data imd ON sod.Item_Code = imd.Item_Code
    `;

    const params: any[] = [];

    if (startDate && endDate) {
      query += ` WHERE sod.Order_Date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    const [rows] = await pool.query(query, params);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating product-wise sales order report:", error);
    return NextResponse.json(
      { error: "Failed to generate product-wise sales order report" },
      { status: 500 }
    );
  }
}

