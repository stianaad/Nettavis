const express = require('express');
const router = express.Router();
var mysql = require("mysql");
var bodyParser = require("body-parser");
var Base64 = require('js-base64').Base64;

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
    req.body.innhold = Base64.encode(req.body.innhold);
    nyhetssakDao.opprettNyhetssak(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

router.put("/:sakID", (req: Request,res: Response) => {
    console.log("Fikk put request fra klienten");
    req.body.innhold = Base64.encode(req.body.innhold);
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


router.post("/test/html", (req: Request,res: Response) => {
  console.log("/test/html fekk request");
  console.log("Fikk POST-request fra kleinten");
  let innhold = Base64.encode(req.body.innhold);  // ZGFua29nYWk=
  console.log(innhold);  // dankogai
  nyhetssakDao.leggTilHtml(innhold, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get("/html/get", (req: Request,res: Response) => { //bruke dette til å søke på nyhetssaker,// og må filtrere ut dei nyhetssakene eg skal ha
  console.log("/html/get fikk get request fra klienten");
  nyhetssakDao.getHtml((status, data) => {// må ha på % for å kunne filtrere ut i mysql
    res.status(status);
    res.json(data);
  });
});

module.exports = router;