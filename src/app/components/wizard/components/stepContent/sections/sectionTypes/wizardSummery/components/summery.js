import React, { Component } from "react";
import { get, isEqual, map } from "lodash";
import Show from "app/helpers/components/show/show";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import {
  create_landsallotment,
  review_landsallotment_munplan,
  review_landsallotment_munsurvey,
} from "../../../../../../modulesObjects/lands_allotment/create/index";
import {
  lands_statements,
  plan_statements,
  municipality_statements,
  approve_investmanager_investmentsites,
  print_investmentsites_lagnh,
} from "../../../../../../modulesObjects/investment_sites/create/index";
import { Create_Plan_Approval_Request } from "../../../../../../modulesObjects/plan_approval/create/index.js";
import ownerData from "app/helpers/modules/owner";
import { convertToArabic } from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { Collapse } from "antd";
import { adle_statement_propertycheck } from "../../../../../../modulesObjects/property_check/create";
const { Panel } = Collapse;

class summery extends Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(
        nextProps?.treeNode?.option?.label,
        this.props?.treeNode?.option?.label
      ) || !isEqual(nextProps.forceUpdate, this.props.forceUpdate)
    );
  }
  renderInfo = (data, field, key) => {
    const { t } = this.props;
    let value = get(data, key);
    if (field.field == "list") {
      delete field.fields.actions;
    } else if (field.field == "primaryPricing") {
      field.isReadOnly = true;
    } else if (field.field == "button") {
      field.in_summery = true;
    }

    if (value || field.field == "button") {
      return (
        <tr>
          {!field.hideLabel && (
            <td style={{ width: "50%" }}>
              <label style={{ whiteSpace: "nowrap" }}>{t(field.label)}</label>
            </td>
          )}
          <td style={{ width: "50%" }} colSpan={"100%"}>
            <Show
              field={field}
              val={
                (["text", "number", "inputNumber", "hijriDatePicker"].indexOf(
                  field.field
                ) != -1 &&
                  convertToArabic(value)) ||
                value
              }
              isView={true}
              stepModuleId={this.props.data.module_id}
            />
          </td>
        </tr>
      );
    }
  };
  render() {
    let forms = this.props.data.forms || {
      ...Create_Plan_Approval_Request.steps,
      ...approve_investmanager_investmentsites.steps,
      ...print_investmentsites_lagnh.steps,
    };
    //;
    const { t } = this.props;
    let label =
      this.props?.treeNode?.option?.label || this.props.data.sectionName || "";

    let sections =
      (!Array.isArray(this.props.data.sectionName) && [
        this.props.data.sectionName,
      ]) ||
      this.props.data.sectionName;
    return (
      <>
        {(sections.length > 1 ||
          this.props?.treeNode?.option?.isRequestModule) &&
          map(
            sections,
            (section) =>
              (this.props.mainObject[sections[0]][section] && (
                <Collapse className="Collapse" defaultActiveKey={["0"]} key={0}>
                  <Panel
                    header={(sections.length > 1 && t(section)) || t(label)}
                    forceRender={true}
                    style={{ margin: "5px" }}
                  >
                    <table className="table table-bordered table-striped">
                      {map(
                        forms?.[sections?.[0] || ""]?.["sections"]?.[section]
                          ?.fields || [],
                        this.renderInfo.bind(
                          this,
                          this.props.mainObject[sections[0]][section]
                        )
                      )}
                    </table>
                  </Panel>
                </Collapse>
              )) || <></>
          )}{" "}
        {sections.length == 1 &&
          !this.props?.treeNode?.option?.isRequestModule && (
            <table className="table table-bordered table-striped">
              {map(sections, (section) =>
                map(
                  forms?.[sections?.[0] || ""]?.["sections"]?.[section]
                    ?.fields || [],
                  this.renderInfo.bind(
                    this,
                    this.props.mainObject[sections[0]][section]
                  )
                )
              )}
            </table>
          )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(summery));
