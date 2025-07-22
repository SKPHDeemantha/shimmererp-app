import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { User_ID, Password } = await request.json();

    if (!User_ID || !Password) {
      return NextResponse.json(
        { error: "User Id and Password are required" },
        { status: 400 }
      );
    }

    const pool = await getDBConnection();
    const [users] = await pool.query(
      "SELECT * FROM user_data WHERE User_ID = ?",
      [User_ID]
    );

    if ((users as any).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = (users as any)[0];

    const valid = await bcrypt.compare(Password, user.Password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Example: determine if Admin based on Email (can be adjusted)
    const isAdmin = User_ID === "USR002";

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          User_ID: user.User_ID,
          Name: user.Name,
          Email: user.Email,
          Profile_Picture: user.Profile_Picture,
          isAdmin,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
