import React from "react";
import { Select } from "antd";
import { fetchAllData } from "app/helpers/functions";
import { withTranslation } from "react-i18next";
import mainInput from "app/helpers/main/input";
import { fetchData } from "app/helpers/apiMethods";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { withRouter } from "apps/routing/withRouter";
import { get, isEqual, omit, map, isFunction } from "lodash";
import ActiveSelect from "./activeSelect";
const Option = Select.Option;

export class switchSelectComponent extends mainInput {
  constructor(props) {
    super(props);

    const { init_data } = props;

    if (init_data) {
      init_data(props);
    }

    // console.log(props.data);
    // console.log(props.input.value)
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      //!isEqual(nextProps.data, this.props.data) ||
      !isEqual(nextProps.isMulti, this.props.isMulti) ||
      // !isEqual(nextProps.data, this.props.values.waseka_data_select) ||
      !isEqual(nextProps.lang, this.props.lang) ||
      !isEqual(nextProps.forceUpdate, this.props.forceUpdate)
    );
  }

  render() {
    let { isMulti } = this.props;
    // console.log(this.props);
    //label = (isFunction(visible) ?  visible(values, this.props) : visible) ? label : '';

    return (
      <div>
        <ActiveSelect isMulti={isMulti} selectProps={this.props} />
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("labels")(switchSelectComponent))
);
