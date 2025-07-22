// lib/db.ts
import mysql from 'mysql2/promise';

export async function getDBConnection() {
    try {
        console.log("Connecting to database...");
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionLimit: 10,
            waitForConnections: true,
            queueLimit: 0,
            connectTimeout: 10000,
        });

        // Test the connection
        await pool.getConnection();
        console.log("Database connected");
        
        return pool;
    } catch (error) {
        console.error('Failed to create database connection:', error);
        throw error; 
    }
}
