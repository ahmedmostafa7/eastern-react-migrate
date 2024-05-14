import React, { Component } from "react";
import { Table, Alert, Pagination } from "antd";
import { APIURL } from "imports/config";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import {
  assign,
  map,
  isEqual,
  get,
  set,
  uniq,
  union,
  isFunction,
  isEmpty,
  omit,
} from "lodash";
import { fetchData } from "app/helpers/apiMethods";
import { tableActions } from "../../common";
import * as tableActionFunctions from "../../tableActionFunctions";
// import { workFlowUrl } from "imports/config";
import * as fieldValues from "app/helpers/fieldValues";
import { withTranslation } from "react-i18next";
import { withRouter } from "apps/routing/withRouter";
import { convertToArabic } from "../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import Filters from "./filters";
// import { set } from 'd3'
class tabsTableComponent extends Component {
  constructor(props) {
    super(props);
    const {
      content: { fields, views },
    } = props;
    this.state = {
      unfilteredData: {},
      columns: [{}],
      newUrl: "",
      lastPage: false,
      FilterVal: {},
      DataCount: 0,
      app_id: 0,
      requests: [],
    };
    this.tableHeight = 500;
    this.getMoreData = this.getMoreData.bind(this);
    this.ChangePage = this.ChangePage.bind(this);
    this.showFields = (fields || []).filter((field) =>
      views.includes(field.name)
    );

    // this.colWidth = 100 / (this.showFields.length + 1) + "%";
  }

  //function to get the converted value based on the field from the fieldValues in helpers folder
  tableRenderFunction(field, text, record) {
    ////
    // this.setState({ app_id: record.app_id })
    return get(fieldValues, field.field, (text) => text)(
      (typeof text != "object" && convertToArabic(text)) || text,
      record,
      field,
      this.props
    );
  }
  ChangePage(da) {
    // console.log(da);
  }

  componentDidMount() {
    // let app_id = localStorage.getItem("appId")
    this.state = { pageSize: "12" };
    this.tableContent = document.querySelector(".ant-table-body");
    const {
      content: { fields, views, ...content },
      t,
    } = this.props;
    let columns = fields
      .filter(
        (field) =>
          views.includes(field.name) &&
          (field.visible && isFunction(field.visible) ? field.visible() : true)
      )
      .map((field) => {
        const { name, label, options, sorter } = field;
        return {
          title: t(label),
          key: name,
          dataIndex: name,
          // width: this.colWidth,
          filtering: field.filtering,
          // filteredValue: get(FilterVal, name, null),
          onFilter: (value, record) => {
            //
            return get(record, name, "").includes(value);
          },
          render: this.tableRenderFunction.bind(this, field), //where the function (that converts values such as boolean to icon) is appllied
          filters:
            options !== undefined
              ? field.options.map((option) =>
                  assign(option, { text: option.label })
                )
              : null,
          sorter: sorter
            ? (a, b) => get(tableActionFunctions, sorter, null)(a, b, name)
            : null,
        };
      });

    debugger;
    const actions = content.actions
      ? {
          title: "",
          dataIndex: "actions",
          key: "actions",
          render: (text, record, index) => {
            // console.log("rec", record, index);

            const actions = isEqual(content.actions, "common")
              ? tableActions
              : Object.values(content.actions).filter((action) => {
                  return action.visible && isFunction(action.visible)
                    ? action.visible(record)
                    : true;
                });
            // console.log("actions", tableActions);

            return (
              <span className="grid-3">
                {map(actions, (action, key) => (
                  <span key={action.name}>
                    {window.location.href !== "/print_chart" && (
                      <button
                        className={
                          ["print", "sakupdate"].indexOf(
                            action.name.toLowerCase()
                          ) != -1 && this.props.app_id == 14
                            ? "remove_print_btn"
                            : `btn btn-success ${action.class}`
                        }
                        onClick={get(
                          tableActionFunctions,
                          action.function,
                          () => (
                            <Alert
                              message="not a valid action function"
                              banner
                            />
                          )
                        ).bind(this, record, index, action, this.props)}
                      >
                        {t(action.label)}
                      </button>
                    )}
                  </span>
                ))}
              </span>
            );
          },
        }
      : null;

    // this.props.setBtnsParams(actions);

    actions ? (columns = [...columns, actions]) : null;
    if (this.state.columns !== columns) {
      this.setState({ columns });
    }
    const { apiUrl } = this.props;

    this.onChange(1, apiUrl);
  }

  getMoreData(url) {
    const {
      next,
      count,
      results = [],
      fillData,
      moduleName,
      setLoading,
    } = this.props;

    if (next) {
      fetchData(workFlowUrl + url).then(
        (result) => {
          this.fetch = false;
          const newResults = result.results;
          // console.log("res", newResults);
          // ? [...results, ...recievedData]
          // : recievedData;

          fillData({ ...result, results: newResults }, moduleName);
        },
        () => {
          this.fetch = false;
          setLoading(false);
        }
      );
    }
  }

  getDataCount(url) {
    const { setLoading } = this.props;

    if (this.state["DataCount"] == 0) {
      fetchData(workFlowUrl + url).then(
        (result) => {
          setLoading(false);
          this.setState({ DataCount: result });
        },
        () => {
          setLoading(false);
        }
      );
    }
  }

  componentWillUnmount() {
    this.tableContent
      ? this.tableContent.removeEventListener("scroll", this.getMoreData)
      : null;
  }

