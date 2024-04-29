import React, { Component } from "react";
import { Button, Form, Tooltip, Row, Col } from "antd";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import renderField from "app/components/inputs";
import { Field, reduxForm } from "redux-form";
import searchFields from "./searchFields";
import { withTranslation } from "react-i18next";
import { map, pick } from "lodash";
import memoize from "memoize-one";
import {
  serverFieldMapper,
  apply_field_permission,
} from "app/helpers/functions";
import style from "./style.less";
import { reset } from "redux-form";

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
    const { t, handleSubmit, searchVals, onSubmit } = this.props;
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
                .map((field, index) => {
                  return (
                    ((this.props.currentApp.id != 26 ||
                      (this.props.currentApp.id == 26 &&
                        field.name != "SubmissionType")) && (
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
                        />
                      </Col>
                    )) || (
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
                          data={[
                            {
                              value: 1,
                              name: t("labels:runningProcesses"),
                            },
                            {
                              value: 2,
                              name: t("labels:finishedProcesses"),
                            },
                            {
                              value: 3,

                              name: t("labels:canceledProcesses"),
                            },
                          ]}
                        />
                      </Col>
                    )
                  );
                })}
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
                    this.setState({ button: "search" });
                  }}
                  className="search_archive"
                >
                  {t("search")}
                </Button>{" "}
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    this.props.reset("searchForm");
                  }}
                >
                  مسح
                </Button>
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
