import React, { Component } from "react";
import { connect } from "react-redux";
import { get, isEqual, pick, omit } from "lodash";
import * as calculateFunctions from "./functions";
import mapDispatchToProps from "main_helpers/actions/main";

export class calculator extends Component {
  constructor(props) {
    super(props);
    this.calc(props);
  }
  calc(props) {
    const {
      values,
      input,
      mainValue = input.value,
      params,
      func,
      totalChange,
    } = props;
    let calculations = get(calculateFunctions, func, () => 0)(
      params,
      { values },
      props
    );
    if (mainValue != calculations) {
      if (totalChange) {
        totalChange(props, calculations);
      }
      input.onChange(calculations);
      this.value = calculations;
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    const calc = ["field", "form", "values"];
    const exclude = [""];
    const su = !isEqual(
      { porps: pick(omit(nextProps, exclude), calc) },
      { props: pick(omit(this.props, exclude), calc) }
    );
    if (su) {
      this.calc(nextProps);
    }
    const compare = [...calc, "mainValue"];
    return !isEqual(
      { props: pick(this.props, compare) },
      { props: pick(nextProps, compare) }
    );
  }
  render() {
    const { input, mainValue = input.value } = this.props;
    return <div>{mainValue || this.value}</div>;
  }
}

const mapStateToProps = (state, props) => {
  console.log("7aaa", state, props);
  return {
    fullForm: get(state, "form"),
    mainObj:
      get(
        state,
        "wizard.mainObject.suggestParcel.suggestParcel.suggestParcels"
      ) ||
      get(
        state,
        "wizard.mainObject.mainObject.suggestParcel.suggestParcel.suggestParcels"
      ),
    totalCal: get(state, props.total, 0),
    mainObject: get(state, "wizard.mainObject"),
    elec: get(
      state,
      "wizard.mainObject.suggestParcel.suggestParcel.electricArea"
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(calculator);
