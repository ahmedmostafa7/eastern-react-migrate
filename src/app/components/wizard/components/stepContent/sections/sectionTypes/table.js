import React, { Component } from "react";
import { Table } from "antd";
import { map } from "lodash";
import { withTranslation } from "react-i18next";

class TableComp extends Component {
  constructor(props) {
    super(props);
    const { fields, t } = props;
    this.columns = map(fields, (value, key) => ({
      dataIndex: key,
      title: t(value.label),
      key: key,
    }));
  }

  render() {
    const { sectionName } = this.props;

    return (
      <div>
        <Table
          bordered
          className="rf"
          columns={this.columns}
          dataSource={[]}
          pagination={false}
          scroll={{ y: 400 }}
          rowKey={sectionName}
        />
      </div>
    );
  }
}

export const table = withTranslation("labels")(TableComp);
