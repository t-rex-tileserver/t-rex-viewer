import React, { Component } from 'react';
import './OpenLayersMapWidget.css';

class OpenLayersMapWidget extends Component {

  constructor(props) {
    super(props);
    this.loadedTileset = "";
  }

  render() {
    return (
      <div className="OpenLayersMapWidget" ref="MapWidget"></div>
    )
  }

  componentDidMount() {
    this.map = new ol.Map({
      layers: [],
      target: this.refs.MapWidget,
      view: new ol.View({
        center: this.props.center,
        zoom: this.props.zoom,
      })
    });
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
    var layer = new ol.layer.VectorTile({
      source: new ol.source.VectorTile({
        format: new ol.format.MVT(),
        tileGrid: ol.tilegrid.createXYZ({maxZoom: 22}),
        tilePixelRatio: 16,
        url: 'http://127.0.0.1:6767/' + this.props.activeTileset + '/{z}/{x}/{y}.pbf'
      })
    });
    this.map.addLayer(layer);
    this.map.setView(new ol.View({
      center: [0, 0],
      zoom: 2
    }));
  }

  storeExtent(e) {
    this.props.storeExtent(this.map.getView().getCenter(), this.map.getView().getZoom());
 }

}

export default OpenLayersMapWidget;
