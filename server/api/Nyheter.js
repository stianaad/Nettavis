//@flow
const express = require('express');
const router = express.Router();
var mysql = require("mysql");
var bodyParser = require("body-parser");
const NyhetssakDao = require("../dao/NyhetssakDao.js");

type Request = express$Request;
type Response = express$Response;


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

router.post("/opprettKommentar/sak", (req : Request, res: Response) => {
  console.log("Fikk POST-request fra klienten");
  nyhetssakDao.opprettKommentar(req.body, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.put("/likes/:sakID", (req : Request, res: Response) => {
  console.log(" /nyheter/likes/:sakID fikk PUT-request fra klienten");
  nyhetssakDao.oppdaterLikes(req.body, req.params.sakID, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.put("/likes/:sakID/:kommentarID", (req : Request, res: Response) => {
  console.log(" /nyheter/likes/:sakID/:kommentarID fikk PUT-request fra klienten");
  nyhetssakDao.oppdaterLikesKommentar(req.body, req.params.kommentarID, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get("/kommentarer/:sakID/:sorterEtterKolonne/:sorteringsRekkefolge",(req : Request, res: Response) => {
  console.log("/nyheter/kommentarer/:sakID/:sorteringsrekkefolge fikk request fra klient");
  nyhetssakDao.getKommentarerGittSak(req.params.sakID,req.params.sorterEtterKolonne,req.params.sorteringsRekkefolge,(status,data) => {
    res.status(status);
    res.json(data);
  });
});

router.get("/side/:sakNrStart",(req : Request, res: Response) => {
    console.log("/nyheter/side/sakNrStart: fikk request fra klient");
    nyhetssakDao.getNyhetssakViktighet1(req.params.sakNrStart,(status,data) => {
        res.status(status);
        res.json(data);
    });
});

router.get("/antallSaker",(req : Request, res: Response) => {
  console.log("/antallSaker: fikk request fra klient");
  nyhetssakDao.getAntSaker((status,data) => {
    res.status(status);
    res.json(data);
  });
});

//trur ikkje eg bruke dinna
router.get("/nyeste", (req : Request, res: Response) => { // denne skal vises på nyhetsfeeden
  console.log("/nyeste: fikk request fra klient");
  nyhetssakDao.getNyesteNyhetssaker((status,data) => {
    res.status(status);
    res.json(data);
  });
});
router.get("/gittKategori/:kategori", (req : Request, res: Response) => {
  console.log("/kategori/:kategori: fikk request fra kleint");
  console.log(req.params.kategori);
  nyhetssakDao.getNyhetssakerGittKategori(req.params.kategori, (status, data) => {
    res.status(status);
    res.json(data);
  });
});

router.get("/kategori/:sakID", (req : Request, res: Response) => {
    console.log("/kategori/:sakID: fikk request fra klient");
    console.log(req.params);
    nyhetssakDao.getsakID(req.params.sakID, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

router.get("/kategorier", (req : Request, res: Response) => {
  console.log("/kategori fikk request fra klient");
  nyhetssakDao.getAlleKategorier((status,data) => {
    res.status(status);
    res.json(data);
  })
});

router.get("/liveFeed",(req : Request, res: Response) => {
  console.log("/liveFeed/:nr fikk request fra klient");
  console.log(req.params.nr);
  nyhetssakDao.getLiveFeed((status,data) => {
    res.status(status);
    res.json(data);
  })
});

module.exports = router;