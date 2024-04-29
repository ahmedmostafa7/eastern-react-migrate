import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Button, Alert, message } from "antd";
import { Field, reduxForm } from "redux-form";
import { mapDispatchToProps } from "./mapping";
import loginFields from "./LoginFields";
import RenderField from "app/components/inputs";
import { serverFieldMapper } from "app/helpers/functions";
import { withTranslation } from "react-i18next";
import { postItem } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
import { withRouter } from "react-router";
import { workFlowUrl } from "imports/config";
import { get, isEmpty } from "lodash";

class Login extends Component {
  constructor(props) {
    super(props);
    this.fields = loginFields.map((f) => serverFieldMapper(f));
    this.state = {
      submitting: false,
      error: "",
    };
  }

  handleSubmit(values) {
    const { addUser, t, history } = this.props;
    this.setState({ submitting: true });
    const url = workFlowUrl + "/auth";
    return postItem(url, values)
      .then((res) => {
        this.setState({ submitting: false });
        addUser(res);
        let noTokenUser = Object.assign({}, res);
        noTokenUser["token"] = null;
        noTokenUser["esri_token"] = null;
        noTokenUser["esriToken"] = null;
        localStorage.setItem("user", JSON.stringify(noTokenUser));
        localStorage.setItem("token", res.token);
        window.esriToken = res.esriToken;
        let redirect = "/";

        if (get(res, "groups")) {
          let found = res.groups
            .map((group) => group.groups_permissions)
            .filter((v) => v);
          redirect = !isEmpty(found)
            ? res.is_super_admin
              ? "/administration"
              : "/apps"
            : "/";
        }

        history.push(redirect);
        message.success("تم تسجيل الدخول بنجاح");

        // postItem('/authenticate')
        //     .then(res => {
        //         this.setState({ submitting: false });
        //         addUser(res);
        //
        //         redirect_to && history.push(redirect_to);
        //     })
      })
      .catch(({ response }) => {
        if (get(response, "status") == 403) {
          message.error(t(response.data));
          // this.setState({
          //     error: response.data
          // })
        } else {
          message.error("حدث خطأ");
        }
        this.setState({
          ...this.state,
          submitting: false,
        });
      });
  }
  render() {
    const { t, handleSubmit, className } = this.props;
    const { error, submitting } = this.state;
    return (
      <div className={className}>
        <Form style={{ direction: "rtl" }}>
          {error && (
            <Alert
              message={t(`messages:${this.state.error}`)}
              type="error"
              closable
              onClose={() => this.setState({ error: "" })}
            />
          )}
          {this.fields.map((field) => {
            //console.log("props:",this.props)
            return (
              <Field
                key={field.name}
                name={field.name}
                component={RenderField}
                {...field}
              />
            );
          })}
          <Button
            className="login-button"
            onClick={handleSubmit(this.handleSubmit.bind(this))}
            disabled={submitting}
            loading={submitting}
            type="primary"
          >
            {t("Sign in")}
          </Button>
        </Form>
      </div>
    );
  }
}

export default reduxForm({
  form: "loginForm",
})(
  withRouter(
    connect(null, mapDispatchToProps)(withTranslation("actions")(Login))
  )
);
