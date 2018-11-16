// @flow
/* eslint eqeqeq: "off" */


import * as React from 'react';
import { Component,sharedComponentData } from 'react-simplified';
import { HashRouter, Route, NavLink, Redirect,Switch } from 'react-router-dom';
//import { Container, Row, Col } from 'react-grid-system';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import axios from 'axios';
import { Alert, KategoriVisning, ListGroup, NavBar, Visning, Oppsett,Input,Row,Column,ContainerFluid, Overskrift, ListGroupInline, CheckBox } from './widgets';
import { sakService,kategoriService} from './services';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  kategorier = [];

  //delt = sharedComponentData({kategorier: []});

  render() {
    return (
      <NavBar>
        <NavBar.Brand> Bømlo-nytt</NavBar.Brand>
        <NavBar.LinkLeft to="/nyheter/Sport"> Sport</NavBar.LinkLeft>
        <NavBar.LinkLeft to="/nyheter/Kultur"> Kultur</NavBar.LinkLeft>
        <NavBar.LinkLeft to="/nyheter/Tech"> Tech</NavBar.LinkLeft>
        <NavBar.LinkRight to="/registrer"> Registrer nyhetssak</NavBar.LinkRight>
      </NavBar>
    );
  }

  mounted(){
    kategoriService
      .getAlleKategorier()
      .then(kategori => (this.kategorier = kategori))
      .catch((error: Error) => Alert.danger(error.message))
  }
}

class Footer extends Component{
  render(){
    return(
      <footer>
        <br/>
        <div className={"text-center"}>
          <p><strong>Kontakt meg på Stian@hotmail.com</strong></p>
        </div>
        <br/>
      </footer>
    )
  }
}

class Redirection extends Component{
  render() {
    return(
      <Redirect to="/nyheter"/>
    )
  }
}

class LiveFeed extends Component{
  nyesteSaker = [];
  start = 3;
  interval=null;

  render() {
    return(
      <ContainerFluid>
        <Row>
          <marquee>
            <ListGroupInline>
          {this.nyesteSaker.map(sak =>(
            <ListGroupInline.Item nokkel={sak.sakID} to={"/nyheter/"+sak.kategoriNavn+"/"+sak.sakID}>
              {sak.overskrift}<br></br>
              {sak.tidspunkt}
            </ListGroupInline.Item>
          ))}
            </ListGroupInline>
          </marquee>
        </Row>
      </ContainerFluid>
    )
  }

  mounted() {
    sakService
      .getLiveFeed(this.start)
      .then(sak => (this.nyesteSaker = sak))
      .catch((error: Error) => Alert.danger(error.message));

    /*<ListGroup.Item key={sak.sakID} to={"/nyheter/"+sak.kategoriNavn+"/"+sak.sakID}>*/

    this.interval = setInterval(() => {
      sakService
        .getLiveFeed(this.start)
        .then(sak => (this.nyesteSaker = sak))
        .catch((error: Error) => Alert.danger(error.message));
      this.start = this.start-1;
      if(this.start == 0){
        this.start= 3;
      }
    },10000);
  }

  beforeUnmount(){
    if(this.interval){
      clearInterval(this.interval);
    }
  }

}

class FramsideVisning extends Component{
  alleNyheter = [];
  delt = {nyheter: []};
  antallSakerPrSide = 9;

  sakNrStart = 0;
  sakNrSlutt = this.antallSakerPrSide;

  render() {
    return (
      <div >
        <br></br>
        <LiveFeed/>
        <br></br>
        <Oppsett midtBredde={10} sideBredde={1} >
          <ContainerFluid>
            <Row  styles={{ margin: 'auto', justifyContent: 'center', alignItems: 'flex-start'}}>
              <div className={"card-columns"}>
              {this.delt.nyheter.map(e => (
                  <div className={"card"}>
                  <NavLink key={e.sakID} to={'nyheter/'+e.kategoriNavn+'/'+e.sakID}>
                    <img src={e.bildelink} className={"card-img-top img-fluid"}/>
                    <div className={"card-body"}>
                      <h5 className={"card-title text-center"}>{e.overskrift}</h5>
                    </div>
                  </NavLink>
                  </div>
              ))}
              </div>
            </Row>
          </ContainerFluid>
          <br></br>
          <footer>
            {(this.sakNrStart>0) ? (
              <button type="button" className="float-left" onClick={this.forrigeSide}>
              <span><img src={"http://pluspng.com/img-png/arrow-png-no-background-download-this-image-as-600.png"} width="40" height="40"/></span>
            </button>) : (
              null
              )}
            {(this.sakNrSlutt<this.alleNyheter.length) ? (
              <button type="button" className="float-right" onClick={this.nesteSide}>
                <span><img src="https://www.clipartmax.com/png/middle/2-21171_free-arrow-clipart-no-background-transparent-arrow-right-arrow-transparent-background.png" width="40" height="40"/></span>
            </button>) : (
              null
            )}
          </footer>
        </Oppsett>
      </div>
    );
  }

