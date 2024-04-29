import React from "react";
import { Field } from "redux-form";
import renderField from "app/components/inputs";
import { isEqual, pick, get, sortBy, isEmpty, last, map } from "lodash";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { postItem, updateItem, deleteItem } from "app/helpers/apiMethods";
import mainInput from "app/helpers/main/input";
import * as fieldValues from "app/helpers/fieldValues";
import {
  apply_permissions,
  serverFieldMapper,
  applySubmissionsFuncs,
} from "app/helpers/functions";
import { Button } from "antd";
import { getPaginatedData, getScrollingData, getAllData } from "./loadData";
import * as Fields from "app/helpers/components/show/types";
export class list extends mainInput {
  constructor(props) {
    super(props);
    const {
      fields = [],
      t,
      setCurrentPage,
      setPageSize,
      permissions = {},
      pagination = {},
      pageSize: propsPageSize,
    } = props;
    const { currentPage = 1, pageSize = propsPageSize } = pagination;
    setCurrentPage(currentPage);
    setPageSize(pageSize);
    this.fields = fields.map((f) => {
      f.hideLabel = ["boolean", "multiChecks"].includes(f.field)
        ? true
        : f.hideLabel;
      f.label = t(`labels:${f.label}`);
      return serverFieldMapper(f);
    });
    this.state = {};
    this.state.columns = this.buildColumns();
    this.extraActions = [
      {
        action: this.add_row.bind(this),
        name: "Add",
        permissions: get(permissions, "actions.create", null),
      },
    ];
    this.onScroll = this.onScroll.bind(this);
    this.loading = false;
    if (!props.input.value) {
      this.handleChange([]);
    }
  }

