import React, { Component } from "react";
import { map, pick, isEmpty } from "lodash";
import Head from "./head";
import Row from "./row";
import { FormSection } from "redux-form";
import { last } from "lodash";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "list"),
    ...mapDispatchToProps1(dispatch),
  };
};

class index extends Component {
  constructor(props) {
    super(props);
    if (props.init_data) {
      props.init_data(props.values, props);
    }
  }
  renderHeads = () => {
    const { fields } = this.props;
    return (
      <thead>
        {map(fields, (d, key) => (
          <Head head={d.head} key={key}></Head>
        ))}
      </thead>
    );
  };
  renderRow = (d, key) => {
    const { colums, fields = colums, input } = this.props;
    const picking = ["change", "touch", "untouch", "values", "index"];
    const mainProps = pick(this.props, picking);
    const name = last(input.name.split("."));
    //console.log(name, d.main_id, key)

    return (
      <FormSection name={`${name}.${(d && d.main_id) || key}`}>
        <tr>
          {map(fields, (f, k) => (
            <Row
              key={"" + key + k}
              {...mainProps}
              mainProps={pick(this.props, picking)}
              data={d}
              select={f.name || k}
              mainValues={input.value}
              field={f}
            />
          ))}
        </tr>
      </FormSection>
    );
  };
  renderBody = () => {
    const { input } = this.props;
    return map(input.value, this.renderRow);
  };
  render() {
    const { input } = this.props;
    if (isEmpty(input.value)) {
      return <></>;
    }
    return (
      <table className="table input-list-table table-bordered">
        {this.renderHeads()}
        <tbody>{this.renderBody()}</tbody>
      </table>
    );
  }
}

export default connect(
  mapStateToProps,
  appMapDispatchToProps
)(withTranslation("labels")(index));
