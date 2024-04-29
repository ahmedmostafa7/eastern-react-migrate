import React, { Component } from "react";
import { connect } from "react-redux";
import { get } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import * as Dialogs from "./dialogTypes";
import { reduxForm } from "redux-form";
import { composeAsyncValidations } from "app/helpers/functions";

class DialogComponent extends Component {
  render() {
    const { dialog = {}, removeDialog } = this.props;
    const Dialog = get(Dialogs, dialog.name, null);
    return (
      <div>
        {Dialog && (
          <Dialog
            {...dialog}
            {...{ removeDialog }}
            initialValues={dialog.item}
          />
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogComponent);
