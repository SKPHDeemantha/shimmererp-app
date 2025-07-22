import { request } from "http";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function GET(){
    return NextResponse.json({
        hello: "world",
    })
}

export async function POST(request:Request) {
    const data = await request.json()
    return NextResponse.json({
        data,
    })
    
}