  nesteSide(){
    this.sakNrStart=this.sakNrStart+this.antallSakerPrSide;
    this.sakNrSlutt = this.sakNrSlutt + this.antallSakerPrSide;
    if(this.sakNrSlutt>this.alleNyheter.length){
      this.sakNrSlutt = this.alleNyheter.length;
    }
    this.delt.nyheter = this.alleNyheter.slice(this.sakNrStart,this.sakNrSlutt);
  }

  forrigeSide(){
    console.log(this.sakNrSlutt);
    this.sakNrStart = this.sakNrStart - this.antallSakerPrSide;
    if(this.sakNrSlutt === this.alleNyheter.length){
      this.sakNrSlutt = this.sakNrSlutt - (this.sakNrSlutt%this.antallSakerPrSide);
      console.log(this.sakNrSlutt);
      console.log(this.sakNrStart);
    } else {
      this.sakNrSlutt = this.sakNrSlutt - this.antallSakerPrSide;
      console.log(this.sakNrStart);
      console.log(this.sakNrSlutt);
    }
    this.delt.nyheter = this.alleNyheter.slice(this.sakNrStart,this.sakNrSlutt);
  }

  mounted(){
    sakService
      .getNyheter()
      .then(nyheter => {
        this.alleNyheter = nyheter;
        this.delt.nyheter = this.alleNyheter.slice(0,this.antallSakerPrSide);
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class Kategori extends Component<{match: { params: { kategorinavn: string }}}>{
  alleNyhetssakerGittKategori = [];
  delt = {kategori: []};

  antallSakerPrSide = 3;

  sakNrStart = 0;
  sakNrSlutt = this.antallSakerPrSide;

  render() {
    return (
      <div>
        <br></br>
        <h1 className="text-center">{this.props.match.params.kategorinavn}</h1>
        <br></br>
        <Oppsett midtBredde={8} sideBredde={2} >
          <ContainerFluid>
            <Row  styles={{maxWidth: 1200, margin: 'auto', justifyContent: 'center', alignItems: 'flex-start'}}>
              <div className={"card-columns"}>
                {this.delt.kategori.map(e => (
                  <div className={"card"}>
                    <NavLink key={e.sakID} exact to={'/nyheter/'+e.kategoriNavn+'/'+e.sakID}>
                      <img src={e.bildelink} className={"card-img-top img-fluid"}/>
                      <div className={"card-body"}>
                        <h5 className={"card-title text-center"}>{e.overskrift}</h5>
                      </div>
                    </NavLink>
                  </div>
                ))}
              </div>
            </Row>
          </ContainerFluid>
          <br></br>
          <footer>
            {(this.sakNrStart>0) ? (
              <button type="button" className="float-left" onClick={this.forrigeSide}>
                forrige side
              </button>) : (
              null
            )}
            {(this.sakNrSlutt<this.alleNyhetssakerGittKategori.length) ? (
              <button type="button" className="float-right" onClick={this.nesteSide}>
                neste side <span><img src="https://banner2.kisspng.com/20180407/ayq/kisspng-triangle-monochrome-black-and-white-right-arrow-5ac977e966cfc2.8899314915231528734211.jpg" width="40" height="40"/></span>
              </button>) : (
              null
            )}
          </footer>
        </Oppsett>
      </div>
    );
  }

  nesteSide(){
    this.sakNrStart=this.sakNrStart+this.antallSakerPrSide;
    this.sakNrSlutt = this.sakNrSlutt + this.antallSakerPrSide;
    if(this.sakNrSlutt>this.alleNyhetssakerGittKategori.length){
      this.sakNrSlutt = this.alleNyhetssakerGittKategori.length;
    }
    this.delt.kategori = this.alleNyhetssakerGittKategori.slice(this.sakNrStart,this.sakNrSlutt);
  }

  forrigeSide(){
    console.log(this.sakNrSlutt);
    this.sakNrStart = this.sakNrStart - this.antallSakerPrSide;
    if(this.sakNrSlutt === this.alleNyhetssakerGittKategori.length){
      this.sakNrSlutt = this.sakNrSlutt - (this.sakNrSlutt%this.antallSakerPrSide);
      console.log(this.sakNrSlutt);
      console.log(this.sakNrStart);
    } else {
      this.sakNrSlutt = this.sakNrSlutt - this.antallSakerPrSide;
      console.log(this.sakNrStart);
      console.log(this.sakNrSlutt);
    }
    this.delt.kategori = this.alleNyhetssakerGittKategori.slice(this.sakNrStart,this.sakNrSlutt);
  }

  mounted(){
    sakService
      .getNyhetssakerGittKategori(this.props.match.params.kategorinavn)
      .then(kat => {
        this.delt.kategori = kat.slice(this.sakNrStart,this.sakNrSlutt);
        this.alleNyhetssakerGittKategori = kat;
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class Nyhetsside extends Component<{match: { params: { sakID: number }}}>{
  delt ={kommentarer: [],antKommentarer: "kommentar", sak: {
      sakID: this.props.match.params.sakID,
      overskrift: "",
      bildelink: "",
      innhold: "",
      tidspunkt: "",
      antallLikes: 0,
      kategoriNavn: "",
      viktighet: 1
    }};

  antKommentarerLastetInn = 5;
  alleKommentarer = [];
  aktivDropDownList = true;

  kommentar = {
    kommentarNavn: '',
    innhold: '',
    nyhetssakID: this.props.match.params.sakID
  };

  buttonColor = "btn btn-default btn-sm";
  sorteringsRekkefolge= "desc";
  sorterEtterKolonne="kommentarID";

  render(){
    if(!this.delt.sak) return null;
    return(
      <div>
        <Oppsett sideBredde={1} midtBredde={10}>
          <div>
          <br></br>
          <div>
            <div className="text-center">
            <Overskrift>{this.delt.sak.overskrift}</Overskrift>
            <br></br>
            <img src={this.delt.sak.bildelink} className="mx-auto d-block img-fluid w-50 card-img-top" />
            <p><i>Nyhetsartikkelen ble opprettet {this.delt.sak.tidspunkt}</i></p>
              <div>
                <p>Denne artikkelen har {this.delt.sak.antallLikes} likes {'  '}
                <button type="button" className={this.buttonColor} onClick={this.skiftFarge}>
                  <span><img src="https://cdn3.iconfinder.com/data/icons/social-productivity-black-line-2/1/37-512.png" width="40" height="40"/></span> Like
                </button>
                </p>
              </div>
              <br></br>
            </div>
          <Oppsett sideBredde={1} midtBredde={10}>
            <div className={"card-body"}>{this.delt.sak.innhold} printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMake
              printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently <br></br> with desktop publishing software like Aldus PageMake
              printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMake
              printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMake</div>
          </Oppsett>
        </div>
          <br></br>
          <br></br>
          <Oppsett sideBredde={2} midtBredde={8}>
            <div>
              <p>
                {(this.alleKommentarer.length>0) ? (this.alleKommentarer.length) : ('')} {this.delt.antKommentarer}
                <select
                  onChange={this.sorter}
                  className="form-control float-right "
                  disabled={this.aktivDropDownList}
                  style={{width: 180}}
                  placeholder="Select a person">
                  <option hidden> Sorter etter</option>
                  <option value={"Eldste"} key="Eldste"> Eldste</option>
                  <option value={"Nyeste"} key="Nyeste"> Nyeste</option>
                  <option value={"Mest populære"} key="Mest Populære"> Mest Populære</option>
                </select>
              </p>
              <div  className={"card-footer"}>
              <div>
                <br></br>
                <form id="kommentarFelt">
                  <Input tittelInput={"Navn"}>
                    <input
                      type="text"
                      placeholder="Ola Nordmann"
                      onChange={(event: SyntheticInputEvent<HTMLInputElement>) => { this.kommentar.kommentarNavn = event.target.value;}}
                    />
                  </Input>
                  <textarea className="form-control" placeholder="Kommenter..." rows="3"  id="comment" name="text"
                            onChange={(event: SyntheticInputEvent<HTMLInputElement>) => { this.kommentar.innhold = event.target.value;}}
                  />
                  <button type="button" onClick={this.leggTilKommentar}>
                    Legg til kommentar
                  </button>
                </form>
              </div>
              <br></br>
              <div >
                  {this.delt.kommentarer.map(kommentar => (
                    <ListGroup.Item key={kommentar.kommentarID}>
                      <b>{kommentar.kommentarNavn}</b>
                      <br></br>
                      {kommentar.innhold}
                      <p className="float-right">
                        <small>{kommentar.tidspunkt}</small>
                      </p>
                      <br></br>
                      <a href={"/#/nyheter/"+this.delt.sak.kategoriNavn+"/"+this.delt.sak.sakID} onClick={() => {this.likerKommentar(kommentar.kommentarID)}}>Liker</a>
                      <span>
                        <img src={"https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/vfPFP3W/facebook-thumbs-up-symbol-animates-in_mkjbkw25__F0000.png"} height={30} width={30}/>
                      </span> {(kommentar.antallLikesKommentar>0) ? (kommentar.antallLikesKommentar) : ('')}
                    </ListGroup.Item>
                  ))}
              </div>
              <br></br>
                {(this.antKommentarerLastetInn<this.alleKommentarer.length) ? (<div className={"text-center"}>
                  <button type={"button"} onClick={this.lastInnKommentarer}>
                    Last inn flere kommentarer
                  </button>
                </div>) : (
                  null
                )}
              <br></br>
            </div>
            </div>
          </Oppsett>
          </div>
        </Oppsett>
      </div>
    )
  }

  lastInnKommentarer(){
    this.antKommentarerLastetInn+= 5;
    if(this.antKommentarerLastetInn>this.alleKommentarer.length){
      this.antKommentarerLastetInn = this.alleKommentarer.length;
    }
    this.delt.kommentarer = this.alleKommentarer.slice(0,this.antKommentarerLastetInn);
  }

  likerKommentar(kommentarID) {
    let noverandreKommentar = this.delt.kommentarer.find(kommentar => (kommentar.kommentarID === kommentarID));
    console.log(noverandreKommentar);
    if(noverandreKommentar) {
      sakService
        .oppdaterLikesKommentar(this.props.match.params.sakID, kommentarID, (noverandreKommentar.antallLikesKommentar + 1))
        .then(() => {
          sakService.getKommentarerGittSak(this.props.match.params.sakID, this.sorterEtterKolonne, this.sorteringsRekkefolge)
            .then(kommentarer => (this.delt.kommentarer = kommentarer))
            .catch((error: Error) => Alert.danger(error.message));
        }).catch((error: Error) => Alert.danger(error.message));
    }
  }

  sorter(e){
    let {value} = e.target;
    console.log(value);
    if(value === "Eldste"){
      this.sorteringsRekkefolge = "asc";
      this.sorterEtterKolonne = "kommentarID";
      console.log("Eldste");
    } else if(value === "Nyeste"){
      console.log("Nyeste");
      this.sorteringsRekkefolge = "desc";
      this.sorterEtterKolonne = "kommentarID";
    } else{
      console.log("Populær");
      this.sorteringsRekkefolge = "desc";
      this.sorterEtterKolonne = "antallLikesKommentar";
    }
    console.log(this.props.match.params.sakID,this.sorterEtterKolonne,this.sorteringsRekkefolge);
    sakService
      .getKommentarerGittSak(this.props.match.params.sakID,this.sorterEtterKolonne,this.sorteringsRekkefolge)
      .then(kommentarer => {
        this.delt.kommentarer = kommentarer;
        if(this.delt.kommentarer.length>1){
          this.delt.antKommentarer="kommentarer";
        }
        if(kommentarer.length>this.antKommentarerLastetInn){
          this.delt.kommentarer = kommentarer.slice(0,this.antKommentarerLastetInn);
          this.alleKommentarer = kommentarer;
        }
      })
      .catch(() => {this.delt.antKommentarer="Ingen kommentarer";});
  }

  skiftFarge(){
    if(this.buttonColor === "btn btn-default btn-sm"){
      if(this.delt.sak.antallLikes === null){
        this.delt.sak.antallLikes = 0;
      }
      sakService.oppdaterLikes(this.props.match.params.sakID,(this.delt.sak.antallLikes+1))
        .then(() => {
          this.buttonColor = "btn btn-success btn-sm";
          sakService
            .getSakID(this.props.match.params.sakID)
            .then(sak => (this.delt.sak = sak[0]))
            .catch((error: Error) => Alert.danger(error.message));
        })
        .catch((error: Error) => Alert.danger(error.message));
    } else {
      sakService.oppdaterLikes(this.props.match.params.sakID,(this.delt.sak.antallLikes-1))
        .then(() => {
          this.buttonColor = "btn btn-default btn-sm";
          sakService
            .getSakID(this.props.match.params.sakID)
            .then(sak => (this.delt.sak = sak[0]))
            .catch((error: Error) => Alert.danger(error.message));
        })
        .catch((error: Error) => Alert.danger(error.message))

    }
  }

  leggTilKommentar(){
    sakService
      .leggTilKommentar(this.kommentar) // får feil her
      .then(() => {
        this.aktivDropDownList = false;
        sakService
          .getKommentarerGittSak(this.props.match.params.sakID,this.sorterEtterKolonne,this.sorteringsRekkefolge)
          .then(kommentarer => {
            this.delt.kommentarer = kommentarer;
            this.alleKommentarer = kommentarer;
            document.getElementById("kommentarFelt").reset(); // feil her
            if(kommentarer.length>1){
              this.delt.antKommentarer="kommentarer";
            } else if(kommentarer.length==1){
              this.delt.antKommentarer="kommentar";
            }
            if(kommentarer.length>this.antKommentarerLastetInn){
              this.delt.kommentarer = kommentarer.slice(0,this.antKommentarerLastetInn);
            }
            this.aktivDropDownList = false;
          })
          .catch(() => {
            this.delt.antKommentarer="Ingen kommentarer";
          });
      })
      .catch((error: Error) => Alert.danger(error.message));
    console.log("alt gjekk bra");

  }

  mounted(){
    sakService
      .getSakID(this.props.match.params.sakID)
      .then(sak => (this.delt.sak = sak[0]))
      .catch((error: Error) => Alert.danger(error.message));

    sakService
      .getKommentarerGittSak(this.props.match.params.sakID,this.sorterEtterKolonne,this.sorteringsRekkefolge)
      .then(kommentarer => {
        this.delt.kommentarer = kommentarer;
        this.alleKommentarer = kommentarer;
        if(this.delt.kommentarer.length>1){
          this.delt.antKommentarer="kommentarer";
        }
        if(kommentarer.length>this.antKommentarerLastetInn){
          this.delt.kommentarer = kommentarer.slice(0,this.antKommentarerLastetInn);
        }
        this.aktivDropDownList = false;
      })
      .catch(() => {this.delt.antKommentarer="Ingen kommentarer";});
  }
}

class EndreNyhetssaker extends Component{
  alleNyhetssaker = [];

  checkBox = {
    sport: {gyldighet: false, navn: "Sport", disable: false},
    kultur: {gyldighet: false, navn: "Kultur", disable: false},
    tech: {gyldighet: false, navn: "Tech", disable: false}
  };

  aktivCheckBox = "";

  delt = sharedComponentData({nyhetssaker: []});

  sok = {
    innhold: ''
  };

  handterInput(e) {
    this.sok.innhold = e.target.value;
    console.log(this.sok.innhold);
    if (this.sok.innhold.length >0) {
      if(this.checkBox.kultur.disable ||
        this.checkBox.sport.disable ||
        this.checkBox.tech.disable){
        sakService
          .filtrerPaaKategoriOgOverskrift(this.aktivCheckBox,this.sok.innhold)
          .then(sak => (this.delt.nyhetssaker = sak))
          .catch();
      } else {
        sakService
          .filtrerNyhetssaker(this.sok.innhold)
          .then(sak => (this.delt.nyhetssaker = sak))
          .catch((error: Error) => Alert.danger(error.message));
      }
    } else {
      if(this.checkBox.kultur.disable ||
        this.checkBox.sport.disable ||
        this.checkBox.tech.disable){
        this.delt.nyhetssaker = this.alleNyhetssaker.filter(nyhet => (nyhet.kategoriNavn === this.aktivCheckBox));
      } else {
        sakService
          .getAlleNyhetssaker()
          .then(nyeste => (this.delt.nyhetssaker = nyeste))
          .catch((error: Error) => Alert.danger(error.message));
      }
    }
  }

  render() {
    return(
      <Oppsett sideBredde={2} midtBredde={8}>
        <Overskrift>Rediger nyhetssaker</Overskrift>
        <div>
          <h3>Filtrer kategorier</h3>
          <br></br>
          <CheckBox checkBoxNavn={"Sport"} disable={this.checkBox.sport.disable} forandring={() => this.checkSport()}/>
          <CheckBox checkBoxNavn={"Kultur"} disable={this.checkBox.kultur.disable} forandring={() => this.checkKultur()}/>
          <CheckBox checkBoxNavn={"Tech"} disable={this.checkBox.tech.disable} forandring={() => this.checkTech()}/>
        </div>
        <br></br>
        <form>
          <Input tittelInput="Søk">
            <input
              type="text"
              placeholder="Søk etter nyhetssak"
              onChange = {this.handterInput}
            />
            <NavLink activeStyle={{ color: 'darkblue' }} to={"/registrerNyhetssak"}>
              <button className="float-right btn btn-info" >Legg til ny sak</button>
            </NavLink>
          </Input>
        </form>
        <ul className="list-group ">
          {this.delt.nyhetssaker.map(sak => (
            <ListGroup.Item key={sak.sakID}>
              {sak.overskrift}
              <Popup trigger={<button className="float-right btn btn-danger"> Slett</button>} position="right center">
                { close => (
                  <div>
                  <p><b>Er du sikker på at du vil slette denne nyhetssaken?</b></p>
                  <button className="btn btn-warning float-left ml-3" onClick={() => {close();}}>Nei</button>
                  <button className="btn btn-success float-right mr-3" onClick={() => {this.slett(sak.sakID)}}>Ja</button>
                </div>
                )}
              </Popup>
              <NavLink activeStyle={{ color: 'darkblue' }} to={"/oppdater/"+sak.sakID}>
                <button className="float-right btn btn-info mr-2" >Oppdater</button>
              </NavLink>
            </ListGroup.Item>
          ))}
        </ul>
      </Oppsett>
    )
  }

  checkSport(){
    this.checkBox.sport.gyldighet = !this.checkBox.sport.gyldighet;
    if(this.checkBox.sport.gyldighet){
      this.aktivCheckBox = this.checkBox.sport.navn;
      this.delt.nyhetssaker = this.delt.nyhetssaker.filter(nyhet => (nyhet.kategoriNavn === this.checkBox.sport.navn));
      this.checkBox.kultur.disable=true;
      this.checkBox.tech.disable=true;
    } else {
      this.delt.nyhetssaker = this.alleNyhetssaker;
      this.checkBox.kultur.disable=false;
      this.checkBox.tech.disable=false;
    }
  }

  checkKultur(){
    //const noverandeKategori = this.checkBox.map(kat => kat.navn === kategoriNavn);
    this.checkBox.kultur.gyldighet = !this.checkBox.kultur.gyldighet;
    if(this.checkBox.kultur.gyldighet){
      this.aktivCheckBox = this.checkBox.kultur.navn;
      this.delt.nyhetssaker = this.delt.nyhetssaker.filter(nyhet => (nyhet.kategoriNavn === this.checkBox.kultur.navn));
      this.checkBox.sport.disable=true;
      this.checkBox.tech.disable=true;
    } else {
      this.delt.nyhetssaker = this.alleNyhetssaker;
      this.checkBox.sport.disable=false;
      this.checkBox.tech.disable=false;
    }
  }

  checkTech(){
    this.checkBox.tech.gyldighet = !this.checkBox.tech.gyldighet;
    if(this.checkBox.tech.gyldighet){
      this.aktivCheckBox = this.checkBox.tech.navn;
      this.delt.nyhetssaker = this.delt.nyhetssaker.filter(nyhet => (nyhet.kategoriNavn === this.checkBox.tech.navn));
      this.checkBox.sport.disable=true;
      this.checkBox.kultur.disable=true;
    } else {
      this.delt.nyhetssaker = this.alleNyhetssaker;
      this.checkBox.sport.disable=false;
      this.checkBox.kultur.disable=false;
    }
  }

  filtrerKategorier(kategoriNavn1: string,kategoriNavn2: string){
      this.delt.nyhetssaker = this.delt.nyhetssaker.filter(nyhet => ((nyhet.kategoriNavn=== kategoriNavn1) || (nyhet.kategoriNavn=== kategoriNavn2)));
  }

  slett(sakID) {
    console.log(sakID);
    sakService
      .slettNyhetssak(sakID)
      .catch((error: Error) => Alert.danger(error.message));
    window.location.reload();
  }


  mounted(){
    sakService
      .getAlleNyhetssaker()
      .then(nyeste => {
        this.delt.nyhetssaker = nyeste;
        this.alleNyhetssaker = nyeste;
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class OppdaterNyhetssak extends Component<{match: { params: {sakID: number}}}>{
  sak = {
    sakID: this.props.match.params.sakID,
    overskrift: "",
    bildelink: "",
    innhold: "",
    tidspunkt: "",
    antallLikes: 0,
    kategoriNavn: "",
    viktighet: 0
  };

  form = null;

  kategorier = [];

  delt = sharedComponentData({kategorier: []});

  viktighetListe(e) {
    let {value} = e.target;
    console.log(value);
    this.sak.viktighet = value;
  }

  kategoriListe(e){
    let {value} = e.target;
    console.log(value);
    this.sak.kategoriNavn = value;
  }


  render(){
    if(!this.sak) return null;
    return(
      <div>
        <Oppsett midtBredde={8} sideBredde={2}>
          <Overskrift>Oppdater nyhetssak</Overskrift>
          <br></br>
          <br></br>
          <p className="text-center"><img src={this.sak.bildelink} width="300" height="200"/></p>
          <p className="font-italic text-center">Se nåværende bilde over</p>
          <form ref={e => (this.form = e)}>
            <Input tittelInput="Overskrift">
              <input type="text" className="form-control"
                     value={this.sak.overskrift}
                     onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.overskrift = event.target.value)}/>
            </Input>
            <Input tittelInput="Bildelink">
              <input type="text" className="form-control"
                     value={this.sak.bildelink}
                     onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.bildelink = event.target.value)}/>
            </Input>
            <div className="container-fluid">
              <div className="row">
                <div className="col-6">
                  <label> Viktighet:</label>
                  <br></br>
                  <select
                    onChange={this.viktighetListe}
                    className="form-control float-left"
                    style={{width: 200}}
                    value={this.sak.viktighet}>
                    <option value="1" key="1"> Viktighet 1</option>
                    <option value="2" key="2"> Viktighet 2</option>
                  </select>
                </div>
                <div className="col-6">
                  <label> Kategori:</label>
                  <br></br>
                  <select
                    onChange={this.kategoriListe}
                    className="form-control"
                    style={{width: 200}}
                    value={this.sak.kategoriNavn}>
                    {this.kategorier.map(e => (
                      <option value={e.navn} key={e.navn}> {e.navn}</option>))
                    }
                  </select>
                </div>
              </div>
            </div>
            <br></br>
            <div className="form-group">
            <textarea className="form-control" placeholder="Innhold..." rows="3"  id="comment" name="text"
                      value={this.sak.innhold}
                      onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {this.sak.innhold = event.target.value;}}
            />
            </div>
          </form>
          <div className="text-center">
            <button type="button" className="btn btn-ghost btn-ghost-bordered center-block" onClick={this.oppdater}> Oppdater </button>
          </div>
          <br></br>
          <br></br>
        </Oppsett>
      </div>
    )
  }

  oppdater () {
     const oppdaterSak = {
      overskrift: this.sak.overskrift,
      bildelink: this.sak.bildelink,
      innhold: this.sak.innhold,
      kategoriNavn: this.sak.kategoriNavn,
      viktighet: this.sak.viktighet
    };
     console.log(oppdaterSak);
    /*sakService
      .oppdaterNyhetssak(this.props.match.params.sakID,oppdaterSak)
      .catch((error: Error) => Alert.danger(error.message))*/
  }

  mounted(){
    sakService
      .getSakID(this.props.match.params.sakID)
      .then(nyhet => (this.sak = nyhet[0]))
      .catch((error: Error) => Alert.danger(error.message));

    kategoriService
      .getAlleKategorier()
      .then(kategori => {
        this.kategorier = kategori;
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class RegistrerNyhetssak extends Component{
  alleKategorier = [];
  viktighet = 1;
  kategori = "";
  form = null;

  opprettSak =  {
    overskrift: '',
    bildelink: '',
    innhold: '',
    kategoriNavn: '',
    viktighet: this.viktighet
  };
  render(){
    return(
      <Oppsett midtBredde={8} sideBredde={2}>
        <Overskrift>Registrer nyhetssak</Overskrift>
        <br></br>
        <br></br>
        <p className="text-center"><img src={this.opprettSak.bildelink} width="300" height="200"/></p>
        <p className="font-italic text-center">Skriv inn bildelink og se hvordan bildet ser ut over</p>
        <form ref={e => (this.form = e)}>
          <Input tittelInput="Overskrift">
            <input type="text" className="form-control" placeholder="Bømlo kåret til verdens beste by"
                   required={true}
                  onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.opprettSak.overskrift = event.target.value)}/>
          </Input>
          <Input tittelInput="Bildelink">
            <input type="text" className="form-control" placeholder="Link..."
                   required={true}
                   onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.opprettSak.bildelink = event.target.value)}/>
          </Input>
          <ContainerFluid>
            <div className="row">
              <div className="col-6">
                <label> Viktighet:</label>
                <br></br>
                  <select
                    onChange={this.viktighetListe}
                    className="form-control float-left "
                    style={{width: 200}}
                    placeholder="Select a person">
                    <option hidden> Velg viktighet</option>
                    <option value={1} key="1"> Viktighet 1</option>
                    <option value={2} key="2"> Viktighet 2</option>
                  </select>
              </div>
              <div className="col-6">
                <label> Kategori:</label>
                <br></br>
                <select
                  onChange={this.kategoriListe}
                  className="form-control "
                  style={{width: 200}}
                  placeholder="Select a person">
                  <option hidden> Velg kategori</option>
                  {this.alleKategorier.map(e => (
                    <option value={e.navn} key={e.navn}> {e.navn}</option>))
                  }
                </select>
              </div>
            </div>
          </ContainerFluid>
          <br></br>
          <div className="form-group">
            <textarea className="form-control" placeholder="Innhold..." rows="3"  id="comment" name="text"
                      required={true}
                      onChange={(event: SyntheticInputEvent<HTMLInputElement>) => {this.opprettSak.innhold = event.target.value;}}
            />
          </div>
        </form>
        <div className="text-center">
          <button type="button" className="btn btn-ghost btn-ghost-bordered center-block" onClick={this.registrer}> Registrer </button>
        </div>
        <br></br>
        <br></br>
      </Oppsett>
    )
  }

  registrer(){
    if(!this.form || !this.form.checkValidity()){
      return Alert.danger("Vennligst fyll ut de tomme feltene");
    }
    sakService
      .opprettNyhetssak(this.opprettSak) // feil her
      .then(() => {Alert.success("Du har registrert en ny sak!")})
      .catch((error: Error) => Alert.danger(error.message));
    history.push('/nyheter/'+this.opprettSak.kategoriNavn);
  }

  viktighetListe(e) {
    let {value} = e.target;
    console.log(value);
    this.opprettSak.viktighet = value;
  }

  kategoriListe(e){
    let {value} = e.target;
    console.log(value);
    this.opprettSak.kategoriNavn = value;
  }

  mounted(){
    kategoriService
      .getAlleKategorier()
      .then(kat => (this.alleKategorier = kat))
      .catch((error: Error) => Alert.danger(error.message));
  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <HashRouter>
      <div>
        <Alert/>
        <Menu/>
        <Switch>
          <Route exact path="/" component={Redirection} />
          <Route exact path="/#/" component={Redirection} />
          <Route exact path="/nyheter" component={FramsideVisning} />
          <Route exact path="/nyheter/:kategorinavn" component={Kategori} />
          <Route exact path="/nyheter/:kategorinavn/:sakID" component={Nyhetsside}/>
          <Route path="/registrer" component={EndreNyhetssaker}/>
          <Route exact path="/oppdater/:sakID" component={OppdaterNyhetssak}/>
          <Route path="/registrerNyhetssak" component={RegistrerNyhetssak}/>
        </Switch>
        <Footer/>
      </div>
    </HashRouter>,
    root
  );