var http = require('http');
var https = require('https');
var url = require('url');
var cors = require('cors');

var configFile = require('./serverConfig.json');

var hostname = configFile.hostname;
var port = configFile.port;


//create a server object:
http.createServer(function (r, res) {

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization",
      //"Access-Control-Allow-Methods": "OPTIONS, POST, GET",
      //"Access-Control-Max-Age": 2592000, // 30 days
      'Content-Type': 'text/html',
      /** add other headers as per requirement */
    };

    res.writeHead(200, headers);

    // To handle CORS and avoid error where authorization header is null.
    if (r.method === 'OPTIONS') {
        res.end();
        return;
    }

    var q = url.parse(r.url, true).query;
    var txt = "Amount: " + q.amount + ", from: " + q.from + ", to: " + q.to;
    console.log(r.headers['authorization']);

    const data = JSON.stringify({
      "receiver": q.to,
      "source_amount": q.amount
    })

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
        res.writeHead(200, headers)
        res.write(d)
        process.stdout.write(d)
        res.end(txt); //end the response
      })
    })

    req.on('error', error => {
      h2 = headers;
      h2.error = "Internal Server Error"
      res.writeHead(500, h2)
      console.error(error)
      res.end(txt); //end the response
    })

    req.write(data)
    req.end()

}).listen(8080); //the server object listens on port 8080
