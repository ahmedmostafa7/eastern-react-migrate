import React, { Component } from "react";
import { map, pick } from "lodash";
import { serverFieldMapper } from "app/helpers/functions";
import { FormControl } from "app/components/inputs";

export default class collapse extends Component {
  constructor(props) {
    super(props);
    //
    this.fields = map(props.fields, (value, key) => ({
      name: key,
      ...serverFieldMapper(value, props),
    }));
    // console.log(props)
  }
  render() {
    return map(this.fields, (f) => {
      return (
        <FormControl
          {...{
            ...pick(this.props, [
              "change",
              "touch",
              "untouch",
              "values",
              "index",
            ]),
            ...f,
          }}
        />
      );
    });
  }
}
