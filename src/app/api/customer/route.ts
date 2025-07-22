import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

// GET all customers
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM customer_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST new customer
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    const { Customer_ID, Name, Email, Phone, Address } = body;
    if (!body.Name || !body.Customer_ID) {
      return NextResponse.json(
        { error: "Name and Customer_ID are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      `INSERT INTO customer_data (Customer_ID,Name, Email, Phone, Address)
             VALUES (? ,?, ?, ?, ?)`,
      [body.Customer_ID,body.Name, body.Email|| null, body.Phone || null, body.Address || null]
    );

    return NextResponse.json(
      { Customer_ID: (result as any).insertId, ...body },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

// PUT update customer
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    if (!body.Customer_ID) {
      return NextResponse.json(
        { error: "Customer_ID is required" },
        { status: 400 }
      );
    }

    const [existing] = await pool.query(
      "SELECT * FROM customer_data WHERE Customer_ID = ?",
      [body.Customer_ID]
    );

    if ((existing as any).length === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    await pool.execute(
      `UPDATE customer_data
             SET Name = ?, Email = ?, Phone = ?, Address = ?
             WHERE Customer_ID = ?`,
      [
        body.Name || (existing as any)[0].Name,
        body.Email || (existing as any)[0].Email,
        body.Phone || (existing as any)[0].Phone,
        body.Address || (existing as any)[0].Address,
        body.Customer_ID,
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM customer_data WHERE Customer_ID = ?",
      [body.Customer_ID]
    );

    return NextResponse.json((updated as any[])[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// DELETE customer
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const Customer_ID = searchParams.get("Customer_ID");

    if (!Customer_ID) {
      return NextResponse.json(
        { error: "Customer_ID is required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    const [existing] = await pool.query(
      "SELECT * FROM customer_data WHERE Customer_ID = ?",
      [Customer_ID]
    );

    if ((existing as any).length === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    await pool.execute("DELETE FROM customer_data WHERE Customer_ID = ?", [
      Customer_ID,
    ]);

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