  componentDidUpdate(prevProps) {
    const { tabTotalApi } = this.props;
    if (tabTotalApi) {
      this.getDataCount(tabTotalApi);
    }
  }
  handleFilterChange = (filter, value, evt) => {
    let { FilterVal } = this.state;

    set(FilterVal, filter.name, value);
    this.setState({ FilterVal }, () => {
      this.onChange(1);
    });
  };
  getFilterData(dataSource) {
    const { columns } = this.state;
    return columns.map((filter) => {
      if (!filter.filtering) {
        return filter;
      }
      const data = uniq(
        map(dataSource, (d) => get(d, filter.key)).filter((d) => d)
      );
      return {
        ...filter,
        filters: data.map((d) => ({ text: d, value: d })),
      };
    });
  }

  onChange = (page) => {
    const { next, apiUrl, fillData, count, moduleName, setLoading } =
      this.props;
    const { lastPage, pageSize, FilterVal } = this.state;
    if (apiUrl) {
      let newUrl;
      let filteredNextUrl = apiUrl;

      newUrl = filteredNextUrl.includes("?")
        ? filteredNextUrl.concat(`&pageNum=${page}`)
        : filteredNextUrl.concat(`?pageNum=${page}`);
      if (FilterVal) {
        Object.keys(FilterVal).forEach((key) => {
          newUrl = newUrl.concat(
            `&${key}=${(
              (!Array.isArray(FilterVal[key]) &&
                Object.values(FilterVal[key])[0]) ||
              FilterVal[key]
            ).join(",")}`
          );
        });
      }

      fetchData(workFlowUrl + newUrl).then((result) => {
        this.fetch = false;
        let newResults = result.results;

        if (newUrl.indexOf("/false/") != -1) {
          newResults = newResults.map((item) => {
            if (item.transfered_user_id) {
              item.name = `${item.name} (محولة)`;
            }
            return item;
          });
        }

        fillData({ ...result, results: newResults }, moduleName);
        this.setState({
          current: page,
          pageSize:
            (this.props.app_id == 29 &&
              ["inbox", "returned"].indexOf(this.props.name) != -1 &&
              18) ||
            12,
          // noNext: apiUrl,
          lastPage:
            page ==
            Math.ceil(
              newResults.length /
                ((this.props.app_id == 29 &&
                  ["inbox", "returned"].indexOf(this.props.name) != -1 &&
                  18) ||
                  12)
            ),
        });
      });
      // this.fetchTableData(nextUrl);
    }
  };

  filterResults(result, main_filters, FilterVal) {
    let res = { ...result };
    let is_exists = true;
    Object.values(main_filters).forEach((filter) => {
      if (
        get(FilterVal, filter.name)?.length &&
        get(FilterVal, filter.name).indexOf(get(res, filter.name)) == -1 &&
        is_exists
      ) {
        is_exists = false;
      }
    });

    return is_exists;
  }

  render() {
    const {
      count,
      results = [],
      currentApp,
      tabHeaderCountLabel = "إجمالي المعاملات",
      tabTotalApi,
      t,
    } = this.props;

    const { DataCount, FilterVal, requests, current } = this.state;
    const { tableHeight } = this;
    console.log("mounted", this.props);
    const all_cols = this.getFilterData(results);
    // const all_cols = union(filters, columns);
    const locale = {
      filterConfirm: "تفعيل",
      filterReset: "الغاء",
      emptyText: "لا توجد بيانات",
    };

    return (
      <div>
        {/* <LocaleProvider locale={ar_EG}> */}
        {tabTotalApi && DataCount > 0 && (
          <div style={{ textAlign: "right" }}>
            {`${tabHeaderCountLabel} ${DataCount}`}
          </div>
        )}

        {results.length > 0 ? (
          <div>
            <Filters
              values={FilterVal}
              dataSource={results}
              filters={this.props.content.main_filters}
              handleChange={this.handleFilterChange.bind(this)}
              t={t}
            />
            <Table
              bordered
              className="firstStepTable"
              locale={locale}
              rowKey={"id"}
              dataSource={
                // (this.props.content.main_filters &&
                //   Object.values(this.props.content.main_filters).filter(
                //     (filter) => get(FilterVal, filter.name, []).length > 0
                //   ).length > 0 &&
                //   results.filter((r) =>
                //     this.filterResults(
                //       r,
                //       this.props.content.main_filters,
                //       FilterVal
                //     )
                //   )) ||
                results
              }
              // onChange={this.getMoreData}
              columns={all_cols}
              // scroll={{ y: "80vh" }}
              pagination={false}
            />
            <Pagination
              defaultCurrent={1}
              onChange={this.onChange}
              hideOnSinglePage={true}
              defaultPageSize={this.state.pageSize || 1}
              pageSize={this.state.pageSize || 1}
              current={current}
              // pageSize={
              //   (this.props.app_id == 29 &&
              //     ["inbox", "returned"].indexOf(this.props.name) != -1 &&
              //     18) ||
              //   12
              // }
              // defaultPageSize={
              //   (this.props.app_id == 29 &&
              //     ["inbox", "returned"].indexOf(this.props.name) != -1 &&
              //     18) ||
              //   12
              // }
              total={
                // (this.props.content.main_filters &&
                //   Object.values(this.props.content.main_filters).filter(
                //     (filter) => get(FilterVal, filter.name, []).length > 0
                //   ).length > 0 &&
                //   results.filter((r) =>
                //     this.filterResults(
                //       r,
                //       this.props.content.main_filters,
                //       FilterVal
                //     )
                //   ).length) ||
                count
              }
            />
          </div>
        ) : (
          <Table
            className="firstStepTable emptyTable"
            rowKey={"id"}
            locale={locale}
          />
        )}
        {/* </LocaleProvider> */}
        {/* onChange={this.handleTableChange.bind(this)}/> */}
      </div>
    );
  }
}

export const tabsTable = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("tabs")(tabsTableComponent))
);
