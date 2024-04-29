import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

export class doughnut extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }
  render() {
    const { data, options } = this.props;
    return <Doughnut {...{ data, options }} ref={this.myRef} />;
  }
}
