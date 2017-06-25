import React, { Component } from 'react';
import Map from 'ol/map';
import View from 'ol/view';
import VectorTile from 'ol/layer/vectortile';
import VectorTileSource from 'ol/source/vectortile';
import MVT from 'ol/format/mvt';
import tilegrid from 'ol/tilegrid';
import proj from 'ol/proj';
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
    this.map = new Map({
      layers: [],
      target: this.refs.MapWidget,
      view: new View({
        center: proj.fromLonLat(this.props.center),
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
    var layer = new VectorTile({
      source: new VectorTileSource({
        format: new MVT(),
        tileGrid: tilegrid.createXYZ({maxZoom: 22}),
        tilePixelRatio: 16,
        url: 'http://127.0.0.1:6767/' + this.props.activeTileset + '/{z}/{x}/{y}.pbf'
      })
    });
    this.map.addLayer(layer);
    if (this.props.bounds !== null) {
      this.map.getView().fit(boundsFromLonLat(this.props.bounds), {padding: [10, 10, 10, 10]});
    }
  }

  storeExtent(e) {
    var extent = this.map.getView().calculateExtent(this.map.getSize());
    var center = proj.toLonLat(this.map.getView().getCenter());
    this.props.storeExtent(boundsToLonLat(extent), center, this.map.getView().getZoom());
  }

}

export function boundsToLonLat(extent) {
    var min_ll = proj.toLonLat([extent[0], extent[1]]);
    var max_ll = proj.toLonLat([extent[2], extent[3]]);
    return min_ll.concat(max_ll);
}

export function boundsFromLonLat(extent) {
    var minxy = proj.fromLonLat([extent[0], extent[1]]);
    var maxxy = proj.fromLonLat([extent[2], extent[3]]);
    return minxy.concat(maxxy);
}


export default OpenLayersMapWidget;
