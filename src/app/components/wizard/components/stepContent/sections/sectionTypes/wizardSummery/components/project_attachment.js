import React, { Component } from "react";
import { get, map, isEmpty } from "lodash";
import ShowField from "app/helpers/components/show";
import Attachment from "app/helpers/modules/imp_project/attachment";
const fields = {
  attachments: Attachment.sections.attachments.fields,
  important: Attachment.sections.important.fields,
};

export default class submission extends Component {
  constructor(props) {
    super(props);
  }
  renderInfo = (data, field, key) => {
    return <ShowField field={field} val={get(data, key)} key={key} />;
  };
  render() {
    const { attachments, important } = this.props.mainObject.project_attachment;

    return (
      <>
        {map(fields.attachments, this.renderInfo.bind(this, attachments))}
        {!isEmpty(important) &&
          map(fields.important, this.renderInfo.bind(this, important))}
      </>
    );
  }
}
