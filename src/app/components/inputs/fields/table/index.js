import React, { Component } from "react";
import { Table, Alert, Popconfirm, Button, Icon } from "antd";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { assign, map, isEqual, get } from "lodash";
import * as tableActionFunctions from "./tableActionFunctions";
import * as fieldValues from "app/helpers/fieldValues";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import axios from "axios";

class tableComponent extends Component {
  constructor(props) {
    super(props);
    const { fields } = props;
    this.state = {
      unfilteredData: {},
      columns: [{}],
    };
    this.tableHeight = 500;
    this.getMoreData = this.getMoreData.bind(this);

    // this.colWidth = 100/(fields.length + 1)+'%';
  }

  tableRenderFunction(field, text, record) {
    return get(fieldValues, field.field, (text) => text)(
      text,
      record,
      field,
      this.props
    );
  }

  componentDidMount() {
    const { fields, tableActions, t } = this.props;

    let columns = fields.map((field) => {
      const { name, label, sorter } = field;
      return {
        title: t(label),
        key: name,
        dataIndex: name,
        // width: this.colWidth,
        render: this.tableRenderFunction.bind(this, field),
        sorter: sorter
          ? (a, b) => get(tableActionFunctions, sorter, null)(a, b, name)
          : null,
      };
    });

    const actions = tableActions
      ? {
          title: "Actions",
          dataIndex: "actions",
          key: "actions",
          render: (text, record, index) => {
            return (
              <span>
                {map(tableActions, (action) => (
                  <span key={action.name}>
                    {/* <Divider type='vertical'/> */}
                    <Popconfirm
                      title={action.title}
                      onConfirm={get(
                        tableActionFunctions,
                        action.function,
                        () => (
                          <Alert message="not a valid action function" banner />
                        )
                      ).bind(this, record, index, action, this.props)}
                      icon={
                        <Icon
                          type={action.icon}
                          style={{ color: action.color }}
                        />
                      }
                    >
                      <Button type={action.type}>{t(action.label)}</Button>
                    </Popconfirm>
                  </span>
                ))}
              </span>
            );
          },
        }
      : null;

    actions ? (columns = [...columns, actions]) : null;
    if (this.state.columns !== columns) {
      this.setState({ columns });
    }

    this.fetchTableData();
  }

  fetchTableData(recievedUrl) {
    const {
      fillData,
      tableData: { method, fetchUrl, queryParams },
      results,
    } = this.props;
    const url = recievedUrl && results ? recievedUrl : fetchUrl;

    if (recievedUrl || !results) {
      //setLoading(true)
      axios[method](url, { ...queryParams }).then(({ data }) => {
        const recievedData = data.results.map((singleResult) =>
          assign(singleResult, { key: singleResult.id })
        );
        const newResults = results
          ? [...recievedData, ...results]
          : recievedData;
        fillData({ ...data, results: newResults });
        //setLoading(false)
      });
    }

    if (!recievedUrl) {
      !this.tableContent
        ? this.setScrollEvents()
        : (this.tableContent.scrollTop = 0);
    }
  }

  setScrollEvents() {
    this.tableContent = document.querySelector(".ant-table-body");
    this.tableContent.addEventListener("scroll", this.getMoreData);
  }

  getMoreData(event) {
    const { next, count, results = [] } = this.props;
    let maxScroll = event.target.scrollHeight - event.target.clientHeight;
    let currentScroll = event.target.scrollTop;
    if (Math.ceil(currentScroll) >= maxScroll - 20) {
      if (next && results.length < count) {
        this.fetchTableData(next.replace("/GISBusinessAPI", ""));
        this.tableContent.scrollTop = this.tableContent.scrollTop - 50;
      }
    }
  }

  componentWillUnmount() {
    const { removeData } = this.props;
    removeData();
    this.tableContent
      ? this.tableContent.removeEventListener("scroll", this.getMoreData)
      : null;
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.results, this.props.results)) {
      this.fetchTableData();
    }
  }

  render() {
    const { results = [] } = this.props;
    const { columns } = this.state;
    const { tableHeight } = this;

    return (
      <div>
        <Table
          bordered
          rowKey={"id"}
          dataSource={results}
          columns={columns}
          scroll={{ y: tableHeight }}
          pagination={false}
        />
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("labels")(tableComponent))
);
