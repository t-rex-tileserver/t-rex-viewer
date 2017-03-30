import React, { Component } from 'react';
import './InfoWidget.css';

class InfoWidget extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var tsname = this.props.activeTileset;
    var pbfbaseurl = window.location.protocol + '//' + window.location.host + '/';
    var pbfurl = pbfbaseurl + tsname + '/{z}/{x}/{y}.pbf';
    var styleurl = pbfbaseurl + tsname + '.style.json';
    var maputnikurl = 'http://127.0.0.1:6767/maputnik.html?style=' + styleurl;
    var tileset = this.props.tilesets.filter(function(ts) {
      return (ts.name === tsname);
    });
    var layers = tileset.length > 0 ? tileset[0].layers : [];
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
          <li>Style map with <a href={maputnikurl} target="maputnik">Maputnik</a></li>
          </ul>
        </p>
        {/*<p>Snippets:
          <ul>
          <li>MapBox GL JS</li>
          <li>OpenLayers</li>
          </ul>
        </p>*/}
      </div>
    )
  }
}

export default InfoWidget;
