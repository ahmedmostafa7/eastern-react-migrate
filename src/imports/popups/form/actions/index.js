import React, { Component } from "react";
import { Button } from "antd";
import { withTranslation } from "react-i18next";
class Actions extends Component {
  render() {
    const { onCancel, t } = this.props;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 80px",
          gridGap: "10px",
          justifyContent: "flex-end",
        }}
      >
        <button className="btn btn-success" type="submit">
          {t("Save")}
        </button>
        <button className="btn btn-warning" onClick={onCancel} type="button">
          {t("Cancel")}
        </button>
      </div>
    );
  }
}

export default withTranslation("actions")(Actions);
