import React, { Component } from 'react';
import './styles/journeys.scss';
import './bootstrap.min.css';
import Forest from './components/Forest';
import Tree from './components/Tree';
import Footer from './components/Footer';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import HeaderComponent from './components/HeaderComponent';
import { Provider } from 'react-redux';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTree, faSpinner, faHome } from '@fortawesome/free-solid-svg-icons'

import SideNav, { Toggle, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
 
// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


library.add(...[faTree,faSpinner,faHome])



class Journeys extends Component {
  render() {
    return (
    <Provider store={store}>
      <div className="container">
        <HeaderComponent></HeaderComponent>
        <SideNav>
          <Toggle/>
          <SideNav.Nav defaultSelected="home">
          <NavItem eventKey="home">
            <NavIcon>
                <FontAwesomeIcon icon="tree" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
              <Forest/>
            </NavText>
        </NavItem>
          </SideNav.Nav>
        </SideNav>
        <main>
          {/* <Content /> */}
          <Tree/>
        </main>
        <Footer></Footer>
      </div>
    </Provider>
    );
  }
}

export default Journeys;
