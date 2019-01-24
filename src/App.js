import React, { Component } from 'react';
import './journeys.css';
import Forest from './components/Forest';
import Tree from './components/Tree';
import Footer from './components/Footer';

import HeaderComponent from './components/HeaderComponent';
import { Provider } from 'react-redux';
import store from './store';

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
