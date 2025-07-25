import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET All Invoices and Separate Counts by Type with Date Range
export async function GET(req: Request) {
  try {
    const pool = await getDBConnection();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validate date range
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing startDate or endDate" },
        { status: 400 }
      );
    }

    // Combined filtered invoices
    const [combinedRows] = await pool.query(
      `
      SELECT In_No, Customer_Id AS Party_Id, Customer_Name AS Party_Name, Created_Date, 
             Item_Code, Item_Name, Pack_Size, Total_Amount, 'customer' AS Type 
      FROM customer_invoice_data
      WHERE Created_Date BETWEEN ? AND ?
      UNION ALL
      SELECT In_No, Supplier_ID AS Party_Id, Supplier_Name AS Party_Name, Date, 
             Item_Code, Item_Name, Pack_Size, Total_Amount, 'supplier' AS Type 
      FROM supplier_invoice_data
      WHERE Date BETWEEN ? AND ?
      `,
      [startDate, endDate, startDate, endDate]
    );

    // Filtered counts
    const [counts] = await pool.query(
      `
      SELECT 'customer' AS Type, COUNT(*) AS InvoiceCount 
      FROM customer_invoice_data 
      WHERE Created_Date BETWEEN ? AND ?
      UNION ALL
      SELECT 'supplier' AS Type, COUNT(*) AS InvoiceCount 
      FROM supplier_invoice_data 
      WHERE Date BETWEEN ? AND ?
      `,
      [startDate, endDate, startDate, endDate]
    );

    return NextResponse.json(
      {
        invoiceData: combinedRows,
        invoiceCounts: counts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating invoice count report:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice count report" },
      { status: 500 }
    );
  }
}
