import React, { Component } from 'react';
import {Map, View} from 'ol';
import VectorTile from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import {createXYZ} from 'ol/tilegrid';
import {fromLonLat, toLonLat} from 'ol/proj';
import {boundsFromLonLat, boundsToLonLat} from './OpenLayersMapWidget';
import './XRayMapWidget.css';

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
    this.map = new Map({
      layers: [],
      target: this.refs.MapWidget,
      view: new View({
        center: fromLonLat(this.props.center),
        zoom: this.props.zoom
      })
    });
    this.map.on('pointermove', this.fetchAttributes.bind(this));
    this.map.on('postrender', this.storeExtent.bind(this));
    if (this.props.bounds !== null) {
      this.map.getView().fit(boundsFromLonLat(this.props.bounds), {padding: [10, 10, 10, 10]});
    }
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
    fetch('http://127.0.0.1:6767/' + this.props.activeTileset + '.json')
      .then(function(response){ return response.json() })
      .then(function(obj){ this.initMap(obj); }.bind(this));
  }

  initMap(data) {
    var layer = new VectorTile({
      preload: Infinity,
      source: new VectorTileSource({
        format: new MVT(),
        tileGrid: new createXYZ({
          minZoom: data.minzoom,
          maxZoom: data.maxzoom
        }),
        tilePixelRatio: 16,
        urls: data['tiles']
      })
    });
    this.map.addLayer(layer);
    this.map.setView(new View({
      center: fromLonLat(this.props.center),
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
    var extent = this.map.getView().calculateExtent(this.map.getSize());
    var center = toLonLat(this.map.getView().getCenter());
    this.props.storeExtent(boundsToLonLat(extent), center, this.map.getView().getZoom());
  }
}

export default XRayMapWidget;
