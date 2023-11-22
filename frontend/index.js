const express = require('express');
const dotenv = require("dotenv");
const mysql = require('mysql2');
const path = require('path');
const app = express();
const router = express.Router();
var cors = require('cors');
dotenv.config();
app.use('/', router);
app.use(cors());
port = '3030'

let corsOptions = {
    origin: 'http://localhost:3030',
    methods: 'GET,POST,PUT,DELETE'
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "delicio"
});

app.get('/product', (req, res) => {
    console.log(req.body)
    
    const filterObj = req.query
    let filter = ""
  
    console.log(filterObj)
  
    if (filterObj.name !== undefined && filterObj.name !== "") {
      filter += ` AND ( firstname LIKE "%${filterObj.name}%" OR lastname LIKE "%${filterObj.name}%" ) `
    }
  
    if (filterObj.type !== undefined && filterObj.type !== "") {
      filter += ` AND age = ${parseInt(filterObj.type)} `
    }
  
    if (filterObj.portion !== undefined && filterObj.portion !== "") {
      filter += ` AND sex = "${filterObj.portion}" `
    }
  
    if (filterObj.totaltime !== undefined && filterObj.totaltime !== "") {
      filter += ` AND nation = "${filterObj.totaltime}" `
    }
  
    const query = `SELECT * FROM admin_info WHERE 1 ${filter}`
  
    // console.log(query)
  
    connection.query(query, (err, result) => {
      res.send(result)
    })
  })

app.post('/product', cors(), function (req, res) {
    let pro = req.body.pro;
    console.log(pro);
    if (!pro) {
        return res.status(400).send({ error: true, message: 'Please provide product information' });
    }
    connection.query('INSERT INTO datadomain set ?',student, function (error, results) {
        if (error) throw error;
    return res.send({error: false, data: results.affectedRows, message: 'New product has been created successfully.'});
    }); 
});

app.put('/product', cors(), function (req, res) {
    let proID = req.body.pro.product_no;
    let pro = req.body.pro;
    if (!proID || !pro) {
        return res.status(400).send({ error: pro, message: 'Please provide product information' });
        }
    connection.query('UPDATE datadomain set ? WHERE product_no = ?',[pro,proID], function (error, results) {
        if (error) throw error;
    return res.send({error: false, data: results.affectedRows, message: 'New product has been updated successfully.'});
    }); 
});


app.delete('/product', cors(), function (req, res) {
    let proID = req.body.product_no;
    if (!proID) {
        return res.status(400).send({ error: pro, message: 'Please provide product information' });
        }
    connection.query('DELETE FROM datadomain WHERE product_no = ?',[proID], function (error, results) {
        if (error) throw error;
    return res.send({error: false, data: results.affectedRows, message: 'New product has been deleted successfully.'});
    }); 
});      


app.get('/product', function (req, res) {
    connection.query('SELECT * FROM datadomain', function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'product list.' });
    });
});

app.get('/product/:pro', cors(), function (req, res) {
    let pro = req.params.pro;
    console.log(req.params.pro);
    let sql;
    if (!isNaN(req.params.pro)) {
        sql = `SELECT * FROM datadomain WHERE product_no LIKE "%${pro}%"`;
    }  else {
        sql = `SELECT * FROM datadomain WHERE productname LIKE "%${pro}%"`;
    }
    connection.query(sql, function (error, results) {
        res.json(results);
    });
})

app.get('/product/:id/:pro', cors(), function (req, res) {
    let id = req.params.id;
    let pro = req.params.pro;
    console.log(req.params.pro);
    console.log(req.params.id);
    let sql;
    if (!isNaN(req.params.id)) {
        sql = `SELECT * FROM datadomain WHERE product_no  = ${id}`;
    } if (!isNaN(req.params.pro)){
    sql = `SELECT * FROM datadomain WHERE productname  = ${pro}`;
}
    connection.query(sql, function (error, results) {
        res.json(results);
    });
})



app.listen(port, function () {
    console.log('Started!')
});
