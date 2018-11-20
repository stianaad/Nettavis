// @flow
/* eslint eqeqeq: "off" */


import * as React from 'react';
import { Component,sharedComponentData } from 'react-simplified';
import { HashRouter, Route, NavLink, Redirect,Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
var Base64 = require('js-base64').Base64;
import {
  Alert,
  ListGroup,
  NavBar,
  Oppsett,
  Input,
  Row,
  Column,
  ContainerFluid,
  Overskrift,
  ListGroupInline,
  CheckBox,
  Card
} from './widgets';
import { sakService,kategoriService, Sak, OpprettSak, OpprettKommentarer} from './services';

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
  interval=null;

  render() {
    return(
      <marquee style={{background: "grey"}}>
        <ListGroupInline>
      {this.nyesteSaker.map(sak =>(
        <ListGroupInline.Item key={sak.sakID} style={{color: "white"}} to={"/nyheter/"+sak.kategoriNavn+"/"+sak.sakID}>
          {sak.overskrift} {'   '}{sak.tidspunkt}
        </ListGroupInline.Item>
      ))}
        </ListGroupInline>
        <div>
          <div class="text-center">
          <h3>Dei va suverene og vann tittelen</h3>
          <p>Contrary to popular <a href="/#"> link </a>belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
          <img src="https://www.irishtimes.com/polopoly_fs/1.3486225.1525633083!/image/image.jpg_gen/derivatives/box_620_330/image.jpg" height="100" width="200"/>
          <p> Ferguson var United sin beste manager gjennom tidene og vann nok et trofe</p>
          <br/>
          </div>
          <h5> Dette er ei mindre overskrift</h5>
          <p>Contrary to popular <a href="/#"> link </a>belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
        </div>
      </marquee>
    )
  }

  mounted() {
    sakService
      .getLiveFeed()
      .then(sak => (this.nyesteSaker = sak))
      .catch((error: Error) => Alert.danger(error.message));

    this.interval = setInterval(() => {
      sakService
        .getLiveFeed()
        .then(sak => (this.nyesteSaker = sak))
        .catch((error: Error) => Alert.danger(error.message));
    },10000);
  }

  beforeUnmount(){
    if(this.interval){
      clearInterval(this.interval);
    }
  }

}

class FramsideVisning extends Component{
  delt = {nyheter: []};
  antallSakerPrSide = 10;
  sideNr = 1;
  antallSider = 1;
  sakNrStart = 0;
  antallSaker = 0;

  render() {
    return (
      <div >
        <LiveFeed/>
        <br></br>
        <br></br>
        <Oppsett midtBredde={10} sideBredde={1} >
          <ContainerFluid>
            <Row  styles={{ margin: 'auto', justifyContent: 'center', alignItems: 'flex-start'}}>
              <div className={"card-columns"}>
              {this.delt.nyheter.map(e => (
                  <Card key={e.sakID} to={'nyheter/'+e.kategoriNavn+'/'+e.sakID} link={e.bildelink} title={e.overskrift}/>
              ))}
              </div>
            </Row>
          </ContainerFluid>
          <br></br>
          <footer>
            <div className={"text-center"}>
              {(this.sakNrStart>0) ? (
                <button type="button" style={{padding: 0, border: "none", backgroundColor: "white"}} className="mr-4" onClick={this.forrigeSide} >
                  <span><img src={"http://pluspng.com/img-png/arrow-png-no-background-download-this-image-as-600.png"} width="20" height="20"/></span>
                </button>) : (
                null
              )}
              Side {this.sideNr} av {this.antallSider}
              {((this.sakNrStart+this.antallSakerPrSide)<this.antallSaker) ? (
                <button type="button" style={{padding: 0, border: "none", backgroundColor: "white"}} className=" ml-4" onClick={this.nesteSide}>
                  <span><img src="https://www.freeiconspng.com/uploads/white-arrow-transparent-png-27.png" width="20" height="20"/></span>
                </button>) : (
                null
              )}
            </div>
          </footer>
        </Oppsett>
      </div>
    );
  }

  nesteSide(){
    this.sakNrStart+=this.antallSakerPrSide;
    this.sideNr++;
    sakService
      .getNyheter(this.sakNrStart)
      .then(nyheter => {
        this.delt.nyheter=nyheter;
      })
      .catch((error: Error) => Alert.danger(error.message));

  }

  forrigeSide(){
    this.sakNrStart-=this.antallSakerPrSide;
    this.sideNr--;
    sakService
      .getNyheter(this.sakNrStart)
      .then(nyheter => {
        this.delt.nyheter=nyheter;
      })
      .catch((error: Error) => Alert.danger(error.message));
  }

  mounted(){
    sakService
      .getNyheter(this.sakNrStart)
      .then(nyheter => {
        this.delt.nyheter=nyheter;
      })
      .catch((error: Error) => Alert.danger(error.message));

    sakService
      .getAntSaker()
      .then(antall => {
        this.antallSaker = antall[0].antall;
        this.antallSider = Math.ceil(this.antallSaker/this.antallSakerPrSide);
        console.log(antall[0].antall);
      })
      .catch((error: Error) => Alert.danger(error.message));
  }
}

