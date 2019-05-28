const express = require('express')
const port = 6789

let { postgresRoutes } = require('./routes/postgres.js');
let { mongoRoutes } = require('./routes/mongo.js');

let app = express();

app.listen(port)
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

console.log('app listening on port ' + port)

app.get('/', function(req, res){
  res.redirect('/postgres/users');
})
app.use('/postgres', postgresRoutes);
app.use('/mongo', mongoRoutes);

module.exports = app
