import React, { Component } from 'react';
import './XRayMapWidget.css';
var ol = require('openlayers/build/ol-custom');

class XRayMapWidget extends Component {

  constructor(props) {
    super(props);
    this.state = {attribs: {}}
    this.loadedTileset = "";
  }

  render() {
    return (
      <div className="XRayContainer">
        <div className="XRayMapWidget" ref="MapWidget"></div>
        {this.renderAttributes()}
      </div>
    )
  }

  componentDidMount() {
    this.map = new ol.Map({
      layers: [],
      target: this.refs.MapWidget,
      view: new ol.View({
        center: ol.proj.fromLonLat(this.props.center),
        zoom: this.props.zoom
      })
    });
    this.map.on('pointermove', this.fetchAttributes.bind(this));
    this.map.on('postrender', this.storeExtent.bind(this));
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
    this.loadedTileset = this.props.activeTileset;
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
    this.map.setView(new ol.View({
      center: ol.proj.fromLonLat(this.props.center),
      zoom: this.props.zoom
    }));
  }

  fetchAttributes(e) {
    var attribs = {};
    this.map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
      attribs = Object.assign(attribs, feature.getProperties());
    });
    this.setState({attribs: attribs});
  }

  renderAttributes() {
    if(Object.keys(this.state.attribs).length > 0)
    {
      var self = this;
      return (
        <div className="XRayAttributesList">
        {Object.keys(this.state.attribs).map(key =>
          (<div>{key}: {self.state.attribs[key]} </div>)
        )}
        </div>
      );
    }
  }

  storeExtent(e) {
    var ll = ol.proj.toLonLat(this.map.getView().getCenter());
    this.props.storeExtent(ll, this.map.getView().getZoom());
 }
}

export default XRayMapWidget;
