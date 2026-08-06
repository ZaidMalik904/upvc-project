const mysql = require('mysql2/promise');

async function checkDb() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'upvc_database'
  });
  
  try {
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Tables:', tables);
  } catch (e) {
    console.error(e);
  } finally {
    connection.end();
  }
}

checkDb();
