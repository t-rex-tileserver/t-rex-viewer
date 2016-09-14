import React, { Component } from 'react';
import './XRayMapWidget.css';

class XRayMapWidget extends Component {

  constructor(props) {
    super(props);
    this.state = {props: {}}
    this.loadedTileset = "";
  }

  render() {
    return (
      <div className="XRayContainer">
        <div className="XRayMapWidget" ref="MapWidget"></div>
        <div className="XRayPropertiesList" ref="PropertiesList">
        {this.renderProperties()}
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.map = new ol.Map({
      layers: [],
      target: this.refs.MapWidget,
      view: new ol.View({
        center: [0, 0],
        zoom: 2
      })
    });
    this.map.on('pointermove', this.fetchProperties.bind(this));
    this.updateMap();
  }

  componentDidUpdate() {
    this.updateMap();
  }

  updateMap() {
    if(this.props.activeTileset === this.loadedTileset) {
      return;
    }
    var self = this;
    this.map.getLayers().forEach(
      function(layer) { self.map.removeLayer(layer); }
    );
    if(!this.props.activeTileset) {
      return;
    }
    fetch('http://localhost:6767/' + this.props.activeTileset + '.json')
      .then(function(response){ return response.json() })
      .then(function(obj){ this.initMap(obj); }.bind(this));
  }

  initMap(data) {
    var layer = new ol.layer.VectorTile({
      preload: Infinity,
      source: new ol.source.VectorTile({
        format: new ol.format.MVT(),
        tileGrid: new ol.tilegrid.createXYZ({
          minZoom: data.minzoom,
          maxZoom: data.maxzoom
        }),
        tilePixelRatio: 16,
        urls: data['tiles']
      })
    });
    this.map.addLayer(layer);
    this.loadedTileset = this.props.activeTileset;
  }

  fetchProperties(e) {
    var props = {};
    this.map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
      props = Object.assign(props, feature.getProperties());
    });
    this.setState({props: props});
  }

  renderProperties() {
    var self = this;
    return Object.keys(this.state.props).map(key =>
      (<div>{key}: {self.state.props[key]} </div>)
    );
  }

}

export default XRayMapWidget;
