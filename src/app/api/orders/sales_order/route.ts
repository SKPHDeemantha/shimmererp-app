import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// ✅ GET: All Sales Orders
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM sales_order_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales orders" },
      { status: 500 }
    );
  }
}

// ✅ POST: Create Sales Order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      Customer_Id,
      Customer_Name,
      Order_Date,
      Order_Status,
      Delivery_Date,
      Payment_Status,
      Total_Qty,
      Discount,
      Total_Amount,
    } = body;

    if (
      !Customer_Id ||
      !Customer_Name ||
      !Order_Date ||
      !Order_Status ||
      !Delivery_Date ||
      !Payment_Status ||
      !Total_Qty ||
      Discount === undefined ||
      !Total_Amount
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // 1. Get the latest So_Id
    const [rows] = (await pool.query(
      `SELECT So_Id FROM sales_order_data ORDER BY So_Id DESC LIMIT 1`
    )) as [{ So_Id: string }[], any];

    let newSoId = "S0001"; // default first So_Id
    if (rows.length > 0) {
      const lastSoId = rows[0].So_Id;
      const numericPart = parseInt(lastSoId.replace("S", ""), 10);
      const nextNumber = numericPart + 1;
      newSoId = `S${nextNumber.toString().padStart(4, "0")}`;
    }

    // 2. Insert new sales order
    await pool.execute(
      `INSERT INTO sales_order_data 
      (So_Id, Customer_Id, Customer_Name, Order_Date, Order_Status, Delivery_Date, Payment_Status, Total_Qty, Discount, Total_Amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newSoId,
        Customer_Id,
        Customer_Name,
        Order_Date,
        Order_Status,
        Delivery_Date,
        Payment_Status,
        Total_Qty,
        Discount,
        Total_Amount,
      ]
    );

    return NextResponse.json(
      { message: "Sales order created", So_Id: newSoId },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create sales order" },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update Sales Order by So_Id
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      So_Id,
      Customer_Id,
      Customer_Name,
      Order_Date,
      Order_Status,
      Delivery_Date,
      Payment_Status,
      Total_Qty,
      Discount,
      Total_Amount,
    } = body;

    if (!So_Id) {
      return NextResponse.json({ error: "So_Id is required" }, { status: 400 });
    }

    const pool = await getDBConnection();

    const [existing] = await pool.query(
      "SELECT * FROM sales_order_data WHERE So_Id = ?",
      [So_Id]
    );
    const current = (existing as any[])[0];

    if (!current) {
      return NextResponse.json(
        { error: "Sales order not found" },
        { status: 404 }
      );
    }

    await pool.execute(
      `UPDATE sales_order_data SET
        Customer_Id = ?,
        Customer_Name = ?,
        Order_Date = ?,
        Order_Status = ?,
        Delivery_Date = ?,
        Payment_Status = ?,
        Total_Qty = ?,
        Discount = ?,
        Total_Amount = ?
       WHERE So_Id = ?`,
      [
        Customer_Id ?? current.Customer_Id,
        Customer_Name ?? current.Customer_Name,
        Order_Date ?? current.Order_Date,
        Order_Status ?? current.Order_Status,
        Delivery_Date ?? current.Delivery_Date,
        Payment_Status ?? current.Payment_Status,
        Total_Qty ?? current.Total_Qty,
        Discount ?? current.Discount,
        Total_Amount ?? current.Total_Amount,
        So_Id,
      ]
    );

    return NextResponse.json(
      { message: "Sales order updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update sales order" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Delete Sales Order by So_Id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("So_Id");

    if (!id) {
      return NextResponse.json({ error: "So_Id is required" }, { status: 400 });
    }

    const pool = await getDBConnection();
    const [existing] = await pool.query(
      "SELECT * FROM sales_order_data WHERE So_Id = ?",
      [id]
    );

    if ((existing as any).length === 0) {
      return NextResponse.json(
        { error: "Sales order not found" },
        { status: 404 }
      );
    }

    await pool.execute("DELETE FROM sales_order_data WHERE So_Id = ?", [id]);

    return NextResponse.json(
      { message: "Sales order deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete sales order" },
      { status: 500 }
    );
  }
}
