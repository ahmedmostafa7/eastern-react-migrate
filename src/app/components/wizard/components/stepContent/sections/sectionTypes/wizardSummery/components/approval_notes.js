import React, { Component } from "react";
import { get, map } from "lodash";
import ShowField from "app/helpers/components/show";
import { moment } from "moment-hijri";
const fields = {
  notes: {
    field: "list",
    className: "modal-table",
    label: "approvalSubmissionNotes",
    hideLabel: true,
    value_key: "notes",
    moduleName: "APPROVALSubmissionNotes",
    hideLabels: true,
    inline: true,
    fields: {
      notes: {
        head: "Notes",
      },
      attachments: {
        head: "Attachments",
        field: "simpleUploader",
        type: "show",
        multiple: true,
      },
    },
  },
};

export default class approvalSubmissionNotes extends Component {
  constructor(props) {
    super(props);
    const { notes } = this.props.mainObject.approvalSubmissionNotes;
    let newNotes = { ...notes, date: moment().format("iYYYY-iMM-iD") };
    this.data = notes;
  }
  renderInfo = (field, key) => {
    return <ShowField field={field} val={get(this.data, key)} key={key} />;
  };
  render() {
    console.log("ggtgt", fields, this.renderInfo);
    return map(fields, this.renderInfo);
  }
}
