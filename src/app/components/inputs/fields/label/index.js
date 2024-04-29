import React, { Component } from "react";
import { get } from "lodash";
import * as dataTypes from "./typeofData";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
class labelComponent extends Component {
  componentDidMount() {
    const { init_data } = this.props;

    if (init_data) {
      init_data(this.props);
    }
  }

  render() {
    const {
      className,
      input: { value },
      type,
      data = {},
      t,
    } = this.props;

    let initialVal = get(data, value, value);
    const Val = get(dataTypes, type, () => <label>{initialVal}</label>);

    return <Val {...{ className }} data={value} t={t} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(labelComponent));
