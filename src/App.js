import React, { Component } from 'react';
import './App.css';
import TileList from './TileList';
import OpenLayersMapWidget from './MapWidgets/OpenLayersMapWidget';
import XRayMapWidget from './MapWidgets/XRayMapWidget';
import TitleBar from './TitleBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tileset: null,
      viewer: 'OpenLayers',
      center: [0, 0],
      zoom: 2
    };
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
    this.setState({center: [0, 0], zoom: 2, tileset: tileset});
  }

  setViewer(viewer) {
    this.setState({viewer: viewer});
  }

  storeExtent(center, zoom) {
    this.setState({center: center, zoom: zoom});
  }

  renderMapWidget() {
    if(this.state.viewer === 'OpenLayers') {
      return (<OpenLayersMapWidget activeTileset={this.state.tileset}
                                   storeExtent={this.storeExtent.bind(this)}
                                   center={this.state.center}
                                   zoom={this.state.zoom}/>);
    } else if(this.state.viewer === 'X-Ray') {
      return (<XRayMapWidget activeTileset={this.state.tileset}
                             storeExtent={this.storeExtent.bind(this)}
                             center={this.state.center}
                             zoom={this.state.zoom}/>);
    }
    return null;
  }
}

export default App;
