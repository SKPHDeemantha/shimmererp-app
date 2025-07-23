import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET Invoice Count by Type (customer/supplier)
export async function GET() {
  try {
    const pool = await getDBConnection();

    const [rows] = await pool.query(`
      SELECT InvoiceType, COUNT(*) AS InvoiceCount
      FROM (
        SELECT 'customer' AS InvoiceType, * FROM customer_invoice_report
        UNION ALL
        SELECT 'supplier' AS InvoiceType, * FROM supplier_invoice_report
      ) AS combined_invoices
      GROUP BY InvoiceType;
    `);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating invoice count report:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice count report" },
      { status: 500 }
    );
  }
}
