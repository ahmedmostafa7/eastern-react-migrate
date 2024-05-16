import React, { Component } from "react";
import { AutoComplete } from "antd";
import {
  toArray,
  mapValues,
  get,
  includes,
  eq,
  isArray,
  isEqual,
} from "lodash";
import axios from "axios";
import { array_to_obj } from "main_helpers/functions";
const { Option } = AutoComplete;
import { withTranslation } from "react-i18next";
import applyFilters from "main_helpers/functions/filters";
import label from "../../label";
import { validate as isValidUUID } from "uuid";
import { connect } from "react-redux";
import { withRouter } from "apps/routing/withRouter";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { esriRequest } from "../../identify/Component/common";
const funs = {
  includes,
  eq,
};
class SearchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: {},
      text:
        (typeof this.props.input.value == "object" &&
          (!isNaN(Object.keys(this.props.input.value)[0]) ||
            isValidUUID(Object.keys(this.props.input.value)[0])) &&
          Object.values(this.props.input.value).map(
            (item) => item[this.props.label_key]
          )) ||
        (typeof this.props.input.value == "object" &&
          isNaN(Object.keys(this.props.input.value)[0]) &&
          !isValidUUID(Object.keys(this.props.input.value)[0]) &&
          this.props.input.value[this.props.label_key]) ||
        this.props.input.value ||
        "",
    }; //

    const init = get(props.field.value, props.save, "");
    if (init) {
      this.state.dataSource = { [init.id]: init };
    }
    if (!props.min) {
      this.onSearch("");
    }

    if (props.searchOnLoad) {
      this.onSearch(" ");
    }
  }

  // componentDidUpdate(prevProps) {
  //
  //   if (this.props.input.value.isReset) {
  //     this.props.input.value.isReset = false;
  //     const { postRequest } = this.props;
  //     let data = (postRequest &&
  //       postRequest(this.props, this.state.dataSource)) || [];
  //     this.setState({
  //       text: data.length && data?.[0]?.id || "",
  //       dataSource: data.length && data?.[0] || [],
  //     });
  //   }
  // }
  handleChange = (name, ev) => {
    const { postRequest, method } = this.props;
    this.setState({
      [name]:
        (method != "esri" &&
          postRequest &&
          postRequest(this.props, this.state.dataSource)?.[0]?.id) ||
        get(ev, "target.value", ev),
    });
  };
  renderOption = (item) => {
    const { label_key = "id", label_value = "name" } = this.props;
    const value = get(item, label_value);
    const key = get(item, label_key);
    return (
      <Option key={String(key)} text={value} value={String(key)} data={item}>
        <span className="global-search-item-desc">{value}</span>
      </Option>
    );
  };
  onSelect = (value, option) => {
    const { input, saveTo, change, values, onSelect = () => {} } = this.props;
    input.onChange(value);
    this.setState({ text: value });
    if (saveTo) {
      change(saveTo, option.props.data);
    }
    return onSelect(value, option.props.data, values, this.props);
  };

  isNonObjectsArray = (arr) => {
    return arr.every((i) => typeof i !== "object");
  };
  onSearch = (value) => {
    const {
      values,
      url,
      min = -1,
      filter_key,
      method,
      postRequest,
      preRequest,
    } = this.props;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (
      (value && value?.length > min) ||
      value == null ||
      value.match(/^ *$/) !== null
    ) {
      this.timer = setTimeout(() => {
        console.log(values);
        if (preRequest) {
          preRequest(this.props);
        }
        let urlParams = mapValues(this.props.params, (d) =>
          get(values, d, applyFilters({ path: d, default: d }))
        );
        if (filter_key) {
          if (filter_key == "token") {
            urlParams["f"] = "json";
            urlParams[filter_key] = window.esriToken;
          } else {
            urlParams[filter_key] = value;
          }
        }
        let promise = null;
        if (method == "post") {
          promise = axios.post(url, urlParams);
        } else if (method == "esri") {
          promise = esriRequest(url);
        } else {
          promise = axios.get(url, { params: urlParams });
        }
        (
          (method != "esri" &&
            promise.then(({ data: d }) => {
              this.callbackResult(d);
            })) ||
          promise.then((d) => {
            this.callbackResult(d);
          })
        ).catch(() => {
          this.searhing = false;
        });
      }, 200);
    }
  };

  callbackResult = (d) => {
    const { postRequest } = this.props;
    let currentData =
      postRequest &&
      postRequest(
        this.props,
        array_to_obj(
          d.results ||
            (this.isNonObjectsArray(_.isArray(d) ? d : [d])
              ? (_.isArray(d) ? d : [d]).map((r) => ({ id: r }))
              : _.isArray(d)
              ? d
              : [d])
        )
      );
    this.setState(
      {
        dataSource: {
          ...this.state.dataSource,
          ...(currentData ||
            array_to_obj(
              d.results ||
                (this.isNonObjectsArray(_.isArray(d) ? d : [d])
                  ? (_.isArray(d) ? d : [d]).map((r) => ({ id: r }))
                  : _.isArray(d)
                  ? d
                  : [d])
            )),
        },
      },
      () => {
        this.searhing = false;
      }
    );
  };
  filterOption = (input, option) => {
    const { label_value = "name", search_match = "includes" } = this.props;
    const fun = get(funs, search_match);
    return fun(String(get(option.props.data, label_value)), input);
  };
  render() {
    const { dataSource } = this.state;
    const { t, placeholder, owner, values } = this.props;

    return (
      <div>
        <AutoComplete
          dataSource={toArray(dataSource).map(this.renderOption)}
          style={{ width: 200 }}
          onSelect={this.onSelect}
          label={t(placeholder)}
          placeholder={t(placeholder)}
          onSearch={this.onSearch}
          onChange={this.handleChange.bind(this, "text")}
          filterOption={this.filterOption}
          value={this.state.text}
          notFoundContent="لا توجد بيانات"
          optionLabelProp="value"
        />
      </div>
    );
  }
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("labels")(SearchComponent))
);
