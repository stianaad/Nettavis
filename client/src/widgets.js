// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

/**
 * Renders alert messages using Bootstrap classes.
 */
export class Alert extends Component {
  alerts: { text: React.Node, type: string }[] = [];

  render() {
    return (
      <>
        {this.alerts.map((alert, i) => (
          <div key={i} className={'alert alert-' + alert.type} role="alert">
            {alert.text}
            <button
              className="close"
              onClick={() => {
                this.alerts.splice(i, 1);
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </>
    );
  }

  static success(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'success' });
    });
  }

  static info(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'info' });
    });
  }

  static warning(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'warning' });
    });
  }

  static danger(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'danger' });
    });
  }
}

/**
 * Renders an information card using Bootstrap classes
 */
export class Card extends Component<{ title: React.Node,exact?: boolean,link: string,to: string, children?: React.Node }> {
  render() {
    return (
      <div className="card">
        <NavLink style={{color: "black"}} exact={this.props.exact} to={this.props.to}>
          <img src={this.props.link} className={"card-img-top img-fluid"}/>
          <div className="card-body">
            <h5 className="card-title text-center">{this.props.title}</h5>
            <div className="card-text"><i>{this.props.children}</i></div>
          </div>
        </NavLink>
      </div>
    );
  }
}

class ListGroupItem extends Component<{ to?: string, children: React.Node }> {
  render() {
    return this.props.to ? (
      <NavLink className="list-group-item" activeClassName="active" to={this.props.to}>
        {this.props.children}
      </NavLink>
    ) : (
      <li className="list-group-item">{this.props.children}</li>
    );
  }
}

/**
 * Renders a list group using Bootstrap classes
 */
export class ListGroup extends Component<{
  children: React.Element<typeof ListGroupItem> | (React.Element<typeof ListGroupItem> | null)[] | null
}> {
  static Item = ListGroupItem;

  render() {
    return <ul className="list-group">{this.props.children}</ul>;
  }
}

class ListGroupItemInline extends Component<{ to: string, style?: Object, children: React.Node }> {
  render() {
    return(
      <NavLink className="list-inline-item mt-2 mr-5 ml-5" style={this.props.style} activeClassName="active" to={this.props.to}>
        {this.props.children}
      </NavLink>
    )
  }
}

export class ListGroupInline extends Component<{
  children: React.Element<typeof ListGroupItemInline> | (React.Element<typeof ListGroupItemInline> | null)[] | null
}> {
  static Item = ListGroupItemInline;

  render() {
    return <ul className="list-inline">{this.props.children}</ul>;
  }
}

export class CheckBox extends Component<{checkBoxNavn: string, forandring: Object,disable?: boolean}> {
  render(){
    return(
      <div className={"form-check form-check-inline"}>
        <input className="form-check-input" type="checkbox" id={this.props.checkBoxNavn} disabled={this.props.disable} onChange={this.props.forandring}  value={this.props.checkBoxNavn}/>
        <label className="form-check-label" >{this.props.checkBoxNavn}</label>
      </div>
    )
  }
}

export class Overskrift extends Component<{ children: React.Node }> {
  render() {
    return <h1 className="text-center">{this.props.children}</h1>;
  }
}

export class ContainerFluid extends Component<{children: React.Node }> {
  render() {
    return <div className={"container-fluid"}>{this.props.children}</div>;
  }
}

/**
 * Renders a row using Bootstrap classes
 */
export class Row extends Component<{ children: React.Node, styles?: Object }> {
  render() {
    return <div className={"row"} style={this.props.styles}>{this.props.children}</div>;
  }
}

/**
 * Renders a column with specified width using Bootstrap classes
 */
export class Column extends Component<{ bredde: number, children?: React.Node }> {
  render() {
    return <div className={'col-sm-' + this.props.bredde}>{this.props.children}</div>;
  }
}

class NavBarBrand extends Component<{ children?: React.Node }> {
  render() {
    if (!this.props.children) return null;
    return (
      <NavLink className="navbar-brand" style={{ font: "400 100px/1.5  Pacifico,Helvetica, sans-serif",textShadow: "3px 3px 0px rgba(0,0,0,0.1), 7px 7px 0px rgba(0,0,0,0.05)", fontSize: "40px"}} activeClassName="active" exact to="/nyheter">
        {this.props.children}
      </NavLink>
    );
  }
}

class NavBarLinkLeft extends Component<{ to: string, exact?: boolean, children?: React.Node }> {
  render() {
    if (!this.props.children) return null;
    return (
      <NavLink className="nav-link " style={{ fontSize: "20px"}} activeClassName="active" exact={this.props.exact} to={this.props.to}>
        {this.props.children}
      </NavLink>
    );
  }
}

class NavBarLinkRight extends Component<{ to: string, exact?: boolean, children?: React.Node }> {
  render() {
    if (!this.props.children) return null;
    return (
      <NavLink className="nav-link " style={{ fontSize: "20px"}} activeClassName="active" exact={this.props.exact} to={this.props.to}>
        {this.props.children}
      </NavLink>
    );
  }
}

/**
 * Renders a navigation bar using Bootstrap classes
 */
export class NavBar extends Component<{ children: React.Element<typeof NavBarBrand | typeof NavBarLinkLeft | typeof NavBarLinkRight>[] }> {
  static Brand = NavBarBrand;
  static LinkLeft = NavBarLinkLeft;
  static LinkRight = NavBarLinkRight;

  render() {
    return (
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
          <ul className="navbar-nav mr-auto">{this.props.children.filter(child => child.type == NavBarLinkLeft)}</ul>
        </div>
        <div className="mx-auto order-0">
          <NavLink className="navbar-brand mx-auto" to="#">{this.props.children.filter(child => child.type == NavBarBrand)}</NavLink>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
          <ul className="navbar-nav ml-auto">
            {this.props.children.filter(child => child.type == NavBarLinkRight)}
          </ul>
        </div>
      </nav>
    );
  }
}

export class Oppsett extends Component<{sideBredde: number,sideTekst?: React.Node, midtBredde: number, children: React.Node}>{
  render(){
    return(
      <ContainerFluid>
        <Row>
          <Column bredde={this.props.sideBredde}>
            <div className="text-center">
            {this.props.sideTekst}
            </div>
          </Column>
          <Column bredde={this.props.midtBredde}>
              {this.props.children}
          </Column>
          <Column bredde={this.props.sideBredde}>
            <div className="text-center">
              {this.props.sideTekst}
            </div>
          </Column>
        </Row>
      </ContainerFluid>
    )
  }
}

class ButtonSuccess extends Component<{
  onClick: () => mixed,
  children: React.Node
}> {
  render() {
    return (
      <button type="button" className="btn btn-success" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

export class Input extends Component<{tittelInput: string,children: React.Node}>{
  render() {
    return(
      <div className="input-group mb-3 ">
        <div className="input-group-prepend">
          <span className="input-group-text">{this.props.tittelInput}</span>
        </div>
        {this.props.children}
      </div>
    )
  }
}
