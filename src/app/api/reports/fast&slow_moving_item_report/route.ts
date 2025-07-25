import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET item movement report with optional date range
export async function GET(req :Request) {
  try {
    const pool = await getDBConnection();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let query = `
      SELECT 
        imr.Report_Id,
        imr.Item_Code,
        d.Deliver_Id,
        imr.Item_Name,
        imr.Total_Movement,
        imr.Last_Movement_Date,
        imr.Days_Since_Movement,
        imr.Category,
        imr.Report_Date
      FROM item_movement_report imr
      INNER JOIN deliver_data d 
        ON imr.Item_Code = d.Item_Code
        AND imr.Last_Movement_Date = d.Date
        AND imr.Total_Movement = d.Quantity
    `;

    const params = [];

    if (startDate && endDate) {
      query += ` WHERE imr.Report_Date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    const [rows] = await pool.execute(query, params);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST: Insert new item movement report
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      Report_Id,
      Item_Code,
      Deliver_Id,
      Item_Name,
      Total_Movement,
      Last_Movement_Date,
      Days_Since_Movement,
      Category,
      Report_Date,
    } = body;

    const pool = await getDBConnection();

    const [result] = await pool.execute(
      `
      INSERT INTO item_movement_report (
        Report_Id, Item_Code, Deliver_Id, Item_Name,
        Total_Movement, Last_Movement_Date, Days_Since_Movement,
        Category, Report_Date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        Report_Id,
        Item_Code,
        Deliver_Id,
        Item_Name,
        Total_Movement,
        Last_Movement_Date,
        Days_Since_Movement,
        Category,
        Report_Date,
      ]
    );

    return NextResponse.json({ message: "Report added successfully", result });
  } catch (error) {
    console.error("Insert error:", error);
    return NextResponse.json(
      { error: "Failed to insert report" },
      { status: 500 }
    );
  }
}
