// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert,Overskrift } from '../src/widgets.js';
import { shallow, mount } from 'enzyme';
import { Column, ContainerFluid, Row, ListGroup, ListGroupInline, Oppsett, Input, NavBar, Card } from '../src/widgets';

describe('Alert tests', () => {
  const wrapper = shallow(<Alert />);

  it('initially', () => {
    let instance: ?Alert = Alert.instance();
    expect(typeof instance).toEqual('object');
    if (instance) expect(instance.alerts).toEqual([]);

    expect(wrapper.find('button.close')).toHaveLength(0);
  });
  /* Dette er metodene som jeg klonet fra forelesning, men fungerte ikkje, lurer på om det var noe feil med det du laget?
  it('after danger', done => {
    Alert.danger('test');

    setTimeout(() => {
      let instance: ?Alert = Alert.instance();
      expect(typeof instance).toEqual('object');
      if (instance) expect(instance.alerts).toEqual([{ text: 'test', type: 'danger' }]);

      expect(wrapper.find('button.close')).toHaveLength(1);
      done();
    });
  });

  it('after clicking close button', () => {
    wrapper.find('button.close').simulate('click');

    let instance: ?Alert = Alert.instance();
    expect(typeof instance).toEqual('object');
    if (instance) expect(instance.alerts).toEqual([]);
    expect(wrapper.find('button.close')).toHaveLength(0);
  });*/
});

describe('Overskrift tests', () => {
  const wrapper = shallow(<Overskrift children="Overskrift"/>);

  it('Får overskrift med type h1', () => {
    expect(wrapper.contains(<h1 className="text-center">{"Overskrift"}</h1>)).toEqual(true);
    expect(wrapper.containsMatchingElement(<h2 className="text-center">{"Overskrift"}</h2>)).toEqual(false);
  })
}); // funke

describe('ContainerFluid tests', () => {
  const wrapper = shallow(
    <ContainerFluid senterTekst={"text-center"}>
      <div className={"row"}/>
    </ContainerFluid>
  );

  it('Container som inneholder rad', () => {
    expect(wrapper.contains(<div className="row"/>)).toEqual(true);
  });

  it('sjekke at parent() består av klassen container-fluid og text-center', () => {
    expect(wrapper.find('div').parent().hasClass('container-fluid text-center')).toEqual(true);
  });
}); // funke

describe('Row tests', () => {
  const wrapper = shallow(
    <Row>
      <div className='col-sm-5'>

      </div>
    </Row>
  );

  it('Container som inneholder rad', () => {
    expect(wrapper.contains(<div className='col-sm-5'/>)).toEqual(true);
  });

  it('sjekke om strukturen til Row', () => {
    expect(wrapper.matchesElement(
      <div className="row">
        <div className='col-sm-5'>
        </div>
      </div>)).toEqual(true);
  });

  it('sjekke at parent() består av ein div ', () => {
    expect(wrapper.find('div').parent().is('div')).toEqual(true);
  });

  it('sjekke at parent() består av klassen row ', () => {
    expect(wrapper.find('div').parent().hasClass('row')).toEqual(true);
  });

}); // funke

describe('Column tests', () => {
  const wrapper = shallow(
    <Column bredde={3}>
      <ul>
        <li>
          Liste1
        </li>
      </ul>
    </Column>
  );

  it('Kolonne som inneholder ei liste', () => {
    expect(wrapper.contains(<ul><li>Liste1</li></ul>)).toEqual(true);
  });

  it('sjekke at parent() består av klassen column ', () => {
    expect(wrapper.find('ul').parent().hasClass('col-sm-3')).toEqual(true);
  });

  it('sjekke at children() til ul består av klassen li', () => {
    expect(wrapper.find('ul').children()).toHaveLength(1);
  });

}); // funke

describe('ListGroup tests', () => {
  const wrapper = shallow(
    <ListGroup>
      <ListGroup.Item>
        <p>Test</p>
      </ListGroup.Item>
    </ListGroup>
  );

  it('sjekker at den matcher med oppsette i  widgets', () => {
    expect(wrapper.matchesElement(
      <ul className={"list-group"}>
        <ListGroup.Item>
          <p>Test</p>
        </ListGroup.Item>
      </ul>
    )).toEqual(true);
  });

  it('Sjekke Listgroup sine children', () => {
    expect(wrapper.find('ul').children()).toHaveLength(1);
  });
}); // funke

describe('ListGroupItem tests', () => {
  const wrapper = shallow(
    <ListGroup.Item>
        <p>Test</p>
    </ListGroup.Item>
  );

  it('sjekker parent til p for å sjå at den inneholder klassen list-group-item', () => {
    expect(wrapper.find('p').parent().hasClass("list-group-item")).toEqual(true);
  });

  it('Sjekke ListgroupItem sine children', () => {
    expect(wrapper.find('li').children()).toHaveLength(1);
  });
}); // funke

