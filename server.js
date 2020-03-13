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
});
connection.connect();
const multer = require('multer');
//업로드 경로설정
//미리 폴더를 만들어놔야 하며, 경로 맨 앞에 '/'는 붙이지 않습니다. 
const upload = multer({dest: 'upload/'});

app.get('/api/customers', (req, res) =>{
  connection.query(
    "SELECT * FROM CUSTOMER WHERE isDeleted = 0",
    (err, rows, fields) =>{
      res.send(rows);
    })
  })
//upload 폴더 공유
//app.use(express.static('public'));
app.use('/image', express.static('./upload'));
//app.use('/image', express.static(path.join(__dirname, './upload')));

app.post('/api/customers', upload.single('image'), (req, res)=>{
  let sql = 'INSERT INTO CUSTOMER VALUES (NULL, ?, ?, ?, ?, ?, now(), 0)';
  let image = '/image/' + req.file.filename;
  let name = req.body.name;
  let birthday = req.body.birthday;
  let gender = req.body.gender;
  let job = req.body.job;
  let params = [image, name, birthday, gender, job];
  //.query(sqlString, values, callback)
  connection.query(sql, params,
    (err, rows, fields) =>{
      res.send(rows);
    })
})

app.delete('/api/customers/:id',(req,res)=>{
  let sql = 'UPDATE CUSTOMER SET isDeleted = 1 WHERE id=?';
  let params = [req.params.id];
  connection.query(sql, params, 
    (err, rows, fileds)=>{
      res.send(rows);
    })
})
app.listen(port, () => console.log(`Listening on port ${port}`));
