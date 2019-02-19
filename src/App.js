import React, { Component } from 'react';
import './journeys.css';
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
import { faTree, faSpinner } from '@fortawesome/free-solid-svg-icons'

library.add(...[faTree,faSpinner])


class Journeys extends Component {
  render() {
    return (
    <Provider store={store}>
      <div className="container">
        <HeaderComponent></HeaderComponent>
        <nav>
        
          <Forest/>
        </nav>
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
