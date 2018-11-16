// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

class Sak {
  sakID: number;
  overskrift: string;
  bildelink: string;
  innhold: string;
  tidspunkt: string;
  antallLikes: number;
  kategoriNavn: string;
  viktighet: number;
}

class OpprettSak {
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
class OpprettKommentarer{
  kommentarNavn: string;
  innhold: string;
  nyhetssakID: number;
}

class Kategorier{
  navn: string;
}

class SakService {
  getNyheter(): Promise<Sak[]> {
    return axios.get('/nyheter/');
  }

  getNyeste(): Promise<Sak[]>{
    return axios.get('/nyheter/nyeste');
  }

  getNyhetssakerGittKategori(kategori: string): Promise<Sak[]>{
    return axios.get('/nyheter/gittKategori/'+kategori);
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

  oppdaterNyhetssak(sakID: number,opprettSak: OpprettSak): Promise<void>{
    return axios.put('/registrer/'+sakID,opprettSak);
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

  getLiveFeed(nr: number): Promise<Sak[]>{
    return axios.get('/nyheter/liveFeed/'+nr);
  }
}

class KategoriService{
  getAlleKategorier(): Promise<Kategorier[]>{
    return axios.get('/nyheter/kategorier');
  }
}

export let sakService = new SakService();
export let kategoriService = new KategoriService();