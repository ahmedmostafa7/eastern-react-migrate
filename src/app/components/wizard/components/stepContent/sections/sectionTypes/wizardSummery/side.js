import React, { Component } from "react";
import { Tree, Tooltip } from "antd";

import {
  map,
  keys,
  set,
  isEmpty,
  omitBy,
  isNull,
  sortBy,
  filter,
  concat,
  includes,
  omit,
  get,
  find,
  assign,
  pick,
} from "lodash";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;
import getModules from "./modules";
import { fetchData } from "app/helpers/apiMethods";
import { workFlowUrl } from "../../../../../../../../imports/config";
import { checkStepIsExcludedFromSummary } from "app/helpers/functions";
import { checkImportedMainObject } from "../../../../../../inputs/fields/identify/Component/common/common_func";
const backGroundStyle = {
  backgroundColor: "#9797ca",
};
class wizardSummerySide extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    // workflowSteps: [],
    // };
    const { setCurrentTreeNode, treeNode, mainObject, currentModule } =
      this.props;
    const url = `${workFlowUrl}/submission/GetTimeLine/${this.props.currentModule.record.id}`;

    window.parcelsInfo = this.props.mainObject;

    this.nodes = getModules(mainObject, this.props.currentModule, true);

    if (!treeNode) {
      // this.firstStepKey = get(steps, '[0]');
      // const firstSectionKeys = Object.keys(get(wizardSettings, `steps.${this.firstStepKey}.sections`, {}))
      // this.firstSectionKey = get(firstSectionKeys, '[0]');

      if (
        currentModule &&
        currentModule.record &&
        currentModule.record.current_step == "2515"
      ) {
        mainObject["landData"]["landData"]["lands"].isZaedaLgnah = true;
      }

      const firstObject = mainObject
        ? map(
            Object.keys(mainObject).filter(
              (key) =>
                key.toLowerCase() != "supporting" &&
                typeof mainObject[key] == "object"
            ),
            (val, key) => {
              this.firstStepKey1 = val;
              return {
                key: val,
                value: omit(
                  {
                    ...mainObject[val],
                  },
                  "user"
                ),
              };
            }
          )[0] || {}
        : {};

      this.firstStepKey = firstObject.key;
      const firstSectionKeys = keys(firstObject.value);
      this.firstSectionKey = get(firstSectionKeys, "[0]", "[]");

      this.selectedTreeNode =
        (currentModule?.record?.app_id == 16 &&
          currentModule?.record?.request_no &&
          `sub_info.0`) ||
        `${this.firstStepKey}.${this.firstSectionKey}`;

      this.selectedTreeOption =
        (currentModule?.record?.app_id == 16 &&
          currentModule?.record?.request_no && {
            label: "sub_info",
            type: "sub_info",
          }) ||
        get(this.nodes, `${this.firstStepKey}[0]`);

      setCurrentTreeNode({
        path: this.selectedTreeNode,
        option: this.selectedTreeOption,
      });

      if (this.props.currentModule?.record?.request_no) {
        fetchData(url).then((data) => {
          data = omitBy(data, isNull);
          const {
            submission_history,
            CurrentStep: { name, index },
            workflows: { steps },
          } = data;

          // //
          let subNodes = getModules(
            mainObject,
            this.props.currentModule,
            false
          );

          // let steps_module_ids = [
          // ...new Set(
          //     submission_history
          //       .filter(
          //         (stepItem) =>
          //           [
          //             ...new Set(
          //               submission_history.map((step) => step.step_id)
          //             ),
          //           ].indexOf(stepItem.step_id) != -1
          //       )
          //       .map((step) => step.CurrentStep.module_id)
          // ),
          // ];

          // .filter(
          // (stepItem) =>
          // steps_module_ids.indexOf(stepItem.CurrentStep.module_id) != -1
          // )
          let history_steps = submission_history
            .filter((r) => checkStepIsExcludedFromSummary(r.CurrentStep?.id))
            .map((historyStep) => {
              return {
                stepName: historyStep?.CurrentStep?.name,
                stepNameAr: historyStep?.CurrentStep?.name,
                module_id: historyStep?.CurrentStep.module_id,
                stepId: historyStep?.step_id,
                is_create: historyStep?.CurrentStep?.is_create,
              };
            });

          Object.keys(this.nodes).forEach((key) => {
            let step = submission_history.find(
              (r) => !checkStepIsExcludedFromSummary(r.CurrentStep?.id)
            );

            this.nodes[key] = this.nodes[key].length
              ? this.nodes[key].map((node) => {
                  node.stepId = step?.step_id;
                  return node;
                })
              : [];
          });

          history_steps = _.uniqBy(
            history_steps,
            (value) => value.module_id && value.stepId
          );

          this.props.setWorkflowSteps(history_steps);
          // this.setState({
          // workflowSteps: history_steps,
          // });

          setCurrentTreeNode({
            path: this.selectedTreeNode,
            option: this.selectedTreeOption,
            // workflowSteps: history_steps,
            currentStepInfo: data,
          });
        });
      } else {
        // this.state["workflowSteps"] = [];
        setCurrentTreeNode({
          path: this.selectedTreeNode,
          option: this.selectedTreeOption,
          // workflowSteps: [],
          currentStepInfo: null,
        });
      }
    }
  }

  getStepTreeNode(step) {
    const { t } = this.props;
    let { key, sections } = step;
    //
    if (
      !checkImportedMainObject(this.props) &&
      this.props.mainObject?.landData
    ) {
      var reqType =
        (([34].indexOf(this.props.currentModule.id) != -1 ||
          [1971, 1949, 2048, 2068].indexOf(
            this.props.currentModule.record.workflow_id
          ) != -1) &&
          "duplex") ||
        "";

      var requestType = this.props.mainObject?.landData?.requestType;
      if (key == "data_msa7y") {
        let isKrokyUpdateContract =
          this.props?.mainObject?.data_msa7y?.msa7yData?.cadDetails?.temp
            ?.isKrokyUpdateContract || undefined;

        if (!isKrokyUpdateContract) {
          if (reqType) {
            key = "data_msa7y2";
          } else if (
            !reqType &&
            requestType &&
            [14].indexOf(this.props.currentModule.record.app_id) == -1
          ) {
            key = "data_msa7y1";
          }
        }
      } else if (key == "sugLandData") {
        if (reqType) {
          key = "sugLandData_duplex";
        } else {
          key = "sugLandData_parcel";
        }
      } else if (
        [25].indexOf(this.props.currentModule.record.app_id) != -1 &&
        key == "waseka"
      ) {
        key = "كتابة العدل";
      } else if (
        [2210].indexOf(this.props.currentModule.record.workflow_id) != -1 &&
        key == "destinationData"
      ) {
        key = "destinationData1";
      }
    }

    if (
      checkImportedMainObject(this.props) &&
      [14, 1].indexOf(this.props.currentModule.record.app_id) != -1 &&
      key == "data_msa7y"
    ) {
      key = "landData";
    }

    if (
      this.props.mainObject &&
      this.props.mainObject.mun_remark &&
      key == "mun_remark"
    ) {
      if (this.props.mainObject.mun_remark.step_id == 1848) {
        key = "mun_remark_1";
      } else if (this.props.mainObject.mun_remark.step_id == 1849) {
        key = "mun_remark_2";
      }
    }

    let selectedNode = [
      ...Object.values(
        getModules(
          this.props.mainObject,
          this.props.currentModule,
          true,
          step?.sections[0]?.module_id
        )
      ).map((item) => item[0]),
      ...Object.values(
        getModules(
          this.props.mainObject,
          this.props.currentModule,
          false,
          step?.sections[0]?.module_id
        )
      ).map((item) => item[0]),
    ].filter(
      (nodeItem) =>
        [null, undefined].indexOf(nodeItem?.module_ids) == -1 &&
        nodeItem?.module_ids?.indexOf(step?.sections[0]?.module_id) != -1
    );

    if (selectedNode.length && this.props.mainObject?.comments) {
      Object.keys(this.props.mainObject?.comments).forEach((commentKey) => {
        if (commentKey == selectedNode[0].label) {
          //
          this.props.mainObject.comments[commentKey][0] = {
            ...this.props.mainObject?.comments[commentKey][0],
            commentStep: {
              module_id: step?.sections[0]?.module_id,
              name: step?.sections[0]?.label,
              id: step?.sections[0]?.stepId,
            },
          };
        }
      });
    }

    let notifiedTreeItemClass =
      ((this.props?.record?.is_returned ||
        this.props?.currentModule?.record?.is_returned) &&
        this.props.mainObject?.comments &&
        ((this.props.mainObject?.comments["remarks"]?.length &&
          this.props.mainObject?.comments["remarks"]?.filter(
            (comment) =>
              comment?.step?.name == key &&
              [null, undefined].indexOf(comment) == -1 &&
              comment &&
              Object.keys(comment).length > 0 &&
              (!comment?.checked ||
                (comment?.checked == true && _.isEmpty(comment?.reply_text))) &&
              (!step?.sections?.[0]?.isRequestModule
                ? comment?.step?.module_id == step?.sections?.[0]?.module_id &&
                  comment?.step?.stepId == step?.sections?.[0]?.stepId
                : true)
          )?.length > 0) ||
          Object.keys(this.props.mainObject?.comments || {})?.filter(
            (commentKey) => {
              let commentInfo =
                (!Array.isArray(this.props.mainObject?.comments[commentKey]) &&
                  this.props.mainObject?.comments[commentKey]) ||
                null;
              return (
                (!_.isEmpty(commentInfo) &&
                  commentKey != "remarks" &&
                  (commentKey == key || commentInfo?.step?.name == key) &&
                  (!commentInfo?.checked ||
                    (commentInfo?.checked == true &&
                      _.isEmpty(commentInfo?.reply_text))) &&
                  (!step?.sections?.[0]?.isRequestModule
                    ? commentInfo?.step?.module_id ==
                        step?.sections?.[0]?.module_id &&
                      commentInfo?.step?.stepId == step?.sections?.[0]?.stepId
                    : true)) ||
                false
              );
            }
          )?.length > 0 ||
          (this.props.mainObject?.comments &&
            Object.keys(this.props.mainObject?.comments)?.filter(
              (commentKey) =>
                commentKey != "remarks" &&
                this.props.mainObject?.comments[commentKey].length &&
                this.props.mainObject?.comments[commentKey].find((comment) => {
                  return (
                    [null, undefined].indexOf(comment) == -1 &&
                    comment &&
                    Object.keys(comment).length > 0 &&
                    (!comment?.checked ||
                      (comment?.checked == true &&
                        _.isEmpty(comment?.reply_text))) &&
                    (commentKey == key || comment?.step?.name == key) &&
                    (!step?.sections?.[0]?.isRequestModule
                      ? comment?.step?.module_id ==
                          step?.sections?.[0]?.module_id &&
                        comment?.step?.stepId == step?.sections?.[0]?.stepId
                      : true)
                  );
                }) != undefined
            )?.length > 0)) &&
        "NotifiedTreeItem") ||
      "";
    let summeryData = Object.values(
      this.props.mainObject?.summery?.summery || {}
    );
    let EnableEditingTreeItemClass =
      (this.props.currentModule.record.CurrentStep.is_edit &&
        key != "sub_info" &&
        (!summeryData.length ||
          (summeryData.length &&
            summeryData.find(
              (value) =>
                (!value?.step?.isRequestModule &&
                  value?.step?.stepId == sections?.[0]?.stepId) ||
                value?.step?.isRequestModule == sections?.[0]?.isRequestModule
            ) != undefined)) &&
        ((sections?.[0]?.stepId &&
          this.props.currentModule?.actions?.filter(
            (action) =>
              [3, 15].indexOf(action.id) != -1 &&
              action.steps?.find((step) => step.id == sections?.[0]?.stepId) !=
                undefined
          )?.length) ||
          (!sections?.[0]?.stepId &&
            this.props.currentModule?.actions?.filter(
              (action) =>
                [3, 15].indexOf(action.id) != -1 &&
                action.steps?.find(
                  (step) => !checkStepIsExcludedFromSummary(step?.id)
                ) != undefined
            )?.length)) &&
        "EditedTreeItem") ||
      "";

    if (sections.length > 0) {
      return (
        <TreeNode
          title={t(key)}
          key={key}
          id={key}
          className={notifiedTreeItemClass || EnableEditingTreeItemClass}
        >
          {" "}
          {map(sections, (v, k) => (
            <TreeNode
              title={t(v.label || k)}
              style={(v.isNew && backGroundStyle) || {}}
              className={
                (this.selectedTreeNode == `${key}.${k}` &&
                  ((!v.isRequestModule &&
                    v.module_id == this.selectedTreeOption.module_id &&
                    v.stepId == this.selectedTreeOption.stepId) ||
                    true) &&
                  "selectedTreeItem") ||
                ""
              }
              isLeaf
              section={v}
              key={`${key}.${k}`}
              id={k}
            >
              {" "}
            </TreeNode>
          ))}{" "}
        </TreeNode>
      );
    }
  }

  onSelect(k, e) {
    const { setCurrentTreeNode } = this.props;
    let firstNode;
    let nodeProps;
    if (e.node.isLeaf()) {
      setCurrentTreeNode({ path: k[0], option: e.node.props.section });
    } else if (e.node) {
      nodeProps = get(
        e?.node?.props?.children?.find((r) => typeof r == "object")[0],
        "props",
        {}
      );
      firstNode = get(e.node, "props.children.0.props.id", nodeProps?.id);
      // firstNode &&
      setCurrentTreeNode({
        path: `${k[0]}.${firstNode}`,
        option:
          e?.node?.props?.children?.[0]?.props?.section || nodeProps?.section,
      });
    }

    this.selectedTreeNode =
      (e?.node?.isLeaf() && k[0]) || `${k[0]}.${firstNode}`;
    this.selectedTreeOption =
      (e?.node?.isLeaf() && e?.node?.props?.section) ||
      e?.node?.props?.children[0]?.props?.section ||
      nodeProps?.section;
  }

  componentWillUnmount() {
    this.props.removeCurrentTreeNode();
  }

  render() {
    const {
      treeNode,
      mainObject = {},
      currentModule,
      user,
      steps,
      workflowSteps,
    } = this.props;
    const {
      currentModule: { record },
    } = this.props;
    var hidden = [
      "comment",
      "comments",
      "approvals_select",
      "remark",
      "summery",
    ];

    //تدقيق مساحي
    if (record && record.app_id == 29) {
      hidden.push("data_msa7y");
    }

    if (record && record.app_id == 19) {
      hidden.push("landData");
    }

    if (!(mainObject.ma7dar && mainObject.ma7dar.ma7dar_mola5s)) {
      hidden.push("ma7dar");
    }

    let remarks = {
      ...[
        ...(typeof mainObject.remarks == "array" ? mainObject.remarks : []),
      ].reduce(
        (o, v) => ({
          ...o,
          [get(v, "step.name", "")]: omit(v, ["step"]),
        }),
        {}
      ),
    };
    let newMainObject = {
      ...steps.reduce((a, b) => {
        a[b] = mainObject[b];
        return a;
      }, {}),
      ...omit(mainObject, steps),
    };
    //
    // if (workflowSteps.length) {
    // ////
    // workflowSteps
    //     ?.filter((step) => !step.is_create)
    //     .forEach((step) => {
    //       newMainObject[step.stepNameAr] = {};
    //       this.nodes[step.stepNameAr] = [
    //         {
    //           label: step.stepNameAr,
    //           type: "tabsSummary",
    //           module_id: step.module_id,
    //           stepId: step.stepId,
    //         },
    //       ];
    //     });
    // }

    // if (record && record.app_id == 16 && record.request_no) {
    // if (!newMainObject.sub_info) {
    //     newMainObject["sub_info"] = {};
    // }

    // if (newMainObject.sub_info) {
    //     this.nodes["sub_info"] = [
    //       {
    //         label: "sub_info",
    //         type: "sub_info",
    //       },
    //     ];
    // }
    // }

    if (!isEmpty(remarks)) {
      newMainObject.remarks = remarks;
    }
    if (
      get(
        mainObject,
        "remark.comment.comment",
        get(
          mainObject,
          "remark.comment.attachemnts"
          // "remark.comment.check_plan_approval"
        )
      )
    ) {
      set(
        newMainObject,
        `remarks.${get(currentModule, "record.CurrentStep.name", "")}`,
        {
          user,
          ...mainObject.remark.comment,
        }
      );
    }

    return (
      <DirectoryTree
        selectedKeys={[treeNode]}
        defaultExpandedKeys={
          (currentModule?.record?.app_id == 16 &&
            currentModule?.record?.request_no && ["sub_info"]) || [
            this.firstStepKey,
          ]
        }
        onSelect={this.onSelect.bind(this)}
      >
        {" "}
        {record &&
          record.app_id == 16 &&
          record.request_no &&
          this.getStepTreeNode({
            key: "sub_info",
            sections: [
              {
                label: "sub_info",
                type: "sub_info",
              },
            ],
          })}
        {map(omit(newMainObject, hidden), (v, k) =>
          this.getStepTreeNode({
            key: k,
            sections:
              get(this.nodes, k) ||
              omit(
                {
                  ...v,
                },
                "user"
              ),
          })
        )}
        {map(workflowSteps, (v, k) => {
          return this.getStepTreeNode({
            key: v.stepNameAr,
            sections: [
              {
                label: v.stepNameAr,
                type: "tabsSummary",
                module_id: v.module_id,
                stepId: v.stepId,
              },
            ],
          });
        })}{" "}
      </DirectoryTree>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(wizardSummerySide));
