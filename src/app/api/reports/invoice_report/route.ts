import { getDBConnection } from "../../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const pool = await getDBConnection();

    // Get the "type" from the query string
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";

    let query = "";
    let rows: any[] = [];

    if (type === "customer") {
      query = "SELECT * FROM customer_invoice_report";
    } else if (type === "supplier") {
      query = "SELECT * FROM supplier_invoice_report";
    } else {
      query = `
        SELECT 'customer' AS InvoiceType, * FROM customer_invoice_report
        UNION ALL
        SELECT 'supplier' AS InvoiceType, * FROM supplier_invoice_report
      `;
    }

    [rows] = await pool.query(query);

    return NextResponse.json(rows, { status: 200 });

  } catch (error) {
    console.error("Error fetching invoice report:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice report" },
      { status: 500 }
    );
  }
}
