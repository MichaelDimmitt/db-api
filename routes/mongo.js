let app = require('express').Router();
const MongoClient = require('mongodb').MongoClient



app.get('/users', function(req,res){
  MongoClient.connect("mongodb://localhost:27017/project1", function(err, db) {
    console.log('connected successfully to server')
    db.collection('users').aggregate([ ]).toArray()
      .then(result => {
        db.close();
        res.json(result)
      })
  });
})

app.post('/insert', function(req,res){
  const { firstName, lastName, npiNumber, businessAddress, telephoneNumber, email } = req.body
  MongoClient.connect("mongodb://localhost:27017/project1", function(err, db) {
    console.log('connected successfully to server')
    db.collection('users').insert({ firstName, lastName, npiNumber, businessAddress, telephoneNumber, email })
    db.collection('users').aggregate([ ]).toArray()
      .then(result => {
        db.close();
        res.json(result)
      })
  });
})

app.get('/delete', function (req, res) {
  MongoClient.connect("mongodb://localhost:27017/project1", function (err, db) {
    console.log('connected successfully to server')
    let count = 1
    removeSingleRecord(db, count)
    res.json('record removed')
  });
})

function removeSingleRecord(db, count){
  db.collection('users').aggregate([ { $skip: count}, { $limit: 1} ]).toArray()
    .then((result) => { db.collection('users').remove(result[0]) })
}

module.exports = { mongoRoutes: app }

