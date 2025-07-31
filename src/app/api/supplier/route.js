import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

// GET all suppliers
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM supplier_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

// POST new supplier with auto-incremented Supplier_Id (e.g., SUP0001)
export async function POST(request) {
  try {
    const {
      Supplier_Name,
      Country,
      Email,
      Phone,
      Address,
      Status,
    } = await request.json();

    if (!Supplier_Name) {
      return NextResponse.json(
        { error: "Supplier_Name is required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // Generate new Supplier_Id
    const [latest] = await pool.query(
      "SELECT Supplier_Id FROM supplier_data ORDER BY Supplier_Id DESC LIMIT 1"
    );

    let newId = "SUP0001";
    if (latest.length > 0) {
      const lastId = latest[0].Supplier_Id; // e.g., "SUP0010"
      const num = parseInt(lastId.replace("SUP", ""), 10);
      newId = "SUP" + String(num + 1).padStart(4, "0");
    }

    // Insert supplier
    await pool.execute(
      `INSERT INTO supplier_data 
       (Supplier_Id, Supplier_Name, Country, Email, Phone, Address, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        Supplier_Name,
        Country || null,
        Email || null,
        Phone || null,
        Address || null,
        Status || null,
      ]
    );

    return NextResponse.json(
      {
        Supplier_Id: newId,
        Supplier_Name,
        Country,
        Email,
        Phone,
        Address,
        Status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 }
    );
  }
}

// PUT update supplier
export async function PUT(request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    if (!body.Supplier_Id) {
      return NextResponse.json(
        { error: "Supplier_Id is required" },
        { status: 400 }
      );
    }

    const [existing] = await pool.query(
      "SELECT * FROM supplier_data WHERE Supplier_Id = ?",
      [body.Supplier_Id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    const supplier = existing[0];

    await pool.execute(
      `UPDATE supplier_data 
       SET Supplier_Name = ?, Country = ?, Email = ?, Phone = ?, Address = ?, Status = ?
       WHERE Supplier_Id = ?`,
      [
        body.Supplier_Name || supplier.Supplier_Name,
        body.Country || supplier.Country,
        body.Email || supplier.Email,
        body.Phone || supplier.Phone,
        body.Address || supplier.Address,
        body.Status || supplier.Status,
        body.Supplier_Id,
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM supplier_data WHERE Supplier_Id = ?",
      [body.Supplier_Id]
    );

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update supplier" },
      { status: 500 }
    );
  }
}

// DELETE supplier
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const Supplier_Id = searchParams.get("Supplier_Id");

    if (!Supplier_Id) {
      return NextResponse.json(
        { error: "Supplier_Id is required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    const [existing] = await pool.query(
      "SELECT * FROM supplier_data WHERE Supplier_Id = ?",
      [Supplier_Id]
    );

    if (!Array.isArray(existing) || existing.length === 0) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    await pool.execute("DELETE FROM supplier_data WHERE Supplier_Id = ?", [
      Supplier_Id,
    ]);

    return NextResponse.json(
      { message: "Supplier deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete supplier" },
      { status: 500 }
    );
  }
}
