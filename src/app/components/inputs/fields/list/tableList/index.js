import React from "react";
import { last } from "lodash";
import { withTranslation } from "react-i18next";
import { Button, Table } from "antd";
import * as ActionsComponents from "./actions";
import { list, connectList } from "../";
import { apply_permissions } from "app/helpers/functions";

class tableListComponent extends list {
  constructor(props) {
    super(props);
    this.ActionsComponents = ActionsComponents;
  }
  componentDidMount() {
    this.listDiv = last(document.querySelectorAll(".ant-table-body"));
    super.componentDidMount();
    const { init } = this.props;
    if (init) init(this.props);
  }
  fixedData(props) {
    console.log(props);
  }
  render() {
    const {
      className = "",
      fixedData,
      input: { value, ...input },
      footer,

      plan_approval,
      data,
      ux_pattern,
      type,
      class: rowClass = () => {},
      t,
      value_key,
      height = 600,
    } = this.props;
    const { index } = this.state;
    // let newData;
    // if (plan_approval) {
    //   let constdata = {
    //     date_att: "1442/09/09",
    //     no_att: "dfg",
    //     type_att: "gv",
    //   };
    //   newData = [...data, constdata];
    // }

    console.log("TableData", fixedData, this.props);
    return (
      <div style={{ display: "grid", gridGap: "10px", margin: "10px" }}>
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
        <Table
          id="notesTable1"
          bordered
          className={className}
          locale={{ emptyText: t("messages:No data") }}
          {...input}
          type={type}
          columns={this.columns}
          footer={footer ? this.setSumFooter.bind(this) : null}
          scroll={ux_pattern == "infiniteScrolling" ? { y: height } : undefined}
          dataSource={data || []}
          rowKey={value_key}
          pagination={this.paginationConfig || false}
          rowClassName={rowClass}
        />
      </div>
    );
  }
}

export default connectList(
  withTranslation("actions", "messages")(tableListComponent)
);
