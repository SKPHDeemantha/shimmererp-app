import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";

// GET all certificates
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM certification_report");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// POST a new certificate

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Certificate_Name, Item_Code, Item_Name, Expiry_Date } = body;

    if (!Certificate_Name || !Item_Code || !Item_Name || !Expiry_Date) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // Step 1: Generate new Reg_Id like R0001, R0002, ...
    const [rows] = await pool.query(
      `SELECT Reg_Id FROM certification_report ORDER BY Reg_Id DESC LIMIT 1`
    )as [{ Reg_Id: string }[], any];

    let newRegId = "R0001";
    if (rows.length > 0) {
      const lastId = rows[0].Reg_Id;
      const numericPart = parseInt(lastId.replace("R", ""), 10);
      const nextNumber = numericPart + 1;
      newRegId = `R${nextNumber.toString().padStart(4, "0")}`;
    }

    // Step 2: Insert into certification_report
    await pool.execute(
      `INSERT INTO certification_report (Reg_Id, Certificate_Name, Item_Code, Item_Name, Expiry_Date)
       VALUES (?, ?, ?, ?, ?)`,
      [newRegId, Certificate_Name, Item_Code, Item_Name, Expiry_Date]
    );

    return NextResponse.json(
      { message: "Certificate created", Reg_Id: newRegId, ...body },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json(
      { error: "Failed to create certificate" },
      { status: 500 }
    );
  }
}


// PUT update certificate
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    if (!body.Reg_Id) {
      return NextResponse.json(
        { error: "Reg_Id is required" },
        { status: 400 }
      );
    }

    const [existing] = await pool.query(
      "SELECT * FROM certification_report WHERE Reg_Id = ?",
      [body.Reg_Id]
    );

    const existingCert = (existing as any[])[0];
    if (!existingCert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    await pool.execute(
      `UPDATE certification_report SET
        Certificate_Name = ?, Item_Code = ?, Item_Name = ?, Expiry_Date = ?
        WHERE Reg_Id = ?`,
      [
        body.Certificate_Name || existingCert.Certificate_Name,
        body.Item_Code || existingCert.Item_Code,
        body.Item_Name || existingCert.Item_Name,
        body.Expiry_Date || existingCert.Expiry_Date,
        body.Reg_Id,
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM certification_report WHERE Reg_Id = ?",
      [body.Reg_Id]
    );

    return NextResponse.json((updated as any[])[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update certificate" },
      { status: 500 }
    );
  }
}

// DELETE certificate
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regId = searchParams.get("Reg_Id");

    if (!regId) {
      return NextResponse.json(
        { error: "Reg_Id is required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    const [existing] = await pool.query(
      "SELECT * FROM certification_report WHERE Reg_Id = ?",
      [regId]
    );

    if ((existing as any).length === 0) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    await pool.execute("DELETE FROM certification_report WHERE Reg_Id = ?", [regId]);

    return NextResponse.json(
      { message: "Certificate deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete certificate" },
      { status: 500 }
    );
  }
}
