import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

// GET all invoices
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM invoice_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

// POST a new invoice
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    const {
      In_No,
      Supplier_ID,
      Supplier_Name,
      Date,
      Item_Code,
      Item_Name,
      Pack_Size,
      Total_Amount,
    } = body;

    if (
      !In_No ||
      !Supplier_ID ||
      !Supplier_Name ||
      !Date ||
      !Item_Code ||
      !Item_Name ||
      !Pack_Size ||
      !Total_Amount
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      `INSERT INTO invoice_data (In_No, Supplier_ID, Supplier_Name, Date, Item_Code, Item_Name, Pack_Size, Total_Amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [In_No, Supplier_ID, Supplier_Name, Date, Item_Code, Item_Name, Pack_Size, Total_Amount]
    );

    return NextResponse.json({ id: In_No, ...body }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

// PUT update invoice
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    if (!body.In_No) {
      return NextResponse.json(
        { error: "Invoice number (In_No) is required" },
        { status: 400 }
      );
    }

    const [existing] = await pool.query(
      "SELECT * FROM invoice_data WHERE In_No = ?",
      [body.In_No]
    );
    const existingInvoice = (existing as any[])[0];

    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    await pool.execute(
      `UPDATE invoice_data SET
        Supplier_ID = ?, Supplier_Name = ?, Date = ?, Item_Code = ?, Item_Name = ?, Pack_Size = ?, Total_Amount = ?
        WHERE In_No = ?`,
      [
        body.Supplier_ID || existingInvoice.Supplier_ID,
        body.Supplier_Name || existingInvoice.Supplier_Name,
        body.Date || existingInvoice.Date,
        body.Item_Code || existingInvoice.Item_Code,
        body.Item_Name || existingInvoice.Item_Name,
        body.Pack_Size || existingInvoice.Pack_Size,
        body.Total_Amount || existingInvoice.Total_Amount,
        body.In_No,
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM invoice_data WHERE In_No = ?",
      [body.In_No]
    );
    return NextResponse.json((updated as any[])[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

// DELETE invoice
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const inNo = searchParams.get("In_No");
    const pool = await getDBConnection();

    if (!inNo) {
      return NextResponse.json(
        { error: "Invoice number (In_No) is required" },
        { status: 400 }
      );
    }

    const [existing] = await pool.query(
      "SELECT * FROM invoice_data WHERE In_No = ?",
      [inNo]
    );

    if ((existing as any).length === 0) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    await pool.execute("DELETE FROM invoice_data WHERE In_No = ?", [inNo]);

    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
