import React, { Component } from "react";
import { Button, Form, Tooltip, Row, Col } from "antd";
import renderField from "app/components/inputs";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { withTranslation } from "react-i18next";
import searchFields from "./searchFields";
import { map, pick } from "lodash";
import memoize from "memoize-one";
import {
  serverFieldMapper,
  apply_field_permission,
} from "app/helpers/functions";
import { printHost } from "imports/config";
import style from "./style.less";
import { reset } from "redux-form";
import ExportCSV from "./ExportCSV";
import { columns } from "./json_inputs";
import { followUp } from "../../tableActionFunctions/tableActions";
class searchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      button: "",
    };

    this.fields = map(searchFields, (value, key) => ({
      name: key,
      ...serverFieldMapper(value),
    }));
  }
  handleReset() {
    this.props.form.resetFields();
  }

  print = () => {
    /// print func
    window.open(printHost + "/#/addedparcels_requestsReport", "_blank");
  };

  filteringFields = memoize((values) => {
    console.log(
      "d",
      this.fields.filter((field) =>
        apply_field_permission(values, field, this.props)
      )
    );
    return this.fields.filter((field) =>
      apply_field_permission(values, field, this.props)
    );
  });

  componentWillReceiveProps(nextProps) {
    if (
      this.props.currentTab &&
      this.props.currentTab.name !== nextProps.currentTab.name
    ) {
      this.handleReset();
    }
  }
  render() {
    //
    const {
      t,
      handleSubmit,
      searchVals,
      onSubmit,
      resultsToExport,
      pageNo,
      myRef,
      clearData,
    } = this.props;
    // let newSearchValues=
    return (
      <div>
        <div>
          <Form
            onSubmit={handleSubmit((values) =>
              onSubmit(values, this.state.button)
            )}
          >
            <Row
              type="flex"
              style={{ alignItems: "right" }}
              justify="right"
              gutter={24}
            >
              {this.filteringFields(searchVals)
                .filter((field) => field.name.indexOf("_date") == -1)
                .map((field, index) => (
                  <Col span={12} key={index + 1} className="fullMobile">
                    <Field
                      component={renderField}
                      key={field.name}
                      {...{ ...searchVals }}
                      {...field}
                      {...{
                        ...field,
                        ...pick(this.props, ["touch", "untouch", "change"]),
                      }}
                      onChange={() => {
                        clearData();
                      }}
                    />
                  </Col>
                ))}
            </Row>
            <Row
              type="flex"
              style={{ alignItems: "right" }}
              justify="right"
              gutter={24}
            >
              {this.filteringFields(searchVals)
                .filter((field) => field.name.indexOf("_date") != -1)
                .map((field, index) => (
                  <Col span={12} key={index + 1} className="fullMobile">
                    <Field
                      component={renderField}
                      key={field.name}
                      {...{ ...searchVals }}
                      {...field}
                      {...{
                        ...field,
                        ...pick(this.props, ["touch", "untouch", "change"]),
                      }}
                      onChange={() => {
                        clearData();
                      }}
                    />
                  </Col>
                ))}
            </Row>
            <Row
              type="flex"
              style={{ alignItems: "center" }}
              justify="center"
              gutter={10}
            >
              <Col>
                <Button
                  htmlType="submit"
                  onClick={() => {
                    this.setState({ button: "search", exportAll: true });
                  }}
                  className="search_archive"
                >
                  {t("search")}
                </Button>{" "}
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    clearData();
                    this.props.reset("searchForm");
                  }}
                >
                  مسح
                </Button>
                {/* <Button
                  className="search_archive"
                  htmlType="submit"
                  icon="printer"
                  onClick={() => {
                    this.setState({ button: "print" });
                  }}
                >
                  طباعة
                </Button> */}
                {(resultsToExport?.length && (
                  <ExportCSV
                    data={resultsToExport}
                    columns={columns}
                    pageNo={pageNo}
                    props={this.props}
                    followUp={followUp}
                    myRef={myRef}
                    scope={this}
                  />
                )) || (
                  <button
                    htmlType="submit"
                    onClick={() => {
                      this.setState({ button: "ExportToCSV" });
                    }}
                    className="btn btn-warning hidd"
                  >
                    استخراج ملف اكسيل
                  </button>
                )}
              </Col>
            </Row>

            {/* {this.state.button ? <Button className="btn btn-warning btnReport" htmlType='submit' onClick={() => {this.setState({button: 'report'})}}> 
                            {t('report')} </Button> :false} */}
          </Form>
        </div>
      </div>
    );
  }
}

export const SearchForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation("labels")(
    reduxForm({
      form: "searchForm",
    })(searchComponent)
  )
);
