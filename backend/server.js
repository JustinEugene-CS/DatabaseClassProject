const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable cross-origin requests (adjust as needed)
app.use(express.json()); // Parse JSON bodies

// MySQL connection configuration – replace with your actual credentials and database name
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'your_database_name'
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database");
});

// API endpoint to fetch all athletes
app.get('/api/athletes', (req, res) => {
  const sql = 'SELECT * FROM athletes';
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

// API endpoint to fetch a single athlete by id
app.get('/api/athlete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM athletes WHERE id = ?';
  db.query(sql, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Athlete not found' });
    }
    res.json(results[0]);
  });
});

// More endpoints could be added here (e.g., create, update, delete)

// Start the server on port 5000 (or another port of your choice)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});