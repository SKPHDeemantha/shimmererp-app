import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../../lib/db";

// GET Customer-wise Sales Order Report
export async function GET() {
  try {
    const pool = await getDBConnection();

    const [rows] = await pool.query(`
      SELECT 
        So_Id,
        Customer_Id,
        Customer_Name,
        Order_Date,
        Order_Status,
        Delivery_Date,
        Payment_Status,
        Total_Qty,
        Discount,
        Total_Amount
      FROM sales_order_data
    `);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating customer-wise sales order report:", error);
    return NextResponse.json(
      { error: "Failed to generate customer-wise sales order report" },
      { status: 500 }
    );
  }
}
