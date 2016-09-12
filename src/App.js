import React, { Component } from 'react';
import './App.css';
import TileList from './TileList';
import MapWidget from './MapWidget';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {tileset: null};
  }
  render() {
    return (
      <div className="App">
        <TileList app={this} />
        <MapWidget tileset={this.state.tileset} />
      </div>
    );
  }
}

export default App;
