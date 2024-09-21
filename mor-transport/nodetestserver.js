const mysql = require('mysql2/promise');

(async () => {
  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Punjab123',
    database: 'testing',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 15000, // Adjust if needed
  };

  try {
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log('Database connection established successfully!');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();
