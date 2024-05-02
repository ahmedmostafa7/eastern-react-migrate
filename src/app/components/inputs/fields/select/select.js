import React from "react";
import { Select } from "antd";
import { fetchAllData } from "app/helpers/functions";
import { withTranslation } from "react-i18next";
import mainInput from "app/helpers/main/input";
import { fetchData } from "app/helpers/apiMethods";
import { connect } from "react-redux";
import { withRouter } from "apps/routing/withRouter";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { get, isEqual, omit, map, isFunction, isEmpty } from "lodash";

const Option = Select.Option;
export class selectComponent extends mainInput {
  componentDidMount() {
    const {
      data = [],
      input: { value },
      selectChange,
      setNextUrl,
      value_key = "value",
      setData,
      postRequest,
      fetch,
      links = {},
      ux_pattern,
      api_config,
      VALUE,
      inconsistant,
      init,
      resetData,
      label,
      visible,
      //hideLabel = true
      invokeOnRender,
    } = this.props;
    const { nextLink } = links;
    VALUE && this.props.input.onChange(VALUE);
    this.checkData(this.props, {});

    if (init) init(this.props);

    if (!value && resetData) {
      resetData(this.props);
    }

    if (
      (fetch &&
        (!data.length ||
          (ux_pattern != "infiniteScrolling" && (nextLink || inconsistant)))) ||
      (fetch && invokeOnRender)
    ) {
      ux_pattern == "infiniteScrolling"
        ? this.getScrollingData(this.props, true)
        : fetchAllData(fetch, api_config).then((data) => {
            if (!postRequest) {
              setData(data);
              setNextUrl("");
            } else {
              postRequest(this.props, data);
            }
          });
    }
    if (value && selectChange) {
      const selectedRow = data.find((d) => isEqual(get(d, value_key), value));
      selectChange(value, selectedRow, this.props);
    }
  }

  getScrollingData(props, onMount) {
    const {
      fetch,
      addToData,
      setData,
      links = {},
      api_config,
      setNextUrl,
      pageSize = 20,
    } = props;
    const { nextLink } = links;
    if (onMount) {
      return fetchData(fetch, {
        ...api_config,
        params: {
          ...get(api_config, "params"),
          pageSize: pageSize,
        },
      }).then(({ results, next }) => {
        setData(results);
        setNextUrl(next);
      });
    } else {
      return fetchData(nextLink, omit(api_config, "params")).then(
        ({ results, next }) => {
          addToData(results, -1);
          setNextUrl(next);
        }
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.checkData(nextProps, this.props);
    return (
      !isEqual(nextProps.data, this.props.data) ||
      !isEqual(nextProps.input.value, this.props.input.value) ||
      !isEqual(nextProps.lang, this.props.lang) ||
      !isEqual(nextProps.forceUpdate, this.props.forceUpdate)
    );
  }
  checkData = (nextProps, prevProps) => {
    const { value_key = "value" } = nextProps;
    if (
      prevProps.data &&
      nextProps.data &&
      !isEqual(nextProps.data, prevProps.data)
    ) {
      this.handleChange(
        nextProps,
        nextProps.select_first && nextProps.data.length == 1
          ? get(nextProps.data[0], value_key)
          : null
      );
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      data,
      input: { value },
      selectChange,
      resetFields,
      change,
    } = prevProps;
    const {
      data: nextData = [],
      reset,
      input: { value: nextValue },
      value_key = "value",
    } = this.props;
    if (nextValue == "" && value) {
      selectChange && selectChange(nextValue, null, this.props);
    }
    if (
      nextData.length &&
      String(nextValue) != "" &&
      (!isEqual(value, nextValue) || !isEqual(data, nextData))
    ) {
      resetFields && resetFields.map((f) => change(f, ""));
      if (selectChange) {
        const selectedRow = nextData.find((d) =>
          isEqual(get(d, value_key), nextValue)
        );
        // selectedRow.name = "ff";
        selectChange(nextValue, selectedRow, this.props);
        // if (reset) {
        //   selectChange(null, selectedRow, this.props);
        // }
      }
    }

    return true;
  }

  handleChange(props, value) {
    const {
      input: { name, onChange },
      save_to = "",
      data,
      value_key,
      resetFields,
      change,
    } = props;
    resetFields && resetFields.map((f) => change(f, ""));
    let newVal = value ? value : "";
    onChange(newVal);
    if (save_to) {
      let names = name.split(".");
      names.pop();
      names.push(save_to);
      const selectedRow = data.find((d) => isEqual(get(d, value_key), value));
      change(names.join("."), selectedRow);
    }

    if (this.props.onSelect) {
      this.props.onSelect(value, props);
    }
  }

  onScroll(event) {
    // let maxScroll = event.target.scrollHeight - event.target.clientHeight;
    // let currentScroll = event.target.scrollTop;
    // event.persist()
    // if (currentScroll >= maxScroll) {
    //     if (get(this.props, 'links.nextLink')) {
    //         this.getScrollingData(this.props)
    //             .then(() => event.target.scrollTop = currentScroll);
    //     }
    // }
  }
  render() {
    let {
      values,
      input: { value, ...input },
      showArrow,
      showSearch = false,
      label,
      title,
      placeholder = label,
      data = [],
      label_key = "label",
      value_key = "value",
      t,
      disabled,
      ux_pattern,
      visible = true,
      disable_placeholder = true,
    } = this.props;
    // console.log(this.props);
    //label = (isFunction(visible) ?  visible(values, this.props) : visible) ? label : '';

    if (typeof value == "object" && isEmpty(value)) {
      value = "";
    }
    return (
      <>
        {(isFunction(visible)
          ? visible(values, this.props)
          : visible != undefined
          ? visible
          : true) && (
          <div className="addTranDiv">
            <Select
              suffixIcon={
                <img
                  src="images/addTran.svg"

                  // style={{ position: " absolute", right: " 5px", width: "25px" }}
                />
              }
              disabled={
                isFunction(disabled) ? disabled(values, this.props) : disabled
              }
              onPopupScroll={
                ux_pattern == "infiniteScrolling" && this.onScroll.bind(this)
              }
              // showArrow={showArrow}
              dropdownMatchSelectWidth={false}
              showSearch={showSearch}
              allowClear
              autoClearSearchValue
              title={title}
              getPopupContainer={(trigger) => trigger.parentNode}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  ?.toLowerCase()
                  ?.indexOf(String(input).toLowerCase()) >= 0
              }
              value={value}
              {...input}
              onChange={this.handleChange.bind(this, this.props)}
            >
              <Option value={""} key={"null"} disabled={disable_placeholder}>
                {placeholder}
              </Option>
              {data &&
                typeof data[0] == "object" &&
                map(data, (d) => (
                  <Option
                    value={get(d, value_key)}
                    // data={d}
                    key={get(d, value_key)}
                  >
                    {t(get(d, label_key))}
                  </Option>
                ))}
              {data &&
                typeof data[0] == "string" &&
                map(data, (d) => (
                  <Option
                    value={d}
                    // data={d}
                    key={d}
                  >
                    {t(d)}
                  </Option>
                ))}
            </Select>
          </div>
        )}
      </>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("labels")(selectComponent))
);
