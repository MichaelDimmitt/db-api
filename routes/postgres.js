let app = require('express').Router();
let pg = require('pg')
require('pg-essential').patch(pg);

const { Client } = pg
const { config } = require('../config.js')
const fetch = require('node-fetch');

const errorMessage = (err, client) => {
  msg = 'error' + err  
  console.log({err})
  client.end()
  res.status(501).json('hi')
}
let msg = ''

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
    errorMessage(err, client)
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
    errorMessage(err, client)
  }
})

app.get('/insertRepos', async function(req, res){
  const client = new Client(config)
  try{
    
    
    await client.connect()
    const prefix = 'users'
    const userName = 'michaeldimmitt'// 'sindresorhus'
    const startingIndex = 0
    
    const fetchRepo = (prefix, userName, startingIndex, increment) => fetch(`https://api.github.com/${prefix}/${userName}/repos?per_page=100&page=${startingIndex + increment}`).then(x => x.json())
    const reposRequest1 = fetchRepo(prefix, userName, startingIndex, 1)
    const reposRequest2 = fetchRepo(prefix, userName, startingIndex, 2)
    const reposRequest3 = fetchRepo(prefix, userName, startingIndex, 3)
    const reposRequest4 = fetchRepo(prefix, userName, startingIndex, 4)
    const reposRequest5 = fetchRepo(prefix, userName, startingIndex, 5)
    
    const shrinkRepo = (repo) => {
      const trimmedRepo = {
        repo: repo.name,
        username: repo.owner.login,
        starcount: repo.stargazers_count,
        majoritylanguage: repo.language,
        languagecolor: "#89e051",
        description: repo.description === null ? '' : repo.description
      }
    
      return trimmedRepo
    }
    getRepoData = async (repos, client) => {
      if(repos.length > 0) {
        const trimmedData = repos.map( repo => 
          shrinkRepo(repo) 
        )
        const keyValues = Object.keys(trimmedData[0])
        
        try { await client.executeBulkInsertion(trimmedData,keyValues,'repos'); }
        catch(err) { errorMessage(err, client) }
        msg = 'done'
      }
      else { msg = 'done, no insertion added' }
      return msg
    }
    const listOfRepos = await Promise.all([reposRequest1, reposRequest2, reposRequest3, reposRequest4, reposRequest5])
    const [repos1, repos2, repos3, repos4, repos5] = listOfRepos
    const messageArray = await listOfRepos.map(async repos => {
      await getRepoData(repos, client)
    })
    
    console.log('reached the end', repos1, repos1.length, repos2.length, repos3.length, repos4.length, repos5.length) 
    // .then(async (listOfRepos) => {
    //   console.log({listOfRepos})
    //   const [repos1, repos2, repos3, repos4, repos5] = listOfRepos
    //   const messageArray = await listOfRepos.map(async repos => {
    //     await getRepoData(repos, client)
    //   })

    //   if(!repos1.length || !repos2.length || !repos3.length || !repos4.length || !repos5.length)
    //   {
    //     console.log('reached the end', repos1.length, repos2.length, repos3.length, repos4.length, repos5.length)
    //   }
    //   return messageArray
    // })
    // console.log({listOfRepos})

    
    // console.log({messageArray})
    // {
    //   recurse()
    // }
    
    res.status(200).json(msg)
    // psql -d project1 -c "SELECT *  FROM repos"
    // psql -d project1 -c "DELETE from repos;"
  }
   
  catch(err) {
    errorMessage(err, client)
  }
})

// `CREATE TABLE users( ${params.firstName} text, ${params.lastName} text, ${params.npiNumber} text, ${params.businessAddress} text, ${params.telephoneNumber} text, ${params.emailAddress} text )`

module.exports = { postgresRoutes: app }
