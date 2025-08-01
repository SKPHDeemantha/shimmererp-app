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
    const { Name, Email, Phone, Address } = body;

    if (!Name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // Step 1: Generate next Customer_ID (e.g., CU0001, CU0002)
    const [rows] = await pool.query(
      `SELECT Customer_ID FROM customer_data ORDER BY Customer_ID DESC LIMIT 1`
    )as [{ Customer_ID: string }[], any];

    let newCustomerId = "CU0001";
    if (rows.length > 0) {
      const lastId = rows[0].Customer_ID;
      const numericPart = parseInt(lastId.replace("CU", ""), 10);
      const nextNumber = numericPart + 1;
      newCustomerId = `CU${nextNumber.toString().padStart(4, "0")}`;
    }

    // Step 2: Insert into customer_data
    await pool.execute(
      `INSERT INTO customer_data (Customer_ID, Name, Email, Phone, Address)
       VALUES (?, ?, ?, ?, ?)`,
      [
        newCustomerId,
        Name,
        Email || null,
        Phone || null,
        Address || null
      ]
    );

    return NextResponse.json(
      { message: "Customer created", Customer_ID: newCustomerId, ...body },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating customer:", error);
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
