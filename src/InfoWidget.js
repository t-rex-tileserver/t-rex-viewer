import React, { Component } from 'react';
import './InfoWidget.css';

class CodeWidget extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <pre className="CodeWidget">{this.props.code}</pre>
    )
  }
}

class InfoWidget extends Component {

  constructor(props) {
    super(props);
    this.state = { viewer: 'mbgl' };
  }

  render() {
    var tsname = this.props.activeTileset;
    var pbfbaseurl = window.location.protocol + '//' + window.location.host + '/';
    var pbfurl = pbfbaseurl + tsname + '/{z}/{x}/{y}.pbf';
    var styleurl = pbfbaseurl + tsname + '.style.json';
    var tilejsonurl = pbfbaseurl + tsname + '.json';
    var maputnikurl = 'http://127.0.0.1:6767/maputnik.html?style=' + styleurl;
    var tileset = this.props.tilesets.filter(function(ts) {
      return (ts.name === tsname);
    });
    var layers = tileset.length > 0 ? tileset[0].layers : [];
    var codeString = this.state.viewer === 'mbgl' ?
      this.snippet_mbgl(styleurl) :
      this.snippet_openlayers(pbfurl, styleurl);
    return (
      <div className="InfoWidget">
        <h2>Tileset: {tsname}</h2>
        <p>Layers:
          <ul>
          {layers.map(entry =>
            (<li>{entry.name} ({entry.geometry_type})</li>)
          )}
          </ul>
        </p>
        <p>Endpoints:
          <ul>
          <li>Tiles: <code>{pbfurl}</code></li>
          <li>Style JSON: <a href={styleurl}>{styleurl}</a></li>
          <li>TileJSON: <a href={tilejsonurl}>{tilejsonurl}</a></li>
          <li>Style map with <a href={maputnikurl} target="maputnik">Maputnik</a></li>
          </ul>
        </p>
        <p>Snippets:
          <ul>
          <li><a href="#" onClick={this.setViewer.bind(this, 'mbgl')}>MapBox GL JS</a></li>
          <li><a href="#" onClick={this.setViewer.bind(this, 'openlayers')}>OpenLayers</a></li>
          </ul>
          <CodeWidget code={codeString}/>
        </p>
      </div>
    )
  }

  setViewer(viewer) {
    this.setState({viewer: viewer});
  }

  snippet_mbgl(styleurl) {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8' />
    <title></title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.34.0/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.34.0/mapbox-gl.css' rel='stylesheet' />
    <style>
      body { margin:0; padding:0; }
      #map { position:absolute; top:0; bottom:0; width:100%; }
    </style>
  </head>
  <body>
    <div id='map'></div>
    <script>
      var map = new mapboxgl.Map({
          container: 'map',
          style: '${styleurl}',
          center: [0, 0],
          zoom: 2
      });
    </script>
  </body>
</html>
`;
  }

  snippet_openlayers(pbfurl, styleurl) {
    return `<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <link rel="stylesheet" href="https://openlayers.org/en/v4.0.1/css/ol.css" type="text/css">
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <script src="https://openlayers.org/en/v4.0.1/build/ol.js"></script>
  </head>
  <body>
    <div id="map" class="map"></div>
    <script>
      var map = new ol.Map({
        layers: [
          new ol.layer.VectorTile({
            source: new ol.source.VectorTile({
              format: new ol.format.MVT(),
              tileGrid: ol.tilegrid.createXYZ({maxZoom: 22}),
              tilePixelRatio: 16,
              url: '${pbfurl}'
            })
          })
        ],
        target: 'map',
        view: new ol.View({
          center: [0, 0],
          zoom: 2
        })
      });
    </script>
  </body>
</html>
`;
  }

}

export default InfoWidget;