  setSumFooter() {
    const {
      t,
      input: { value = [] },
      moduleName = "",
      sum = "",
      sum_to = "",
      change,
      sumFields = [],
    } = this.props;

    let sums = {};

    if (!isEmpty(value)) {
      sumFields.map((sumField) => {
        sums[`${sumField}Sum`] = 0;
        value.map((val) => {
          sums[`${sumField}Sum`] =
            parseFloat(sums[`${sumField}Sum`]) + parseFloat(val[sumField]);
        });
      });

      change && sums[`${sum}Sum`]
        ? change(`${sum_to}.Sum.${moduleName}`, sums[`${sum}Sum`])
        : null;
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: 500,
        }}
      >
        <label> {t("Sum")} </label>
        {sums ? (
          map(sums, (value, key) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <label> {value ? `${value.toFixed(2)}` : ""}</label>
            </div>
          ))
        ) : (
          <div></div>
        )}
      </div>
    );
  }

  buildColumns() {
    const { t, actions: pActions = [], permissions = {} } = this.props;
    this.columns = [
      ...this.fields.map((d) => ({
        title: t(`labels:${d.label}`),
        key: d.show || d.name,
        dataIndex: d.show || d.name,
        render: (value, record, index) =>
          this.cellRender(d, value, record, index),
      })),
      {
        title: t("actions:Actions"),
        key: "actions",
        dataIndex: "actions",
        render: (value, record, index) => this.actionRender(record, index),
      },
    ];
    this.actions = [
      //   {
      //     action: this.add_action,
      //     name: "Add",
      //     icon: "fa fa-home",
      //     color: "#fff",
      //     // permissions: get(permissions, "actions.add", null),
      //   },
      {
        action: this.edit_action,
        name: "Edit",
        icon: "fas fa-edit",
        color: "#fff",
        permissions: get(permissions, "actions.edit", null),
      },
      {
        action: this.delete_action,
        name: "Delete",
        msg: "Are you sure you want to delete this item?",
        show: "confirmAction",
        icon: "fas fa-trash",
        permissions: get(permissions, "actions.delete", null),
      },
      ...pActions,
    ];
    this.state = {
      index: -1,
      old_data: "",
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { index } = this.state;
    const {
      data,
      pagination = {},
      input: { value },
    } = this.props;
    const { currentPage, pageSize, failed, count } = pagination;
    const {
      data: nextData,
      pagination: nextPagination = {},
      ux_pattern,
      input: { value: nextValue },
    } = nextProps;
    const {
      currentPage: nextCurrentPage,
      count: nextCount,
      pageSize: nextPageSize,
      failed: nextFailed,
    } = nextPagination;
    return (
      !isEqual(nextData, data) ||
      !isEqual(nextValue, value) ||
      nextState.index != this.state.index ||
      (this.props.footer && nextProps.selectors != this.props.selectors) ||
      (index > -1 &&
        !isEqual(
          nextProps.input.value[index],
          this.props.input.value[index]
        )) ||
      (ux_pattern === "pagination" &&
        (!isEqual(pageSize, nextPageSize) ||
          !isEqual(count, nextCount) ||
          !isEqual(currentPage, nextCurrentPage) ||
          !isEqual(failed, nextFailed)))
    );
  }

  componentDidMount() {
    const {
      data = [],
      inline,
      crud = {},
      input: { value },
      setValueLabelKeys,
      value_key,
      label_key,
      ux_pattern,
      inconsistant,
      links,
    } = this.props;
    const { fetch } = crud;
    data ? this.handleChange(data) : null;
    if (ux_pattern == "infiniteScrolling") {
      this.setScrollEvents();
    }
    if (
      !data.length ||
      (ux_pattern != "infiniteScrolling" &&
        (get(links, "nextLink") || !inconsistant))
    ) {
      setValueLabelKeys(label_key, value_key);
      fetch ? this.loadData(this.props, true) : this.handleChange([]);
    }
    if (inline) {
      this.handleChange(value.length ? value : []);
    }
  }

  setPaginationConfig(currentPage, total, pageSize) {
    const { setCurrentPage } = this.props;
    this.paginationConfig = {
      current: currentPage,
      total,
      pageSize,
      onChange: (page) => setCurrentPage(page),
    };
  }

  loadData(props, onMount) {
    const { ux_pattern } = props;
    if (this.loading) {
      return;
    }
    this.loading = true;
    switch (ux_pattern) {
      case "pagination": {
        getPaginatedData.call(this, props, onMount);
        break;
      }
      case "infiniteScrolling": {
        getScrollingData.call(this, props, onMount);
        break;
      }
      default: {
        getAllData.call(this, props);
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    const { data, pagination = {} } = this.props;
    const { currentPage, pageSize, failed, count } = pagination;
    const {
      data: nextData,
      pagination: nextPagination = {},
      ux_pattern,
      crud = {},
    } = nextProps;
    const {
      currentPage: nextCurrentPage,
      count: nextCount,
      pageSize: nextPageSize,
      failed: nextFailed,
    } = nextPagination;
    const { fetch } = crud;
    if (!isEqual(data, nextData)) {
      this.handleChange(nextData);
      ux_pattern === "pagination"
        ? this.setPaginationConfig(nextCurrentPage, nextCount, nextPageSize)
        : null;
    }
    if (nextFailed != failed && nextFailed) {
      this.loadData(nextProps);
    }
    if (
      ux_pattern === "pagination" &&
      (!isEqual(pageSize, nextPageSize) ||
        !isEqual(count, nextCount) ||
        !isEqual(currentPage, nextCurrentPage))
    ) {
      this.setPaginationConfig(nextCurrentPage, nextCount, nextPageSize);
    }
    if (!isEqual(data, nextData) && nextData.length == 0) {
      const { label_key, value_key, setValueLabelKeys } = nextProps;
      setValueLabelKeys(label_key, value_key);
      fetch ? this.loadData(this.props, true) : null;
    }
  }

  handleChange(value) {
    const { onChange } = this.props.input;
    const { setData, sortby, ux_pattern } = this.props;
    const data = sortBy(value, sortby);
    if (ux_pattern != "pagination") {
      setData(data);
    }
    onChange(value);
  }

  calculateIndex(index) {
    const { pagination = {}, ux_pattern } = this.props;
    const { currentPage = 1, pageSize = 20 } = pagination;
    return ux_pattern != "pagination"
      ? index
      : (currentPage - 1) * pageSize + index;
  }
  save_data(index, ev) {
    const {
      params = [],
      values = {},
      crud = {},
      value_key,
      addToData,
      editData,
      untouch,
      touch = () => {},
      meta: { error = [{}] },
      api_config,
      preSubmit,
    } = this.props;
    const { createUrl, updateUrl } = crud;
    const { old_data = {} } = this.state;
    const { value, name } = this.props.input;
    const fieldsName = this.fields.map((d) => d.name);
    const errors = Array.isArray(error)
      ? pick(
          error.reduce((d, o) => ({ ...o, ...d }), 0),
          fieldsName
        )
      : error;
    const calculatedIndex = this.calculateIndex(index);
    if (isEmpty(errors)) {
      applySubmissionsFuncs(value[index], preSubmit, values, this.props).then(
        (newItem) => {
          if (!isEmpty(old_data)) {
            if (updateUrl) {
              const id = value[index][value_key];
              updateItem(updateUrl, newItem, id, {
                ...api_config,
                params: { ...get(api_config, params), ...pick(values, params) },
              }).then((response) => {
                if (window.cadsId && newItem.floorfilepath) {
                  window.cadsId = window.cadsId.filter((d) => d != id);
                }

                editData(this.calculateIndex(index), response);
                this.edit_index(-1);
                this.setState({ old_data: null });
              });
            } else {
              editData(this.calculateIndex(index), newItem);
              this.edit_index(-1);
              this.setState({ old_data: null });
            }
          } else {
            if (createUrl) {
              postItem(createUrl, newItem, {
                ...api_config,
                params: {
                  ...get(api_config, "params"),
                  ...pick(values, params),
                },
              }).then((response) => {
                addToData(response, calculatedIndex, "rewrite");
                this.setState({ old_data: null });
                this.edit_index(-1);
                untouch(...fieldsName.map((d) => `${name}[${index}].${d}`));
              });
            } else {
              addToData(newItem, calculatedIndex, "rewrite");
              this.setState({ old_data: null });
              this.edit_index(-1);
              untouch(...fieldsName.map((d) => `${name}[${index}].${d}`));
            }
          }
        }
      );
    } else {
      touch(...fieldsName.map((d) => `${name}[${index}].${d}`));
    }
  }

  delete_action = (index, item) => {
    const {
      params = [],
      values = {},
      crud = {},
      value_key,
      removeFromData,
      api_config,
      setItemsCount,
      pagination = {},
      postDelete = () => {},
    } = this.props;
    const { count } = pagination;
    if (crud.deleteUrl) {
      deleteItem(crud.deleteUrl, get(item, value_key), {
        ...api_config,
        params: { ...get(api_config, params), ...pick(values, params) },
      }).then((response) => {
        removeFromData(this.calculateIndex(index));
        setItemsCount(count - 1);
        postDelete(index, item, this.props);
      });
    } else {
      removeFromData(this.calculateIndex(index));
      setItemsCount(count - 1);
      postDelete(index, item, this.props);
    }
  };

  cancel_action = (key) => {
    let { name, value } = this.props.input;
    const {
      untouch,
      removeFromData,
      setItemsCount,
      pagination = {},
    } = this.props;
    const { count } = pagination;
    const fieldsName = this.fields.map((d) => d.name);
    value = [...value];
    const { old_data } = this.state;
    if (old_data) {
      value[key] = old_data;
    } else {
      removeFromData(this.calculateIndex(key));
      setItemsCount(count - 1);
    }
    this.setState({
      index: -1,
      old_data: null,
    });
    untouch(...fieldsName.map((d) => `${name}[${key}].${d}`));
  };

  edit_index = (index) => {
    this.setState({
      index,
    });
  };

  edit_action = (index, data) => {
    this.setState({
      old_data: data,
    });

    this.edit_index(index);
  };

  add_row = () => {
    const {
      pagination = {},
      addToData,
      addFrom = "top",
      data,
      setItemsCount,
      ux_pattern,
    } = this.props;
    const { pageSize = 20, count, currentPage = 1 } = pagination;
    const shift =
      addFrom == "top"
        ? 0
        : ux_pattern == "pagination" && data.length == pageSize
        ? data.length - 1
        : data.length;
    addToData({}, (currentPage - 1) * pageSize + shift);
    setItemsCount(count + 1);
    this.edit_index(shift);
    this.listDiv.scrollTop =
      addFrom == "top"
        ? 0
        : this.listDiv.scrollHeight - this.listDiv.clientHeight;
  };

  actionRender = (record, index) => {
    const { t } = this.props;
    if (this.state.index == -1) {
      const {
        t,
        input: { value },
      } = this.props;
      const actions = this.actions
        .filter((d) =>
          apply_permissions(record, d, "permissions", {
            list: value,
            itemIndex: index,
          })
        )
        .map((d) => {
          const ActionComponent = get(
            this.ActionsComponents,
            d.show,
            this.ActionsComponents.mainStyle
          );
          return (
            <ActionComponent
              key={d.name}
              {...{
                ...d,
                t,
                clickAction: () => d.action(index, record, this.props),
              }}
            />
          );
        });
      return actions;
    } else if (this.state.index == index) {
      const actions = [
        <Button
          className="save"
          key="save"
          onClick={() => this.save_data(index)}
        >
          {t("actions:Save")}
        </Button>,
        <Button
          className="cancel"
          key="cancel"
          onClick={() => this.cancel_action(index)}
        >
          {t("actions:Cancel")}
        </Button>,
      ];
      return actions;
    }
  };

  setScrollEvents() {
    this.listDiv.addEventListener("scroll", this.onScroll);
  }
  componentWillUnmount() {
    this.listDiv
      ? this.listDiv.removeEventListener("scroll", this.onScroll)
      : null;
  }

  onScroll(event) {
    let maxScroll = event.target.scrollHeight - event.target.clientHeight;
    let currentScroll = event.target.scrollTop;
    if (currentScroll >= maxScroll) {
      if (get(this.props, "links.nextLink")) {
        getScrollingData.call(this, this.props);
      }
    }
  }

  cellRender({ name: fname, ...field }, data, record, index) {
    const { name, value } = this.props.input;
    const _name = last(name.split("."));
    if (index == this.state.index) {
      const { values: mainValues } = this.props;
      return (
        apply_permissions(
          { ...mainValues, ...value[index] },
          field,
          "permissions",
          this.props
        ) && (
          <Field
            key={`${_name}[${index}].${fname}`}
            name={`${_name}[${index}].${fname}`}
            component={renderField}
            {...{
              ...field,
              ...pick(this.props, ["touch", "untouch", "change"]),
            }}
            hideLabel={this.props.hideLabels}
          />
        )
      );
    }
    const label =
      !this.props.hideLabels && !field.hideLabel ? (
        <label>{get(field, "label")} :</label>
      ) : null;
    const fieldValue = get(fieldValues, field.field, (text) => text)(
      data,
      record,
      { name: fname, ...field },
      { ...field },
      this.calculateIndex(index),
      {
        inputName: get(this.props, "input.name", {}),
        change: get(this.props, "change"),
        props: this.props,
      }
    );
    if (fieldValue) {
      const FComponent = get(Fields, field.field, Fields.label);
      return (
        <div key={`${_name}[${index}].${fname}`}>
          {label} <FComponent field={field} val={fieldValue} />
        </div>
      );
    } else {
      return null;
    }
  }
}

export function connectList(component) {
  return connect(mapStateToProps, mapDispatchToProps)(component);
}
