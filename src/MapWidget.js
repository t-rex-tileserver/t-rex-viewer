import React, { Component } from 'react';
import './MapWidget.css';

// http://tech.oyster.com/using-react-and-jquery-together/

class MapWidget extends Component {

  render() {
    return (
      <div className="MapWidget" id="MapWidget" ref="MapWidget"></div>
    )
  }
  componentDidMount() {
    this.map = new ol.Map({
      layers: [],
      target: 'MapWidget',
      view: new ol.View({
        center: [0, 0],
        zoom: 2
      })
    });

    this.renderMapWidget();
  }
  componentDidUpdate() {
    this.renderMapWidget();
  }
  renderMapWidget() {
    var self = this;
    this.map.getLayers().forEach(
      function(layer) { self.map.removeLayer(layer); }
    );
    if(!this.props.tileset) {
      return;
    }
    var layer = new ol.layer.VectorTile({
      source: new ol.source.VectorTile({
        format: new ol.format.MVT(),
        tileGrid: ol.tilegrid.createXYZ({maxZoom: 22}),
        tilePixelRatio: 16,
        url: 'http://127.0.0.1:6767/' + this.props.tileset + '/{z}/{x}/{y}.pbf'
      })
    });
    this.map.addLayer(layer);
  }

}

export default MapWidget;
