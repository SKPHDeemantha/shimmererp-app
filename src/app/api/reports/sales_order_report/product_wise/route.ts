import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../../lib/db";

// GET Product-wise Sales Order Report
export async function GET() {
  try {
    const pool = await getDBConnection();

    const [rows] = await pool.query(`
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
      INNER JOIN item_master_data so ON sod.Item_Code = imd.Item_Code
    `);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating product-wise sales order report:", error);
    return NextResponse.json(
      { error: "Failed to generate product-wise sales order report" },
      { status: 500 }
    );
  }
}
