import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../lib/db";
import bcrypt from "bcryptjs";

const DEFAULT_PROFILE_PIC =
  "https://www.canva.com/icons/MAEGkZHHSyM-user-profile-illustration/";

// GET all users
export async function GET() {
  try {
    const pool = await getDBConnection();
    const [rows] = await pool.query(
      "SELECT User_ID, Name, Email, Password, Profile_Picture, User_Address FROM user_data"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST (Sign Up) with custom auto-increment User_ID like "U0001"
export async function POST(request: Request) {
  try {
    const { Name, Email, Password, Profile_Picture, User_Address } = await request.json();

    if (!Name || !Email || !Password || !User_Address) {
      return NextResponse.json(
        { error: "Name, Email, Password, and User_Address are required" },
        { status: 400 }
      );
    }

    if (Password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();

    // Generate new User_ID
    const [rows] = await pool.query(
      "SELECT User_ID FROM user_data ORDER BY User_ID DESC LIMIT 1"
    );
    let newId = "U0001";
    if ((rows as any[]).length > 0) {
      const lastId = (rows as any[])[0].User_ID;
      const lastNumber = parseInt(lastId.slice(1)) || 0;
      newId = "U" + String(lastNumber + 1).padStart(4, "0");
    }

    // Check if Email already exists
    const [existingEmail] = await pool.query("SELECT * FROM user_data WHERE Email = ?", [Email]);
    if ((existingEmail as any[]).length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    await pool.execute(
      "INSERT INTO user_data (User_ID, Name, Email, Password, Profile_Picture, User_Address) VALUES (?, ?, ?, ?, ?, ?)",
      [newId, Name, Email, hashedPassword, Profile_Picture || DEFAULT_PROFILE_PIC, User_Address]
    );

    return NextResponse.json(
      { User_ID: newId, Name, Email, User_Address },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// PUT (Update) user
export async function PUT(request: Request) {
  try {
    const { User_ID, Name, Email, Password, Profile_Picture, User_Address } =
      await request.json();

    if (!User_ID) {
      return NextResponse.json({ error: "User_ID is required" }, { status: 400 });
    }

    const pool = await getDBConnection();
    const [existing] = await pool.query("SELECT * FROM user_data WHERE User_ID = ?", [User_ID]);

    if ((existing as any[]).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = (existing as any[])[0];
    const hashedPassword = Password ? await bcrypt.hash(Password, 10) : user.Password;

    await pool.execute(
      `UPDATE user_data 
       SET Name = ?, Email = ?, Password = ?, Profile_Picture = ?, User_Address = ?
       WHERE User_ID = ?`,
      [
        Name || user.Name,
        Email || user.Email,
        hashedPassword,
        Profile_Picture || user.Profile_Picture,
        User_Address || user.User_Address,
        User_ID,
      ]
    );

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const User_ID = searchParams.get("User_ID");

    if (!User_ID) {
      return NextResponse.json({ error: "User_ID is required" }, { status: 400 });
    }

    const pool = await getDBConnection();
    const [result] = await pool.execute("DELETE FROM user_data WHERE User_ID = ?", [User_ID]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
