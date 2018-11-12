import React, { Component } from 'react';
import './App.css';
import './index.css';
import 'ol/ol.css';
import TileList from './TileList';
import InfoWidget from './InfoWidget';
import MapboxGLMapWidget from './MapWidgets/MapboxGLMapWidget';
import OpenLayersMapWidget from './MapWidgets/OpenLayersMapWidget';
import XRayMapWidget from './MapWidgets/XRayMapWidget';
import InspectorMapWidget from './MapWidgets/InspectorMapWidget';
import TitleBar from './TitleBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tilesets: [],
      tileset: null,
      viewer: 'Info',
      bounds: null,
      center: [0, 0],
      zoom: 2
    };
  }

  componentDidMount() {
    fetch('http://127.0.0.1:6767/index.json')
      .then(function(response){ return response.json() })
      .then(function(obj){ this.populateTileList(obj); }.bind(this));
  }

  render() {
    return (
      <div className="App">
        <TileList tilesets={this.state.tilesets} activeTileset={this.state.tileset} setTileset={this.setTileset.bind(this)} />
        <TitleBar activeTileset={this.state.tileset} activeViewer={this.state.viewer} setViewer={this.setViewer.bind(this)} />
        {this.renderMapWidget()}
      </div>
    );
  }

  populateTileList(object) {
    this.setState({tilesets: object.tilesets});
    if (object.tilesets.length > 0) {
      this.setTileset(object.tilesets[0].name);
    }
  }

  setTileset(tileset) {
    this.setState({tileset: tileset});
    var bnd = this.state.tilesets.find(t => t.name === tileset).bounds;
    if (bnd) this.setState({bounds: bnd});
  }

  setViewer(viewer) {
    this.setState({viewer: viewer});
  }

  storeExtent(bounds, center, zoom) {
    if (bounds !== null) this.setState({bounds: bounds});
    this.setState({center: center, zoom: zoom});
  }

  renderMapWidget() {
    if(this.state.viewer === 'Info') {
      return (<InfoWidget tilesets={this.state.tilesets}
                          activeTileset={this.state.tileset}
                          center={this.state.center}
                          zoom={this.state.zoom}/>);
    } else if(this.state.viewer === 'Mapbox GL') {
      return (<MapboxGLMapWidget activeTileset={this.state.tileset}
                                 storeExtent={this.storeExtent.bind(this)}
                                 bounds={this.state.bounds}
                                 center={this.state.center}
                                 zoom={this.state.zoom}/>);
    } else if(this.state.viewer === 'OpenLayers') {
      return (<OpenLayersMapWidget activeTileset={this.state.tileset}
                                   storeExtent={this.storeExtent.bind(this)}
                                   bounds={this.state.bounds}
                                   center={this.state.center}
                                   zoom={this.state.zoom}/>);
    } else if(this.state.viewer === 'X-Ray') {
      return (<XRayMapWidget activeTileset={this.state.tileset}
                             storeExtent={this.storeExtent.bind(this)}
                             bounds={this.state.bounds}
                             center={this.state.center}
                             zoom={this.state.zoom}/>);
    } else if(this.state.viewer === 'Inspector') {
      return (<InspectorMapWidget activeTileset={this.state.tileset}
                             storeExtent={this.storeExtent.bind(this)}
                             bounds={this.state.bounds}
                             center={this.state.center}
                             zoom={this.state.zoom}/>);
    }
    return null;
  }
}

export default App;
