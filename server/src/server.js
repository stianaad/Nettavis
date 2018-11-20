//@flow
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
import path from 'path';
app.use(bodyParser.json()); // for å tolke JSON
const public_path = path.join(__dirname, '/../../client/public');

const nyheter = require("../api/Nyheter.js");
const registrer = require("../api/Registrer.js");

app.use(express.static(public_path));
app.use('/nyheter', nyheter);
app.use('/registrer', registrer);

app.listen(8080);




