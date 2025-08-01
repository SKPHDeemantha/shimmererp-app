import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET all low stock notifications
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM low_stock_notification_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch low stock notifications" },
      { status: 500 }
    );
  }
}

// POST a new low stock notification
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    const {
      Item_Code,
      Item_Name,
      Current_Qty,
      Reorder_level,
      Notification_Status,
      Notification_Date,
      Email,
    } = body;

    if (
      !Item_Code ||
      !Item_Name ||
      !Current_Qty ||
      !Reorder_level ||
      !Notification_Status ||
      !Notification_Date ||
      !Email
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Step 1: Get the latest Notification_Id
    const [rows] = await pool.query(
      `SELECT Notification_Id FROM low_stock_notification_data ORDER BY Notification_Id DESC LIMIT 1`
    )as [{ Notification_Id: string }[], any];

    let newNotificationId = "N0001"; // Default first ID
    if (rows.length > 0) {
      const lastId = rows[0].Notification_Id;
      const numericPart = parseInt(lastId.replace("N", ""), 10);
      const nextNumber = numericPart + 1;
      newNotificationId = `N${nextNumber.toString().padStart(4, "0")}`;
    }

    // Step 2: Insert into the table
    const [result] = await pool.execute(
      `INSERT INTO low_stock_notification_data
        (Notification_Id, Item_Code, Item_Name, Current_Qty, Reorder_level, Notification_Status, Notification_Date, Email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newNotificationId,
        Item_Code,
        Item_Name,
        Current_Qty,
        Reorder_level,
        Notification_Status,
        Notification_Date,
        Email,
      ]
    );

    return NextResponse.json(
      {
        message: "Low stock notification created",
        Notification_Id: newNotificationId,
        ...body,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create low stock notification" },
      { status: 500 }
    );
  }
}


// PUT update low stock notification
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    if (!body.Notification_Id) {
      return NextResponse.json(
        { error: "Notification_Id is required" },
        { status: 400 }
      );
    }

    const [existing] = await pool.query(
      "SELECT * FROM low_stock_notification_data WHERE Notification_Id = ?",
      [body.Notification_Id]
    );

    const current = (existing as any[])[0];
    if (!current) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    await pool.execute(
      `UPDATE low_stock_notification_data SET
        Item_Code = ?,
        Item_Name = ?,
        Current_Qty = ?,
        Reorder_level = ?,
        Notification_Status = ?,
        Notification_Date = ?,
        Email = ?
       WHERE Notification_Id = ?`,
      [
        body.Item_Code || current.Item_Code,
        body.Item_Name || current.Item_Name,
        body.Current_Qty || current.Current_Qty,
        body.Reorder_level || current.Reorder_level,
        body.Notification_Status || current.Notification_Status,
        body.Notification_Date || current.Notification_Date,
        body.Email || current.Email,
        body.Notification_Id,
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM low_stock_notification_data WHERE Notification_Id = ?",
      [body.Notification_Id]
    );

    return NextResponse.json((updated as any[])[0], { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE low stock notification
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("Notification_Id");

    if (!id) {
      return NextResponse.json(
        { error: "Notification_Id is required for delete" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    const [existing] = await pool.query(
      "SELECT * FROM low_stock_notification_data WHERE Notification_Id = ?",
      [id]
    );

    if ((existing as any).length === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    await pool.execute(
      "DELETE FROM low_stock_notification_data WHERE Notification_Id = ?",
      [id]
    );

    return NextResponse.json(
      { message: "Notification deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
