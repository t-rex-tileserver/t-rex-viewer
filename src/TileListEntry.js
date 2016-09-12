import React, { Component } from 'react';
import './TileListEntry.css';


class TileListEntry extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="TileListEntry">
        {this.props.name}
      </div>
    )
  }
}

export default TileListEntry;
