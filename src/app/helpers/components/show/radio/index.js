import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { get, find } from "lodash";

export class radioComp extends Component {
  // constructor(props){
  //   super(props);
  //   if(!props)
  // }
  render() {
    // console.log(this.props)

    const { field, val, t } = this.props;
    const show = get(
      find(field.options, {
        [field.value_key || "value"]:
          val || field.initValue || field.defaultValue,
      }),
      field.label_key || "label"
    );
    return <p>{t(show)}</p>;
  }
}

export default withTranslation("labels")(radioComp);
