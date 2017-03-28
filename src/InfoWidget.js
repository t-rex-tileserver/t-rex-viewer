import React, { Component } from 'react';
import './InfoWidget.css';

class InfoWidget extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var pbfbaseurl = window.location.protocol + '//' + window.location.host + '/';
    var pbfurl = pbfbaseurl + this.props.activeTileset + '/{z}/{x}/{y}.pbf';
    var styleurl = pbfbaseurl + this.props.activeTileset + '.style.json';
    var maputnikurl = 'http://127.0.0.1:6767/maputnik.html?style=' + styleurl;
    var tileset = this.props.tilesets.find(ts => ts.name === this.props.activeTileset);
    var layers = typeof tileset !== 'undefined' ? tileset.layers : [];
    return (
      <div className="InfoWidget">
        <h2>Tileset: {this.props.activeTileset}</h2>
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
          <li>Edit Style with <a href={maputnikurl} target="maputnik">Maputnik</a></li>
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
