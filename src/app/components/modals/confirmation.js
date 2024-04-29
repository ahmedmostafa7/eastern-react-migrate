import React, { Component } from "react";
import { Modal, Button } from "antd";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { mapStateToProps } from "./mapping";

class confirmationComponent extends Component {
  render() {
    const {
      handleCancel,
      t,
      modal: { title, submit, content, customFooter },
    } = this.props;

    const footer = customFooter ? (
      <div>
        {customFooter.map((button) => (
          <Button {...button}> {t(button.label)} </Button>
        ))}
        <Button type="danger" onClick={handleCancel}>
          {t("No")}
        </Button>
      </div>
    ) : undefined;

    return (
      <div>
        <Modal
          title={t(title)}
          visible={true}
          footer={footer}
          cancelType="danger"
          onOk={() => {
            submit();
            handleCancel();
          }}
          okText={t("Yes")}
          cancelText={t("No")}
          onCancel={handleCancel}
        >
          {content && t(content)}
        </Modal>
      </div>
    );
  }
}

export const confirmation = connect(mapStateToProps)(
  withTranslation("modals")(confirmationComponent)
);
