const fs = require('fs'); //파일 접근할수 있는 라이브러리
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({
  host:conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
})
app.get('/api/customers', (req, res) =>{
  connection.query(
    "SELECT * FROM CUSTOMER",
    (err, rows, fields) =>{
      res.send(rows);
    })
  })

app.listen(port, () => console.log(`Listening on port ${port}`));
