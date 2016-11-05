import React, { Component } from 'react';
import './TitleBar.css';
import classnames from 'classnames';

class ViewerSelector extends Component {

  render() {
    var classes = classnames({
      "ViewerSelector": true,
      "ActiveViewerSelector": this.props.activeViewer === this.props.name
    });
    return (
      <span className={classes} onClick={this.setViewer.bind(this)}>{this.props.name}</span>
    )
  }

  setViewer() {
    this.props.setViewer(this.props.name);
  }

}

class TitleBar extends Component {

  constructor(props) {
    super(props);
    this.state = {viewers: [
      {name: "Inspector", key: "inspector"},
      {name: "X-Ray", key: "xray"},
      {name: "OpenLayers", key: "openlayers"},
      {name: "Mapbox GL", key: "mbgl"}]
    };
  }

  render() {
    return (
      <div className="TitleBar">
      {this.props.activeTileset}
      {this.renderViewerSelectors()}
      </div>
    );
  }

  renderViewerSelectors() {
    return this.state.viewers.map(viewer => (
      <ViewerSelector name={viewer.name} key={viewer.key} activeViewer={this.props.activeViewer} setViewer={this.props.setViewer} />
    ));
  }

}

export default TitleBar;