class Kategori extends Component<{match: { params: { kategorinavn: string }}}>{
  delt = {kategori: []};
  antallSakerPrSide = 3;
  sideNr = 1;
  antallSider = 1;
  antallSaker = 0;
  sakNrStart = 0;

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
                  <Card key={e.sakID} exact={true} to={'/nyheter/'+e.kategoriNavn+'/'+e.sakID} link={e.bildelink} title={e.overskrift}/>
                ))}
              </div>
            </Row>
          </ContainerFluid>
          <br></br>
          <footer>
            <div className={"text-center"}>
              {(this.sakNrStart>0) ? (
                <button type="button" style={{padding: 0, border: "none", backgroundColor: "white"}} className="mr-4" onClick={this.forrigeSide} >
                  <span><img src={"http://pluspng.com/img-png/arrow-png-no-background-download-this-image-as-600.png"} width="20" height="20"/></span>
                </button>) : (
                null
              )}
              Side {this.sideNr} av {this.antallSider}
              {((this.sakNrStart+this.antallSakerPrSide)<this.antallSaker) ? (
                <button type="button" style={{padding: 0, border: "none", backgroundColor: "white"}} className=" ml-4" onClick={this.nesteSide}>
                  <span><img src="https://www.freeiconspng.com/uploads/white-arrow-transparent-png-27.png" width="20" height="20"/></span>
                </button>) : (
                null
              )}
            </div>
          </footer>
        </Oppsett>
      </div>
    );
  }

  nesteSide(){
    this.sakNrStart+= this.antallSakerPrSide;
    this.sideNr++;
    sakService
      .getNyhetssakerGittKategori(this.props.match.params.kategorinavn,this.sakNrStart)
      .then(kat => {
        this.delt.kategori = kat;
      })
      .catch((error: Error) => Alert.danger(error.message));
    }

  forrigeSide(){
    this.sakNrStart-= this.antallSakerPrSide;
    this.sideNr--;
    sakService
      .getNyhetssakerGittKategori(this.props.match.params.kategorinavn,this.sakNrStart)
      .then(kat => {
        this.delt.kategori = kat;
      })
      .catch((error: Error) => Alert.danger(error.message));
   }

  mounted(){
    this.sakNrStart = 0;
    this.sideNr=1;
    sakService
      .getNyhetssakerGittKategori(this.props.match.params.kategorinavn,this.sakNrStart)
      .then(kat => {
        this.delt.kategori = kat;
         })
      .catch((error: Error) => Alert.danger(error.message));

    sakService
      .getAntSakerKategori(this.props.match.params.kategorinavn)
      .then(antall => {
        this.antallSaker = antall[0].antall;
        this.antallSider = Math.ceil(this.antallSaker/this.antallSakerPrSide);
        console.log(antall[0].antall);
      })
      .catch((error: Error) => Alert.danger(error.message));


  }
}

