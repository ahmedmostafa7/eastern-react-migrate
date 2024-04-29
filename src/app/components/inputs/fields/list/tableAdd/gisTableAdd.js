import React from "react";
import { withTranslation } from "react-i18next";
import { Button, Table } from "antd";
import { Cell } from "./cell";
// import * as ActionsComponents from './actions';
import { list, connectList } from "../";

class tableListComponent extends list {
  constructor(props) {
    super(props);
    this.state = { dataTable: [] };
    // this.ActionsComponents = ActionsComponents;
  }
  componentDidMount() {
    // this.listDiv = last(document.querySelectorAll('.ant-table-body'));
    // super.componentDidMount();
    // const { po } = this.props
    // const { dataTable } = this.state;
    // this.setState({
    //     dataTable: [...dataTable, po]
    // })
  }
  handleChange(value) {
    const {
      input: { onChange },
    } = this.props;
    onChange(value);
  }

  render() {
    const {
      className = "",
      input: { value, ...input },
      coulmns,
      qw,
      dw,
      addResultTotable,
      footer,
      data2 = [],
      ux_pattern,
      type,
      class: rowClass = () => {},
      t,
      value_key,
      height = 600,
    } = this.props;
    console.log("da", data2);
    const columns = coulmns.map((col) => {
      return col;
    });

    return (
      <div>
        <Button
          onClick={addResultTotable}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a row
        </Button>
        <Table
          // components={Cell}
          rowClassName={() => "editable-row"}
          bordered
          // onChange={this.handleChange}
          dataSource={data2}
          columns={columns}
        />
      </div>
    );
  }
}

export default connectList(
  withTranslation("actions", "messages")(tableListComponent)
);
