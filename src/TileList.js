import React, { Component } from 'react';
import './TileList.css';
import TileListEntry from './TileListEntry';


class TileList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var title = this.props.activeTileset ? "Tile sets:" : "Select tile set:";
    return (
      <div className="TileList">
      <div className="TileListTitle">{title}</div>
      {this.renderTileListEntries()}
      </div>
    );
  }

  renderTileListEntries() {
    return this.props.tilesets.map(entry => (
      <TileListEntry name={entry.name} layers={entry.layers} activeTileset={this.props.activeTileset} setTileset={this.props.setTileset} />
    ));
  }

}

export default TileList;
