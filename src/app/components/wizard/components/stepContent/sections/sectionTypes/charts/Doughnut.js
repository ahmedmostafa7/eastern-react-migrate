import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

export class doughnut extends Component {
  render() {
    const { data } = this.props;
    return <Doughnut data={data} />;
  }
}
