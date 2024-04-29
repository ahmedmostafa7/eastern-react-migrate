import React, { Component } from "react";
import * as heads from "./types";
import { get } from "lodash";
import { withTranslation } from "react-i18next";
class Head extends Component {
  render() {
    const { head, t } = this.props;
    const HeadComponent = get(heads, head.type, heads.label);
    return (
      <th>
        <HeadComponent head={t(head.head || head)} />
      </th>
    );
  }
}

export default withTranslation("labels")(Head);
