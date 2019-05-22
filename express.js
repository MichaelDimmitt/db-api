const app = require('express')()
const port = 6789

app.listen(port);
console.log('app listening on port ' + port)

app.get('/', function(req, res){
  res.json('works')
})
