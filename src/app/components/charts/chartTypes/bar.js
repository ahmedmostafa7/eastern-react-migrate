import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

export class bar extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }
  render() {
    const { data, options } = this.props;
    return (
      <div>
        {data && (
          <Bar
            ref={this.myRef}
            width={700}
            height={500}
            {...{ data, options }}
          />
        )}
      </div>
    );
  }
}
