import React, { Component } from "react";
import { get, map } from "lodash";
import ShowField from "app/helpers/components/show";
import printSetting from "app/helpers/modules/service/print_settings";

export default class print extends Component {
  constructor(props) {
    super(props);
  }
  renderInfo = (data, field, key) => {
    return <ShowField field={field} val={get(data, key)} key={key} />;
  };
  render() {
    const { print } = this.props.mainObject.printSetting;

    return (
      <>
        {map(
          printSetting.sections.print.fields,
          this.renderInfo.bind(this, print)
        )}
      </>
    );
  }
}
