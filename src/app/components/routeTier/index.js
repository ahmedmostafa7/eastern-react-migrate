import React, { Component } from "react";
import { get, find, omit, includes } from "lodash";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { withRouter } from "apps/routing/withRouter";
import Axios from "axios";
import qs from "qs";
import { withTranslation } from "react-i18next";
import { fetchData, postItem } from "../../helpers/apiMethods";
import { applyMapping } from "main_helpers/functions/app_mappings";
import { message } from "antd";
import {
  collectAllPathsFromObject,
  checkCommentsAvailability,
} from "../../components/inputs/fields/identify/Component/common/common_func";
import { retrieveFeesInfo } from "../../../main_helpers/functions/fees";
const base64Regex =
  /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
export class WizardById extends Component {
  tab_name = undefined;

  constructor(props) {
    super(props);
    const { setCurrentApp } = this.props;

    console.log("prooops", this.props);
    //setting the current wizard module and its steps

    const urlParams = get(window.location.href.split("?"), "1");
    const params = qs.parse(urlParams, { ignoreQueryPrefix: true });
    const token = get(params, "tk");
    const app_name = get(params, "appname");
    this.tab_name = get(params, "tabName");
    const currentAppId = get(params, "appId");
    if (token) {
      // get user from token
      localStorage.setItem("token", token);
    }
    localStorage.setItem("appname", app_name);
    localStorage.setItem("appId", currentAppId);

    setCurrentApp(app_name);

    if (this.props.params && this.props.params.id) {
      Axios.get(
        workFlowUrl + "/api/Submission/GetByIdForWizard/" + this.props.params.id
      )
        .then((response) => {
          this.view(response.data, response.status);
        })
        .catch((error) => {
          message.error("عذرا، لا تملك صلاحية لعرض هذة المعاملة");
        });
    }
  }

  applyCurrentModule1(record, action, actions, props, response_status) {
    const {
      user_groups,
      addToMainObject,
      setCurrentModule,
      history,
      // here is the logged in user
      t,
    } = props;

    const { CurrentStep, status, request_no, workflows } = record;

    this.success(t);
    if (includes(["outbox"], this.tab_name)) {
      setCurrentModule({
        record,
        actions: (!record.transfered_user_id && actions) || [],
        name: "default_module",
        id: 2,
      });
      localStorage.setItem("req_no", request_no);
      localStorage.setItem("CurrentStep", CurrentStep.name);
      history("/wizard");
      //window.open("/wizard", "_blank")
      return;
    }

    if (
      includes(["inbox"], this.tab_name) ||
      includes(["unpaid"], this.tab_name) ||
      includes(["Paid"], this.tab_name) ||
      includes(["UPDATING_SUBMISSIONS"], this.tab_name) ||
      (includes(["archive"], this.tab_name) &&
        /*find(
          user_groups,
          (group) => group.id == get(CurrentStep, "groups.id", "")
        ) &&*/
        includes([1], status))
    ) {
      //if user don't have permission for this request
      if (includes(["archive"], this.tab_name) && response_status == 270) {
        setCurrentModule({
          record,
          actions: (!record.transfered_user_id && actions) || [],
          name: "summary",
          id: 7,
        }); // default_module id
      } else {
        //2 is a finished submission & 3 is rejected
        let user = JSON.parse(localStorage.getItem("user"));
        if (
          record.assign_to_user_id == user.id ||
          record.assign_to_position_id == user.position_id ||
          user.groups.find((group) => group.id == record.assign_to_group_id) !=
            undefined
        ) {
          setCurrentModule({
            record,
            actions: (!record.transfered_user_id && actions) || [],
            id: CurrentStep?.module_id,
          });
        } else {
          setCurrentModule({
            record,
            actions: (!record.transfered_user_id && actions) || [],
            name: "default_module",
            id: 2,
          });
        }
      }
    } else {
      let action = status == 3 || status == 2 ? {} : actions;
      if (record.plan_status == 4) {
        //stopped plan status
        addToMainObject(record.stop_reason, "stoppingReason.stoppingReason");
      }

      setCurrentModule({
        record,
        actions: (!record.transfered_user_id && actions) || [],
        name: "default_module",
        id: 2,
      }); // default_module id
    }

    localStorage.setItem("req_no", request_no);
    localStorage.setItem("CurrentStep", CurrentStep.name);
    localStorage.setItem("workFlowName", workflows.name);
    history("/wizard");
  }

  view(record, response_status) {
    const { name, removeMainObject, setMainObject, setComments, t } =
      this.props;

    let action = undefined;

    const { submission_file_path, id, is_delayed, CurrentStep } = record;
    let module_id = record.CurrentStep && record.CurrentStep?.module_id;
    console.log("cs", CurrentStep, record);
    localStorage.setItem("id_submission", id);

    localStorage.setItem("module_id", module_id);
    removeMainObject();
    //let oldMain, newMain;

    this.getJsonFile(submission_file_path, setMainObject, setComments, name)
      .then((data) => {
        data =
          (typeof data == "string" &&
            JSON.parse(window.lzString.decompressFromBase64(data))) ||
          data;
        this.getButtons(id, is_delayed).then((actions) => {
          if (data.submissionType && typeof data.submissionType == "string") {
            delete data.submissionType;
          }

          applyMapping(data, record).then((response) => {
            data = response.mainObject;
            window.Supporting = data.Supporting || {};
            if (record.workflows) {
              data.submissionTypeName = record.workflows.name;
            }
            if (record.CurrentStep && record.CurrentStep.id) {
              data.currentStepId = record.CurrentStep.id;
            }

            retrieveFeesInfo(data, record);

            checkCommentsAvailability(data, record);

            //if (!data.All_Attachments) {
            // let paths= [];
            // collectAllPathsFromObject(data, '', paths)
            // data["All_Attachments"] = paths;
            //}

            setMainObject(omit(data, ["allNotes", "workflow_id"]));
            this.applyCurrentModule1(record, action, actions, this.props);
          });
        });
      })
      .catch((e) => {
        console.error(e);
        this.failure(t);
      });
  }

  applyCurrentModule2(record, props) {
    const { setCurrentModule, history, t } = props;
    const { CurrentStep, request_no } = record;
    success(t);
    setCurrentModule({
      record,
      actions: [
        {
          name: "global.SUBMIT",
          can_submit: true,
          id: 1,
          css_class: "send",
        },
      ],
      id: CurrentStep?.module_id,
    });
    //}
    localStorage.setItem("req_no", request_no);
    localStorage.setItem("CurrentStep", CurrentStep.name);
    history("/wizard");
  }
  //function to req the action buttons of the wizard for the current step
  getButtons(id, is_delayed) {
    const url = `${workFlowUrl}/GetActions/${id}`;
    const params = { is_delayed };
    return Axios.get(url, { ...params }).then(({ data }) => {
      return data.actions;
    });
  }

  async getJsonFile(url, setMainObject, setComments, name = "") {
    return fetchData(backEndUrlforMap + url + "mainObject.json").then(
      (data) => {
        data =
          (typeof data == "string" &&
            JSON.parse(window.lzString.decompressFromBase64(data))) ||
          data;
        setComments(data.comments);
        // setAllNotes(data.allNotes)
        // const data = mainNodelObject
        setMainObject(omit({ ...data }, ["allNotes"]));
        return data;
      }
    );
  }

  success(t) {
    window.notifySystem("success", t("Successfully retrieved data"));
  }

  failure(t) {
    window.notifySystem("error", t("An error occured, can not retrieve data"));
  }

  render() {
    return <div></div>;
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("actions")(WizardById))
);
