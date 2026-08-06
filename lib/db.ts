import mysql from 'mysql2/promise';

declare global {
  var mysqlPool: mysql.Pool | undefined;
}

export function getDbConnection() {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool({
      host: '127.0.0.1',
      user: 'root',
      password: '', // Default XAMPP password is empty
      database: 'upvc_database',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return global.mysqlPool;
}

export async function query<T>(sql: string, values?: any[]): Promise<T> {
  const connection = getDbConnection();
  const [rows] = await connection.execute(sql, values);
  return rows as T;
}
