var mysql = require("mysql");

const NyhetssakDao = require("./NyhetssakDao.js");
const runsqlfile = require("./runsqlfile.js");

// GitLab CI Pool
var pool = mysql.createPool({
    connectionLimit: 1,
    host: "mysql.stud.iie.ntnu.no",
    user: "stianaad",
    password: "at5lTFrZ",
    database: "stianaad",
    debug: false,
    multipleStatements: true
});

let nyhetssakDao = new NyhetssakDao(pool);

/*
beforeAll(done => {
    runsqlfile("dao/createTable.sql", pool, () => {
        runsqlfile("dao/createTestdata.sql",pool,done);
    });
});*/

afterAll(() => {
    pool.end();
});

test("Få ein sak med id frå db", done => {
    function callback(status, data){
        console.log(
            "Test callback: status " + status + ", data= "+ JSON.stringify(data)
        );
        expect(data.length).toBe(1);
        expect(data[0].overskrift).toBe("Norge vant");
        done();
    }

    nyhetssakDao.getsakID(1, callback);
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
        {overskrift: "Mourinho sparket", innhold: "Etter at United ikkje klarte å vinne mot Chelsea så endte det med at Mourinho fekk sparken", bildelink: "https://c.ndtvimg.com/2018-09/rop4uba8_jose-mourinho-afp_625x300_22_September_18.jpg", viktighet: 1, kategoriNavn: "Sport"},
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
        {overskrift: "Liverpool vant", innhold: "LFC vant", bildelink: "https://d3j2s6hdd6a7rg.cloudfront.net/v2/uploads/media/default/0001/66/thumb_65953_default_news_size_5.jpeg", viktighet: 2, kategoriNavn: "Sport"},
        16,
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

  nyhetssakDao.oppdaterLikes({antallLikes: 3},16,
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
        23,
        callback
    );
});

/*test("Hent nyhetssaker med viktighet 2", done => {
    function callback(status, data){
        console.log(
            "Test callback: status " + status + ", data= "+ JSON.stringify(data)
        );
        expect(data.length).toBe(1);
        expect(data[0].overskrift).toBe("FIFA er korrupt");
        done();
    }

    nyhetssakDao.getNyhetssakViktighet2(
        "Sport",
        callback
    );
});*/ // venter litt med dinna

test("Hent nyhetssaker med viktighet 1", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThanOrEqual(3);
    expect(data[0].overskrift).toBe("FIFA er korrupt"); // disse vil forandre seg hele tiden når folk like saker
    expect(data[1].overskrift).toBe("Kultur er kjekt");
    expect(data[2].overskrift).toBe("Norge vant");
    done();
  }

  nyhetssakDao.getNyhetssakViktighet1(
    callback
  );
});

test("Hent alle nyhetssaker", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThanOrEqual(9); // det var 9 nyhetssaker da denne testen ble utført, og dermed har eg brukt at det skal vær lik 9 elle meir visst testane blir køyrt seinare
    expect(data[0].overskrift).toBe("Apple lanserer ny Iphone"); // desse vil forandre seg hele tida når det blir lagt til nnye saker
    expect(data[1].overskrift).toBe("FIFA er korrupt");
    expect(data[2].overskrift).toBe("Kultur er kjekt");
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
    expect(data.length).toBeGreaterThanOrEqual(3); // det var 3 nyhetssaker da denne testen ble utført, og dermed har eg brukt at det skal vær lik 9 elle meir visst testane blir køyrt seinare
    expect(data[0].overskrift).toBe("Kultur er kjekt");
    expect(data[1].overskrift).toBe("Nordmenn er født med ski på bena");
    expect(data[2].overskrift).toBe("Kultur er viktig i hele verden");
    done();
  }

  nyhetssakDao.getNyhetssakerGittKategori("Kultur",
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

  nyhetssakDao.opprettKommentar({kommentarNavn: "Stian",innhold: "Dette er ein test",nyhetssakID: 10},
    callback
  );
});

test("Få kommentarer gitt sakID", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThanOrEqual(4);
    expect(data[3].kommentarNavn).toBe("Stian");
    done();
  }

  nyhetssakDao.getKommentarerGittSak(10,"kommentarID","asc",
    callback
  );
});

test("Søk etter nyhetssaker", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.length).toBeGreaterThanOrEqual(2);
    expect(data[0].overskrift).toBe("Kultur er kjekt");
    expect(data[1].overskrift).toBe("Kultur er viktig i hele verden");
    done();
  }

  nyhetssakDao.filtrerNyhetssaker("Kultur",
    callback
  );
});

test("Hent livefeed", done => {
  function callback(status, data){
    console.log(
      "Test callback: status " + status + ", data= "+ JSON.stringify(data)
    );
    expect(data.length).toBe(5); // vil alltid hente ut dei fem nyaste sakene
    expect(data[0].overskrift).toBe("Mourinho sparket");
    expect(data[1].overskrift).toBe("test");
    expect(data[2].overskrift).toBe("Pizza er godt");
    done();
  }

  nyhetssakDao.getLiveFeed(0,
    callback
  );
});

















