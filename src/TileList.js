import React, { Component } from 'react';
import './TileList.css';
import TileListEntry from './TileListEntry';


class TileList extends Component {

  constructor(props) {
    super(props);
    this.state = { tiles: [] };
    fetch('http://localhost:6767/index.json', {mode: 'no-cors'})
      .then(function(response){ return response.json() })
      .then(function(obj){ this.populateTileList(); });
  }

  render() {
    return (
      <div className="TileList">
      {this.renderTileListEntries()}
      </div>
    );
  }

  renderTileListEntries() {
    return this.state.tiles.map(entry => (
    <TileListEntry name={entry['name]']} />
  ));
  }

  populateTileList(object) {
    var listEntries = [];
    object['tilesets'].foreach((tileset) => {
      listEntries.push({'name': tileset['name'], 'tilejson': tileset['tilejson']});
    });
    this.setState({tiles: listEntries});
  }

}

export default TileList;
