const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const path = require('path')
const port = '3000'
const jwt = require('jsonwebtoken')
const secret = 'mysecrets'

const app = express()
const router = express.Router()

app.use(router)
app.use(cors())
app.use(express.json())

app.use('/', express.static(path.join(__dirname,'frontend')));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "delicio"
})

app.get('/api/admins', (req, res) => {

  const filterObj = req.query
  let filter = ""

  if (filterObj.name !== undefined && filterObj.name !== "") {
    filter += ` AND ( firstname LIKE "%${filterObj.name}%" OR lastname LIKE "%${filterObj.name}%" ) `
  }

  if (filterObj.age !== undefined && filterObj.age !== "") {
    filter += ` AND age = ${parseInt(filterObj.age)} `
  }

  if (filterObj.sex !== undefined && filterObj.sex !== "") {
    filter += ` AND sex = "${filterObj.sex}" `
  }

  if (filterObj.nation !== undefined && filterObj.nation !== "") {
    filter += ` AND nation = "${filterObj.nation}" `
  }

  const query = `SELECT * FROM admin_info WHERE 1 ${filter}`

  // console.log(query)

  db.query(query, (err, result) => {
    res.send(result)
  })
})

app.get('/api/admins/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const query = `SELECT * FROM admin_info WHERE admin_no = ${id}`
  db.query(query, (err, result) => {
    res.send(result)
  })
})

app.post('/api/admins', (req, res) => {
  const insertData = req.body

  const query = `
    INSERT INTO admin_info (
      admin_no,
      firstname,
      lastname,
      address,
      age,
      email,
      sex,
      nation,
      admin_status
    ) VALUES (
      ${insertData.admin_no},
      "${insertData.firstname}",
      "${insertData.lastname}",
      "${insertData.address}",
      ${insertData.age},
      "${insertData.email}",
      "${insertData.sex}",
      "${insertData.nation}",
      "active"
    )
  `

  db.query(query, (err, result) => {
    res.send(result)
  })
})

app.put('/api/admins/:id', (req, res) => {
  const id = parseInt(req.params.id)

  const updateData = req.body

  const query = `
    UPDATE admin_info 
    SET
      firstname = "${updateData.firstname}",
      lastname = "${updateData.lastname}",
      address = "${updateData.address}",
      nation = "${updateData.nation}",
      age = ${updateData.age},
      
      email = "${updateData.email}"
    WHERE admin_no = ${id}
  `
  db.query(query, (err, result) => {
    res.send(result)
  })
})

app.delete('/api/admins/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const query = `DELETE FROM admin_info WHERE admin_no = ${id}`
  db.query(query, (err, result) => {
    res.send(result)
  })
})

app.get('/api/products', (req, res) => {

  const filterObj = req.query
  let filter = ""

  if (filterObj.name !== undefined && filterObj.name !== "") {
    filter += ` AND productname LIKE "%${filterObj.name}%" `
  }

  if (filterObj.preptime !== undefined && filterObj.preptime !== "") {
    filter += ` AND preptime = ${parseInt(filterObj.preptime)} `
  }

  if (filterObj.serving !== undefined && filterObj.serving !== "") {
    filter += ` AND serving = "${filterObj.serving}" `
  }

  if (filterObj.cooktime !== undefined && filterObj.cooktime !== "") {
    filter += ` AND cooktime = "${filterObj.cooktime}" `
  }

  const query = `SELECT * FROM datadomain WHERE 1 ${filter}`

  db.query(query, (err, result) => {
    res.send(result)
  })
})

app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const query = `SELECT * FROM datadomain WHERE product_no = ${id}`
  db.query(query, (err, result) => {
    res.send(result[0])
  })
})

//--------------------------------------- authenication --------------------------------

app.post('/adminlogin' , (req, res) => {
  let user = req.body.username
  db.query(
    `SELECT * FROM admin_login WHERE username = ? AND adminpw = ?`,
    [req.body.username, req.body.password],
    (err, result) => {
      if (err) {
        res.send({ err: err, status: 'error' })
      }
      else if (result.length > 0) {
        let token = jwt.sign({ user }, secret, { expiresIn: '1h' })
        res.send({ token: token, status : 'success'})
      } else {
        res.send({ message: "Wrong email/password combination!" , status: 'error'})
      }
    }
  )
});

app.post('/admin_authen' , (req, res) => {
  try {
    let tokenchecking = req.headers.authorization.split(' ')[1];
    jwt.verify(tokenchecking, secret)
    res.json({status: 'success'})
  } catch(err){
    res.json({status: 'error'})
  }
});

app.listen(port, () => {
  console.log('Started!')
})