import { NextResponse } from "next/server";
import { getDBConnection } from "../../../../../lib/db";

// GET Aging Report
export async function GET() {
  try {
    const pool = await getDBConnection();

    const [rows] = await pool.query(`
      SELECT 
        grd.Mf_Date,
        imd.Item_Code,
        imd.Item_Name,
        CONCAT(
          TIMESTAMPDIFF(YEAR, CURRENT_DATE, grd.Ex_Date), ' years, ',
          TIMESTAMPDIFF(MONTH, CURRENT_DATE, grd.Ex_Date) % 12, ' months, ',
          DATEDIFF(
            grd.Ex_Date,
            DATE_ADD(
              DATE_ADD(CURRENT_DATE, INTERVAL TIMESTAMPDIFF(YEAR, CURRENT_DATE, grd.Ex_Date) YEAR),
              INTERVAL TIMESTAMPDIFF(MONTH, CURRENT_DATE, grd.Ex_Date) % 12 MONTH
            )
          ), ' days'
        ) AS Expiry_Duration
      FROM 
        good_receipts_data AS grd
      INNER JOIN 
        item_master_data AS imd 
      ON 
        imd.Item_Code = grd.Item_Code;
    `);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error generating aging report:", error);
    return NextResponse.json(
      { error: "Failed to generate aging report" },
      { status: 500 }
    );
  }
}
