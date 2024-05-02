import React, { Component } from "react";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "apps/routing/withRouter";
import { isEmpty, get, map } from "lodash";
// import axios from 'axios'
import Header from "./header";

class tableComponent extends Component {
  renderRow(data, fields) {
    return <tr>{map(fields, (f) => get(data, f.show, ""))}</tr>;
  }
  renderData(fields) {
    const { field } = this.props;
    return <tbody>{map(field.value, (d) => this.renderRow(d, fields))}</tbody>;
  }
  renderHeader(fields) {
    const { t } = this.props;
    return (
      <thead>
        <tr>
          {map(fields, (d) => (
            <th>{t(d.head)}</th>
          ))}
        </tr>
      </thead>
    );
  }
  render() {
    const { field, settings, headers } = this.props;
    const fields = get(settings, "fields", {});
    if (isEmpty(field.value)) {
      return <div></div>;
    }
    return (
      <section>
        <Header {...{ headers }} />
        <div>
          <table>
            {this.renderHeader(fields)}
            {this.renderData(fields)}
          </table>
        </div>
      </section>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("labels")(tableComponent))
);
