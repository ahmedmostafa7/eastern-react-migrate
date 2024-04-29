import React, { Component } from "react";
import { get, map } from "lodash";
import ShowField from "app/helpers/components/show";
import Comment from "app/helpers/modules/comment";

export default class submission extends Component {
  constructor(props) {
    super(props);
  }
  renderInfo = (data, field, key) => {
    return <ShowField field={field} val={get(data, key)} key={key} />;
  };
  render() {
    const { comment } = this.props.mainObject.remark;
    console.log(Comment);

    return (
      <>
        {map(
          Comment.sections.comment.fields,
          this.renderInfo.bind(this, comment)
        )}
      </>
    );
  }
}
