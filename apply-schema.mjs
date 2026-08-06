import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

async function applySchema() {
  try {
    const sqlPath = path.join(process.cwd(), 'schema_update.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'upvc_database',
      multipleStatements: true
    });

    console.log('Connected to upvc_databse. Applying new schema...');
    await connection.query(sql);
    console.log('Schema successfully applied!');
    
    await connection.end();
  } catch (error) {
    console.error('Error applying schema:', error);
  }
}

applySchema();
