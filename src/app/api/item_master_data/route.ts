import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";
import { error } from "console";

// GET all items
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query("SELECT * FROM item_master_data");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

// POST new item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    const {
      Item_Code,
      Item_Name,
      Brand,
      Size,
      Available_Stock,
      Price,
      Country,
    } = body;

    if (!Item_Code || !Item_Name) {
      return NextResponse.json(
        { error: "Item_Code and Item_Name are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      `INSERT INTO item_master_data 
                (Item_Code, Item_Name, Brand, Size, Available_Stock, Price, Country)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Item_Code,
        Item_Name,
        Brand || null,
        Size || null,
        Available_Stock || 0,
        Price || 0.0,
        Country || null,
      ]
    );
    console.log("Insert result:", result);

    return NextResponse.json({ ...body }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

// PUT update item
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const pool = await getDBConnection();

    if (!body.Item_Code) {
      return NextResponse.json(
        { error: "Item_Code is required" },
        { status: 400 }
      );
    }

    const [existing] = (await pool.query(
      "SELECT * FROM item_master_data WHERE Item_Code = ?",
      [body.Item_Code]
    )) as [any[], any];

    if (existing.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await pool.execute(
      `UPDATE item_master_data 
             SET Item_Name = ?, Brand = ?, Size = ?, Available_Stock = ?, Price = ?, Country = ?
             WHERE Item_Code = ?`,
      [
        body.Item_Name || existing[0]?.Item_Name,
        body.Brand || existing[0]?.Brand,
        body.Size || existing[0]?.Size,
        body.Available_Stock ?? existing[0]?.Available_Stock,
        body.Price ?? existing[0]?.Price,
        body.Country || existing[0]?.Country,
        body.Item_Code,
      ]
    );

    const [updated] = await pool.query(
      "SELECT * FROM item_master_data WHERE Item_Code = ?",
      [body.Item_Code]
    );

    return NextResponse.json((updated as any[])[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const Item_Code = searchParams.get("Item_Code");

    if (!Item_Code) {
      return NextResponse.json(
        { error: "Item_Code is required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    const [existing] = await pool.query(
      "SELECT * FROM item_master_data WHERE Item_Code = ?",
      [Item_Code]
    );

    if ((existing as any).length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await pool.execute("DELETE FROM item_master_data WHERE Item_Code = ?", [
      Item_Code,
    ]);

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
