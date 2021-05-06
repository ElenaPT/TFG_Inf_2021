var http = require('http');
var https = require('https');
var url = require('url');

var configFile = require('./serverConfig.json');

var hostname = configFile.hostname;
var port = configFile.port;


//create a server object:
http.createServer(function (r, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var q = url.parse(r.url, true).query;
    var txt = "Amount: " + q.amount + ", from: " + q.from + ", to: " + q.to;

    const data = JSON.stringify({
      "receiver": q.to,
      "source_amount": q.amount
    })

    //console.log(r);

    const options = {
      hostname: hostname,
      port: port,
      path: '/accounts/' + q.from + '/payments',
      method: 'POST',
      headers: {
        'Authorization':  r.headers['authorization'],
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      }
    }

    const req = http.request(options, res2 => {
      console.log(`statusCode: ${res.statusCode}`)

      res2.on('data', d => {
        res.writeHead(200, d)
        process.stdout.write(d)
      })
    })

    req.on('error', error => {
      res.writeHead(500, {'error': 'Internal Server Error'})
      console.error(error)
    })

    req.write(data)
    req.end()

    res.end(txt); //end the response
}).listen(8080); //the server object listens on port 8080
