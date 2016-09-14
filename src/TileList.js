import React, { Component } from 'react';
import './TileList.css';
import TileListEntry from './TileListEntry';


class TileList extends Component {

  constructor(props) {
    super(props);
    this.state = { tiles: [] };
  }

  componentDidMount() {
    fetch('http://localhost:6767/index.json')
      .then(function(response){ return response.json() })
      .then(function(obj){ this.populateTileList(obj); }.bind(this));
  }

  render() {
    return (
      <div className="TileList">
      <div className="TileListTitle">Tile sets:</div>
      {this.renderTileListEntries()}
      </div>
    );
  }

  renderTileListEntries() {
    return this.state.tiles.map(entry => (
    <TileListEntry name={entry.name} activeTileset={this.props.activeTileset} setTileset={this.props.setTileset} />
  ));
  }

  populateTileList(object) {
    var listEntries = [];
    object.tilesets.forEach((tileset) => {
      listEntries.push({'name': tileset.name, 'tilejson': tileset.tilejson});
    });
    this.setState({tiles: listEntries});
  }

}

export default TileList;
