import { NextResponse } from 'next/server';

// Simple test connection function
async function testConnection(): Promise<boolean> {
    // Replace this with your actual connection logic
    return true; // This is just a placeholder
}

export async function GET() {
    try {
        const isConnected = await testConnection();
        return NextResponse.json(
            { status: 'success', connected: isConnected },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { status: 'error', message: 'Database connection failed' },
            { status: 500 }
        );
    }
}