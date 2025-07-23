import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

// GET all quotations
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM quatation_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}

// POST new quotation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      Quatation_Id,
      Customer_Id,
      Customer_Name,
      Date_Created,
      Valid_Until,
      Status,
      Total_Amount,
      Discount,
      Grand_Total,
    } = body;

    if (
      !Quatation_Id ||
      !Customer_Id ||
      !Customer_Name ||
      !Date_Created ||
      !Valid_Until ||
      !Status ||
      !Total_Amount ||
      !Discount ||
      !Grand_Total
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();
    await pool.execute(
      `INSERT INTO quatation_data (Quatation_Id, Customer_Id, Customer_Name, Date_Created, Valid_Until, Status, Total_Amount, Discount, Grand_Total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Quatation_Id,
        Customer_Id,
        Customer_Name,
        Date_Created,
        Valid_Until,
        Status,
        Total_Amount,
        Discount,
        Grand_Total,
      ]
    );

    return NextResponse.json({ id: Quatation_Id, ...body }, { status: 201 });
  } catch (error) {
    console.error("Error creating quotation:", error);
    return NextResponse.json(
      { error: "Failed to create quotation" },
      { status: 500 }
    );
  }
}

// PUT update quotation
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    if (!body.Quatation_Id) {
      return NextResponse.json(
        { error: "Quatation_Id is required" },
        { status: 400 }
      );
    }

    const [existing] = await pool.query(
      "SELECT * FROM quatation_data WHERE Quatation_Id = ?",
      [body.Quatation_Id]
    );

    const quotation = (existing as any[])[0];
    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    await pool.execute(
      `UPDATE quatation_data SET
        Customer_Id = ?, Customer_Name = ?, Date_Created = ?, Valid_Until = ?, Status = ?, Total_Amount = ?, Discount = ?, Grand_Total = ?
        WHERE Quatation_Id = ?`,
      [
        body.Customer_Id || quotation.Customer_Id,
        body.Customer_Name || quotation.Customer_Name,
        body.Date_Created || quotation.Date_Created,
        body.Valid_Until || quotation.Valid_Until,
        body.Status || quotation.Status,
        body.Total_Amount || quotation.Total_Amount,
        body.Discount || quotation.Discount,
        body.Grand_Total || quotation.Grand_Total,
        body.Quatation_Id,
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM quatation_data WHERE Quatation_Id = ?",
      [body.Quatation_Id]
    );

    return NextResponse.json((updated as any[])[0], { status: 200 });
  } catch (error) {
    console.error("Error updating quotation:", error);
    return NextResponse.json(
      { error: "Failed to update quotation" },
      { status: 500 }
    );
  }
}

// DELETE quotation
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("Quatation_Id");

    if (!id) {
      return NextResponse.json(
        { error: "Quatation_Id is required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();
    const [existing] = await pool.query(
      "SELECT * FROM quatation_data WHERE Quatation_Id = ?",
      [id]
    );

    if ((existing as any[]).length === 0) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    await pool.execute("DELETE FROM quatation_data WHERE Quatation_Id = ?", [id]);

    return NextResponse.json(
      { message: "Quotation deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting quotation:", error);
    return NextResponse.json(
      { error: "Failed to delete quotation" },
      { status: 500 }
    );
  }
}
