const express = require('express');
const router = express.Router();
var mysql = require("mysql");
var bodyParser = require("body-parser");
var atob = require('atob');
var btoa = require('btoa');

type Request = express$Request;
type Response = express$Response;

const NyhetssakDao = require("../dao/NyhetssakDao.js");

var pool = mysql.createPool({
    connectionLimit: 5,
    host: "mysql.stud.iie.ntnu.no",
    user: "stianaad",
    password: "at5lTFrZ",
    database: "stianaad",
    debug: false,
    multipleStatements: true
});

let nyhetssakDao = new NyhetssakDao(pool);

router.get("/",(req : Request, res: Response) => {
  console.log("/registrer/ fikk request fra klient");
  nyhetssakDao.getAlleNyhetssaker((status,data) => {
    res.status(status);
    res.json(data);
  });
});

router.get("/filtrer/:kategoriNavn/:sokeOrd",(req : Request, res: Response) => {
  console.log("/registrer/ fikk request fra klient");
  nyhetssakDao.filtrertPaaKategoriOgOverskrift(req.params.kategoriNavn,req.params.sokeOrd,(status,data) => {
    res.status(status);
    res.json(data);
  });
});

router.post("/", (req: Request,res: Response) => {
    console.log("Fikk POST-request fra kleinten");
    nyhetssakDao.opprettNyhetssak(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

router.put("/:sakID", (req: Request,res: Response) => {
    console.log("Fikk put request fra klienten");
    nyhetssakDao.oppdaterNyhetssak(req.body, req.params.sakID, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

router.delete("/:sakID", (req: Request,res: Response) => {
    console.log("Fikk slettet en sak");
    nyhetssakDao.slettNyhetssak(req.params.sakID, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

router.get("/filtrer/:sok", (req: Request,res: Response) => { //bruke dette til å søke på nyhetssaker,// og må filtrere ut dei nyhetssakene eg skal ha
  console.log("/filtrer/:sok fikk get request fra klienten");
  nyhetssakDao.filtrerNyhetssaker(req.params.sok, (status, data) => {// må ha på % for å kunne filtrere ut i mysql
    res.status(status);
    res.json(data);
  });
});
/*
function b64EncodeUnicode(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
}

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}*/
/*
router.post("/test/html", (req: Request,res: Response) => {
  console.log("Fikk POST-request fra kleinten");
  var bin = "Hello";
  var b64 = btoa(bin);
  var hei = "SGVsbG8sIFdvcmxkIQ==";
  var bin = atob(b64);
  /*nyhetssakDao.leggTilHtml(tekst, (status, data) => {
    res.status(status);
    res.json(data);
  });*/
//});

module.exports = router;