import React, { Component } from "react";
import { get } from "lodash";
import * as Charts from "app/components/charts";

export class chart extends Component {
  constructor(props) {
    super(props);
    const { chartType } = props;
    this.Chart = get(Charts, chartType, () => (
      <h1 style={{ color: "red" }}>Invalid chartType</h1>
    ));
  }

  render() {
    const { Chart } = this;

    return (
      <div>
        <Chart {...this.props} />
      </div>
    );
  }
}
