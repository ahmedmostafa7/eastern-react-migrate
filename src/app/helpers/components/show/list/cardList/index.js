import React from "react";
import { get, reject, find } from "lodash";
import { withTranslation } from "react-i18next";
import { Card, Button, Pagination } from "antd";
import * as ActionsComponents from "./actions";
import { connectList, list } from "../";
import { apply_permissions } from "app/helpers/functions";
class cardListComponent extends list {
  constructor(props) {
    super(props);
    this.ActionsComponents = ActionsComponents;
  }
  componentDidMount() {
    this.listDiv = document.querySelector(".cardList");
    super.componentDidMount();
  }
  render() {
    const {
      input: { value },
      data = [],
      title_key,
      t,
      value_key,
    } = this.props;
    const { index } = this.state;
    return (
      <div>
        {index == -1 &&
          this.extraActions
            .filter((d) =>
              apply_permissions(value, d, "permissions", {
                list: value,
                itemIndex: index,
              })
            )
            .map((action, key) => (
              <Button className="add-button" key={key} onClick={action.action}>
                {t(`actions:${action.name}`)}
              </Button>
            ))}
        <div className="cardList" style={{ overflowY: "scroll" }}>
          {data.length ? (
            data.map((row, dataIndex) => (
              <Card key={get(row, value_key)} title={get(row, title_key)}>
                {reject(this.columns, (c) => c.key === "actions").map(
                  (column, columnIndex) => (
                    <div key={columnIndex}>
                      {column.render(get(row, column.key), row, dataIndex)}
                    </div>
                  )
                )}
                <div
                  className="ic"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 40px",
                    justifyItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {find(this.columns, (c) => c.key === "actions").render(
                    null,
                    row,
                    dataIndex
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card>{t("messages:No data")}</Card>
          )}
        </div>
        {this.paginationConfig && <Pagination {...this.paginationConfig} />}
      </div>
    );
  }
}

export default connectList(
  withTranslation("actions", "messages")(cardListComponent)
);
