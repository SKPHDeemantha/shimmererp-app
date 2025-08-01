import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

// GET all good issues
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM good_issues_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching good issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch good issues" },
      { status: 500 }
    );
  }
}

// POST a new good issue
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Item_Code, Item_Name, Quantity, Date } = body;

    if (!Item_Code || !Item_Name || !Quantity || !Date) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // Step 1: Generate a new Good_Issue_Id like GI0001, GI0002, ...
    const [rows] = await pool.query(
      `SELECT Good_Issue_Id FROM good_issues_data ORDER BY Good_Issue_Id DESC LIMIT 1`
    )as [{ Good_Issue_Id: string }[], any];

    let newIssueId = "GI0001";
    if (rows.length > 0) {
      const lastId = rows[0].Good_Issue_Id;
      const numericPart = parseInt(lastId.replace("GI", ""), 10);
      const nextNumber = numericPart + 1;
      newIssueId = `GI${nextNumber.toString().padStart(4, "0")}`;
    }

    // Step 2: Insert into good_issues_data
    await pool.execute(
      `INSERT INTO good_issues_data 
        (Good_Issue_Id, Item_Code, Item_Name, Quantity, Date)
       VALUES (?, ?, ?, ?, ?)`,
      [newIssueId, Item_Code, Item_Name, Quantity, Date]
    );

    return NextResponse.json(
      { message: "Good issue created", Good_Issue_Id: newIssueId, ...body },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating good issue:", error);
    return NextResponse.json(
      { error: "Failed to create good issue" },
      { status: 500 }
    );
  }
}


// PUT update good issue
// export async function PUT(request: Request) {
//   try {
//     const body = await request.json();
//     const pool = await getDBConnection();

//     if (!body.Good_Issue_Id) {
//       return NextResponse.json(
//         { error: "Good_Issue_Id is required" },
//         { status: 400 }
//       );
//     }

//     const [existing] = await pool.query(
//       "SELECT * FROM good_issues_data WHERE Good_Issue_Id = ?",
//       [body.Good_Issue_Id]
//     );

//     const issue = (existing as any[])[0];
//     if (!issue) {
//       return NextResponse.json({ error: "Good issue not found" }, { status: 404 });
//     }

//     await pool.execute(
//       `UPDATE good_issues_data SET
//         Item_Code = ?, Item_Name = ?, Quantity = ?, Date = ?
//         WHERE Good_Issue_Id = ?`,
//       [
//         body.Item_Code || issue.Item_Code,
//         body.Item_Name || issue.Item_Name,
//         body.Quantity || issue.Quantity,
//         body.Date || issue.Date,
//         body.Good_Issue_Id,
//       ]
//     );

//     const [updated] = await pool.query(
//       "SELECT * FROM good_issues_data WHERE Good_Issue_Id = ?",
//       [body.Good_Issue_Id]
//     );

//     return NextResponse.json((updated as any[])[0], { status: 200 });
//   } catch (error) {
//     console.error("Error updating good issue:", error);
//     return NextResponse.json(
//       { error: "Failed to update good issue" },
//       { status: 500 }
//     );
//   }
// }

// DELETE good issue
// export async function DELETE(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("Good_Issue_Id");

//     if (!id) {
//       return NextResponse.json(
//         { error: "Good_Issue_Id is required" },
//         { status: 400 }
//       );
//     }

//     const pool = await getDBConnection();
//     const [existing] = await pool.query(
//       "SELECT * FROM good_issues_data WHERE Good_Issue_Id = ?",
//       [id]
//     );

//     if ((existing as any[]).length === 0) {
//       return NextResponse.json({ error: "Good issue not found" }, { status: 404 });
//     }

//     await pool.execute("DELETE FROM good_issues_data WHERE Good_Issue_Id = ?", [id]);

//     return NextResponse.json(
//       { message: "Good issue deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting good issue:", error);
//     return NextResponse.json(
//       { error: "Failed to delete good issue" },
//       { status: 500 }
//     );
//   }
// }
