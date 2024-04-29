import React, { Component } from "react";
import SurvayPrint from "../wizard/modulesObjects/survey_report/print/survey_html";
import { Modal, Button } from "antd";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { mapStateToProps } from "./mapping";
import { getValuesFromMainObj } from "../editPrint/globalPrintVals";
import ContractPrint from "../wizard/modulesObjects/contract_update/print";
import LandsallotmentPrint from "../wizard/modulesObjects/lands_allotment/print/landsallotment_print";
import PropertycheckPrint from "../wizard/modulesObjects/property_check/print/sakPropertycheck_letter";
import PrintDescriptionCardComponent from "../wizard/modulesObjects/investment_sites/printDescriptionCardComponent";
class globalModal extends Component {
  state = { data: [] };

  render() {
    console.log(this.props);
    const {
      handleCancel,
      t,
      modal: { name, mo3aynaObject, title, submit, content, customFooter, id },
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
      <div className="gp">
        <Modal
          title={title}
          visible={true}
          className="mo3yna_full"
          footer={footer}
          cancelType="danger"
          wrapClassName="fw"
          onOk={() => {
            submit();
            handleCancel();
          }}
          okText={t("Yes")}
          cancelText={t("No")}
          onCancel={handleCancel}
          // onCancel={handleCancel}
        >
          {name == "kroky" && (
            <SurvayPrint
              mo3aynaObject={getValuesFromMainObj(this.props, mo3aynaObject, _)}
            />
          )}
          {name == "contractupdate" && (
            <ContractPrint
              mo3aynaObject={getValuesFromMainObj(this.props, mo3aynaObject, _)}
            />
          )}
          {/* {name == "landsallotment" && (
            <LandsallotmentPrint
              mo3aynaObject={getValuesFromMainObj(this.props, mo3aynaObject, _)}
            />
          )} */}
          {name == "propertycheck" && (
            <PropertycheckPrint
              mo3aynaObject={getValuesFromMainObj(this.props, mo3aynaObject, _)}
            />
          )}
          {name == "fda2" && (
            <PrintDescriptionCardComponent
              mo3aynaObject={mo3aynaObject}
              // mo3ynaId={id}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export const globalMo3yna = connect(mapStateToProps)(
  withTranslation("modals")(globalModal)
);
