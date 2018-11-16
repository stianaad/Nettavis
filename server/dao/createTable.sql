DROP TABLE IF EXISTS kategori;
DROP TABLE IF EXISTS nyhetssak;
DROP TABLE IF EXISTS kommentarFelt;


CREATE TABLE kategori(
  navn VARCHAR(35),
  CONSTRAINT kategori_pk PRIMARY KEY (navn)
);


CREATE TABLE nyhetssak(
  sakID INTEGER AUTO_INCREMENT,
  overskrift VARCHAR(45),
  tidspunkt DATETIME NOT NULL CURRENT_TIMESTAMP,
  innhold TEXT NOT NULL,
  bildelink TINYTEXT,
  viktighet TINYINT NOT NULL,
  antallLikes INTEGER
  kategoriNavn VARCHAR(35) NOT NULL,
  CONSTRAINT nyhetssak_pk PRIMARY KEY (sakID),
  CONSTRAINT nyhetssak_fk1 FOREIGN KEY (kategoriNavn) REFERENCES kategori(navn)
);

CREATE TABLE kommentarFelt (
    kommentarID INTEGER AUTO_INCREMENT,
    kommentarNavn VARCHAR(30) NOT NULL,
    innhold TEXT NOT NULL,
    nyhetssakID INTEGER,
    tidspunkt DATETIME NOT NULL,
    CONSTRAINT kommentarFelt_pk PRIMARY KEY(kommentarID),
    CONSTRAINT kommentarFelt_fk1 FOREIGN KEY(nyhetssakID) REFERENCES nyhetssak(sakID)
)