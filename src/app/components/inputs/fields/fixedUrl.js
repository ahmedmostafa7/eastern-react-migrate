import React, { Component } from "react";
import { List, Icon } from "antd";
import { withTranslation } from "react-i18next";
import { host } from "configFiles/config";
import { get } from "lodash";

class fixedUrlComp extends Component {
  render() {
    const { className, input, label, type, t, items } = this.props;

    return items ? (
      <List
        className={className}
        itemLayout="horizontal"
        dataSource={items}
        locale={{ emptyText: t("No Data") }}
        renderItem={(item) => (
          <List.Item
            onClick={() => {
              window.open(window.filesHost + `${get(item, "url")}`);
            }}
          >
            <a>
              {get(item, "type").includes("image") ? (
                <img
                  src={window.filesHost + `${get(item, "url")}`}
                  style={{ width: "80px", height: "80px" }}
                />
              ) : (
                <Icon type="file-pdf" style={{ fontSize: "104px" }} />
              )}
            </a>
          </List.Item>
        )}
      />
    ) : (
      <div> </div>
    );
  }
}

export const fixedUrl = withTranslation("labels")(fixedUrlComp);
