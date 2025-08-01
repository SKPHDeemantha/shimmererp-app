import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET all notifications
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM certification_expiry_notification");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch certification expiry notifications" },
      { status: 500 }
    );
  }
}

// POST a new notificatioN
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    const {
      Reg_Id,
      Certification_Name,
      Expiry_Date,
      Notification_Status,
    } = body;

    if (!Reg_Id || !Certification_Name || !Expiry_Date || !Notification_Status) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 1. Get the latest Notification_ID
    const [rows] = await pool.query(
      `SELECT Notification_ID FROM certification_expiry_notification ORDER BY Notification_ID DESC LIMIT 1`
    ) as [{ Notification_ID: string }[], any];

    let newNotificationId = "N0001"; // default starting ID
    if (rows.length > 0) {
      const lastId = rows[0].Notification_ID;
      const numericPart = parseInt(lastId.replace("N", ""), 10);
      const nextNumber = numericPart + 1;
      newNotificationId = `N${nextNumber.toString().padStart(4, "0")}`;
    }

    // 2. Insert the new notification
    const [result] = await pool.execute(
      `INSERT INTO certification_expiry_notification 
        (Notification_ID, Reg_Id, Certification_Name, Expiry_Date, Notification_Status)
       VALUES (?, ?, ?, ?, ?)`,
      [newNotificationId, Reg_Id, Certification_Name, Expiry_Date, Notification_Status]
    );

    return NextResponse.json(
      { message: "Notification created", Notification_ID: newNotificationId, ...body },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create certification expiry notification" },
      { status: 500 }
    );
  }
}

// PUT update notification
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    if (!body.Notification_ID) {
      return NextResponse.json(
        { error: "Notification_ID is required for update" },
        { status: 400 }
      );
    }

    const [existing] = await pool.query(
      "SELECT * FROM certification_expiry_notification WHERE Notification_ID = ?",
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
      `UPDATE certification_expiry_notification SET 
        Reg_Id = ?, 
        Certification_Name = ?, 
        Expiry_Date = ?, 
        Notification_Status = ?
       WHERE Notification_ID = ?`,
      [
        body.Reg_Id || current.Reg_Id,
        body.Certification_Name || current.Certification_Name,
        body.Expiry_Date || current.Expiry_Date,
        body.Notification_Status || current.Notification_Status,
        body.Notification_ID,
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM certification_expiry_notification WHERE Notification_ID = ?",
      [body.Notification_ID]
    );

    return NextResponse.json((updated as any[])[0], { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update certification expiry notification" },
      { status: 500 }
    );
  }
}

// DELETE notification
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
      "SELECT * FROM certification_expiry_notification WHERE Notification_ID = ?",
      [id]
    );

    if ((existing as any).length === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    await pool.execute(
      "DELETE FROM certification_expiry_notification WHERE Notification_ID = ?",
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
