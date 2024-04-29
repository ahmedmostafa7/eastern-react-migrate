import { Table } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { get, isEqual } from "lodash";
import { buildColumns } from "./helperMethods";
import { fetchData } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";

class AdminTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [],
      currentModule: undefined,
      search: {},
    };
    this.getMoreData = this.getMoreData.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const {
      currentModule,
      setSelector,
      currentModuleKey,
      data,
      search,
      inconsistant,
      t,
    } = props;
    const { currentModule: prevModule, search: prevSearch } = state;
    if (
      currentModule &&
      (!isEqual(currentModule, prevModule) || !isEqual(search, prevSearch))
    ) {
      const searchUrl =
        search && search.q && search.filter_key
          ? `/1/20/${get(search, "q", "")}/${get(search, "filter_key", "")}`
          : "";
      const params = searchUrl == "" ? { pageSize: 1000 } : {};
      const url = `${get(currentModule, "apiUrl")}`;
      if (
        !data ||
        !data.length ||
        !isEqual(search, prevSearch) ||
        inconsistant
      ) {
        //fetchData(url, { params: { pageSize: 20, ...search } })
        fetchData(url + searchUrl, { params }).then(
          (result) => {
            const { results, next, count, prevURL, totalPages } = result;
            setSelector(
              {
                data: result,
                links: { nextLink: next, prevLink: prevURL, count, totalPages },
                inconsistant: isEqual(search, {}) ? false : true,
              },
              currentModuleKey
            );
          },
          (err) => {
            handleErrorMessages(err, t);
          }
        );
      }

      return {
        currentModule,
        columns: buildColumns(currentModule, props),
        search,
      };
    }
    return false;
  }

  componentDidMount() {
    const {
      currentModule,
      setSelector,
      currentModuleKey,
      data,
      search,
      inconsistant,
      t,
    } = props;
    const { currentModule: prevModule, search: prevSearch } = state;
    if (
      currentModule &&
      (!isEqual(currentModule, prevModule) || !isEqual(search, prevSearch))
    ) {
      const url = `${get(currentModule, "apiUrl")}`;
      if (
        !data ||
        !data.length ||
        !isEqual(search, prevSearch) ||
        inconsistant
      ) {
        fetchData(url, { params: { pageSize: 1000, ...search } }).then(
          (result) => {
            const { results, next, count, prevURL, totalPages } = result;
            setSelector(
              {
                data: result,
                links: { nextLink: next, prevLink: prevURL, count, totalPages },
                inconsistant: isEqual(search, {}) ? false : true,
              },
              currentModuleKey
            );
          },
          (err) => {
            handleErrorMessages(err, t);
          }
        );
      }

      this.setState({
        currentModule,
        columns: buildColumns(currentModule, props),
        search,
      });
    }
  }
  fetchTableData(url, params) {
    const { addToData, currentModuleKey, t } = this.props;
    fetchData(url, { params }).then(
      (result) => {
        const { results, next, count, prevURL, totalPages } = result;
        addToData(
          results,
          { nextLink: next, prevLink: prevURL, count, totalPages },
          currentModuleKey
        );
      },
      (err) => {
        handleErrorMessages(err, t);
      }
    );
  }

  getMoreData(event) {
    const { links, search } = this.props;
    const { nextLink } = links;
    let maxScroll = event.target.scrollHeight - event.target.clientHeight;
    let currentScroll = event.target.scrollTop;
    if (currentScroll >= maxScroll) {
      if (nextLink) {
        this.fetchTableData(nextLink, { ...search });
      }
    }
  }

  setScrollEvents() {
    if (this.props.data) {
      this.tableContent = document.querySelector(".ant-table-body");
      this.tableContent.addEventListener("scroll", this.getMoreData);
    }
  }

  componentDidMount() {
    this.setScrollEvents();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.data, this.props.data) ||
      !isEqual(nextProps.lang, this.props.lang)
    );
  }

  render() {
    const { data, t } = this.props;
    const { currentModule } = this.state;
    return data && data.length !== 0 ? (
      <Table
        bordered
        className="table-content"
        scroll={{ y: "600" }}
        columns={this.state.columns}
        dataSource={data}
        pagination={false}
        rowKey={get(currentModule, "primaryKey")}
        locale={{ emptyText: t("messages:No data") }}
        // the onclick of a row only exists in workflowTitle mdoule for now
        onRow={
          get(currentModule, "onRowClicked", null)
            ? (column) => {
                return {
                  onDoubleClick: () =>
                    get(currentModule, "onRowClicked")(column, this.props),
                };
              }
            : () => {}
        }
      />
    ) : (
      <div style={{ textAlign: "center" }}>{t("messages:No data")} </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("actions")(AdminTable))
);
