import React, { Component } from "react";
import { FormControl } from "app/components/inputs";
import { map } from "lodash";
export default class header extends Component {
  render() {
    const { headers } = this.props;
    return (
      <div>
        {map(headers, (d) => (
          <FormControl {...d} />
        ))}
      </div>
    );
  }
}
