import React, { Component } from 'react';
import './TileListEntry.css';
import classnames from 'classnames';


class TileListEntry extends Component {

  constructor(props) {
    super(props);
    this.setTileset = this.setTileset.bind(this);
  }
  render() {
    var classes = classnames({
      "TileListEntry": true,
      "ActiveTileListEntry": this.props.app.state.tileset === this.props.name
    });
    return (
      <div className={classes} onClick={this.setTileset}>
        {this.props.name}
      </div>
    )
  }
  setTileset() {
    this.props.app.setState({tileset: this.props.name});
  }
}

export default TileListEntry;
