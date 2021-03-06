let app = require('express').Router();
const { Client } = require('pg')
const { config } = require('../config.js')
app.get('/users', async function(req, res){
  try{
  const client = new Client(config)

  await client.connect()
  const body = await client.query(`SELECT * FROM users`)
  console.log(body.rows)
  await client.end()
  res.status(200).json(body.rows)
  }
  catch(err) {
    console.log({err})
    client.end()
    res.status(501).json('hi')
  }
})


app.post('/insert', async function(req, res){
  const params=req.body
  try{
  const client = new Client(config)
  await client.connect()
//  const body2 = await client.query(`INSERT INTO users VALUES ('${params.firstName}', 'dimmitt', '82138','2312 baymeadows way, jacksonville, fl','9022006567','michaelgdimmitt@gmail.com');`)
  const body2 = await client.query(`INSERT INTO users VALUES ( '${params.firstName}', '${params.lastName}', '${params.npiNumber}', '${params.businessAddress}', '${params.telephoneNumber}', '${params.emailAddress}' )`);
  const body = await client.query('SELECT * FROM users')
  console.log(body.rows)
  await client.end()
  res.status(200).json(body.rows)
  }
  catch(err) {
    console.log({err})
    client.end()
    res.status(501).json('hi')
  }
})

// `CREATE TABLE users( ${params.firstName} text, ${params.lastName} text, ${params.npiNumber} text, ${params.businessAddress} text, ${params.telephoneNumber} text, ${params.emailAddress} text )`

module.exports = { postgresRoutes: app }
