const express = require('express')
const port = 6789
let { postgresRoutes } = require('./routes/postgres.js');

let app = express();
app.listen(port);
console.log('app listening on port ' + port)

app.get('/', function(req, res){
  res.redirect('/postgres/users');
})
app.use('/postgres', postgresRoutes);

module.exports = app
