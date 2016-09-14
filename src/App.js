import React, { Component } from 'react';
import './App.css';
import TileList from './TileList';
import OpenLayersMapWidget from './MapWidgets/OpenLayersMapWidget';
import XRayMapWidget from './MapWidgets/XRayMapWidget';
import TitleBar from './TitleBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {tileset: null, viewer: 'OpenLayers'};
  }
  render() {
    return (
      <div className="App">
        <TileList activeTileset={this.state.tileset} setTileset={this.setTileset.bind(this)} />
        <TitleBar activeTileset={this.state.tileset} activeViewer={this.state.viewer} setViewer={this.setViewer.bind(this)} />
        {this.renderMapWidget()}
      </div>
    );
  }

  setTileset(tileset) {
    this.setState({tileset: tileset});
  }

  setViewer(viewer) {
    this.setState({viewer: viewer});
  }
  
  renderMapWidget() {
    if(this.state.viewer === 'OpenLayers') {
      return (<OpenLayersMapWidget activeTileset={this.state.tileset} />);
    } else if(this.state.viewer === 'X-Ray') {
      return (<XRayMapWidget activeTileset={this.state.tileset} />);
    }
    return null;
  }
}

export default App;
