import React, { Component } from "react";
import RenderSection from "./sections";
import { reduxForm, FormSection } from "redux-form";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { Form, Collapse } from "antd";
import {
  map,
  get,
  pickBy,
  mapKeys,
  replace,
  assign,
  pick,
  includes,
  orderBy,
  isEqual,
  isEmpty,
} from "lodash";
import RenderAction from "./actions";
import * as Modals from "app/components/modals";
import { defaultActions } from "./actions/defaultActions";
import { withTranslation } from "react-i18next";
import {
  apply_field_permission,
  apply_permissions,
} from "app/helpers/functions";
import { wakilamin_efada_propertyremoval } from "../../modulesObjects";
import applyFilters from "main_helpers/functions/filters";
const Panel = Collapse.Panel;

class StepContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredActions: [],
    };
    let { actions = [] } = this.props;
    this.tawgehSteps = actions.find(
      (action) => [3].indexOf(action.id) != -1
    )?.steps;
    this.tawgehStepsFromStart = actions.find(
      (action) => [15].indexOf(action.id) != -1
    )?.steps;
    this.updateActions();
  }

  updateActions() {
    let { actions = [], currentStep, mainObject, workflowSteps } = this.props;
    try {
      if (this.props?.record?.CurrentStep?.module_id == 87) {
        let submitActions = actions.filter((x) => x.name == "global.SUBMIT");
        if (submitActions && submitActions.length > 1) {
          let adminSign = mainObject?.lagna_notes?.lagna_remarks?.remarks?.find(
            (x) => x.isSignAmin == true
          );
          if (adminSign) {
            if (adminSign.checked) {
              actions = actions.filter(
                (x) =>
                  (x.name == "global.SUBMIT" && !x.next_step) ||
                  x.name != "global.SUBMIT"
              );
            } else {
              actions = actions.filter(
                (x) =>
                  (x.name == "global.SUBMIT" && x.next_step) ||
                  x.name != "global.SUBMIT"
              );
            }
          }
        }
      } else if (
        this.props?.record?.app_id == 26 &&
        this.props?.record?.CurrentStep?.module_id == 151
      ) {
        // let workflowsCount = workflowSteps.filter(
        //   (r) => [3018, 3019, 3020, 3021].indexOf(r.stepId) != -1
        // ).length;
        actions =
          // (actions.find((x) => (x.step_action_id == 1223)) != undefined &&
          //   actions.filter(
          //     (x) =>
          //       (workflowsCount < 4 && x.step_action_id != 1223) ||
          //       (workflowsCount == 4 && x.step_action_id == 1223) ||
          //       x.name != "global.SUBMIT"
          //   )) ||
          actions.filter(
            (x) =>
              x.name != "global.SUBMIT" ||
              (this.props.mainObject?.efada_lands_statements
                ?.efada_lands_statements?.efada_melkia_aradi == 2 &&
                x.next_step != null) ||
              (this.props.mainObject?.efada_lands_statements
                ?.efada_lands_statements?.efada_melkia_aradi != 2 &&
                x.next_step == null)
          ) || actions;
      } else if (this.props?.record?.app_id == 29) {
        // if (
        //   [10501, 10506, 10513].indexOf(
        //     this.props?.mainObject?.landData?.landData?.lands?.temp?.mun
        //   ) == -1
        // ) {
        //   actions = actions.filter((r) => r.id != 5);
        // }

        if (
          this.props?.record?.module_id == 114 ||
          this.props?.record?.CurrentStep?.module_id == 114
        ) {
          if (
            this.props?.mainObject?.landData?.landData?.lands?.parcels[0]
              ?.attributes?.isTadkeekBefore
          ) {
            actions = actions.filter((r) => r.id == 8);
          } else {
            actions = actions.filter((r) => r.id != 8);
          }
        }
      }
      // else if (this.props?.record?.app_id == 14) {
      //
      //   if ([2172, 2333].indexOf(this.props?.record.CurrentStep.id) != -1) {
      //     if (
      //       ["1", "3"].indexOf(
      //         this.props.mainObject?.update_contract_submission_data
      //           ?.update_contract_submission_data?.sakType
      //       ) != -1
      //     ) {
      //       actions = actions.filter(
      //         (r) => [3160, 3161].indexOf(r.next_step) == -1
      //       );
      //     } else {
      //       actions = actions.filter(
      //         (r) => [3162, 3163].indexOf(r.next_step) == -1
      //       );
      //     }
      //   }
      // }
    } catch (e) {}

    let actionsObject = orderBy([...actions], (v) => v.index, ["desc"]).map(
      (value) => {
        // const formValues = applyFilters({
        //   key: "FormValues",
        //   form: "stepForm",
        // });
        const permissions =
          //  formValues.efada_wakil_statements
          //   ? {
          //       show_match_value_props: [
          //         "formValues.efada_wakil_statements.efada__wakil_approval",
          //         ([1, 6].indexOf(value.id) != -1 && "1") || "2",
          //       ],
          //     }
          //   :
          value.can_submit ? { show_check_index: -1 } : {}; //

        if (
          [3, 15].indexOf(value.id) != -1 &&
          this.props.record.CurrentStep.is_edit
        ) {
          // [3, 15].indexOf(value.id) != -1
          let summeryData = Object.values(
            this.props.mainObject?.summery?.summery || {}
          );

          value.className = value.css_class = "btn-return";
          value.steps =
            (!summeryData.length &&
              ((value.id == 3 && this.tawgehSteps) ||
                (value.id == 15 && this.tawgehStepsFromStart) ||
                value.steps)) ||
            (
              (value.id == 3 && this.tawgehSteps) ||
              (value.id == 15 && this.tawgehStepsFromStart)
            )?.filter(
              (step) =>
                summeryData.find(
                  (sum) =>
                    sum?.step?.stepId == step.id && !isEmpty(sum.comments)
                ) != undefined
            );
        }

        let newValue = assign(value, {
          label: value.label_name || value.name,
          className: value.css_class,
          permissions,
        });
        if (value.steps || value.users) {
          newValue = assign(newValue, { type: "select" });
        }
        return newValue;
      }
    );

    actionsObject = mapKeys(
      actionsObject,
      (value) =>
        value.step_action_id ||
        (this.props?.record?.app_id == 29 && replace(value.name, "global.", "")) //&&
    );

    this.state["filteredActions"] = {
      ...actionsObject,
      ...defaultActions,
    };
    this.state.keys = map(currentStep.sections, (_, key) => key);
    this.myForm = React.createRef();
  }
  filteringSections = (sections, values) => {
    return pickBy(sections, (field) =>
      apply_field_permission(values, field, this.props)
    );
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      currentStep: { name },
      reset,
    } = prevProps;
    const {
      currentStep: { name: nextName },
    } = this.props;

    if (name !== nextName) {
      this.myForm.current.scrollTo(0, 0);
      reset();
    }
    this.updateActions();
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (!isEqual(nextProps.currentStep, this.props.currentStep)) {
      this.state.keys = map(nextProps.currentStep.sections, (_, key) => key);
    }
    return (
      !isEqual(
        { props: this.props, state: this.state },
        { props: nextProps, state: nextState }
      ) ||
      !isEqual(nextProps.forceUpdate, this.props.forceUpdate) ||
      true
    );
  }
  changeKeys = (keys) => {
    this.setState({ keys });
  };

  renderInfo(val, k) {
    return (
      <div key={k} className={k}>
        {map(val, (v, k) => (
          <RenderAction
            key={k}
            actionName={(v.name && replace(v.name, "global.", "")) || k}
            actionVals={v}
            {...{ ...this.props }}
          />
        ))}
      </div>
    );
  }
  render() {
    const {
      currentStep,
      steps,
      modal = {},
      removeModal,
      t,
      formValues,
    } = this.props;
    const { filteredActions } = this.state;

    const sections = this.filteringSections(currentStep.sections, formValues);
    let ShowModal = get(Modals, modal.type);
    const actions = pickBy(filteredActions, (v) =>
      apply_permissions(v, v, "permissions", {
        ...this.props,
        list: steps,
        itemIndex: steps.indexOf(currentStep.name),
      })
    );

    const allActions = {
      first: pickBy(actions, (v, k) =>
        includes(
          [
            "next",
            "previous",
            "cancel",
            "close",
            "saveEdits",
            "saveDraft",
            // "preview",
            "alert",
          ],
          k
        )
      ),
      buttons: pickBy(
        actions,
        (v, k) =>
          !includes(
            [
              "next",
              "previous",
              "cancel",
              "close",
              "saveEdits",
              "saveDraft",
              // "preview",
              "alert",
            ],
            k
          )
      ),
      // select: pickBy(actions, v => v.type == 'select'),
    };
    return (
      <div
        ref={this.myForm}
        style={{ overflowY: "hidden" }}
        className="wizard-container"
      >
        <Form>
          <Collapse
            className="Collapse"
            activeKey={this.state.keys}
            onChange={this.changeKeys}
            key={get(
              map(sections, (section, key) => key),
              "[0]"
            )}
          >
            {map(sections, (section, key) => (
              <Panel key={key} header={t(section.label)} forceRender={true}>
                <Form.Item className={section.className}>
                  <FormSection name={key} className="qrrr">
                    {/* <Card title={t(section.label)} headStyle={{ backgroundColor: '#DECEFF' }}> */}
                    <RenderSection
                      {...{
                        ...section,
                        ...pick(this.props, ["touch", "untouch", "change"]),
                      }}
                      values={get(formValues, key)}
                    />
                    {/* </Card> */}
                  </FormSection>
                </Form.Item>
              </Panel>
            ))}
          </Collapse>
          <div className="group_of_buttons">
            {map(allActions, (val, k) => this.renderInfo(val, k))}
          </div>
        </Form>
        {ShowModal ? <ShowModal handleCancel={removeModal} /> : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: "stepForm",
    enableReinitialize: true,
  })(withTranslation("labels")(StepContent))
);
