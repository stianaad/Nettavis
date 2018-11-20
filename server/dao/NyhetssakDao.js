// @flow

const Dao = require("./dao.js");

module.exports = class NyhetssakDao extends Dao {
  getNyhetssakViktighet1(sakNrStart: number,callback: (status: string, data: string) => void){
      super.query(
          `SELECT sakID,overskrift,antallLikes,bildelink,kategoriNavn FROM nyhetssak WHERE viktighet=1 ORDER BY antallLikes DESC,sakID DESC LIMIT ${sakNrStart},9`,
          [],
          callback
      );
  }

  getAntSakerFramside(callback: (status: string, data: string) => void){
    super.query(
      "SELECT COUNT(sakID) AS antall FROM nyhetssak WHERE viktighet=1",
      [],
      callback
    )
  };

  getAntSakerKategori(kategoriNavn: string,callback: (status: string, data: string) => void){
    super.query(
      "SELECT COUNT(sakID) AS antall FROM nyhetssak WHERE kategoriNavn=?",
      [kategoriNavn],
      callback
    )
  };

  getAlleNyhetssaker(callback: (status: string, data: string) => void){
    super.query(
      "SELECT sakID,overskrift,kategoriNavn FROM nyhetssak ORDER BY overskrift",
      [],
      callback
    );
  }

  filtrertPaaKategoriOgOverskrift(kategoriNavn: string,sokeOrd: string, callback: (status: string, data: string) => void){
    super.query(
      "SELECT sakID, overskrift FROM nyhetssak WHERE kategoriNavn=? AND overskrift LIKE ?",
      [kategoriNavn,sokeOrd+'%'],
      callback
    )
  }

  getNyhetssakerGittKategori(sakNrStart: number,kategoriNavn: string,callback: (status: string, data: string) => void){
      super.query(
          `SELECT sakID,overskrift,antallLikes, bildelink,kategoriNavn FROM nyhetssak WHERE kategoriNavn=? ORDER BY antallLikes DESC,sakID DESC LIMIT ${sakNrStart},9`,
          [kategoriNavn],
          callback
      );
  }

  getAlleKategorier(callback: (status: string, data: string) => void){
    super.query(
      "SELECT navn FROM kategori",
      [],
      callback
    );
  }

  /*getNyesteNyhetssaker(callback){
      super.query(
          "SELECT overskrift, tidspunkt FROM nyhetssak ORDER BY tidspunkt DESC LIMIT 2",
          [],
          callback
      );
  }*/

  getsakID(sakID: number, callback: (status: string, data: string) => void){
      super.query(
          "SELECT sakID,overskrift, innhold,DATE_FORMAT(tidspunkt, '%Y-%m-%d %H:%i') AS tidspunkt,antallLikes,bildelink,kategoriNavn,viktighet FROM nyhetssak WHERE sakID=?",
          [sakID],
          callback
      );
  }

  oppdaterLikes(json: Object, sakID: number, callback: (status: string, data: string) => void){
    const oppdater = [json.antallLikes, sakID];
    super.query(
      "UPDATE nyhetssak SET antallLikes=? WHERE sakID=?",
      oppdater,
      callback
    );
  }

  opprettNyhetssak(json: Object, callback: (status: string, data: string) => void){
      let sak = [json.overskrift, json.innhold, json.bildelink,json.viktighet, json.kategoriNavn];
      console.log("sak", sak);
      super.query(
          "INSERT INTO nyhetssak VALUES(DEFAULT,?,DEFAULT,?,?,?,0,?)",
          sak,
          callback
      );
  }

  opprettKommentar(json: Object, callback: (status: string, data: string) => void){
    let kommentar = [json.kommentarNavn, json.innhold, json.nyhetssakID];
    console.log("kommentar", kommentar);
    super.query(
      "INSERT INTO kommentarFelt VALUES(DEFAULT,?,?,?,DEFAULT,0)",
      kommentar,
      callback
    );
  }

  getKommentarerGittSak(sakID: number,sorterEtterKolonne: string, sorteringsRekkefolge: string, callback: (status: string, data: string) => void){
    console.log("sakID",sakID);
    super.query(
      `SELECT kommentarID,kommentarNavn,innhold,DATE_FORMAT(tidspunkt, '%Y-%m-%d %H:%i') AS tidspunkt,antallLikesKommentar FROM kommentarFelt WHERE nyhetssakID=? ORDER BY ${sorterEtterKolonne} ${sorteringsRekkefolge}`,
      [sakID],
      callback
    )
  }

  oppdaterLikesKommentar(json: Object, kommentarID: number, callback: (status: string, data: string) => void){
    const oppdater = [json.antallLikesKommentar, kommentarID];
    super.query(
      "UPDATE kommentarFelt SET antallLikesKommentar=? WHERE kommentarID=?",
      oppdater,
      callback
    );
  }

  oppdaterNyhetssak(json: Object,sakID: number, callback: (status: string, data: string) => void){
      const oppdatering = [json.overskrift, json.innhold, json.bildelink,json.viktighet, json.kategoriNavn,sakID];
      super.query(
          "UPDATE nyhetssak SET overskrift=?,innhold=?,bildelink=?,viktighet=?,kategoriNavn=? WHERE sakID=?",
          oppdatering,
          callback
      );
  }

  slettNyhetssak(sakID: number, callback: (status: string, data: string) => void){
      super.query(
          "DELETE FROM nyhetssak WHERE sakID=?",
          [sakID],
          callback
      );
  }

  filtrerNyhetssaker(overskrift: string,callback: (status: string, data: string) => void){
    console.log(overskrift);
    super.query(
      "SELECT sakID, overskrift FROM nyhetssak WHERE overskrift LIKE ?",
      [overskrift+'%'],
      callback
    )
  }

  getLiveFeed(callback: (status: string, data: string) => void){
    super.query(
      `SELECT sakID,overskrift,kategoriNavn, DATE_FORMAT(tidspunkt, '%Y-%m-%d %H:%i') AS tidspunkt FROM nyhetssak ORDER BY sakID DESC LIMIT 0,5`,
      [],
      callback
    )
  }
};