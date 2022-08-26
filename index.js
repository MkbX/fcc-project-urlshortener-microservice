require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const url = require('url');
const dns = require('dns');
const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static(`${process.cwd()}/public`));

//pseudo "map-database"
let index = 0;
let database = new Map();
database.set("https://freecodecamp.org", index);

//main endpoint
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//post handler
app.post('/api/shorturl', function(req, res) {
  console.log(req.body.url);
  const urlString = req.body.url.toString();
  console.log('reqBodyStr',urlString);
  const hostname1 = url.parse(urlString,true);
  console.log('urlParse',hostname1);
  let hostname = hostname1.hostname;
  if(hostname == null) {
    hostname = "errorNull";
  }
  console.log("hst",hostname);
  dns.lookup(hostname, (err, address, family) =>{
    if(hostname === "errorNull" || err) {
      res.json({ error: 'invalid url' });
      console.log(err);
    } else {
      console.log(err, 'address: %j family: IPv%s', address, family);
      console.log('map',database);
      if(database.has(urlString) === false) {
        index++;
        database.set(urlString, index);
      }
      console.log('databaseStr',database.get(urlString));
    res.json({ original_url : urlString, short_url : database.get(urlString) });
   }
    
  });
  
});

//redirection
app.get("/api/shorturl/:key", function(req, res) {
  database.forEach(function(value, key) {
    console.log(req.params.key);
    console.log(database);
    console.log(key,value);
    if(value == req.params.key) {
      res.redirect(301,key);
    }
  });


});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
