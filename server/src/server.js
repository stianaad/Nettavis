//@flow
var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var app = express();
import reload from 'reload';
import path from 'path';

var apiRoutes = express.Router();
app.use(bodyParser.json()); // for å tolke JSON
const public_path = path.join(__dirname, '/../../client/public');

const nyheter = require("../api/Nyheter.js");
const registrer = require("../api/Registrer.js");
const NyhetssakDao = require("../dao/NyhetssakDao.js");

app.use(express.static(public_path));
app.use('/nyheter', nyheter);
app.use('/registrer', registrer);

/*
if (process.env.NODE_ENV !== 'production') {
  let reloadServer = reload(app);
  fs.watch(public_path, () => reloadServer.reload());
}*/


app.listen(8080);/*
export let listen = new Promise<void>((resolve, reject) => {
  app.listen(3000, error => {
    if (error) reject(error.message);
    console.log('Server started');
    resolve();
  });
});
*/



