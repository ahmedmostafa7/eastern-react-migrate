import React, { Component } from "react";
import { get, map } from "lodash";
import ShowField from "app/helpers/components/show";
import { withTranslation } from "react-i18next";
import { angularUrl } from "configFiles/config";
import { Button } from "antd";
const fields = {
  sub_type: {
    label: "Submission Type",
    field: "select",
    showSearch: true,
    moduleName: "Consultants",
    label_key: "name",
    value_key: "id",
    data: [
      {
        id: "imp",
        name: "Important Project",
      },
      {
        id: "imp_time",
        name: "Important Project Time",
      },
    ],
    required: true,
  },
  attach_kroky: {
    label: "attach To Kroky",
    field: "boolean",
  },
  submission_no: {
    label: "Kroky Number",
    required: true,
  },
  submission_date: {
    label: "Kroky Date",
    field: "hijriDatePicker",
    lessThanToday: true,
    required: true,
  },
  isuue_date: {
    label: "Kroky Issue",
    required: true,
  },
  image: {
    label: "Kroky Image",
    multiple: false,
    placeholder: "select file",
    field: "simpleUploader",
  },
};

class submission extends Component {
  constructor(props) {
    super(props);
    const { submission, kroky } = this.props.mainObject.submissionType;
    this.submission = submission;
    this.fKroky = get(submission.kroky, "[0]");
    this.data = submission.without_kroky
      ? kroky
      : {
          submission_no: this.fKroky.request_no,
          submission_date: this.fKroky.create_date,
          isuue_date: "آمانة المنطقة الشرقية",
        };
    this.data = {
      ...this.data,
      attach_kroky: !submission.without_kroky,
      sub_type: submission.sub_type,
    };
  }
  openKroky = () => {
    // kroky url here with submission id
    const url = angularUrl + this.fKroky.print_state + this.fKroky.id;
    window.open(url, "_blank");
  };
  renderInfo = (field, key) => {
    return <ShowField field={field} val={get(this.data, key)} key={key} />;
  };
  render() {
    const { t } = this.props;
    return (
      <>
        {map(fields, this.renderInfo)}
        {this.data.attach_kroky && (
          <Button onClick={this.openKroky}>{t("Print Kroky")}</Button>
        )}
      </>
    );
  }
}

export default withTranslation("labels")(submission);
