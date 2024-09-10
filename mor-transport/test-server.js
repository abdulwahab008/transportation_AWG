const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',     // or '127.0.0.1'
  user: 'root',
  password: 'Punjab123',
  database: 'testing'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
  connection.end();
});
