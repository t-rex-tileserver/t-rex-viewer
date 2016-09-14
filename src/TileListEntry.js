import React, { Component } from 'react';
import './TileListEntry.css';
import classnames from 'classnames';


class TileListEntry extends Component {

  render() {
    var classes = classnames({
      "TileListEntry": true,
      "ActiveTileListEntry": this.props.activeTileset === this.props.name
    });
    return (
      <div className={classes} onClick={this.setTileset.bind(this)}>{this.props.name}<ul>
        {this.props.layers.map(entry =>
          (<li>{entry.name} ({entry.geometry_type})</li>)
        )}
      </ul></div>
    )
  }

  setTileset() {
    this.props.setTileset(this.props.name);
  }
}

export default TileListEntry;
