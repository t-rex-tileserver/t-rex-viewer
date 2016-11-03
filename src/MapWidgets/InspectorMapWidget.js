import React, { Component } from 'react';
import './InspectorMapWidget.css';
var ol = require('openlayers/build/ol-custom');

class InspectorMapWidget extends Component {

  constructor(props) {
    super(props);
    this.loadedTileset = "";
    this.layer = null;
    this.state = {
      tile: "",
      pbfSize: 0,
      features: 0,
      layers: {},
      layerFeatureCounts: {},
      layerClasses: {}};
  }

  render() {
    return (
      <div className="InspectorContainer">
        <div className="InspectorMapWidget" ref="MapWidget"></div>
        {this.renderInspectAttributes()}
      </div>
    )
  }

  componentDidMount() {
    this.map = new ol.Map({
      layers: [],
      target: this.refs.MapWidget,
      view: new ol.View({
        center: this.props.center,
        zoom: this.props.zoom
      })
    });
    this.tilegrid = ol.tilegrid.createXYZ();
    this.map.on('click', this.fetchInspectAttributes.bind(this));
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
    this.layer = null;
    this.loadedTileset = this.props.activeTileset;
    if(!this.props.activeTileset) {
      return;
    }
    fetch('http://localhost:6767/' + this.props.activeTileset + '.json')
      .then(function(response){ return response.json() })
      .then(function(obj){ this.initMap(obj); }.bind(this));
  }

  initMap(data) {
    this.layer = new ol.layer.VectorTile({
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
    this.map.addLayer(this.layer);
    var tileDebugLayer = new ol.layer.Tile({
      source: new ol.source.TileDebug({
        projection: 'EPSG:3857',
        tileGrid: this.tilegrid
      })
    });
    this.map.addLayer(tileDebugLayer);

    this.map.setView(new ol.View({
      center: this.props.center,
      zoom: this.props.zoom
    }));
  }

  fetchInspectAttributes(e) {
    if(this.layer === null) {
      return;
    }
    var tilecoord = this.tilegrid.getTileCoordForCoordAndResolution(
      e.coordinate, this.map.getView().getResolution());
    var tileUrlFunction = this.layer.getSource().getTileUrlFunction();
    var url = tileUrlFunction(tilecoord, 1, ol.proj.get('EPSG:3857'));
    fetch(url)
      .then(function(response){ return response.arrayBuffer() })
      .then(function(buffer){ this.parseInspectAttributes(buffer, tilecoord); }.bind(this));
  }

  parseInspectAttributes(buffer, tilecoord) {
    var format = new ol.format.MVT();
    var features = format.readFeatures(buffer);
    var layers = {};
    var layerFeatureCounts = {};
    var layerClasses = {};
    features.forEach(function(f) {
      var layer = f.get('layer');
      var cls = f.get('class');
      var type = f.get('type');

      if (!(layer in layers)) {
        layers[layer] = {};
        layerClasses[layer] = {};
        layerFeatureCounts[layer] = 0;
      }
      layerFeatureCounts[layer]++;

      for (var key in f.getProperties()) {
        if (key !== 'layer' && key !== 'class' && key !== 'type')
          layers[layer][key] = true;
      }

      if (cls) {
        if (!(cls in layerClasses[layer])) {
          layerClasses[layer][cls] = {};
        }
        if (type) {
          if (!(type in layerClasses[layer][cls])) {
            layerClasses[layer][cls][type] = true;
          }
        }
      }
    });
    this.setState({
      tile: tilecoord[0] + '/' + (-tilecoord[2] - 1) + '/' + tilecoord[1],
      pbfSize: buffer.byteLength + " B (" + (buffer.byteLength / 1024).toFixed(2) + " kB)",
      features: features.length,
      layers: layers,
      layerFeatureCounts: layerFeatureCounts,
      layerClasses: layerClasses});
  }

  renderInspectAttributes() {
    if(this.state.tile === "")
    {
      return;
    }
    var self = this;
    return (
      <div className="InspectorResultList">
        <div>Tile: {this.state.tile}</div>
        <div>PBF size: {this.state.pbfSize}</div>
        <div>Features: {this.state.features}</div>
        <div>Layers: {Object.keys(this.state.layers).length}</div>
        <div></div>
        {Object.keys(self.state.layers).map(layer =>
          (<div key={layer}>#{layer} ({self.state.layerFeatureCounts[layer]} features)<ul>
          {Object.keys(self.state.layers[layer]).map(key => (<li key={key}>[{key}]</li>))}
          {Object.keys(self.state.layerClasses[layer]).length === 0 ?
            (<li>No class</li>)
           :
            Object.keys(self.state.layerClasses[layer]).map(cls =>
              (<li>{cls}<ul>)
              {Object.keys(self.state.layerClasses[layer][cls]).map(type =>
                (<li>{type}</li>)
              )}
              (</ul></li>)
            )
          }
          </ul></div>)
        )}
      </div>
    );
  }

  storeExtent(e) {
    this.props.storeExtent(this.map.getView().getCenter(), this.map.getView().getZoom());
 }
}

export default InspectorMapWidget;
