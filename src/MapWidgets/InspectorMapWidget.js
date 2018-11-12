import React, { Component } from 'react';
import {Map, View} from 'ol';
import VectorTile from 'ol/layer/VectorTile';
import Tile from 'ol/layer/Tile';
import TileDebug from 'ol/source/TileDebug';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import {createXYZ} from 'ol/tilegrid';
import {fromLonLat, toLonLat, tileUrlFunction} from 'ol/proj';
import {boundsFromLonLat, boundsToLonLat} from './OpenLayersMapWidget';
import './InspectorMapWidget.css';

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
    this.map = new Map({
      layers: [],
      target: this.refs.MapWidget,
      view: new View({
        center: fromLonLat(this.props.center),
        zoom: this.props.zoom
      })
    });
    this.tilegrid = createXYZ();
    this.map.on('click', this.fetchInspectAttributes.bind(this));
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
    this.layer = null;
    this.loadedTileset = this.props.activeTileset;
    if(!this.props.activeTileset) {
      return;
    }
    fetch('http://127.0.0.1:6767/' + this.props.activeTileset + '.json')
      .then(function(response){ return response.json() })
      .then(function(obj){ this.initMap(obj); }.bind(this));
  }

  initMap(data) {
    this.layer = new VectorTile({
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
    this.map.addLayer(this.layer);
    var tileDebugLayer = new Tile({
      source: new TileDebug({
        projection: 'EPSG:3857',
        tileGrid: this.tilegrid
      })
    });
    this.map.addLayer(tileDebugLayer);

    this.map.setView(new View({
      center: fromLonLat(this.props.center),
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
    var url = tileUrlFunction(tilecoord, 1, get('EPSG:3857'));
    fetch(url)
      .then(function(response){ return response.arrayBuffer() })
      .then(function(buffer){ this.parseInspectAttributes(buffer, tilecoord); }.bind(this));
  }

  parseInspectAttributes(buffer, tilecoord) {
    var format = new MVT();
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
    var extent = this.map.getView().calculateExtent(this.map.getSize());
    var center = toLonLat(this.map.getView().getCenter());
    this.props.storeExtent(boundsToLonLat(extent), center, this.map.getView().getZoom());
  }
}

export default InspectorMapWidget;
