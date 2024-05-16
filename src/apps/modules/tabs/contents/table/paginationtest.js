import React, { Component } from "react";
import { Table, Alert } from "antd";
import { APIURL } from "imports/config";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { assign, map, isEqual, get, set, uniq, union } from "lodash";
import { fetchData } from "app/helpers/apiMethods";
import { tableActions } from "../../common";
import * as tableActionFunctions from "../../tableActionFunctions";
import { workFlowUrl } from "imports/config";
import * as fieldValues from "app/helpers/fieldValues";
import { withTranslation } from "react-i18next";
import { withRouter } from "apps/routing/withRouter";
// import Filters from './filters'
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
      FilterVal: {},
    };
    this.tableHeight = 500;
    this.getMoreData = this.getMoreData.bind(this);
    this.showFields = (fields || []).filter((field) =>
      views.includes(field.name)
    );
    // this.colWidth = 100 / (this.showFields.length + 1) + "%";
  }

  //function to get the converted value based on the field from the fieldValues in helpers folder
  tableRenderFunction(field, text, record) {
    return get(fieldValues, field.field, (text) => text)(
      text,
      record,
      field,
      this.props
    );
  }

  componentDidMount() {
    // const {FilterVal} = this.state
    const {
      content: { fields, views, ...content },
      t,
    } = this.props;
    let columns = fields
      .filter((field) => views.includes(field.name))
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

    const actions = content.actions
      ? {
          title: "",
          dataIndex: "actions",
          key: "actions",
          render: (text, record, index) => {
            const actions = isEqual(content.actions, "common")
              ? tableActions
              : content.actions;
            return (
              <span className="grid-3">
                {map(actions, (action) => (
                  <span key={action.name}>
                    <button
                      className={`btn btn-success ${action.class}`}
                      onClick={get(
                        tableActionFunctions,
                        action.function,
                        () => (
                          <Alert message="not a valid action function" banner />
                        )
                      ).bind(this, record, index, action, this.props)}
                    >
                      {t(action.label)}
                    </button>
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
    // console.log("mounted");
    this.fetchTableData();
  }

  fetchTableData(recievedUrl) {
    const {
      fillData,
      moduleName,
      apiUrl,
      content: { id },
      results,
      setLoading,
    } = this.props;
    const url = recievedUrl && results ? recievedUrl : apiUrl;
    if (!this.fetch) {
      if (recievedUrl || !results) {
        this.fetch = true;
        setLoading(true);
        fetchData("http://77.30.168.84/GISAPIDEVV2" + url).then(
          (result) => {
            this.fetch = false;
            const recievedData = result.results.map((singleResult) =>
              assign(singleResult, { key: singleResult[id] })
            );
            const newResults = results
              ? [...results, ...recievedData]
              : recievedData;
            fillData({ ...result, results: newResults }, moduleName);
            setLoading(false);
          },
          () => {
            this.fetch = false;
            setLoading(false);
          }
        );
      }
    }

    if (!recievedUrl) {
      !this.tableContent ? this.setScrollEvents() : null;
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const { search: prevSearch, filters: prevFilters } = this.props;
  //   let { search, filters} = nextProps;
  //   if (!isEqual(prevSearch, search) || !isEqual(prevFilters, filters)) {
  //     filters = mapValues(filters, value => {console.log(value); return(value.value)});
  //     //this.fetchTableData(currentApp.api_url, { ...search, ...filters, size:20 });
  //   }
  // }

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
        this.fetchTableData(next.replace("/api", "").replace(APIURL, ""));
        this.tableContent.scrollTop = this.tableContent.scrollTop - 50;
      }
    }
  }

  componentWillUnmount() {
    // const {unfilteredData} = this.state;
    // const {fillData, currentTab:{name}} = this.props;
    // isEmpty(unfilteredData)? null : fillData(unfilteredData, `${name}.results`);
    this.tableContent
      ? this.tableContent.removeEventListener("scroll", this.getMoreData)
      : null;
  }
  // handleTableChange(pagination, tableFilters, sorter){
  //   const {allData={}, currentTab:{name}, fillData} = this.props;
  //   const {unfilteredData} = this.state;
  //   isEmpty(unfilteredData)? this.setState({unfilteredData: allData[name].results}) : null;
  //   const newData = unfilteredData.filter(r=>(some(tableFilters, (value, key)=>(value.includes(String(r[key]))))));
  //   !Object.values(tableFilters).every(v => isEmpty(v))? fillData(newData,  `${name}.results`) : null;
  // }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.results, this.props.results)) {
      this.fetchTableData();
    }
  }
  handleFilterChange = (filter, value) => {
    let { FilterVal } = this.state;
    set(FilterVal, filter.name, value);
    this.setState({ FilterVal });
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
  render() {
    const { results = [] } = this.props;
    // const {columns} = this.state
    const { tableHeight } = this;
    const all_cols = this.getFilterData(results);
    // const all_cols = union(filters, columns);
    const locale = {
      filterConfirm: "تفعيل",
      filterReset: "الغاء",
      emptyText: "لا توجد بيانات",
    };
    return (
      <div>
        {/* <Filters values={FilterVal}  dataSource={results} filters={this.props.content.main_filters} handleChange={this.handleFilterChange.bind(this)}/> */}
        {/* <LocaleProvider locale={ar_EG}> */}
        {results.length > 0 ? (
          <Table
            bordered
            className="firstStepTable"
            locale={locale}
            rowKey={"id"}
            dataSource={results}
            columns={all_cols}
            // scroll={{ y: tableHeight }}
            pagination={false}
          />
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
