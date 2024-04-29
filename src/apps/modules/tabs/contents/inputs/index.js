import React, { Component } from "react";
import { Form, Button } from "antd";
import { Field, reduxForm } from "redux-form";
import renderField from "app/components/inputs";
import { withTranslation } from "react-i18next";
import { pick } from "lodash";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
import {
  getAllStatistics,
  getAllProvStatistics,
  GetProvinceStatistics,
  GetEngCompanyRequestsStatistics,
  SubmnsCountPerStep,
  SubmnsCountPerStepDelayed,
} from "app/components/charts/apiFunctions";
import {
  apply_field_permission,
  serverFieldMapper,
} from "app/helpers/functions";
import {
  SubmnsCountPerSteps,
  checkTeamPerformance,
} from "../../../../../app/components/charts/apiFunctions";
export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "inputs"),
    ...mapDispatchToProps1(dispatch),
  };
};
class inputComp extends Component {
  constructor(props) {
    super(props);

    const { fields } = props;

    if (fields) {
      this.fields = fields.map((f) => serverFieldMapper(f));
      this.renderedFields = this.filteringFields(props.values);
    }
  }

  filteringFields(values) {
    return this.fields.filter((field) => {
      return apply_field_permission(values, field.permissions, this.props);
    });
  }

  submitHandler = (vals) => {
    const {
      SubmnsCountPerStepUrl,
      ProgressPerStepUrl,
      pieChartUrl,
      sunBurstUrl,
      GetProvinceStatisticsUrl,
      GetEngCompanyRequestsStatisticsUrl,
      teamIndicatorUrl,
    } = this.props;

    getAllStatistics(pieChartUrl, "illustrationChart", vals, this.props);
    SubmnsCountPerStep(
      SubmnsCountPerStepUrl,
      "illustrationChart4",
      vals,
      this.props
    );
    SubmnsCountPerStepDelayed(
      ProgressPerStepUrl,
      "illustrationChart5",
      vals,
      this.props
    );
    SubmnsCountPerSteps(
      SubmnsCountPerStepUrl,
      "illustrationChart4",
      vals,
      this.props
    );
    checkTeamPerformance(
      teamIndicatorUrl,
      "illustrationChart13",
      vals,
      this.props
    );
    GetProvinceStatistics(
      `${GetProvinceStatisticsUrl}&`,
      "illustrationChart3",
      vals,
      this.props
    );
    getAllProvStatistics(sunBurstUrl, "sortingServicesChart", vals, this.props);
    GetEngCompanyRequestsStatistics(
      GetEngCompanyRequestsStatisticsUrl,
      "illustrationChart2",
      vals,
      this.props
    );
  };

  // componentDidMount() {
  //   setTimeout(() => {
  //
  //     document.querySelector('form button').click()
  //   }, 2000);
  // }

  render() {
    const { values, t, handleSubmit } = this.props;

    return (
      (this.fields && (
        <Form
          id={"myform"}
          onSubmit={handleSubmit(this.submitHandler.bind(this))}
          layout="inline"
        >
          {this.renderedFields?.map((field) => (
            <Field
              component={renderField}
              key={field.name}
              {...{ values }}
              {...{
                ...field,
                ...pick(this.props, ["touch", "untouch", "change"]),
              }}
            />
          ))}

          <Button
            className="btn filter "
            htmlType="submit"
            style={{ marginTop: "45px", marginRight: "10px" }}
          >
            {t("filter")}
          </Button>
        </Form>
      )) || <></>
    );
  }
}

//in need the mapping here because it is sent in the functions
export const Inputs = reduxForm({
  form: "inputStatisticsForm", // a unique identifier for this form
})(
  connect(
    mapStateToProps,
    appMapDispatchToProps
  )(withTranslation("labels")(inputComp))
);
