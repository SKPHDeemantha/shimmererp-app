import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../../lib/db";

// GET Customer-wise Sales Order Report with optional date range filter
export async function GET(req: Request) {
  try {
    const pool = await getDBConnection();
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = `
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
    `;

    const params: any[] = [];

    if (startDate && endDate) {
      query += ` WHERE Order_Date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    const [rows] = await pool.query(query, params);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating customer-wise sales order report:", error);
    return NextResponse.json(
      { error: "Failed to generate customer-wise sales order report" },
      { status: 500 }
    );
  }
}