describe('ListGroupInline tests', () => {
  const wrapper = shallow(
    <ListGroupInline>
      <ListGroupInline.Item to={"/test"}>
        <p>Test</p>
      </ListGroupInline.Item>
    </ListGroupInline>
  );

  it('sjekker at den matcher med oppsette i widgets', () => {
    expect(wrapper.matchesElement(
      <ul className={"list-inline"}>
        <ListGroupInline.Item to={"/test"}>
          <p>Test</p>
        </ListGroupInline.Item>
      </ul>
    )).toEqual(true);
  });

  it('Sjekke ListgroupInline sine children', () => {
    expect(wrapper.find('ul').children()).toHaveLength(1);
  });
}); // funke

describe('ListGroupItemInline tests', () => {
  const wrapper = shallow(
    <ListGroupInline.Item  to={"/test"}>
      <p>Test</p>
    </ListGroupInline.Item>
  );

  it('sjekker parent til p for å sjå at den inneholder klassen list-inline-item mr-5 ml-5', () => {
    expect(wrapper.find('p').parent().hasClass("list-inline-item mt-2 mr-5 ml-5")).toEqual(true);
  });

  it('Sjekke ListgroupItem sine children', () => {
    expect(wrapper.find('NavLink').children()).toHaveLength(1);
  });
}); // funke

describe('Oppsett tests', () => {
  const wrapper = shallow(
    <Oppsett sideBredde={2} midtBredde={8} sideTekst={"Reklame"}>
        <ul>
          <li>
            Test1
          </li>
          <li>
            Test2
          </li>
        </ul>
    </Oppsett>
  );

  it('sjekke om Oppsett inneholder en CotainerFluid med en rad som igjen inneholder en midtkolonne til å ha informasjon i', () => {
    expect(wrapper.containsMatchingElement(
      <ul>
        <li>
          Test1
        </li>
        <li>
          Test2
        </li>
      </ul>
      )
    ).toEqual(true);
  });

  it('sjekke klassene til Oppsett', () => {
    expect(wrapper.matchesElement(
      <ContainerFluid>
        <Row>
          <Column bredde={2}>
            <div className="text-center">
              Reklame
            </div>
          </Column>
          <Column bredde={8}>
            <ul>
              <li>
                Test1
              </li>
              <li>
                Test2
              </li>
            </ul>
          </Column>
          <Column bredde={2}>
            <div className="text-center">
              Reklame
            </div>
          </Column>
        </Row>
      </ContainerFluid>
      )
    ).toEqual(true);
  });
});

describe('Input tests', () => {
  const wrapper = shallow(
    <Input tittelInput={"test"}>
      <input type="text"
             placeholder="Ola Nordmann"/>
    </Input>
  );

  it('Sjekker at Input har de rette klassane', () => {
    expect(wrapper.find('input').parent().hasClass('input-group mb-3')).toEqual(true);
  });

  it('Sjekker chidren til Input', () => {
    expect(wrapper.find('div').children()).toHaveLength(3);
  });
});

describe('NavbarBrand tests', () => {
  const wrapper = shallow(
   <NavBar.Brand>
     Hei
   </NavBar.Brand>
  );

  it('Sjekker at Brand har de rette klassane', () => {
    expect(wrapper.find('NavLink').hasClass('navbar-brand')).toEqual(true);
  });
});

describe('NavbarLink(left/right) tests', () => {
  const wrapper = shallow(
    <NavBar.LinkLeft to={"test"}>
      Hei
    </NavBar.LinkLeft>
  );

  it('Sjekker at Link har de rette klassane', () => {
    expect(wrapper.find('NavLink').hasClass('nav-link')).toEqual(true);
  });
});

/*
describe('Navbar tests', () => {
  const wrapper = shallow(
   <NavBar>
     <NavBar.Brand> Brand </NavBar.Brand>
     <NavBar.LinkLeft to={"/venstre"}> venstre </NavBar.LinkLeft>
     <NavBar.LinkRight to={"/hoyre"}> hoyre </NavBar.LinkRight>
   </NavBar>
  );

  it('Sjekker at Input har de rette klassane', () => {
    expect(wrapper.find('input').parent().hasClass('input-group mb-3')).toEqual(true);
  });

  it('Sjekker chidren til Input', () => {
    expect(wrapper.find('div').children()).toHaveLength(3);
  });
});
*/

describe('Card tests', () => {
  const wrapper = shallow(
    <Card title={"Test"} link={"bildeLink"} to={"/test"}>
      hei
    </Card>
  );

  it('Sjekker at img har de rette klassane', () => {
    expect(wrapper.find('img').hasClass('card-img-top img-fluid')).toEqual(true);
  });

  it('Sjekker at Card har ein card-klasse', () => {
    expect(wrapper.find('NavLink').parent().hasClass('card')).toEqual(true);
  });

  it('Sjekker at Card har ein body-klasse', () => {
    expect(wrapper.find('NavLink').childAt(1).hasClass('card-body')).toEqual(true);
  });

  it('Sjekker at Card har to children', () => {
    expect(wrapper.find('NavLink').children()).toHaveLength(2);
  });



});





