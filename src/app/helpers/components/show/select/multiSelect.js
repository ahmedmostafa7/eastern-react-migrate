import React from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { get, map, find } from "lodash";
import { selectComponent } from "./main";
import { withTranslation } from "react-i18next";

class multiSelectComponent extends selectComponent {
  render() {
    const { val, field, data, t } = this.props;
    const shows = map(val, (d) => {
      const md = find(data, { [field.value_key || "value"]: d });
      return t(get(md, field.label_key || "label"));
    });
    return <p>{shows.join(",")}</p>;
  }
}

export const multiSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(multiSelectComponent));
export default multiSelect;
