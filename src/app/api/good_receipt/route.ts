import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

// GET all goods receipts
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM good_receipts_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching goods receipts:", error);
    return NextResponse.json(
      { error: "Failed to fetch goods receipts" },
      { status: 500 }
    );
  }
}

// POST a new goods receipt
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      Po_Id,
      Item_Code,
      Item_Name,
      Quantity,
      Unit_Price,
      Total_Amount,
      MF_Date,
      Status,
      Ex_Date
    } = body;

    if (
      !Po_Id || !Item_Code || !Item_Name || !Quantity ||
      !Unit_Price || !Total_Amount || !MF_Date || !Status || !Ex_Date
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // Step 1: Generate a new GRN_ID like G0001, G0002, ...
    const [rows] = await pool.query(
      `SELECT GRN_ID FROM good_receipts_data ORDER BY GRN_ID DESC LIMIT 1`
    )as [{ GRN_ID: string }[], any];

    let newGrnId = "GR0001";
    if (rows.length > 0) {
      const lastId = rows[0].GRN_ID;
      const numericPart = parseInt(lastId.replace("GR", ""), 10);
      const nextNumber = numericPart + 1;
      newGrnId = `GR${nextNumber.toString().padStart(4, "0")}`;
    }

    // Step 2: Insert the goods receipt
    await pool.execute(
      `INSERT INTO good_receipts_data 
        (GRN_ID, Po_Id, Item_Code, Item_Name, Quantity, Unit_Price, Total_Amount, MF_Date, Status, Ex_Date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newGrnId,
        Po_Id,
        Item_Code,
        Item_Name,
        Quantity,
        Unit_Price,
        Total_Amount,
        MF_Date,
        Status,
        Ex_Date
      ]
    );

    return NextResponse.json(
      { message: "Goods receipt created", GRN_ID: newGrnId, ...body },
    );
  } catch (error) {
    console.error("Error creating goods receipt:", error);
    return NextResponse.json(
      { error: "Failed to create goods receipt" },
      { status: 500 }
    );
  }
}

// PUT update goods receipt
// export async function PUT(request: Request) {
//   try {
//     const body = await request.json();
//     const pool = await getDBConnection();

//     if (!body.GRN_ID) {
//       return NextResponse.json(
//         { error: "GRN_ID is required" },
//         { status: 400 }
//       );
//     }

//     const [existing] = await pool.query(
//       "SELECT * FROM good_receipts_data WHERE GRN_ID = ?",
//       [body.GRN_ID]
//     );

//     const record = (existing as any[])[0];
//     if (!record) {
//       return NextResponse.json({ error: "Goods receipt not found" }, { status: 404 });
//     }

//     await pool.execute(
//       `UPDATE good_receipts_data SET
//         Po_Id = ?, Item_Code = ?, Item_Name = ?, Quantity = ?, Unit_Price = ?,
//         Total_Amount = ?, MF_Date = ?, Status = ?, Ex_Date = ?
//         WHERE GRN_ID = ?`,
//       [
//         body.Po_Id || record.Po_Id,
//         body.Item_Code || record.Item_Code,
//         body.Item_Name || record.Item_Name,
//         body.Quantity || record.Quantity,
//         body.Unit_Price || record.Unit_Price,
//         body.Total_Amount || record.Total_Amount,
//         body.MF_Date || record.MF_Date,
//         body.Status || record.Status,
//         body.Ex_Date || record.Ex_Date,
//         body.GRN_ID
//       ]
//     );

//     const [updated] = await pool.query(
//       "SELECT * FROM good_receipts_data WHERE GRN_ID = ?",
//       [body.GRN_ID]
//     );

//     return NextResponse.json((updated as any[])[0], { status: 200 });
//   } catch (error) {
//     console.error("Error updating goods receipt:", error);
//     return NextResponse.json(
//       { error: "Failed to update goods receipt" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE goods receipt
// export async function DELETE(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("GRN_ID");

//     if (!id) {
//       return NextResponse.json(
//         { error: "GRN_ID is required" },
//         { status: 400 }
//       );
//     }

//     const pool = await getDBConnection();
//     const [existing] = await pool.query(
//       "SELECT * FROM good_receipts_data WHERE GRN_ID = ?",
//       [id]
//     );

//     if ((existing as any[]).length === 0) {
//       return NextResponse.json({ error: "Goods receipt not found" }, { status: 404 });
//     }

//     await pool.execute("DELETE FROM good_receipts_data WHERE GRN_ID = ?", [id]);

//     return NextResponse.json(
//       { message: "Goods receipt deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting goods receipt:", error);
//     return NextResponse.json(
//       { error: "Failed to delete goods receipt" },
//       { status: 500 }
//     );
//   }
 
