// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

export class Sak {
  sakID: number;
  overskrift: string;
  bildelink: string;
  innhold: string;
  tidspunkt: string;
  antallLikes: number;
  kategoriNavn: string;
  viktighet: number;
}

export class OpprettSak {
  overskrift: string;
  bildelink: string;
  innhold: string;
  kategoriNavn: string;
  viktighet: number;
}

class Kommentarer{
  kommentarID: number;
  kommentarNavn: string;
  innhold: string;
  tidspunkt: string;
  antallLikesKommentar: number;
}
export class OpprettKommentarer{
  kommentarNavn: string;
  innhold: string;
  nyhetssakID: number;
}

class Kategorier{
  navn: string;
}

class Antall{
  antall: number;
}

class SakService {
  getNyheter(sakNrStart: number): Promise<Sak[]> {
    return axios.get('/nyheter/side/'+sakNrStart);
  }

  getAntSaker(): Promise<Antall[]>{
    return axios.get('/nyheter/antallSaker');
  }

  getAntSakerKategori(kategoriNavn: string): Promise<Antall[]>{
    return axios.get('/nyheter/antallSaker/'+kategoriNavn);
  }

  getNyeste(): Promise<Sak[]>{
    return axios.get('/nyheter/nyeste');
  }

  getNyhetssakerGittKategori(kategori: string,sakNrStart: number): Promise<Sak[]>{
    return axios.get('/nyheter/gittKategori/'+kategori+'/'+sakNrStart);
  }

  getSakID(sakID: number): Promise<Sak[]>{
    return axios.get('/nyheter/kategori/'+sakID);
  }

  opprettNyhetssak(opprettSak: OpprettSak): Promise<void>{
    return axios.post('/registrer',opprettSak);
  }

  getKommentarerGittSak(sakID: number,sorterEtterKolonne: string,sorteringsRekkefolge: string): Promise<Kommentarer[]>{
    return axios.get('/nyheter/kommentarer/'+sakID+'/'+sorterEtterKolonne+'/'+sorteringsRekkefolge);
  }

  getAlleNyhetssaker(): Promise<Sak[]>{
    return axios.get('/registrer');
  }

  leggTilKommentar(opprettKommentar: OpprettKommentarer): Promise<void>{
    return axios.post('/nyheter/opprettKommentar/sak',opprettKommentar);
  }

  oppdaterLikes(sakID: number,likes: number): Promise<void>{
    return axios.put('/nyheter/likes/'+sakID,{antallLikes: likes});
  }

  oppdaterLikesKommentar(sakID: number,kommentarID: number,likes: number): Promise<void>{
    return axios.put('/nyheter/likes/'+sakID+'/'+kommentarID,{antallLikesKommentar: likes});
  }

  oppdaterNyhetssak(sakID: number,sak: Sak): Promise<void>{
    return axios.put('/registrer/'+sakID,sak);
  }

  slettNyhetssak(sakID: number):Promise<void>{
    return axios.delete('/registrer/'+sakID);
  }

  filtrerNyhetssaker(sakNavn: string): Promise<Sak[]>{
    return axios.get('/registrer/filtrer/'+sakNavn);
  }

  filtrerPaaKategoriOgOverskrift(kategori: string,sokeOrd: string): Promise<Sak[]>{
    return axios.get('/registrer/filtrer/'+kategori+'/'+sokeOrd);
  }

  getLiveFeed(): Promise<Sak[]>{
    return axios.get('/nyheter/liveFeed/');
  }

}

class KategoriService{
  getAlleKategorier(): Promise<Kategorier[]>{
    return axios.get('/nyheter/kategorier');
  }
}

export let sakService = new SakService();
export let kategoriService = new KategoriService();