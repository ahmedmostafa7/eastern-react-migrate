import React, { Component } from "react";

export class number extends Component {
  render() {
    return (
      <div>
        {this.props.data && (+this.props.data).toFixed(2)}
      </div>
    )
  }
}
