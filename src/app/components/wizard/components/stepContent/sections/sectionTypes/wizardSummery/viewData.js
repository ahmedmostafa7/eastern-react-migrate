import React, { Component, Suspense } from "react";
import { fetchAllData } from "app/helpers/functions";
import { map, get, isEmpty, find, findKey, split, omit } from "lodash";
import { Card, Checkbox, Switch, Button, Input } from "antd";
import { Field } from "redux-form";
import renderField from "app/components/inputs";
import { apply_field_permission } from "app/helpers/functions";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { filesHost } from "imports/config";
import { connect } from "react-redux";
import * as fieldValues from "app/helpers/fieldValues";
import * as modules from "../../../../../modulesObjects";
import moment from "moment-hijri";
import * as SummaryComponent from "./components";
import HeaderComment from "./headerComment";
import { checkStepIsExcludedFromSummary } from "app/helpers/functions";
import { copyUser } from "../../../../../../inputs/fields/identify/Component/common/common_func";
class viewData extends Component {
  state = { checkedComment: false, disabled: false };
  constructor(props) {
    super(props);

    this.fields = [
      {
        name: "comments",
        label: "Write your comments",
        hideLabel: true,
        field: "textArea",
        style: { minHeight: "100px" },
        permission: {
          show_if_props_equal: { key: "currentRecordEdit", value: 1 },
        },
        onChangeInput: (props, e) => {
          const {
            input: { onChange },
          } = props;
          onChange(e.target.value);
        },
        onBlur: (e) => {
          this.saveSummeryComment(e.target.value);
        },
      },
    ];
    this.checkboxCommentField = [
      {
        name: "checkComments",
        // label: "Write your comments",
        hideLabel: true,
        field: "boolean",
        style: { minHeight: "100px" },
      },
    ];
    this.filteredFields = this.fields.filter((field) =>
      apply_field_permission({}, field, this.props)
    );
    this.checkboxComment = this.checkboxCommentField.filter((field) =>
      apply_field_permission({}, field, this.props)
    );
    this.data = [];
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.currentStep == "summery") {
      localStorage.setItem("summery", true);
    }
    return (
      this.props.treeNode != nextProps.treeNode ||
      // this.props.mainObject == nextProps.mainObject ||
      this.props.selectors != nextProps.selectors
    );
  }

  getItem(field, data, key) {
    const { t, selectors } = this.props;
    const label = !get(field, "hideSummaryLabel", false) && (
      <label>{t(get(field, "label"))} :</label>
    );
    const value = get(fieldValues, field.field, (text) => text)(
      data,
      null,
      field,
      get(selectors, field.moduleName),
      { t }
    );

    if (value) {
      return (
        <div>
          <table className="table summaryTableShow3" key={key}>
            <tbody>
              <tr className="label_fileUpload">
                <td>{label}</td>
                <td>{value}</td>
              </tr>
            </tbody>
          </table>
          {/* <p>ggg</p> */}
        </div>
      );
    } else {
      return null;
    }
  }

  fillSelects() {
    const { treeNode = {}, selectors = {} } = this.props;
    const path = treeNode.path || "";
    // console.log(modules)
    const currentModule = findKey(modules, (singleModule) => {
      return singleModule.steps[get(path.split("."), "[0]")];
    });
    const currentSectionFields = get(modules[currentModule], [
      "steps",
      get(path.split("."), "[0]"),
      "sections",
      get(path.split("."), "[1]"),
      "fields",
    ]);

    map(currentSectionFields, (field) => {
      if (field.field == "select" && !selectors[field.moduleName]) {
        const { moduleName, fetch, data = [], api_config } = field;
        const { setSelectorData } = this.props;
        if (fetch && !data.length) {
          fetchAllData(fetch, api_config).then((data) => {
            setSelectorData(data, moduleName);
          });
        }
      }
    });
  }

  getData = (treeNode) => {
    const { mainObject } = this.props;
    // console.log(treeNode)
    const currentSectionData = get(mainObject, treeNode.path);
    const option = get(treeNode, "option.type", false);
    const path = get(treeNode, "path", "");
    const data = get(treeNode, "option.data", null);
    const isEmpty = get(treeNode, "option.isEmpty", false);

    if (option) {
      const SComponent = get(SummaryComponent, option);
      if (SComponent) {
        return (
          <Suspense fallback={<></>}>
            <SComponent
              data={treeNode.data || data || currentSectionData}
              isEmpty={isEmpty}
              mainObject={mainObject}
            />
          </Suspense>
        );
      }
    }
    const currentModule = findKey(modules, (singleModule) => {
      return singleModule.steps[get(path.split("."), "[0]")];
    });
    const currentSectionFields = get(modules[currentModule], [
      "steps",
      get(path.split("."), "[0]"),
      "sections",
      get(path.split("."), "[1]"),
      "fields",
    ]);

    if (treeNode == "stoppingReason.stoppingReason") {
      return <div> {currentSectionData} </div>;
    } else {
      return map(currentSectionFields, (field, key) => {
        return this.getItem(field, get(currentSectionData, key), key);
      });
    }
  };
  getDate = () => {
    let today = new Date();
    let todayYear = today.toLocaleDateString();
    console.log(moment(todayYear, "iD/iM/iYYYY"));
    // return moment(todayYear, "iYYYY/iM/iD");
  };

  toggleComment(currentNode, singleComment, index, isToggle = true) {
    let comments =
      this.props?.mainObject?.comments[currentNode] ||
      this.props?.mainObject?.comments["remarks"]?.filter(
        (remark) => remark?.step?.name == currentNode
      );

    // let index = comments?.findIndex(
    //   (remark) => remark?.comment == singleComment?.comment
    // );

    if (isToggle) {
      singleComment.checked =
        [undefined, false, null].indexOf(singleComment?.checked) != -1
          ? true
          : false;
    }

    singleComment.reply = this.props.currentModule.record.is_returned
      ? singleComment.checked
      : false;
    //singleComment.reply_text = "";

    this.props.setComments(currentNode, index, singleComment);
    // });
    //console.log("comments", comments);
    this.setState({ checkedComment: true });
    //console.log("s", comments);
  }

  saveSummeryComment(val) {
    //
    const {
      treeNode = "",
      mainObject,
      subTreeNode,
      workflowSteps,
    } = this.props;
    const currentNode =
      (subTreeNode && split(subTreeNode.path, ".")[0]) ||
      split(treeNode.path, ".")[0];

    const currentNodeOption = omit(treeNode?.option, "type");
    if (!currentNodeOption?.stepId) {
      currentNodeOption.stepId = workflowSteps?.find(
        (step) => step?.is_create
      )?.stepId;
    }

    if (!val && mainObject?.summery?.summery[currentNode]) {
      delete mainObject.summery.summery[currentNode];
      setTimeout(() => {
        this.props.updateSummery(mainObject.summery.summery);
      });
    } else {
      this.props.setSummeryComments(currentNode, {
        comments: val,
        step: {
          ...currentNodeOption,
          name: currentNodeOption.label,
        },
        user: copyUser(this.props),
        checked: false,
      });
    }
  }

  render() {
    const {
      treeNode = "",
      mainObject,
      userId,
      t,
      subTreeNode,
      workflowSteps,
    } = this.props;
    console.log("user", this.props.user);
    let comments = get(mainObject, "comments", {});

    let user = {};

    let newMainObject = {
      ...mainObject,
    };

    const currentNode =
      (subTreeNode && split(subTreeNode.path, ".")[0]) ||
      split(treeNode.path, ".")[0];

    const selectedStepName =
      (subTreeNode && split(subTreeNode?.option?.label, ".")[0]) ||
      split(treeNode?.option?.label, ".")[0];

    let commentsEnabled = true;
    if (workflowSteps?.length) {
      workflowSteps.forEach((step) => {
        if (selectedStepName == step.stepNameAr) {
          commentsEnabled = false;
        }
      });
    }

    map(newMainObject, (obj) => {
      if (get(obj, currentNode)) {
        user = get(obj, "user", {});
      }
    });

    //checking if the current user is the user responsible for this step of the summery to show him comments on it
    const isUser = userId == user.id ? true : false;
    //checking if the current user is the user who wrote a comment
    // const isOwner = find(comments[currentNode], v => v.user.id == userId) ? true : false
    this.fillSelects();
    // if (subTreeNode) {
    //   const { setCurrentTreeNode } = this.props;
    //   if (setCurrentTreeNode) {
    //     setCurrentTreeNode(subTreeNode);
    //   }
    // }
    let gotData = this.getData(subTreeNode || treeNode);
    let checkComment = map(comments, (v, k) => {
      if (
        (v && Object.values(v).length == 0) ||
        (v[0] && Object.keys(v[0]).length === 0)
      ) {
        delete comments[k];
      }
    });
    console.log("checkComment", checkComment);
    let summeryData = Object.values(
      this.props.mainObject?.summery?.summery || {}
    );

    let isCommentsAvailable =
      !isEmpty(comments) &&
      !isEmpty(comments[currentNode]) &&
      (Array.isArray(comments[currentNode])
        ? (!this.props.treeNode?.option?.isRequestModule &&
            (
              comments[currentNode][0].step ||
              comments[currentNode][0].commentStep
            ).module_id == this.props.treeNode?.option?.module_id &&
            (
              comments[currentNode][0].step ||
              comments[currentNode][0].commentStep
            ).stepId == this.props.treeNode?.option?.stepId) ||
          true
        : (!this.props.treeNode?.option?.isRequestModule &&
            (comments[currentNode].step || comments[currentNode].commentStep)
              .module_id == this.props.treeNode?.option?.module_id &&
            (comments[currentNode].step || comments[currentNode].commentStep)
              .stepId == this.props.treeNode?.option?.stepId) ||
          true);

    return (
      <div style={{ height: "100%" }}>
        {isEmpty(gotData) ? <label>{t("no data found")} </label> : gotData}
        {/* {this.getNotes(treeNode)} */}

        {!isEmpty(comments) &&
          ((currentNode != "remarks" && isCommentsAvailable) ||
            comments["remarks"]?.filter(
              (remark) => remark?.step?.name == currentNode
            )?.length > 0) && (
            <Card
              title={t("التعليقات")}
              style={{ margin: "20px" }}
              bodyStyle={{ display: "flex", flexFlow: "row wrap" }}
            >
              {(
                (Array.isArray(comments[currentNode]) &&
                  comments[currentNode]) ||
                comments["remarks"]?.filter(
                  (remark) => remark?.step?.name == currentNode
                )
              )
                ?.filter((d) => {
                  return (
                    ((!this.props.treeNode?.option?.isRequestModule &&
                      (d.step || d.commentStep).module_id ==
                        this.props.treeNode?.option?.module_id &&
                      (d.step || d.commentStep).stepId ==
                        this.props.treeNode?.option?.stepId) ||
                      true) &&
                    !isEmpty(d.comment)
                  );
                })
                // .filter((d) => d)
                ?.map((singleComment, index) => {
                  return (
                    <Card
                      key={index}
                      type="inner"
                      className="sum"
                      style={{ width: "400px", margin: "16px" }}
                      title={
                        <HeaderComment
                          comment={singleComment}
                          user={this.props.user}
                        />
                      }
                      // {get(singleComment, "user.name", "")}
                    >
                      <Switch
                        onClick={this.toggleComment.bind(
                          this,
                          currentNode,
                          singleComment,
                          index,
                          true
                        )}
                        disabled={singleComment.is_disabled}
                        checked={get(singleComment, "checked", false)}
                        //defaultChecked={get(singleComment, "checked", false)}
                      />
                      <br />

                      {get(singleComment, "comment", "")}
                      <br />
                      {(singleComment.reply ||
                        (this.props.currentModule.record.is_returned &&
                          singleComment.checked)) && (
                        <div style={{ marginTop: "20px" }}>
                          <Field
                            type={"text"}
                            hideLabel={true}
                            onChangeInput={(props, e) => {
                              const {
                                input: { onChange },
                              } = props;
                              onChange(e.target.value);
                            }}
                            component={renderField}
                            name={`${currentNode}.${`reply${index}`}`}
                            onBlur={(evt) => {
                              singleComment.reply_text = evt.target.value;
                              this.toggleComment(
                                currentNode,
                                singleComment,
                                index,
                                false
                              );
                            }}
                            disabled={singleComment.is_disabled}
                            init_data={(props) => {
                              const {
                                input: { onChange },
                              } = props;
                              onChange(singleComment.reply_text);
                            }}
                            placeholder={"من فضلك أضف الرد على التعليق"}
                          />
                        </div>
                      )}
                    </Card>
                  );
                }) ||
                (comments[currentNode] &&
                  !Array.isArray(comments[currentNode]) &&
                  ((this.props.treeNode?.option?.isRequestModule &&
                    (
                      comments[currentNode].step ||
                      comments[currentNode].commentStep
                    ).module_id == this.props.treeNode?.option?.module_id &&
                    (
                      comments[currentNode].step ||
                      comments[currentNode].commentStep
                    ).stepId == this.props.treeNode?.option?.stepId) ||
                    (
                      comments[currentNode].step ||
                      comments[currentNode].commentStep
                    ).stepId == this.props.treeNode?.option?.stepId) &&
                  !isEmpty(comments[currentNode].comment) && (
                    <Card
                      key={0}
                      type="inner"
                      className="sum"
                      style={{ width: "400px", margin: "16px" }}
                      title={
                        <HeaderComment
                          comment={comments[currentNode]}
                          user={this.props.user}
                        />
                      }
                      // {get(singleComment, "user.name", "")}
                    >
                      <Switch
                        onClick={this.toggleComment.bind(
                          this,
                          currentNode,
                          comments[currentNode],
                          0,
                          true
                        )}
                        disabled={comments[currentNode].is_disabled}
                        checked={get(comments[currentNode], "checked", false)}
                        //defaultChecked={get(singleComment, "checked", false)}
                      />
                      <br />
                      {get(comments[currentNode], "comment", "")}
                      <br />
                      {(comments[currentNode].reply ||
                        (this.props.currentModule.record.is_returned &&
                          comments[currentNode].checked)) && (
                        <div style={{ marginTop: "20px" }}>
                          <Field
                            type={"text"}
                            hideLabel={true}
                            onChangeInput={(props, e) => {
                              const {
                                input: { onChange },
                              } = props;
                              onChange(e.target.value);
                            }}
                            component={renderField}
                            name={`${currentNode}.${`reply`}`}
                            onBlur={(evt) => {
                              comments[currentNode].reply_text =
                                evt.target.value;
                              this.toggleComment(
                                currentNode,
                                comments[currentNode],
                                0,
                                false
                              );
                            }}
                            disabled={comments[currentNode].is_disabled}
                            init_data={(props) => {
                              const {
                                input: { onChange },
                              } = props;
                              onChange(comments[currentNode].reply_text);
                            }}
                            placeholder={"من فضلك أضف الرد على التعليق"}
                          />
                        </div>
                      )}
                    </Card>
                  ))}
            </Card>
          )}

        {/* adding a comment field */}
        <div style={{ margin: "16px" }} className="summaryCardDiv">
          {commentsEnabled &&
            ((this.props.currentModule.record.is_returned &&
              Object.keys(comments).length == 0) ||
              !this.props.currentModule.record.is_returned) &&
            (!summeryData.length ||
              (summeryData.length > 0 &&
                summeryData.find(
                  (value) =>
                    (!value?.step?.isRequestModule &&
                      value?.step?.stepId ==
                        this.props.treeNode?.option?.stepId) ||
                    value?.step?.isRequestModule ==
                      this.props.treeNode?.option?.isRequestModule
                ) != undefined)) &&
            ((this.props.treeNode?.option?.isRequestModule &&
              this.props.currentModule?.actions?.filter(
                (action) =>
                  [3, 15].indexOf(action.id) != -1 &&
                  action.steps?.find(
                    (step) => !checkStepIsExcludedFromSummary(step?.id)
                  ) != undefined
              )?.length > 0) ||
              (!this.props.treeNode?.option?.isRequestModule &&
                this.props.currentModule?.actions?.filter(
                  (action) =>
                    [3, 15].indexOf(action.id) != -1 &&
                    action.steps?.find(
                      (step) => step.id == this.props.treeNode?.option?.stepId
                    ) != undefined
                )?.length > 0)) &&
            this.filteredFields &&
            this.filteredFields?.map((field) => {
              return (
                <div
                  key={`${currentNode}.${field.name}`}
                  className="Comment_text_area"
                >
                  <div
                    style={{
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr ",
                        }}
                      >
                        {/* <h4 style={{ fontWeight: "bold" }}>
                          {" "}
                          {this.props.user.departments.name}
                        </h4> */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {this.props.user.image ? (
                            <img
                              src={`${filesHost}/${this.props.user.image}`}
                              width="50px"
                            />
                          ) : (
                            <img src="images/avatarImg.png" width="50px" />
                          )}
                          <h4> {this.props.user.name}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Field
                    {...field}
                    component={renderField}
                    name={`${currentNode}.${field.name}`}
                  />
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(viewData));
