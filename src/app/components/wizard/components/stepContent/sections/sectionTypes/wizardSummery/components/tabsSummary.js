import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import {
  convertToArabic,
  localizeNumber,
  remove_duplicate,
  checkImage,
  reformatWasekaData,
  copyUser,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { Checkbox, Collapse } from "antd";
const { Panel } = Collapse;
import { mapValues, get, isEqual } from "lodash";

import axios from "axios";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import getModules from "../modules";
import { connect } from "react-redux";
import ViewData from "../viewData";
class tabsSummary extends Component {
  renderView(treeNode) {
    return <ViewData {...{ ...this.props, subTreeNode: treeNode }} />;
  }

  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(
        nextProps?.treeNode?.option?.module_id,
        this.props?.treeNode?.option?.module_id
      ) ||
      !isEqual(
        nextProps?.treeNode?.option?.stepId,
        this.props?.treeNode?.option?.stepId
      )
    );
  }
  render() {
    const {
      treeNode: {
        option: { tabType, data, module_id, stepId, label },
      },
      mainObject,
      t,
    } = this.props;
    //
    let filteredNodes = [];
    let nodes = getModules(
      mainObject,
      this.props.currentModule,
      false,
      module_id
    );
    ////

    let isSummeryExist = false;
    Object.keys(nodes).map((d, k) => {
      if (
        nodes[d][0] &&
        nodes[d][0]?.module_ids &&
        !nodes[d][0]?.isRequestModule &&
        nodes[d][0]?.module_ids?.indexOf(module_id) != -1
        // &&
        // Object.keys(mainObject[d]).filter(objKey => objKey != 'user').length > 0
      ) {
        //
        let label = "";
        if (module_id == 92 && nodes[d][0]?.label == "submissionType") {
          label = "ارفاق الكروكي المساحي";
        } else if (
          module_id == 94 &&
          nodes[d][0]?.label == "اصدار قرار التخصيص"
        ) {
          label = "اصدار خطاب كتابة العدل";
        } else {
          label = nodes[d][0]?.label;
        }
        isSummeryExist = true;
        filteredNodes.push({
          label:
            (module_id == 106 && "طباعة الخطاب وإرساله إلى كتابة العدل") ||
            (module_id == 105 && "اصدار خطاب سريان مفعول الصك") ||
            (module_id == 111 && "اعتماد خطاب سريان مفعول الصك") ||
            label,
          name: `${d}`, //`${d}_${module_id}`,
          option: nodes[d][0],
        });
      }
    });

    //
    if (
      mainObject?.remarks?.length &&
      mainObject?.remarks?.filter(
        (remark) =>
          (remark?.step?.module_id == module_id &&
            remark?.step?.id == stepId) || // && remark?.comment
          (Object.values(remark)[0]?.step?.module_id == module_id &&
            Object.values(remark)[0]?.step?.id == stepId) //&& Object.values(remark)[0]?.comment
      ).length > 0
    ) {
      mainObject?.remarks
        ?.filter(
          (remark) =>
            (remark?.step?.module_id == module_id &&
              remark?.step?.id == stepId) || //&& remark?.comment
            (Object.values(remark)[0]?.step?.module_id == module_id &&
              Object.values(remark)[0]?.step?.id == stepId) //  && Object.values(remark)[0]?.comment
        )
        ?.forEach((remark, index) => {
          isSummeryExist = true;
          ////
          filteredNodes.push({
            label: "notes",
            name: `${label}_remarks_${index}`,
            option: {
              label: "notes",
              type: "remarks",
              data:
                (remark?.step?.module_id == module_id &&
                  remark?.step?.id == stepId &&
                  remark) ||
                (Object.values(remark)[0]?.step?.module_id == module_id &&
                  Object.values(remark)[0]?.step?.id == stepId &&
                  Object.values(remark)[0]),
            },
          });
        });
    }

    if (!isSummeryExist) {
      filteredNodes.push({
        label: "notes",
        name: `${label}_remarks_${0}`,
        option: {
          isEmpty: true,
          label: "notes",
          type: "remarks",
          data: {
            comments: "لا يوجد ملاحظات",
            step: {
              module_id: module_id,
              id: stepId,
              name: label,
            },
            user: copyUser(this.props),
          },
        },
      });
    }

    return (
      <>
        {filteredNodes && (
          <div>
            {filteredNodes.map((node, k) => {
              return (
                <Collapse
                  className="Collapse"
                  //                defaultActiveKey={(k == 0 && ["0"]) || []}
                  defaultActiveKey={[
                    ...filteredNodes.map((r, i) => i.toString()),
                  ]}
                  key={k}
                >
                  <Panel
                    header={t(node.label)}
                    forceRender={true}
                    style={{ margin: "5px" }}
                  >
                    {this.renderView({
                      label: node.label,
                      path: `${node.name}.0`,
                      option: node.option,
                    })}
                  </Panel>
                </Collapse>
              );
            })}
          </div>
        )}
        {module_id == 134 &&
          this.props?.mainObject?.data_msa7y?.msa7yData?.confirm_revision && (
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>تم التاكد من صحة البيانات حسب الصك</td>
                  <td>
                    <Checkbox checked={true} disabled={true}></Checkbox>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(tabsSummary));
