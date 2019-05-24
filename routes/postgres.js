let app = require('express').Router();
const { config } = require('../config.js');

const { Client } = require('pg');
const client = new Client(config);

app.get('/users', async function(req, res){
  try{
  console.log('reached', {client} )
  await client.connect()
  const body = await client.query('SELECT * FROM newtravel')
  console.log(body.rows[0])
  await client.end()
  res.status(200).json(body.rows[0])
  }
  catch(err) {
    console.log({err})
    client.end()
    res.status(501).json('hi')
  }
})

module.exports = { postgresRoutes: app }
