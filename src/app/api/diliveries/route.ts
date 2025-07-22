import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

export async function GET() {
  try {
    const pool = await getDBConnection();

    const [rows] = await pool.execute(
      "SELECT Deliver_Id, So_Id, Item_Code, Item_Name, Date, Status FROM delivery_data"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
