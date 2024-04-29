import React, { Component } from "react";
import { Button, Form, Tooltip } from "antd";
import renderField from "app/components/inputs";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { withTranslation } from "react-i18next";
import { get, map } from "lodash";
import { serverFieldMapper } from "app/helpers/functions";
// import Tags from './tags';
// import { Filters } from './filters.js';

class searchComponent extends Component {
  handleFilters(name, element) {
    this.props.addFilter(name, element);
  }

  handleSearch(searchValues) {
    this.props.setSearch({ ...searchValues, contain: true });
  }

  handleReset() {
    this.props.removeSearch();
    this.props.reset();
  }

  componentDidUpdate(prevProps) {
    const { currentModuleKey: prevModuleKey } = prevProps;
    const { currentModuleKey } = this.props;
    if (currentModuleKey && prevModuleKey !== currentModuleKey) {
      this.handleReset();
    }
  }
  render() {
    const { t, handleSubmit, currentModule } = this.props;
    return (
      <div style={{ display: "grid", gridGap: "10px" }}>
        <div>
          <Form layout="inline" className="top1">
            <Field
              component={renderField}
              className="search_admin"
              name="q"
              placeholder={t("search")}
              hideLabel={true}
              // validate={this.required}
            />
            <Field
              name="filter_key"
              component={renderField}
              field="select"
              placeholder={t("Search in column")}
              hideLabel={true}
              data={map(get(currentModule, "search_with"), (d) => ({
                label: get(currentModule, `fields.${d}.label`),
                value: d,
              }))}
              // validate={this.required}
            />
            <Form.Item>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridGap: "5px",
                }}
              >
                <Tooltip placement="bottom" title={t("Search")}>
                  <Button
                    type="primary"
                    className="admin-search"
                    icon="search"
                    onClick={handleSubmit(this.handleSearch.bind(this))}
                  />
                </Tooltip>
                <Tooltip placement="bottom" title={t("Clear")}>
                  <Button
                    type="primary"
                    className="admin-delete"
                    icon="delete"
                    onClick={this.handleReset.bind(this)}
                  />
                </Tooltip>
              </div>
            </Form.Item>
          </Form>
        </div>
        {/* <div>
                    <Filters />
                    <Tags />
                </div> */}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation("actions")(
    reduxForm({
      form: "SearchForm",
    })(searchComponent)
  )
);
