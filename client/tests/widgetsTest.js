// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert,Overskrift } from '../src/widgets.js';
import { shallow, mount } from 'enzyme';
import { Column, ContainerFluid, Row, ListGroup, ListGroupInline,Oppsett,Input} from '../src/widgets';

describe('Alert tests', () => {
  const wrapper = shallow(<Alert />);

  it('initially', () => {
    let instance: ?Alert = Alert.instance();
    expect(typeof instance).toEqual('object');
    if (instance) expect(instance.alerts).toEqual([]);

    expect(wrapper.find('button.close')).toHaveLength(0);
  });

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
  });
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
      <li>
        <p>Test</p>
      </li>
    </ListGroup>
  );

  it('sjekker parent til li for å sjå at den inneholder klassen list-group', () => {
    expect(wrapper.find('li').parent().hasClass("list-group")).toEqual(true);
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
      <li nokkel={1} to={"/test"}>
        <p>Test</p>
      </li>
    </ListGroupInline>
  );

  it('sjekker parent til li for å sjå at den inneholder klassen list-inline', () => {
    expect(wrapper.find('li').parent().hasClass("list-inline")).toEqual(true);
  });

  it('Sjekke ListgroupInline sine children', () => {
    expect(wrapper.find('ul').children()).toHaveLength(1);
  });
}); // funke

describe('ListGroupItemInline tests', () => {
  const wrapper = shallow(
    <ListGroupInlInline.Item>
      <p>Test</p>
    </ListGroupInlInline.Item>
  );

  it('sjekker parent til p for å sjå at den inneholder klassen list-inline-item mr-5 ml-5', () => {
    expect(wrapper.find('p').parent().hasClass("list-inline-item mr-5 ml-5")).toEqual(true);
  });

  it('Sjekke ListgroupItem sine children', () => {
    expect(wrapper.find('li').children()).toHaveLength(1);
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




