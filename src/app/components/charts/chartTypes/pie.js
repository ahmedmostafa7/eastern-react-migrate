import React, { Component } from "react";
import { Pie } from "react-chartjs-2";

export class pie extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }
  render() {
    const { data, options, onElementClick, legend } = this.props;
    return (
      <div>
        {data && (
          <Pie
            width={400}
            height={350}
            data={data}
            legend={legend}
            //onElementsClick={onElementClick.bind(this)}
            {...options}
            ref={this.myRef}
          />
        )}
      </div>
    );
  }
}
