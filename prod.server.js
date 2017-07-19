var express = require('express')
var axios = require('axios')
var util = require("util")
var config = require('./config')


var app = express()
var apiRoutes = express.Router()

apiRoutes.get('/word', function (req, res) {
  var url = 'http://word.iciba.com'
  axios.get(url, {
    headers: {
      referer: 'word.iciba.com',
      host: 'word.iciba.com',
      Cookie:'_ustat=%7B%22i%22%3A%2212560797%22%2C%22n%22%3A%22275894290%40qq.com%22%2C%22e%22%3A%22275894290%40qq.com%22%2C%22s%22%3A%7B%22u%22%3Atrue%2C%22m%22%3Atrue%2C%22e%22%3Afalse%7D%2C%22t%22%3A1498468157%2C%22sid%22%3A%22127bcb59fae0a17864e9209190c87ebd%22%7D; _last_active=a%3A3%3A%7Bs%3A1%3A%22i%22%3Bs%3A8%3A%2212560797%22%3Bi%3A0%3Bi%3A1498468157%3Bs%3A1%3A%22u%22%3Bs%3A14%3A%22word.iciba.com%22%3B%7D; PHPSESSID=3t6fq0hvs4c9o26n7chmntbik6'
    },
    params: req.query
  }).then((response) => {
    res.send(util.inspect(response,{depth:null}))
  }).catch((e) => {
    console.log(e)
  })
})
app.use('/api', apiRoutes)

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }

  console.log('app listening at http://localhost:' + port + '\n')
})