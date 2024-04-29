import React, { Component } from "react";
import { Modal } from "antd";
import { get } from "lodash";
import { withTranslation } from "react-i18next";

class confirmationComp extends Component {
  state = {
    confirmLoading: false,
  };

  handleOk = () => {
    const { submitFun, removeDialog, t, error_message } = this.props;

    this.setState({
      confirmLoading: true,
    });
    submitFun()
      .then(() => removeDialog())
      .catch(() => {
        this.setState({
          confirmLoading: false,
        });
      });
  };

  render() {
    const { removeDialog, title, message, item, show, t } = this.props;
    const { confirmLoading } = this.state;
    return (
      <div>
        <Modal
          title={title}
          onOk={this.handleOk}
          visible={true}
          confirmLoading={confirmLoading}
          onCancel={removeDialog}
          okText={t("Yes")}
          cancelText={t("No")}
          okButtonProps={{ disabled: this.state.confirmLoading }}
        >
          <p>{message}</p>
          <p> {get(item, show)} </p>
        </Modal>
      </div>
    );
  }
}

export const confirmation = withTranslation("actions")(confirmationComp);
