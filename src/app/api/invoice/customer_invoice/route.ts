import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET all customer invoices
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM customer_invoice_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch customer invoices" },
      { status: 500 }
    );
  }
}

// POST a new customer invoice
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    const {
      Customer_ID,
      Customer_Name,
      Created_Date,
      Item_Code,
      Item_Name,
      Pack_Size,
      Unit_Price,
      Total_Amount,
      User_ID,
      User_Name,
      Customer_Address,
      User_Address,
      User_Phone,
      Fax,
      SR_No,
      MF_Date,
      Ex_Date,
      Batch_No,
      Type,
    } = body;

    if (
      !Customer_ID || !Customer_Name || !Created_Date || !Item_Code || !Item_Name ||
      !Pack_Size || !Unit_Price || !Total_Amount || !User_ID || !User_Name ||
      !Customer_Address || !User_Address || !User_Phone || !Fax || !SR_No ||
      !MF_Date || !Ex_Date || !Batch_No || !Type
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 1. Generate new In_No
    const [rows] = await pool.query(
      `SELECT In_No FROM customer_invoice_data ORDER BY In_No DESC LIMIT 1`
    )as [{ In_No: string }[], any];

    let newInvoiceNo = "IN0001";
    if (rows.length > 0) {
      const lastId = rows[0].In_No;
      const numericPart = parseInt(lastId.replace("IN", ""), 10);
      const nextNumber = numericPart + 1;
      newInvoiceNo = `IN${nextNumber.toString().padStart(4, "0")}`;
    }

    // 2. Insert into customer_invoice_data
    const [result] = await pool.execute(
      `INSERT INTO customer_invoice_data 
        (In_No, Customer_ID, Customer_Name, Created_Date, Item_Code, Item_Name, Pack_Size, Unit_Price, Total_Amount, 
         User_ID, User_Name, Customer_Address, User_Address, User_Phone, Fax, SR_No, MF_Date, Ex_Date, Batch_No, Type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newInvoiceNo, Customer_ID, Customer_Name, Created_Date, Item_Code, Item_Name,
        Pack_Size, Unit_Price, Total_Amount, User_ID, User_Name, Customer_Address,
        User_Address, User_Phone, Fax, SR_No, MF_Date, Ex_Date, Batch_No, Type
      ]
    );

    return NextResponse.json(
      { message: "Customer invoice created", In_No: newInvoiceNo, ...body },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create customer invoice" },
      { status: 500 }
    );
  }
}

// PUT update customer invoice
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
      "SELECT * FROM customer_invoice_data WHERE In_No = ?",
      [body.In_No]
    );
    const existingInvoice = (existing as any[])[0];

    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    await pool.execute(
      `UPDATE customer_invoice_data SET
        Customer_ID = ?, Customer_Name = ?, Created_Date = ?, Item_Code = ?, Item_Name = ?, Pack_Size = ?, 
        Unit_Price = ?, Total_Amount = ?, User_ID = ?, User_Name = ?, Customer_Address = ?, User_Address = ?,
        User_Phone = ?, Fax = ?, SR_No = ?, MF_Date = ?, Ex_Date = ?, Batch_No = ?, Type = ?
        WHERE In_No = ?`,
      [
        body.Customer_ID || existingInvoice.Customer_ID,
        body.Customer_Name || existingInvoice.Customer_Name,
        body.Created_Date || existingInvoice.Created_Date,
        body.Item_Code || existingInvoice.Item_Code,
        body.Item_Name || existingInvoice.Item_Name,
        body.Pack_Size || existingInvoice.Pack_Size,
        body.Unit_Price || existingInvoice.Unit_Price,
        body.Total_Amount || existingInvoice.Total_Amount,
        body.User_ID || existingInvoice.User_ID,
        body.User_Name || existingInvoice.User_Name,
        body.Customer_Address || existingInvoice.Customer_Address,
        body.User_Address || existingInvoice.User_Address,
        body.User_Phone || existingInvoice.User_Phone,
        body.Fax || existingInvoice.Fax,
        body.SR_No || existingInvoice.SR_No,
        body.MF_Date || existingInvoice.MF_Date,
        body.Ex_Date || existingInvoice.Ex_Date,
        body.Batch_No || existingInvoice.Batch_No,
        body.Type || existingInvoice.Type,
        body.In_No
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM customer_invoice_data WHERE In_No = ?",
      [body.In_No]
    );
    return NextResponse.json((updated as any[])[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update customer invoice" },
      { status: 500 }
    );
  }
}

// DELETE customer invoice
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
      "SELECT * FROM customer_invoice_data WHERE In_No = ?",
      [inNo]
    );

    if ((existing as any).length === 0) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    await pool.execute("DELETE FROM customer_invoice_data WHERE In_No = ?", [inNo]);

    return NextResponse.json(
      { message: "Customer invoice deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete customer invoice" },
      { status: 500 }
    );
  }
}
