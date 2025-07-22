import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET all purchase orders
export async function GET() {
    try {
        const pool = await getDBConnection();
        const [rows] = await pool.query("SELECT * FROM purchase_order");
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch purchase orders" },
            { status: 500 }
        );
    }
}

// POST a new purchase order
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const pool = await getDBConnection();

        const {
            Po_Id,
            Date,
            Location,
            Supplier_Id,
            Supplier_Name,
            Item_Id,
            Item_Name,
            Price,
            Quantity,
            DisValue,
            TotValue
        } = body;

        if (!Po_Id || !Supplier_Id || !Item_Id || !Price || !Quantity) {
            return NextResponse.json(
                { error: "Po_Id, Supplier_Id, Item_Id, Price, and Quantity are required" },
                { status: 400 }
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO purchase_order 
                (Po_Id, Date, Location, Supplier_Id, Supplier_Name, Item_Id, Item_Name, Price, Quantity, DisValue, TotValue)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                Po_Id,
                Date || null,
                Location || null,
                Supplier_Id,
                Supplier_Name || null,
                Item_Id,
                Item_Name || null,
                Price,
                Quantity,
                DisValue || 0.0,
                TotValue || (Price * Quantity) - (DisValue || 0.0)
            ]
        );

        return NextResponse.json({ ...body }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to create purchase order" },
            { status: 500 }
        );
    }
}

// PUT update purchase order
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const pool = await getDBConnection();

        if (!body.Po_Id) {
            return NextResponse.json(
                { error: "Po_Id is required" },
                { status: 400 }
            );
        }

        const [existing] = await pool.query("SELECT * FROM purchase_order WHERE Po_Id = ?", [body.Po_Id]);

        if ((existing as any).length === 0) {
            return NextResponse.json(
                { error: "Purchase order not found" },
                { status: 404 }
            );
        }

        const existingData = (existing as any)[0];

        const updatedTotValue = 
            (body.Price ?? existingData.Price) *
            (body.Quantity ?? existingData.Quantity) -
            (body.DisValue ?? (existingData.DisValue || 0));

        await pool.execute(
            `UPDATE purchase_order SET
                Date = ?, Location = ?, Supplier_Id = ?, Supplier_Name = ?,
                Item_Id = ?, Item_Name = ?, Price = ?, Quantity = ?, DisValue = ?, TotValue = ?
             WHERE Po_Id = ?`,
            [
                body.Date || existingData.Date,
                body.Location || existingData.Location,
                body.Supplier_Id || existingData.Supplier_Id,
                body.Supplier_Name || existingData.Supplier_Name,
                body.Item_Id || existingData.Item_Id,
                body.Item_Name || existingData.Item_Name,
                body.Price ?? existingData.Price,
                body.Quantity ?? existingData.Quantity,
                body.DisValue ?? existingData.DisValue,
                updatedTotValue,
                body.Po_Id
            ]
        );

        const [updated] = await pool.query("SELECT * FROM purchase_order WHERE Po_Id = ?", [body.Po_Id]);
        return NextResponse.json((updated as any[])[0], { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update purchase order" },
            { status: 500 }
        );
    }
}

// DELETE purchase order
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const Po_Id = searchParams.get("Po_Id");

        if (!Po_Id) {
            return NextResponse.json(
                { error: "Po_Id is required" },
                { status: 400 }
            );
        }

        const pool = await getDBConnection();

        const [existing] = await pool.query("SELECT * FROM purchase_order WHERE Po_Id = ?", [Po_Id]);

        if ((existing as any).length === 0) {
            return NextResponse.json(
                { error: "Purchase order not found" },
                { status: 404 }
            );
        }

        await pool.execute("DELETE FROM purchase_order WHERE Po_Id = ?", [Po_Id]);

        return NextResponse.json(
            { message: "Purchase order deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete purchase order" },
            { status: 500 }
        );
    }
}
