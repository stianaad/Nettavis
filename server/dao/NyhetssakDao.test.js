var mysql = require("mysql");

const NyhetssakDao = require("./NyhetssakDao.js");
const runsqlfile = require("./runsqlfile.js");

// GitLab CI Pool
var pool = mysql.createPool({
    connectionLimit: 1,
    host: "mysql",
    user: "root",
    password: "root",
    database: "School",
    debug: false,
    multipleStatements: true
});
/*
var ntnuPool = mysql.createPool({
  connectionLimit: 1,
  host: "mysql.stud.iie.ntnu.no",
  user: "stianaad",
  password: "at5lTFrZ",
  database: "stianaad",
  debug: false,
  multipleStatements: true
});*/

let nyhetssakDao = new NyhetssakDao(pool);
//let ntnuNyhetssakDao = new NyhetssakDao(ntnuPool);

beforeAll(done => {
    runsqlfile("dao/createTable.sql", pool, () => {
        runsqlfile("dao/createTestdata.sql",pool,done);
    });
});

afterAll(() => {
    pool.end();
});

test("Få ein sak med id frå db", done => {
    function callback(status, data){
        console.log(
            "Test callback: status " + status + ", data= "+ JSON.stringify(data)
        );
        expect(data.length).toBe(1);
        expect(data[0].overskrift).toBe("FIFA er korrupt");
        done();
    }
    nyhetssakDao.getsakID(3, callback);
});

test("Opprett ein nyhetssak", done => {
    function callback(status, data){
        console.log(
            "Test callback: status " + status + ", data= "+ JSON.stringify(data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }

    nyhetssakDao.opprettNyhetssak(
        {overskrift: "Mourinho sparket", innhold: "Etter at United ikkje klarte å vinne mot Chelsea så endte det med at Mourinho fekk sparken", bildelink: "https://c.ndtvimg.com/2018-09/rop4uba8_jose-mourinho-afp_625x300_22_September_18.jpg", viktighet: 2, kategoriNavn: "Sport"},
        callback
    );
});

test("oppdater ein nyhetssak", done => {
    function callback(status, data){
        console.log(
            "Test callback: status " + status + ", data= "+ JSON.stringify(data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }

    nyhetssakDao.oppdaterNyhetssak(
        {overskrift: "Mourinho beholdt jobben", innhold: "United vant", bildelink: "https://d3j2s6hdd6a7rg.cloudfront.net/v2/uploads/media/default/0001/66/thumb_65953_default_news_size_5.jpeg", viktighet: 2, kategoriNavn: "Sport"},
        5,
        callback
    );
});

test("Oppdater likes", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }

  nyhetssakDao.oppdaterLikes({antallLikes: 3},4,
    callback
  );
});

test("Slett ein nyhetssak", done => { // MÅ kanskje fikse sånn at endepunktet ikkej er en variabel
    function callback(status, data){
        console.log(
            "Test callback: status " + status + ", data= "+ JSON.stringify(data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }

    nyhetssakDao.slettNyhetssak(
        5,
        callback
    );
});

test("Hent nyhetssaker med viktighet 1", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.length).toBe(2);
    expect(data[0].overskrift).toBe("Norge leder");
    expect(data[1].overskrift).toBe("Apple lanserer ny Iphone");
    done();
  }

  nyhetssakDao.getNyhetssakViktighet1(0,
    callback
  );
});

test("Hent alle nyhetssaker", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.length).toBe(4);
    /*expect(data[0].overskrift).toBe("Android tatt for juks");
    expect(data[1].overskrift).toBe("Apple lanserer ny Iphone");
    expect(data[2].overskrift).toBe("FIFA er korrupt");
    expect(data[3].overskrift).toBe("Norge leder");*/
    done();
  }

  nyhetssakDao.getAlleNyhetssaker(
    callback
  );
});

test("Hent alle nyhetssaker innen en gitt kategori", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.length).toBe(2);
    expect(data[0].overskrift).toBe("Android tatt for juks");
    expect(data[1].overskrift).toBe("Apple lanserer ny Iphone");
    done();
  }

  nyhetssakDao.getNyhetssakerGittKategori("Tech",
    callback
  );
});

test("Hent alle kategorier", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.length).toBe(3);
    expect(data[0].navn).toBe("Kultur");
    expect(data[1].navn).toBe("Sport");
    expect(data[2].navn).toBe("Tech");
    done();
  }

  nyhetssakDao.getAlleKategorier(
    callback
  );
});

test("Opprett ein kommentar", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.affectedRows).toBe(1);
    done();
  }

  nyhetssakDao.opprettKommentar({kommentarNavn: "Stian",innhold: "Dette er ein test",nyhetssakID: 1},
    callback
  );
});

test("Få kommentarer gitt sakID", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.length).toBe(2);
    expect(data[1].kommentarNavn).toBe("Stian");
    done();
  }

  nyhetssakDao.getKommentarerGittSak(1,"kommentarID","asc",
    callback
  );
});

test("Søk etter nyhetssaker", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe("FIFA er korrupt");
    done();
  }

  nyhetssakDao.filtrerNyhetssaker("FIFA",
    callback
  );
});

test("Hent livefeed", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.length).toBe(4);
    expect(data[0].overskrift).toBe("Android tatt for juks");
    expect(data[1].overskrift).toBe("FIFA er korrupt");
    expect(data[2].overskrift).toBe("Apple lanserer ny Iphone");
    expect(data[3].overskrift).toBe("Norge leder");
    done();
  }

  nyhetssakDao.getLiveFeed(
    callback
  );
});

















