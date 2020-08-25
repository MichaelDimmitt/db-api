let app = require('express').Router();
let pg = require('pg')
require('pg-essential').patch(pg);

const { Client } = pg
const { config } = require('../config.js')
const fetch = require('node-fetch');
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

app.get('/insertRepos', async function(req, res){
  try{
    const client = new Client(config)
    
    await client.connect()
    
    const repos = await fetch(`https://api.github.com/users/michaeldimmitt/repos?per_page=100&page=2`)
        .then(function(response) {
          return response.json();
        })
    let msg = ''
    let reallyLargeString = 'INSERT INTO users VALUES'
    if(repos.length > 0){
      const trimmedData = repos.map( repo => {
        const newRepo = {
            repo: repo.name,
            username: repo.owner.login,
            starcount: repo.stargazers_count,
            majoritylanguage: repo.language,
            languagecolor: "#89e051",
            description: repo.description === null ? '' : repo.description
          }
        
        // reallyLargeString = `${reallyLargeString} ( '${newRepo.repo}', '${newRepo.userName}', '${newRepo.starCount}', '${newRepo.majorityLanguage}', '${newRepo.languageColor}', '${newRepo.description}', )`;
        return newRepo
      })
      const keyValues = Object.keys(trimmedData[0])
      console.log({trimmedData, reallyLargeString, keyValues})

      await client.executeBulkInsertion(trimmedData,keyValues,'repos');
      msg = 'done'
    }
    else { msg = 'done, no insertion added' }
    res.status(200).json(msg)
    // psql -d project1 -c "SELECT *  FROM repos"
    // psql -d project1 -c "DELETE from repos;"
  }
   
  catch(err) {
    console.log({err})
    client.end()
    res.status(501).json('hi')
  }
})

// `CREATE TABLE users( ${params.firstName} text, ${params.lastName} text, ${params.npiNumber} text, ${params.businessAddress} text, ${params.telephoneNumber} text, ${params.emailAddress} text )`

module.exports = { postgresRoutes: app }
