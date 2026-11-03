import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "abhisree",
      database: process.env.MYSQL_DATABASE || "game_intelligence_db",
      waitForConnections: true,
      connectionLimit: 15,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      dateStrings: true, // Return dates as ISO strings
    });
  }
  return pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const db = getDbPool();
  const [rows] = await db.query(sql, params);
  return rows as T[];
}

export async function execute<T = mysql.ResultSetHeader>(sql: string, params?: any[]): Promise<T> {
  const db = getDbPool();
  const [result] = await db.execute(sql, params);
  return result as T;
}
