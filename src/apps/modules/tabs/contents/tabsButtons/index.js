import React, { Component } from "react";
import renderField from "app/components/inputs";
import { Field, reduxForm } from "redux-form";
import { withTranslation } from "react-i18next";
import { tabsButtons } from "./buttonsObject";
import { Form } from "redux-form";
import { Button } from "antd";
import { get, isEmpty } from "lodash";

class tabButtons extends Component {
  openExportCad() {
    const { currentApp, home } = this.props;
    ////
    window.location.href = window.printHost + `/#/exportCad/${currentApp.id}`;
  }

  render() {
    const { currentApp, home } = this.props;
    const field = get(
      currentApp,
      "modules.CREATE_REQUEST",
      get(currentApp, "modules.CREATE_ORDERING", "")
    )
      ? (get(currentApp, "modules.CREATE_ORDERING", "") &&
          tabsButtons(currentApp).create_ordering) ||
        tabsButtons(currentApp).create
      : [];
    return (
      <div className="headerButtons">
        <Form
          style={{
            justifyItems: "center",
          }}
        >
          {!isEmpty(field) && (
            <div
              className={`new_submission addnewTran`}
              style={{ marginTop: "15px" }}
            >
              <Field
                // capture
                key={field.fetch}
                component={renderField}
                {...{ ...field }}
              />{" "}
            </div>
          )}
        </Form>
        {/* <div></div> */}
        {!isEmpty(get(currentApp, "modules.CAD_EXPORT", null)) && (
          <div
            style={{ textAlign: "right" }}
            // className={this.props.sideOpened ? "" : "mt-2 mr-2"}
          >
            <Button
              className="new_submission buttonSelect cad_btn"
              onClick={this.openExportCad.bind(this)}
            >
              <img src="images/cadfile.svg" className="pl-3 " />
              <span className="cadFileLabelTab">
                {" "}
                إستيراد ملف رسم هندسي (أوتوكاد)
              </span>
            </Button>
          </div>
        )}
        <div className="clearfix"></div>
      </div>
    );
  }
}

export const TabButtons = withTranslation("tabs")(
  reduxForm({
    form: "ButtonsForm",
  })(tabButtons)
);
