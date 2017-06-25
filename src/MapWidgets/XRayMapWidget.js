import React, { Component } from 'react';
import Map from 'ol/map';
import View from 'ol/view';
import VectorTile from 'ol/layer/vectortile';
import VectorTileSource from 'ol/source/vectortile';
import MVT from 'ol/format/mvt';
import tilegrid from 'ol/tilegrid';
import proj from 'ol/proj';
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
        center: proj.fromLonLat(this.props.center),
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
    fetch('http://127.0.0.1:6767/' + this.props.activeTileset + '.json')
      .then(function(response){ return response.json() })
      .then(function(obj){ this.initMap(obj); }.bind(this));
  }

  initMap(data) {
    var layer = new VectorTile({
      preload: Infinity,
      source: new VectorTileSource({
        format: new MVT(),
        tileGrid: new tilegrid.createXYZ({
          minZoom: data.minzoom,
          maxZoom: data.maxzoom
        }),
        tilePixelRatio: 16,
        urls: data['tiles']
      })
    });
    this.map.addLayer(layer);
    this.map.setView(new View({
      center: proj.fromLonLat(this.props.center),
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
    var ll = proj.toLonLat(this.map.getView().getCenter());
    this.props.storeExtent(ll, this.map.getView().getZoom());
 }
}

export default XRayMapWidget;