class Nyhetsside extends Component<{match: { params: { sakID: number }}}>{
  delt ={kommentarer: [],antKommentarer: "kommentar",
    sak: {
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
  kommentar = new OpprettKommentarer();
  buttonColor = "btn btn-default btn-sm ml-2";
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
            <img src={this.delt.sak.bildelink} className="mx-auto d-block img-fluid mh-25 card-img-top" />
            <p><i>Nyhetsartikkelen ble opprettet {this.delt.sak.tidspunkt}</i></p>
              <div>
                <p>Denne artikkelen har {this.delt.sak.antallLikes} {(this.delt.sak.antallLikes === 1) ? ("like") : ("likes")} {'  '}
                <button type="button" className={this.buttonColor} onClick={this.skiftFarge}>
                  <span><img src="https://cdn3.iconfinder.com/data/icons/social-productivity-black-line-2/1/37-512.png" width="40" height="40"/></span> Like
                </button>
                </p>
              </div>
              <br></br>
            </div>
          <Oppsett sideBredde={1} midtBredde={10}>
              <div dangerouslySetInnerHTML={{__html: Base64.decode(this.delt.sak.innhold)}}></div>
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
                  className="form-control float-right"
                  disabled={this.aktivDropDownList}
                  style={{width: 180}}
                  placeholder="Select a person">
                  <option hidden> Sorter etter</option>
                  <option value={"Eldste"} key="Eldste"> Eldste</option>
                  <option value={"Nyeste"} key="Nyeste"> Nyeste</option>
                  <option value={"Mest populære"} key="Mest Populære"> Mest Populære</option>
                </select>
              </p>
              <div className={"card-footer"}>
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
            .then(kommentarer => {
              this.alleKommentarer = kommentarer;
              this.delt.kommentarer = kommentarer.slice(0,this.antKommentarerLastetInn);
            })
            .catch((error: Error) => Alert.danger(error.message));
        })
        .catch((error: Error) => Alert.danger(error.message));
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
    if(this.buttonColor === "btn btn-default btn-sm ml-2"){
      if(this.delt.sak.antallLikes === null){
        this.delt.sak.antallLikes = 0;
      }
      sakService.oppdaterLikes(this.props.match.params.sakID,(this.delt.sak.antallLikes+1))
        .then(() => {
          this.buttonColor = "btn btn-success btn-sm ml-2";
          sakService
            .getSakID(this.props.match.params.sakID)
            .then(sak => (this.delt.sak = sak[0]))
            .catch((error: Error) => Alert.danger(error.message));
        })
        .catch((error: Error) => Alert.danger(error.message));
    } else {
      sakService.oppdaterLikes(this.props.match.params.sakID,(this.delt.sak.antallLikes-1))
        .then(() => {
          this.buttonColor = "btn btn-default btn-sm ml-2";
          sakService
            .getSakID(this.props.match.params.sakID)
            .then(sak => (this.delt.sak = sak[0]))
            .catch((error: Error) => Alert.danger(error.message));
        })
        .catch((error: Error) => Alert.danger(error.message))

    }
  }

  leggTilKommentar(){
    this.kommentar.nyhetssakID = this.props.match.params.sakID;
    sakService
      .leggTilKommentar(this.kommentar)
      .then(() => {
        this.aktivDropDownList = false;
        sakService
          .getKommentarerGittSak(this.props.match.params.sakID,this.sorterEtterKolonne,this.sorteringsRekkefolge)
          .then(kommentarer => {
            this.delt.kommentarer = kommentarer;
            this.alleKommentarer = kommentarer;
            // $FlowFixMe
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

  delt = {nyhetssaker: []};

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
          .catch();
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
          .catch();
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
          <Input tittelInput="Søk">
            <input
              className={"form-control mr-5"}
              type="text"
              value={this.sok.innhold}
              placeholder="Søk etter nyhetssak"
              onChange = {this.handterInput}
            />
            <NavLink activeStyle={{ color: 'darkblue' }} to={"/registrerNyhetssak"}>
              <button className="float-right btn btn-success" >Legg til ny sak</button>
            </NavLink>
          </Input>
        <ul className="list-group ">
          {this.delt.nyhetssaker.map(sak => (
            <ListGroup.Item key={sak.sakID}>
              <NavLink activeStyle={{ color: 'darkblue' }} style={{color: "black"}} to={"/nyheter/"+sak.kategoriNavn+"/"+sak.sakID}>
              {sak.overskrift}
              </NavLink>
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

  slett(sakID) {
    console.log(sakID);
    sakService
      .slettNyhetssak(sakID)
      .then( () => {
        this.mounted();
        this.sok.innhold = '';
      })
      .catch((error: Error) => Alert.danger(error.message));
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

  sak = new Sak();

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
            <ContainerFluid >
              <Row>
                <Column bredde={6}>
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
                </Column>
                <Column bredde={6}>
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
                </Column>
              </Row>
            </ContainerFluid>
            <br></br>
            <div className="form-group">
            <textarea className="form-control" placeholder="Innhold..." rows="6"  id="comment" name="text"
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
    sakService
      .oppdaterNyhetssak(this.props.match.params.sakID,this.sak)
      .then(() => {
        history.push("/nyheter/"+this.sak.kategoriNavn+"/"+this.sak.sakID);
        Alert.success("Du har oppdatert "+this.sak.overskrift);
      })
      .catch((error: Error) => Alert.danger(error.message));
  }

  mounted(){
    sakService
      .getSakID(this.props.match.params.sakID)
      .then(nyhet => {
        this.sak = nyhet[0];
        this.sak.innhold = Base64.decode(this.sak.innhold);
      })
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

  opprettSak = new OpprettSak();
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
            <Row>
              <Column bredde={6}>
                <label> Viktighet:</label>
                <br></br>
                  <select
                    onChange={this.viktighetListe}
                    className="form-control float-left "
                    style={{width: 200}}
                    >
                    <option hidden> Velg viktighet</option>
                    <option value={1} key="1"> Viktighet 1</option>
                    <option value={2} key="2"> Viktighet 2</option>
                  </select>
              </Column>
              <Column bredde={6}>
                <label> Kategori:</label>
                <br></br>
                <select
                  onChange={this.kategoriListe}
                  className="form-control "
                  style={{width: 200}}
                  >
                  <option hidden> Velg kategori</option>
                  {this.alleKategorier.map(e => (
                    <option value={e.navn} key={e.navn}> {e.navn}</option>))
                  }
                </select>
              </Column>
            </Row>
          </ContainerFluid>
          <br></br>
          <div className="form-group">
            <textarea className="form-control" placeholder="Innhold..." rows="6"  id="comment" name="text"
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
      .opprettNyhetssak(this.opprettSak)
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