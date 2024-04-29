import React, { Component } from "react";
import { get } from "lodash";
import * as dataTypes from "./typeofData";
import { withTranslation } from "react-i18next";

class labelComponent extends Component {
  render() {
    const { values, field, t, val } = this.props;
    const show = get(values, field.show, val);
    let initialVal = get(field.data, show, show);
    const Val = get(dataTypes, field.type, () => <label>{initialVal}</label>);

    return <Val {...{ className: field.className }} data={val} t={t} />;
  }
}

export default withTranslation("labels")(labelComponent);
