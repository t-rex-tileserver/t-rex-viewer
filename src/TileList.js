import React, { Component } from 'react';
import './TileList.css';
import TileListEntry from './TileListEntry';


class TileList extends Component {

  constructor(props) {
    super(props);
    this.state = { tilesets: [] };
  }

  componentDidMount() {
    fetch('http://localhost:6767/index.json')
      .then(function(response){ return response.json() })
      .then(function(obj){ this.populateTileList(obj); }.bind(this));
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
    return this.state.tilesets.map(entry => (
      <TileListEntry name={entry.name} layers={entry.layers} activeTileset={this.props.activeTileset} setTileset={this.props.setTileset} />
    ));
  }

  populateTileList(object) {
    this.setState({tilesets: object.tilesets});
  }

}

export default TileList;
