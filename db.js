const mysql = require('mysql2');

require('dotenv').config();

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'tiger',        // Your database username
  password: 'root', // Your database password
  database: 'testdb'      // Your database name
});
// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database');
  
  // Check if the table exists, and create it if it doesn't
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS table1 (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      requestIP VARCHAR(255) NOT NULL,
      requestOS VARCHAR(255) NOT NULL,
      requestTime VARCHAR(255) NOT NULL
    )
  `;
  
  // Execute the query to create the table if it doesn't exist
  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    console.log('Table already exists');
  });
});

// Export the connection object to be used in app.js
module.exports = db;