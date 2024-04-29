import React, { Component, Suspense } from "react";
import * as Fields from "./types";
import { get } from "lodash";

export default class ShowField extends Component {
  render() {
    const { field } = this.props;
    const FComponent = get(Fields, (field.field || field), Fields.label);
    console.log(this.props, FComponent);
    return (
      <Suspense fallback={<></>}>
        <FComponent {...this.props} ShowField={ShowField} />
      </Suspense>
    );
  }
}
