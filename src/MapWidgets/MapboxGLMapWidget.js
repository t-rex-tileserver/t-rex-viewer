import React, { Component } from 'react';
import './MapboxGLMapWidget.css';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

class MapboxGLMapWidget extends Component {

  constructor(props) {
    super(props);
    this.state = {attribs: {}}
    this.loadedTileset = "";
  }

  render() {
    return (
      <div className="MbGLContainer">
        <div className="MbGLMapWidget" ref="MapWidget"></div>
      </div>
    )
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
          container: this.refs.MapWidget,
          style: 'http://127.0.0.1:6767/' + this.props.activeTileset + '.style.json',
          center: this.props.center,
          zoom: this.props.zoom
    });
    this.map.on('moveend', this.storeExtent.bind(this)); 
  }

  componentDidUpdate() {
    if(this.props.activeTileset === this.loadedTileset) {
      return;
    }
    var self = this;
    this.loadedTileset = this.props.activeTileset;
    if(!this.props.activeTileset) {
      return;
    }
    this.map.setStyle('http://127.0.0.1:6767/' + this.loadedTileset + '.style.json');
  }

  storeExtent(e) {
    this.props.storeExtent(this.map.getCenter().toArray(), this.map.getZoom());
 }
}

export default MapboxGLMapWidget;
