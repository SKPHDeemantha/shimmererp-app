import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

// GET all return orders
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM return_customer_order_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching return orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch return orders" },
      { status: 500 }
    );
  }
}
// POST a new return order with auto-incremented return_order_id like ROI0001
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Customer_Id, Customer_Name, Status, return_Date } = body;

    // Validation (return_order_id is generated)
    if (!Customer_Id || !Customer_Name || !Status || !return_Date) {
      return NextResponse.json(
        {
          error:
            "Customer_Id, Customer_Name, Status, and return_Date are required",
        },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // Generate new return_order_id
    const [rows] = await pool.query(
      "SELECT return_order_id FROM return_order ORDER BY return_order_id DESC LIMIT 1"
    );

    let newId = "ROI0001";
    if ((rows as any[]).length > 0) {
      const lastId = (rows as any[])[0].return_order_id; // e.g., "ROI0025"
      const numeric = parseInt(lastId.replace("ROI", ""), 10);
      newId = "ROI" + String(numeric + 1).padStart(4, "0");
    }

    // Insert new return order
    await pool.execute(
      `INSERT INTO return_order (return_order_id, Customer_Id, Customer_Name, Status, return_Date)
       VALUES (?, ?, ?, ?, ?)`,
      [newId, Customer_Id, Customer_Name, Status, return_Date]
    );

    return NextResponse.json(
      {
        return_order_id: newId,
        Customer_Id,
        Customer_Name,
        Status,
        return_Date,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating return order:", error);
    return NextResponse.json(
      { error: "Failed to create return order" },
      { status: 500 }
    );
  }
}

// PUT update return order
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    if (!body.return_order_id) {
      return NextResponse.json(
        { error: "return_order_id is required" },
        { status: 400 }
      );
    }

    const [existing] = await pool.query(
      "SELECT * FROM return_order WHERE return_order_id = ?",
      [body.return_order_id]
    );

    const order = (existing as any[])[0];
    if (!order) {
      return NextResponse.json(
        { error: "Return order not found" },
        { status: 404 }
      );
    }

    await pool.execute(
      `UPDATE return_order SET
        Customer_Id = ?, Customer_Name = ?, Status = ?, return_Date = ?
        WHERE return_order_id = ?`,
      [
        body.Customer_Id || order.Customer_Id,
        body.Customer_Name || order.Customer_Name,
        body.Status || order.Status,
        body.return_Date || order.return_Date,
        body.return_order_id,
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM return_order WHERE return_order_id = ?",
      [body.return_order_id]
    );

    return NextResponse.json((updated as any[])[0], { status: 200 });
  } catch (error) {
    console.error("Error updating return order:", error);
    return NextResponse.json(
      { error: "Failed to update return order" },
      { status: 500 }
    );
  }
}

// DELETE return order
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("return_order_id");

    if (!id) {
      return NextResponse.json(
        { error: "return_order_id is required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();
    const [existing] = await pool.query(
      "SELECT * FROM return_order WHERE return_order_id = ?",
      [id]
    );

    if ((existing as any[]).length === 0) {
      return NextResponse.json(
        { error: "Return order not found" },
        { status: 404 }
      );
    }

    await pool.execute("DELETE FROM return_order WHERE return_order_id = ?", [
      id,
    ]);

    return NextResponse.json(
      { message: "Return order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting return order:", error);
    return NextResponse.json(
      { error: "Failed to delete return order" },
      { status: 500 }
    );
  }
}
