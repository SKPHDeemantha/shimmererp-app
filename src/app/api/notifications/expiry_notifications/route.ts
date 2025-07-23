import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET all expiry notifications
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM expiry_notification_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expiry notifications" },
      { status: 500 }
    );
  }
}

// POST a new expiry notification
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    const {
      Notification_ID,
      Item_Code,
      Item_Name,
      Quantity,
      Expiry_Date,
      Notification_Status,
    } = body;

    if (!Notification_ID || !Item_Code || !Item_Name || !Quantity || !Expiry_Date || !Notification_Status) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      `INSERT INTO expiry_notification_data 
      (Notification_ID, Item_Code, Item_Name, Quantity, Expiry_Date, Notification_Status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Notification_ID, Item_Code, Item_Name, Quantity, Expiry_Date, Notification_Status]
    );

    return NextResponse.json({ id: Notification_ID, ...body }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create expiry notification" },
      { status: 500 }
    );
  }
}

// PUT update expiry notification
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    if (!body.Notification_ID) {
      return NextResponse.json(
        { error: "Notification_ID is required" },
        { status: 400 }
      );
    }

    const [existing] = await pool.query(
      "SELECT * FROM expiry_notification_data WHERE Notification_ID = ?",
      [body.Notification_ID]
    );

    const current = (existing as any[])[0];

    if (!current) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    await pool.execute(
      `UPDATE expiry_notification_data SET 
        Item_Code = ?, 
        Item_Name = ?, 
        Quantity = ?, 
        Expiry_Date = ?, 
        Notification_Status = ?
       WHERE Notification_ID = ?`,
      [
        body.Item_Code || current.Item_Code,
        body.Item_Name || current.Item_Name,
        body.Quantity || current.Quantity,
        body.Expiry_Date || current.Expiry_Date,
        body.Notification_Status || current.Notification_Status,
        body.Notification_ID
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM expiry_notification_data WHERE Notification_ID = ?",
      [body.Notification_ID]
    );

    return NextResponse.json((updated as any[])[0], { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update expiry notification" },
      { status: 500 }
    );
  }
}

// DELETE expiry notification
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("Notification_ID");

    if (!id) {
      return NextResponse.json(
        { error: "Notification_ID is required for delete" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    const [existing] = await pool.query(
      "SELECT * FROM expiry_notification_data WHERE Notification_ID = ?",
      [id]
    );

    if ((existing as any).length === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    await pool.execute(
      "DELETE FROM expiry_notification_data WHERE Notification_ID = ?",
      [id]
    );

    return NextResponse.json(
      { message: "Notification deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete expiry notification" },
      { status: 500 }
    );
  }
}
