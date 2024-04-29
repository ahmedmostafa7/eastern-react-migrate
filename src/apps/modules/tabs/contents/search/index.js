import React, { Component } from "react";
import { Button, Form, Tooltip } from "antd";
import renderField from "app/components/inputs";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { withTranslation } from "react-i18next";
import { Filters } from "./filters.js";
import style from "./style.less";
import { searchFields } from "./searchFields";
import { map, pick, get, isEmpty } from "lodash";
import memoize from "memoize-one";
import {
  serverFieldMapper,
  apply_field_permission,
} from "app/helpers/functions";
import { workFlowUrl } from "imports/config";
import { fetchData } from "app/helpers/apiMethods";

const searchUrl = "/search";

class searchComponent extends Component {
  constructor(props) {
    super(props);

    this.fields = map(searchFields, (value, key) => ({
      name: key,
      ...serverFieldMapper(value),
    }));
  }

  filteringFields = memoize((values) => {
    return this.fields.filter((field) =>
      apply_field_permission(values, field, this.props)
    );
  });

  handleSearch(values) {
    const { apps, currentApp } = this.props;
    if (!isEmpty(values)) {
      if (
        (values.search_with && (values.search || values.statusSearch)) ||
        values.from_date ||
        values.to_date
      ) {
        const status = get(values, "statusSearch", null);
        let otherParams = {};
        !status
          ? (otherParams[get(values, "search_with")] = get(
              values,
              "search",
              null
            ))
          : null;
        const config = {
          app_id: apps[currentApp].id,
          status,
          ...otherParams,
          ...pick(values, ["from_date", "to_date"]),
        };
        fetchData(workFlowUrl + searchUrl + +"?" + `pageNum=${1}`, {
          params: config,
        }).then((resp) => {});
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.currentTab &&
      this.props.currentTab.name !== nextProps.currentTab.name
    ) {
      this.handleReset();
    }
  }
  render() {
    const {
      t,
      handleSubmit,
      content: { searchWith },
      formVals,
    } = this.props;
    return (
      <div>
        {/* {filters && <Filters {...this.props} style={{width:'50%'}}/>}  */}
        {searchWith && (
          <div>
            <Form
              onSubmit={handleSubmit(this.handleSearch.bind(this))}
              style={{ display: "flex", flexDirection: "row" }}
            >
              {this.filteringFields(formVals).map((field) => (
                <Field
                  component={renderField}
                  key={field.name}
                  {...{ ...formVals }}
                  {...field}
                  {...{
                    ...field,
                    ...pick(this.props, ["touch", "untouch", "change"]),
                  }}
                />
              ))}
              <Button type="primary" htmlType="submit">
                Search
              </Button>
            </Form>
          </div>
        )}
      </div>
    );
  }
}

export const Search = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation("admins")(
    reduxForm({
      form: "SearchForm",
    })(searchComponent)
  )
);
