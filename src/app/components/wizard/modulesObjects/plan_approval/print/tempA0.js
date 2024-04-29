import React, { Component } from "react";
import { get, isEmpty } from "lodash";
import { filesHost } from "imports/config";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import { getSubmissionHistory } from "main_helpers/functions/submission_history";
import SignPics from "../../../../editPrint/signPics";
import axios from "axios";
import {
  convertToArabic,
  remove_duplicate,
  selectActors,
  checkImage,
  getInfo,
  intersectQueryTask,
  getFeatureDomainName,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { followUp } from "../../../../../../apps/modules/tabs/tableActionFunctions/tableActions";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { Row, Col } from "antd";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import EditPrint from "app/components/editPrint";
import {
  CalculateFees,
  CalculateTotalFees,
} from "../../../../../../main_helpers/functions/fees";
import { mapUrl } from "../../../../inputs/fields/identify/Component/mapviewer/config";
// import { workFlowUrl, backEndUrlforMap } from "../../../imports/config";
Array.prototype.sum = function (prop) {
  var total = 0;
  for (var y = 0, _len = this.length; y < _len; y++) {
    prop = prop.replace(/\[(\w+)\]/g, ".$1");
    prop = prop.replace(/^\./, "");
    var a = prop.split(".");
    var data = JSON.parse(JSON.stringify(this[y]));

    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in data) {
        data = data[k];
      } else {
        return 0;
      }
    }

    total += data;
  }
  return total;
};
export default class TempA0 extends Component {
  state = {
    data: [],
    btnPrint: "طباعة مخطط المكتب الهندسي",
    fees: "",
    title1: "",
    title2: "",
    title3: "",
    title4: "",
    title5: "",
    title6: "",
    title7: "",
    title8: "",
    printObj: {},
  };

  setPrintValues = (submissionData, mainObject) => {
    // let mainObject = mainObject;
    let creator_user_name = get(submissionData, "CreatorUser.name", "");
    let actors = selectActors(submissionData, mainObject, [4, 3, 2, 1, 0]);

    let module_id = get(submissionData, "CurrentStep.module_id", "");
    let step_id = get(submissionData, "CurrentStep.id", "");

    let admissions = get(
      mainObject,
      "admissions.admission_ctrl.attachments",
      []
    );

    let bda2l_values = get(
      mainObject,
      "bda2l.bands_approval.band_number.owner_selectedValues",
      get(mainObject, "bda2l.bands_approval.band_number.selectedValues", [])
    ); //.map((value) => value.condition);

    let request_no = get(submissionData, "request_no", "");
    let committee_report_no = get(submissionData, "committee_report_no", "");
    let is_paid =
      (submissionData?.submission_invoices?.length > 0 &&
        submissionData?.submission_invoices?.filter(
          (invoice) => invoice?.is_paid == true
        )?.length == submissionData?.submission_invoices?.length) ||
      submissionData.is_paid;

    let fekraTakhtitiaIndex = this.state[
      "steps_history"
    ].prevSteps.findLastIndex(
      (step) => [2322, 3099].indexOf(step.prevStep.id) != -1
    );

    let StepIndexOf44 = this.state["steps"].findLastIndex(
      (step) => step.module_id == 44
    );

    let StepIndexOf47 = this.state["steps"].findLastIndex(
      (step) => step.module_id == 47
    );

    let StepIndexOf45 = this.state["steps"].findLastIndex(
      (step) => step.module_id == 45
    );

    let currentStepIndex = this.state["steps"].findLastIndex(
      (step) => step.module_id == module_id && step.id == step_id
    );

    let admissionsShow = false;
    if (currentStepIndex >= StepIndexOf44) {
      admissionsShow = true;
    }

    // let committeeactors1 =
    //   (currentStepIndex >= StepIndexOf47 &&
    //     currentStepIndex < StepIndexOf45 &&
    //     actors?.find(r => r.index == 0)) ||
    //   {};
    // let committeeactors2 =
    //   (currentStepIndex >= StepIndexOf47 &&
    //     currentStepIndex < StepIndexOf45 &&
    //     actors?.find(r => r.index == 1)) ||
    //   {};
    // let committeeactors3 =
    //   (currentStepIndex >= StepIndexOf47 &&
    //     currentStepIndex < StepIndexOf45 &&
    //     actors?.find(r => r.index == 2)) ||
    //   {};
    // let committeeactors4 =
    //   (currentStepIndex >= StepIndexOf47 &&
    //     currentStepIndex < StepIndexOf45 &&
    //     actors?.find(r => r.index == 3)) ||
    //   {};
    // let committeeactors5 =
    //   (currentStepIndex >= StepIndexOf47 &&
    //     currentStepIndex < StepIndexOf45 &&
    //     actors?.find(r => r.index == 4)) ||
    //   {};

    let committeeactors1 = actors?.find((r) => r.index == 0);
    let committeeactors2 = actors?.find((r) => r.index == 1);
    let committeeactors3 = actors?.find((r) => r.index == 2);
    let committeeactors4 = actors?.find((r) => r.index == 3);
    let committeeactors5 = actors?.find((r) => r.index == 4);

    let preparedDate =
      this.state["steps_history"].prevSteps[fekraTakhtitiaIndex - 1]?.date;

    let finalApprovalIndex = this.state[
      "steps_history"
    ].prevSteps.findLastIndex(
      (step) => [2372, 2330, 3119].indexOf(step.prevStep.id) != -1
    );
    let aminSignatureIndex = this.state[
      "steps_history"
    ].prevSteps.findLastIndex(
      (step) => [2899, 3124, 2921].indexOf(step.prevStep.id) != -1
    );

    let approvalDate = "";
    if (aminSignatureIndex > finalApprovalIndex) {
      approvalDate =
        (finalApprovalIndex != -1 &&
          this.state["steps_history"].prevSteps[aminSignatureIndex].date) ||
        "";
    }

    let modeerTakhtitIndex = this.state[
      "steps_history"
    ].prevSteps.findLastIndex((step) => [2895].indexOf(step.prevStep.id) != -1);

    let isMMSignShow =
      this.state["steps"].findLastIndex((step) => step.id == step_id) >
      modeerTakhtitIndex;

    let lagnaKrarIndex = this.state["steps"].findLastIndex(
      (step) => [2768, 3105].indexOf(step.id) != -1
    );

    let isSignsTableShow =
      ((lagnaKrarIndex == -1 ||
        this.state["steps"].findLastIndex((step) => step.id == step_id) <=
          lagnaKrarIndex) &&
        true) ||
      false;

    let invoices = get(submissionData, "submission_invoices", "");
    let invoice_number =
      invoices?.map((invoice) => invoice.invoice_number)?.join(", ") ||
      get(submissionData, "invoice_number", "");

    let selectedMaxUsingSymbol = get(mainObject, "selectedMaxUsingSymbol", "");
    let selectedMaxUsingSymbolCode = get(
      mainObject,
      "selectedMaxUsingSymbolCode",
      ""
    );
    let MaxUsingSymbolDescription = get(
      mainObject,
      "MaxUsingSymbolDescription",
      ""
    );
    let SLIDE_AREA = get(
      mainObject,
      "buildingCondition.0.attributes.SLIDE_AREA",
      ""
    );
    let MIN_FROT_OFFSET = get(
      mainObject,
      "buildingCondition.0.attributes.MIN_FROT_OFFSET",
      ""
    );
    let FRONT_OFFSET = get(
      mainObject,
      "buildingCondition.0.attributes.FRONT_OFFSET",
      ""
    );
    let SIDE_OFFSET = get(
      mainObject,
      "buildingCondition.0.attributes.SIDE_OFFSET",
      ""
    );
    let BACK_OFFSET = get(
      mainObject,
      "buildingCondition.0.attributes.BACK_OFFSET",
      ""
    );
    let BUILDING_RATIO = get(
      mainObject,
      "buildingCondition.0.attributes.BUILDING_RATIO",
      ""
    );
    let DESCRIPTION = get(
      mainObject,
      "buildingCondition.0.attributes.DESCRIPTION",
      ""
    );

    var ownerNames = "";
    var owners = get(
      mainObject,
      "ownerData.ownerData.owners",
      get(mainObject, "ownerData.ownerData", [])
    );
    Object.keys(owners).map((key) => {
      ownerNames +=
        (!isEmpty(ownerNames) ? ", " + owners[key].name : owners[key].name) ||
        "";
    });

    let owners_name =
      ownerNames ||
      get(mainObject, "destinationData.destinationData.entity.name", "");

    let plan_no = get(mainObject, "lagna_karar.lagna_karar.plan_number", "");
    let plan_name = get(mainObject, "lagna_karar.lagna_karar.plan_name", "");
    let city = get(
      mainObject,
      "landData.landData.municipality.CITY_NAME_A",
      ""
    );

    let city_code = get(mainObject, "landData.landData.municipality.code", "");
    let sub_city = get(mainObject, "landData.landData.municipality.name", "");

    let finalE3tmadIndex = this.state["steps"].findLastIndex(
      (step) => [2329, 3117].indexOf(step.id) != -1
    );

    let isMsa7aTableShow =
      currentStepIndex > finalE3tmadIndex && // this.state["steps"][finalE3tmadIndex]?.id == step_id
      [10501, 10513, 10506].indexOf(city_code) != -1;

    let isMunTableShow =
      currentStepIndex > finalE3tmadIndex && //this.state["steps"][finalE3tmadIndex]?.id == step_id &&
      [10501, 10513, 10506].indexOf(city_code) == -1;

    let sak_no = get(
      mainObject,
      "waseka.waseka.table_waseka.0.number_waseka",
      ""
    );
    let sak_date = get(
      mainObject,
      "waseka.waseka.table_waseka.0.date_waseka",
      ""
    );
    let sak_issuer = get(
      mainObject,
      "waseka.waseka.table_waseka.0.waseka_search",
      ""
    );
    let parcel_count =
      get(mainObject, "parcelsCount", 0) ||
      mainObject?.plans?.plansData.planDetails.detailsParcelTypes
        .filter(
          (r) =>
            r.key == "سكنى" ||
            r.key == "استثماري" ||
            r.key == "صناعى" ||
            r.key == "زراعي" ||
            r.key == "تجارى"
        )
        ?.reduce((a, b) => {
          return a + b?.value?.[0]?.value?.length;
        }, 0) ||
      mainObject?.plans?.plansData.planDetails.detailsParcelTypes?.reduce(
        (a, b) => {
          return (
            a +
            b?.value?.[0]?.value?.filter(
              (r) =>
                r.typeName == "سكنى" ||
                r.typeName == "استثماري" ||
                r.typeName == "صناعى" ||
                r.typeName == "زراعي" ||
                r.typeName == "تجارى"
            )?.length
          );
        },
        0
      ); // get(mainObject, "parcelsCount", "");
    let plan_using_type = get(
      mainObject,
      "submission_data.mostafed_data.mo5tat_use",
      ""
    );
    let plan_description = get(
      mainObject,
      "print_notes.printed_remarks.plan_desc",
      ""
    );
    let urban_range = get(
      mainObject,
      "landData.landData.municipality.mun_classes.mun_class",
      ""
    );
    let cut_area_percentage = get(mainObject, "cutAreaPercentage", "");

    let selectedPlan =
      mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
        mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
      ];
    let parcel_area =
      get(selectedPlan, "shapeFeatures.boundry.0.area", 0) -
      (get(selectedPlan, "shapeFeatures.out_sak_boundry", [])?.sum("area") ||
        0) -
      (get(selectedPlan, "shapeFeatures.hidden_sak_boundry", [])?.sum("area") ||
        0) -
      get(mainObject, "data_msa7y.msa7yData.cadDetails.cuttes_area", 0);

    let services_percentage = get(mainObject, "servicesPercentage", "");
    let streetlengthsPercentage = get(
      mainObject,
      "streetlengthsPercentage",
      ""
    );
    let services_count = get(mainObject, "servicesCount", "");
    let parking_count = get(mainObject, "parkingCount", "");
    let garden_count = get(mainObject, "gardenCount", "");

    let userIdeng =
      mainObject?.engUserNameToPrint?.engUser?.id ||
      (this.state["historydata"]?.data?.results?.length &&
        this.state["historydata"]?.data?.results?.[
          this.state["historydata"]?.data?.results?.length - 1
        ]?.users?.id);

    let committeeactors_dynamica_id = actors?.reduce(
      (b, a) => b && b?.concat(a?.id),
      []
    );
    //
    let attachments =
      this.state.mainObject?.requests?.attachments?.table_attachments || [];
    let attachments_fa7s = attachments.filter((d) => d.id == 4)[0];

    let {
      office_name,
      gohd,
      depth,
      type,
      depth_water,
      over_all_down,
      over_all_different,
      recommendtion,
    } = attachments_fa7s?.fa7s || {};

    let landImage =
      //filesHost +
      get(mainObject, "landData.landData.image_uploader", "");

    let tempMsa7yImage;
    let msa7yImage = (tempMsa7yImage =
      //window.filesHost +
      get(
        mainObject,
        "landData.landData.lands.parcelData.plans_approved_Image",
        get(mainObject, "landData.landData.lands.parcelData.approved_Image", "")
      ));

    let uplodedFeature = get(mainObject, "sortedtabtiriLandbase", "");

    // bda2l.bands_approval.main_header_title

    let owner_acceptance = get(
      mainObject,
      "bda2l.bands_approval.main_header_title",
      ""
    );

    var bda2l_descs = [];
    let selectedBandsValues = get(
      mainObject,
      "bda2l.bands_approval.band_number.owner_selectedValues",
      get(mainObject, "bda2l.bands_approval.band_number.selectedValues", [])
    );

    //let oldsValues = get(mainObject, "bda2l.bands_approval.band_number.oldOptions", []);

    if (selectedBandsValues) {
      selectedBandsValues = get(
        mainObject,
        "bda2l.bands_approval.band_number.oldOptions",
        []
      )
        ?.filter((r) => {
          return (
            (
              (!Array.isArray(selectedBandsValues) && [selectedBandsValues]) ||
              selectedBandsValues
            ).find(
              (e) =>
                r.value[0].key == e?.key &&
                r.value[0].modal == e?.modal &&
                e?.values?.length == r.value[0].values.length
            ) != undefined
          );
          //  &&
          // (
          //   (!Array.isArray(selectedBandsValues) && [selectedBandsValues]) ||
          //   selectedBandsValues
          // ).find((e) => r.value[0].modal == e?.modal  && e?.values?.length == r.value[0].values.length) != undefined
        })
        ?.map((t) => {
          let values = t.value[0];
          return values;
        });

      if (!Array.isArray(selectedBandsValues)) {
        selectedBandsValues.values.map((item, index) => {
          bda2l_descs.push(`${index + 1} - ${item.condition.item_description}`);
        });
      } else if (Array.isArray(selectedBandsValues)) {
        selectedBandsValues
          .reduce((a, b) => {
            a = a.concat(b.values);
            return a;
          }, [])
          .forEach((item, i) => {
            bda2l_descs.push(`${i + 1} - ${item.condition.item_description}`);
          });
      }
    }

    let bda2l = bda2l_descs.join(" ");

    let currentStepId = get(mainObject, "currentStepId", 0);

    let eng_user_name =
      (mainObject.engUserNameToPrint &&
        mainObject.engUserNameToPrint.engUserName) ||
      (this.state["historydata"]?.data?.results?.length &&
        this.state["historydata"]?.data?.results?.[
          this.state["historydata"]?.data?.results?.length - 1
        ]?.users?.name) ||
      "";

    eng_user_name =
      (eng_user_name?.indexOf("المهندس /") != -1 &&
        eng_user_name?.replaceAll("المهندس /", "")) ||
      eng_user_name ||
      "";
    let print_notes = get(
      mainObject,
      "print_notes.printed_remarks.remarks",
      []
    );
    let printType = get(
      mainObject,
      "print_notes.printed_remarks.printType",
      []
    );

    let electric_room_area = get(
      mainObject,
      "data_msa7y.msa7yData.cadDetails.temp.electric_room_area",
      0
    );

    let msa7yArea = get(
      mainObject,
      "data_msa7y.msa7yData.cadDetails.suggestionsParcels[0].area",
      0
    );

    let remarks = get(mainObject, "lagna_notes.lagna_remarks.remarks", []);
    let isSignAmin =
      remarks?.find((remark) => {
        return remark.isSignAmin == true || remark.isSignAmin == 1;
      })?.checked || false;

    let cutes = get(
      mainObject,
      "data_msa7y.msa7yData.cadDetails.survayParcelCutter",
      []
    );

    let admission_sflata = this.checkAdmissions(admissions, bda2l_values, 1);
    let admission_light = this.checkAdmissions(admissions, bda2l_values, 5);
    let admission_flood = this.checkAdmissions(admissions, bda2l_values, 6);
    let admission_water =
      this.checkAdmissions(admissions, bda2l_values, 3) ||
      this.checkAdmissions(admissions, bda2l_values, 4);
    let admission_elec = this.checkAdmissions(admissions, bda2l_values, 2);
    let admission_phone = this.checkAdmissions(admissions, bda2l_values, 23);
    let admission_bank = this.checkAdmissions(admissions, bda2l_values, 24);

    let elec_request_note = admissions.find((r) => r.id == 1001)?.request_notes;
    let request_notes = admissions
      .filter((r) => r.id != 1001)
      .map((r) => r.request_notes);

    let supervision_letter_num =
      mainObject?.supervision_attachments?.supervision_letter
        ?.supervision_letter_num;
    let supervision_letter_date =
      mainObject?.supervision_attachments?.supervision_letter
        ?.supervision_letter_date;
    let ma7dar_primary_no = this.state["submissionData"]?.request_no;

    let aminSignPrimaryApprovalIndex = this.state[
      "steps_history"
    ].prevSteps?.findLastIndex(
      (step) => [2851, 3112].indexOf(step.prevStep.id) != -1
    );

    let aminStep =
      this.state["steps_history"].prevSteps?.[aminSignPrimaryApprovalIndex] ||
      null;

    let ma7dar_primary_date = aminStep?.date;

    let survey_manager = mainObject?.survey_manager_user?.survManagerUser;
    let survey_user = mainObject?.survey_user?.survUser;

    let imported_mainObject =
      mainObject?.tadkek_data_Msa7y?.tadkek_msa7yData?.imported_mainObject;
    this.setState({
      imported_mainObject,
      survey_manager,
      survey_user,
      elec_request_note,
      request_notes,
      admission_sflata,
      admission_light,
      admission_flood,
      admission_water,
      admission_elec,
      admission_phone,
      admission_bank,
      request_no,
      committee_report_no,
      is_paid,
      creator_user_name,
      committeeactors1,
      committeeactors2,
      committeeactors3,
      committeeactors4,
      committeeactors5,
      selectedMaxUsingSymbol,
      selectedMaxUsingSymbolCode,
      MaxUsingSymbolDescription,
      committeeactors_dynamica_id,
      userIdeng,
      printType,
      SLIDE_AREA,
      MIN_FROT_OFFSET,
      FRONT_OFFSET,
      SIDE_OFFSET,
      BACK_OFFSET,
      BUILDING_RATIO,
      DESCRIPTION,
      office_name,
      gohd,
      depth,
      type,
      depth_water,
      over_all_down,
      over_all_different,
      recommendtion,
      invoice_number,
      invoices,
      owners_name,
      plan_no,
      plan_name,
      city,
      city_code,
      sub_city,
      sak_no,
      sak_date,
      sak_issuer,
      parcel_count,
      plan_using_type,
      plan_description,

      urban_range,
      cut_area_percentage,
      parcel_area,
      services_percentage,
      streetlengthsPercentage,
      services_count,
      parking_count,
      garden_count,
      landImage,
      msa7yImage,
      // mainObject,
      uplodedFeature,
      owner_acceptance,
      bda2l,
      currentStepId,
      eng_user_name,
      tempMsa7yImage,
      electric_room_area,
      print_notes,
      msa7yArea,
      isSignsTableShow,
      isMsa7aTableShow,
      isMunTableShow,
      isSignAmin,
      preparedDate,
      approvalDate,
      module_id,
      step_id,
      admissions,
      bda2l_values,
      admissionsShow,
      isMMSignShow,
      cutes,
      supervision_letter_num,
      supervision_letter_date,
      ma7dar_primary_no,
      ma7dar_primary_date,
    });
  };

  getDistrict = (polygon) => {
    getInfo(mapUrl).then((response) => {
      intersectQueryTask({
        outFields: ["DISTRICT_NAME"],
        geometry: new esri.geometry.Polygon(polygon),
        url: mapUrl + "/" + response["District_Boundary"],
        callbackResult: (res) => {
          getFeatureDomainName(
            res.features,
            response["District_Boundary"]
          ).then((features) => {
            this.setState({
              district: features
                .map((x) => x.attributes.DISTRICT_NAME)
                .join(" - "),
            });
          });
        },
      });
    });
  };

  componentDidMount() {
    console.log("match_id", this.props.match.params.id);
    initializeSubmissionData(this.props.match.params.id).then((response) => {
      this.getDistrict(
        response.mainObject?.data_msa7y?.msa7yData?.cadDetails
          ?.suggestionsParcels[0]?.polygon
      );

      getSubmissionHistory(response.submission.workflow_id, this.props).then(
        (result) => {
          this.state["steps"] = result.steps;
          this.state["steps_history"] = result.steps_history;
          this.state["mainObject"] = response.mainObject;
          this.state["submissionData"] = response.submission;
          this.state["historydata"] = response.historyData;
          this.setState({ id: this.props.match.params.id });
          let printObj = response?.printObj;
          let title1 = response?.printObj?.printTextEdited?.tempA0?.title1;
          let title2 = response?.printObj?.printTextEdited?.tempA0?.title2;
          let title3 = response?.printObj?.printTextEdited?.tempA0?.title3;
          let title4 = response?.printObj?.printTextEdited?.tempA0?.title4;
          let title5 = response?.printObj?.printTextEdited?.tempA0?.title5;
          let title6 = response?.printObj?.printTextEdited?.tempA0?.title6;
          let title7 = response?.printObj?.printTextEdited?.tempA0?.title7;
          let title8 = response?.printObj?.printTextEdited?.tempA0?.title8;
          this.setState({
            printObj: printObj,
            title1: title1,
            title2: title2,
            title3: title3,
            title4: title4,
            title5: title5,
            title6: title6,
            title7: title7,
            title8: title8,
          });
          var totalArea =
            (this.state["mainObject"]?.data_msa7y?.msa7yData?.cadDetails
              ?.suggestionsParcels[0].area *
              (100 -
                +this.state[
                  "mainObject"
                ]?.plans?.plansData?.planDetails?.statisticsParcels
                  ?.find(function (x) {
                    return x.name == "النسب التخطيطية";
                  })
                  ?.areaPercentage?.toFixed(2))) /
            100;
          if (
            this.state["submissionData"].submission_invoices?.length &&
            this.state["mainObject"]?.fees?.feesInfo
          ) {
            this.state["mainObject"].fees.feesInfo.feesList = this.state[
              "submissionData"
            ].submission_invoices.map((invoice) => ({
              ...invoice,
              // increasePercentage: invoice.description
              //   .split(",")[1]
              //   .toString()
              //   .match(/\d+/),
            }));
          }

          if (
            !this.state["submissionData"]?.fees &&
            this.state["mainObject"]?.fees?.feesInfo &&
            !this.state["mainObject"]?.fees?.feesInfo?.feesValue
          ) {
            CalculateFees({ mainObject: this.state["mainObject"] }).then(
              (res) => {
                this.setState({
                  fees: convertToArabic(
                    (this.state["submissionData"].submission_invoices?.length &&
                      `${CalculateTotalFees(
                        this.state["mainObject"]?.fees?.feesInfo || {},
                        false
                      )} ريال`) ||
                      res ||
                      0
                  ),
                });
              }
            );
          } else {
            this.setState({
              fees: convertToArabic(
                (this.state["submissionData"].submission_invoices?.length &&
                  `${CalculateTotalFees(
                    this.state["mainObject"]?.fees?.feesInfo || {},
                    false
                  )} ريال`) ||
                  this.state["submissionData"]?.fees ||
                  this.state["mainObject"]?.fees?.feesInfo?.feesValue ||
                  0
              ),
            });
          }
          this.setPrintValues(
            this.state["submissionData"],
            this.state["mainObject"]
          );
        }
      );
    });
  }
  convertEnglishNotReverseToArabic(english) {
    var arabicNumbers = ["۰", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (english == null || english == "") {
      return "";
    } else {
      var chars = english.split("");
      for (var i = 0; i < chars.length; i++) {
        if (/\d/.test(chars[i])) {
          chars[i] = arabicNumbers[chars[i]];
        }
      }
      let revesedChars = chars.join("");
      return revesedChars;
    }
  }

  convertEnglishToArabic(english, notreverse) {
    //
    var arabicNumbers = ["۰", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (!english || english == null || english == "") {
      return "";
    } else {
      let stringEnglish = english.toString();
      var chars = stringEnglish.split("");
      for (var i = 0; i < chars.length; i++) {
        if (/\d/.test(chars[i])) {
          chars[i] = arabicNumbers[chars[i]];
        }
      }
      let revesedChars = chars.join("");
      if (notreverse) return revesedChars; //.split('/').reverse().join('/')

      if (revesedChars.indexOf(".") > -1) {
        return revesedChars;
      }
      // console.log("ee",stringEnglish)
      return revesedChars.split("/").reverse().join("/");
    }
  }

  changeNote = (parcel, evt) => {
    parcel.note = evt.target.value;
    this.setState({});
  };

  checkAdmissions = (admissions, bda2l_values, itemCode) => {
    let admission = admissions.find(
      (adm) =>
        (!Array.isArray(bda2l_values) &&
          bda2l_values.values?.find(
            (item) => item?.condition?.item_code == itemCode
          )?.condition?.item_description == adm.attachment_type) ||
        (Array.isArray(bda2l_values) &&
          bda2l_values
            .reduce((a, b) => {
              a = a.concat(b.values);
              return a;
            }, [])
            .find((item) => item?.condition?.item_code == itemCode)?.condition
            ?.item_description == adm.attachment_type)
    );

    return admission;
  };

  render() {
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    let {
      imported_mainObject,
      survey_manager,
      survey_user,
      elec_request_note,
      request_notes = [],
      admission_sflata,
      admission_light,
      admission_flood,
      admission_water,
      admission_elec,
      admission_phone,
      admission_bank,
      creator_user_name = "",
      committeeactors1 = {},
      committeeactors2 = {},
      committeeactors3 = {},
      committeeactors4 = {},
      committeeactors5 = {},
      selectedMaxUsingSymbol = "",
      committeeactors_dynamica_id = "",
      userIdeng = "",
      selectedMaxUsingSymbolCode = "",
      MaxUsingSymbolDescription = "",
      request_no = "",
      committee_report_no = "",
      is_paid = "",
      SLIDE_AREA = "",
      office_name = "",
      gohd = "",
      depth = "",
      type = "",
      depth_water = "",
      over_all_down = "",
      over_all_different = "",
      recommendtion = "",
      MIN_FROT_OFFSET = "",
      FRONT_OFFSET = "",
      SIDE_OFFSET = "",
      BACK_OFFSET = "",
      BUILDING_RATIO = "",
      DESCRIPTION = "",
      fees = "",
      invoice_number = "",
      invoices = [],
      owners_name = "",
      plan_no = "",
      plan_name = "",
      city = "",
      city_code = "",
      sub_city = "",
      sak_no = "",
      sak_date = "",
      sak_issuer = "",
      parcel_count = "",
      plan_using_type = "",
      plan_description = "",
      urban_range = "",
      cut_area_percentage = "",
      parcel_area = "",
      services_percentage = "",
      streetlengthsPercentage = "",
      services_count = "",
      parking_count = "",
      garden_count = "",
      landImage = "",
      msa7yImage = "",
      uplodedFeature,
      owner_acceptance = "",
      bda2l = "",
      currentStepId = 0,
      eng_user_name = "",
      tempMsa7yImage = "",
      btnPrint,
      electric_room_area = "",
      print_notes = [],
      printType,
      mainObject,
      title1,
      title2,
      title3,
      title4,
      title5,
      title6,
      title7,
      title8,
      id,
      msa7yArea,
      printObj,
      isSignsTableShow,
      isMsa7aTableShow,
      isMunTableShow,
      isSignAmin,
      preparedDate,
      approvalDate,
      module_id,
      step_id,
      admissions,
      bda2l_values,
      admissionsShow,
      isMMSignShow,
      cutes,
      supervision_letter_num,
      supervision_letter_date,
      ma7dar_primary_no,
      ma7dar_primary_date,
      district,
    } = this.state;
    // let printType = get(this.state.print_notes, "printed_remarks.printType", 1);
    console.log("f", uplodedFeature && uplodedFeature.length);

    return (
      <>
        <div
          className={
            printType == 1
              ? "tempA2 tempA0 table-report-container"
              : "tempA0 table-report-container"
          }
          style={{ textAlign: "right" }}
        >
          <div style={{ border: "1px solid #000" }}>
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  marginLeft: "10px",
                  display: "grid",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="btn btn-warning hidd"
                  style={{ marginBottom: "3px" }}
                  onClick={() => {
                    window.print();
                  }}
                >
                  طباعة
                </button>
                <button
                  className="btn btn-warning hidd"
                  onClick={(evt) => {
                    var mainObject = this.state["mainObject"];
                    this.setState({
                      btnPrint:
                        this.state["btnPrint"] == "طباعة مخطط المكتب الهندسي"
                          ? "رجوع"
                          : "طباعة مخطط المكتب الهندسي",
                      msa7yImage:
                        this.state["btnPrint"] != "رجوع"
                          ? mainObject?.requests?.requests?.attachment_img
                          : tempMsa7yImage,
                    });

                    // setTimeout(() => {
                    //   window.print();
                    // }, 500);
                  }}
                >
                  {btnPrint}
                </button>
              </div>
            </div>
            <Row>
              {/* <Col span={4} className="rowPadding"> */}
              <div style={{ position: "absolute", left: "1%", zIndex: "1" }}>
                <img src="images/north.png" width="150px" />
              </div>
              <Col span={17}>
                <Col
                  span={6}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <div>
                    {uplodedFeature && (
                      <div>
                        <table
                          className={
                            uplodedFeature.length > 100
                              ? "big_zoom table table-bordered"
                              : "normal_zoom table  table-bordered"
                          }
                          style={{
                            margin: "550px 5px",
                            width: "100%",
                          }}
                        >
                          <thead>
                            <tr>
                              <th>الرقم</th>
                              <th>الشمال</th>
                              <th>الشرق</th>
                              <th>الجنوب</th>
                              <th>الغرب</th>
                              <th>المساحة (م٢)</th>
                              <th>الملاحظات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {uplodedFeature &&
                              uplodedFeature.map((parcel, index) => {
                                return (
                                  !parcel.isHide && (
                                    <tr>
                                      <td>{convertToArabic(parcel.number)}</td>
                                      <td>
                                        {convertToArabic(
                                          parseFloat(
                                            parcel?.north_length?.toFixed(2)
                                          )
                                        )}
                                      </td>
                                      <td>
                                        {convertToArabic(
                                          parseFloat(
                                            parcel?.east_length?.toFixed(2)
                                          )
                                        )}
                                      </td>
                                      <td>
                                        {convertToArabic(
                                          parseFloat(
                                            parcel?.south_length?.toFixed(2)
                                          )
                                        )}
                                      </td>
                                      <td>
                                        {convertToArabic(
                                          parseFloat(
                                            parcel?.weast_length?.toFixed(2)
                                          )
                                        )}
                                      </td>

                                      <td>
                                        {convertToArabic(
                                          parseFloat(
                                            +parcel?.area?.toFixed(2) -
                                              (parcel.cuttes_area ||
                                                (parcel.survayParcelCutter &&
                                                  +parcel.survayParcelCutter[0]
                                                    .NORTH_EAST_DIRECTION +
                                                    +parcel
                                                      .survayParcelCutter[0]
                                                      .NORTH_WEST_DIRECTION +
                                                    +parcel
                                                      .survayParcelCutter[0]
                                                      .SOUTH_EAST_DIRECTION +
                                                    +parcel
                                                      .survayParcelCutter[0]
                                                      .SOUTH_WEST_DIRECTION) ||
                                                0)
                                          )
                                        )}
                                      </td>

                                      {parcel.note && (
                                        <td>{convertToArabic(parcel.note)}</td>
                                      )}
                                    </tr>
                                  )
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </Col>
                <Col
                  span={uplodedFeature ? "14" : "20"}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "66vh",
                    alignItems: "center",
                    marginTop: "2vh",
                  }}
                >
                  <div className="mawk3am">
                    {/* <img
                      style={{ maxHeight: "66vh" }}
                      src={remove_duplicate(msa7yImage)}
                      // style={{ height: "25cm", width: "100%" }}
                    /> */}
                    {checkImage(this.props, msa7yImage, { maxHeight: "66vh" })}
                    <p style={{ textAlign: "center" }}>
                      المخطط المقترح أو الكروكي المساحي
                    </p>
                  </div>
                </Col>
                <Col style={{ display: "flex", justifyContent: "flex-start" }}>
                  {" "}
                  <div>
                    {/* <img
                      src={remove_duplicate(landImage)}
                      style={{ maxWidth: "15vw" }}
                    /> */}
                    {checkImage(this.props, landImage, {
                      maxWidth: "15vw",
                    })}
                    <p style={{ textAlign: "center" }}>الموقع العام</p>

                    {elec_request_note && <p>{elec_request_note}</p>}
                    {request_notes?.length > 0 &&
                      request_notes?.map((r) => <p>{r}</p>)}
                  </div>
                </Col>{" "}
              </Col>
              {/* </Col> */}
              <Col
                span={7}
                className={
                  printType == 2
                    ? "right_side_height righttablesTemoA0"
                    : "righttablesTemoA0"
                }
                style={{ border: "2px solid #000" }}
              >
                {" "}
                <ZoomSlider>
                  <div style={{ height: "100%" }}>
                    <div style={{ padding: "10px" }}>
                      <div className="zoom-print">
                        <h4 style={{ textAlign: "right" }} className="boldText">
                          الإستعمال :-
                        </h4>
                        <p style={{ direction: "ltr" }}>
                          {convertToArabic(selectedMaxUsingSymbol)}
                        </p>
                        <p className="boldText">
                          الإستعمالات المسموح بها بحكم النظام :-
                        </p>
                        {plan_using_type != "أسواق جملة" && (
                          <p style={{ direction: "ltr" }}>
                            {convertToArabic(MaxUsingSymbolDescription)}
                          </p>
                        )}
                        {plan_using_type == "أسواق جملة" &&
                          selectedMaxUsingSymbolCode == "ت-ج" && (
                            <div>
                              <p style={{ direction: "ltr" }}>
                                {convertToArabic(MaxUsingSymbolDescription)}
                              </p>
                              <table className="table table-bordered">
                                <tr>
                                  <td>أ) مؤسسات تجارة الجملة</td>
                                  <td>ب) مستودعات التخزين والتوزيع</td>
                                </tr>
                                <tr>
                                  <td>ج) ساحات البيع</td>
                                  <td>د) الإستعمال الحكومي</td>
                                </tr>
                                <tr>
                                  <td colSpan={2}>هـ) المكاتب</td>
                                </tr>
                              </table>
                              <p className="boldText">
                                " لا يسمح بفتح محلات تجارية بالمنطقة "
                              </p>
                              <p className="boldText">
                                الإستعمالات المشروطة المسموح بها :-
                              </p>
                              <p>
                                يسمح بالإستعمالات المشروطة التالية في منطقة{" "}
                                {plan_using_type} {selectedMaxUsingSymbolCode}{" "}
                                :-
                              </p>
                              <table className="table table-bordered">
                                <tr>
                                  <td>
                                    أ) ساحات التحميل والتفريغ داخل حدود القسيمة
                                  </td>
                                  <td>
                                    ب) الوحدات التخطيطية الخاصة وفقا لما ورد
                                    بالبند (٥-٣)
                                  </td>
                                </tr>
                                <tr>
                                  <td>ج) ساحات وقوف الشاحنات</td>
                                  <td>د) الخدمات المحلية</td>
                                </tr>
                              </table>
                            </div>
                          )}
                        <h4 style={{ textAlign: "right" }} className="boldText">
                          تنظيمات البناء :-
                        </h4>
                        <p>
                          ١- إعتماد المخطط لا يعني تثبيت حدود الملكية وعلي
                          الأمانة تطبيق الصك الشرعي ومطابقته على الطبيعة.
                        </p>
                        <p>
                          ٢- لا يجوز التصرف فى أي قطعة من قطع المخطط سواء بالبيع
                          أو البناء أو بأي شكل أخر إلا بعد تركيز كافة المخطط على
                          الطبيعة وفقا للمخطط المعتمد.
                        </p>
                        <p>
                          ٣- قبل إعطاء فسح البناء يجب علي الأمانة التأكد من وجود
                          البتر الخرسانية.
                        </p>
                        <p>
                          ٤- تباع القطع بحدودها الموضحة بالمخطط ولا يجوز تقسيمها
                          إلي أجزاء أصغر.
                        </p>
                        <p>
                          ٥- القطع المخصصة للمرافق العامة لا يسمح بالبناء عليها
                          إلا للغرض نفسه.
                        </p>
                        <p>
                          ٦- الشطفات :- تعمل الشطفات عند تقاطع الشوارع ويكون
                          ضلعي الشطفة متساويان وطول كل منهما يساوي ٥/١ عرض
                          الشارع الأكبر عرضا عند التقاطع وبحيث ألا تقل عن ٣
                          أمتار ولا تزيد عن ٦ أمتار ما لم يذكر خلاف ذلك على
                          المخطط.
                        </p>
                        <p>
                          ٧- جميع ممرات المشاة بعرض ثمانية أمتار ما لم يذكر خلاف
                          ذلك.
                        </p>

                        <h4 style={{ textAlign: "right" }} className="boldText">
                          شروط المنطقة :-
                        </h4>
                        <table
                          className="table table-bordered"
                          // style={{ margin: "15px", width: "95%" }}
                        >
                          <tbody>
                            <tr>
                              <td colSpan="2">مساحة القسيمة</td>
                            </tr>
                            <tr>
                              <td colSpan="2">
                                لا يقل القسيمة عن ({convertToArabic(SLIDE_AREA)}
                                ) ولا يقل طول الواجهة عن (
                                {convertToArabic(MIN_FROT_OFFSET)})
                              </td>
                            </tr>
                            <tr>
                              {" "}
                              <td>
                                <span>الحد الأدني للإرتدادات</span>
                                <table className="table table-bordered">
                                  <tr>
                                    <td>الأمامي</td>
                                    <td>الجوانب</td>
                                    <td>الخلفي</td>
                                  </tr>
                                  <tr>
                                    <td>{convertToArabic(FRONT_OFFSET)}</td>
                                    <td>{convertToArabic(SIDE_OFFSET)}</td>
                                    <td>{convertToArabic(BACK_OFFSET)}</td>
                                  </tr>
                                </table>
                              </td>{" "}
                              <td>
                                مساحة المباني :- الحد الأقصي لمساحة البناء{" "}
                                {this.convertEnglishToArabic(BUILDING_RATIO)} من
                                مساحة القسيمة ما عدا المنطق الموضحة بالرمز{" "}
                                {selectedMaxUsingSymbolCode}
                                بالأطلس تكون نسبة البناء ١٠٠ %
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2">
                                الحد الأقصي لإرتفاع المبني :-{" "}
                                {this.convertEnglishToArabic(DESCRIPTION)}
                              </td>
                            </tr>
                            <tr>
                              <td>مواقف السيارات خارج الشارع</td>
                              <td>إشتراطات اللافتات</td>{" "}
                            </tr>
                            <tr>
                              {" "}
                              <td>
                                <table className="table table-border">
                                  <tr>
                                    <td>الإستخدام</td>
                                    <td>الحد الأدني لموقف السيارات</td>
                                  </tr>
                                  <tr>
                                    <td>وحدة سكنية واحدة</td>
                                    <td>موقف سيارة واحدة من واجهة المبني</td>
                                  </tr>
                                  <tr>
                                    <td>وحدتين سكنيتين فأكثر</td>
                                    <td>موقف سيارة واحدة لكل وحدة سكنية</td>
                                  </tr>
                                  <tr>
                                    <td>تجاري</td>
                                    <td>موقف سيارة واحدة لكل ٣٠ م٢</td>
                                  </tr>
                                  <tr>
                                    <td>ميزانين</td>
                                    <td>موقف سيارة واحدة لكل ٧٥ م٢</td>
                                  </tr>
                                  <tr>
                                    <td>إداري</td>
                                    <td>موقف سيارة واحدة لكل ٧٥ م٢</td>
                                  </tr>
                                  <tr>
                                    <td>مستودع</td>
                                    <td>موقف لكل ١٠٠ م٢ من مساحة الأرض</td>
                                  </tr>
                                  <tr>
                                    <td>مبني حكومي</td>
                                    <td>موقف لكل موظف</td>
                                  </tr>
                                  <tr>
                                    <td>مصنع</td>
                                    <td>موقف لكل موظف</td>
                                  </tr>
                                </table>
                              </td>{" "}
                              <td>
                                <p>
                                  ١- لا يجوز أن يزيد مجموع مساحة اللافتات علي
                                  متر مربع لكل ثلاثة أمتار طولية من واجهة المبني
                                  المطلة علي الشارع.
                                </p>
                                <p>
                                  ٢- يجب أن تكون اللافتات القائمة بذاتها أي غير
                                  المتصلة بالمباني مطابقة لشروط ارتدادات وارتفاع
                                  البناء الخاص بالمنطقة.
                                </p>
                                <p>
                                  ٣- لا يجوز أن تبرز أي لافتة فوق المبني الذي
                                  توجد عليه.
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p>
                          تم سداد مبلغ ({convertToArabic(fees)}) ريال بموجب
                          فاتورة رقم {convertToArabic(invoice_number)}
                        </p>
                        {/* {invoices?.length && (
                          <table className="table table-bordered table-striped">
                            <thead>
                              <tr>
                                <th>رقم الفاتورة</th>
                                <th>تاريخ الفاتورة</th>
                                <th>قيمة الفاتورة</th>
                                <th>حالة الدفع</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoices.map((invoice) => {
                                return (
                                  <tr>
                                    <td>
                                      <span>
                                        {convertToArabic(invoice.invoice_number)}
                                      </span>
                                    </td>
                                    <td>
                                      <span>
                                        {convertToArabic(invoice.invoice_date)}
                                      </span>
                                    </td>
                                    <td>
                                      <span>
                                        {convertToArabic(invoice.fees)} ريال
                                      </span>
                                    </td>
                                    <td>
                                      <span>
                                        {invoice.is_paid
                                          ? "تم الدفع"
                                          : "لم يتم الدفع"}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )} */}
                        <ZoomSlider>
                          <h4
                            style={{ textAlign: "right" }}
                            className="boldText"
                          >
                            ملاحظات :-
                          </h4>
                          <div style={{ padding: "15px", zoom: 0.7 }}>
                            {print_notes.map((note) => {
                              return note.checked && <p>{note.remark}</p>;
                            })}
                            <p>
                              تم تطبيق المخطط إلكترونيا من قبل المكتب الهندسي
                              بموجب المخطط المرفق ضمن المعاملة
                            </p>
                            {ma7dar_primary_date && (
                              <p>
                                تم اعتماد المخطط ابتدائيا بناءا على قرار معالي
                                الأمين رقم {convertToArabic(ma7dar_primary_no)}{" "}
                                بتاريخ {convertToArabic(ma7dar_primary_date)} هـ
                              </p>
                            )}
                            {supervision_letter_num && (
                              <p>
                                تم تنفيذ ضوابط التنمية العمرانية المعتمدة بقرار
                                مجلس الوزارة رقم {convertToArabic("157")} بتاريخ
                                {convertToArabic("11/5/1428")} هـ ولائحتها
                                التنفيذية المحدثة المعتمدة بالقرار الوزاري رقم{" "}
                                {convertToArabic("66000")} بتاريخ{" "}
                                {convertToArabic("20/12/1435")} هـ وذلك بموجب
                                خطاب الإدارةالعامة للإشراف رقم{" "}
                                {convertToArabic(supervision_letter_num)} بتاريخ{" "}
                                {convertToArabic(supervision_letter_date)} هـ
                              </p>
                            )}
                          </div>
                        </ZoomSlider>
                        <div>
                          {/* {isSignsTableShow && (
                            <table
                              className="table table-bordered"
                              // style={{ width: "96%" }}
                            >
                              <thead>
                                <tr>
                                  <th rowSpan="2">أعضاء اللجنة</th>
                                  <th colSpan="3" className="center">
                                    عدد مرات العرض علي اللجنة
                                  </th>{" "}
                                </tr>
                                <tr>
                                  {" "}
                                  <th>العرض الأول بتاريخ / / ١٤٤ هـ</th>{" "}
                                  <th>العرض الثاني بتاريخ / / ١٤٤ هـ</th>
                                  <th>العرض الثالث بتاريخ / / ١٤٤ هـ</th>{" "}
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>المهندس المختص</td> <td></td>
                                  <td></td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <td>مدير إدارة التخطيط</td> <td></td>
                                  <td></td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <td>مدير عام التخطيط العمراني</td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <td>وكيل الأمين المساعد للتخطيط العمراني</td>{" "}
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <td>وكيل الأمين للتعمير والمشاريع</td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr>
                                {isSignAmin && (
                                  <tr>
                                    <td>معالي أمين المنطقة الشرقية</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          )} */}
                          {isSignsTableShow && !imported_mainObject && (
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th colSpan="2" className="center">
                                    اللجنة الفنية
                                  </th>
                                </tr>
                                <tr>
                                  <th colSpan="2" className="center">
                                    إدارة التخطيط
                                  </th>
                                </tr>
                                <tr>
                                  <td style={{ textAlign: "center" }}>
                                    أعضاء اللجنة الفنية{" "}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    التوقيع
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>المهندس المختص</td>
                                  <td>
                                    {province_id && (
                                      <SignPics
                                        planApproval={true}
                                        // committee_report_no={committee_report_no}
                                        // is_paid={is_paid}
                                        province_id={province_id}
                                        userId={userIdeng}
                                      />
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>{committeeactors2?.position}</td>
                                  <td>
                                    {committeeactors2?.is_approved &&
                                      province_id && (
                                        <SignPics
                                          planApproval={true}
                                          province_id={province_id}
                                          // committee_report_no={committee_report_no}
                                          // is_paid={is_paid}
                                          userId={
                                            committeeactors_dynamica_id[3]
                                          }
                                        />
                                      )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>{committeeactors3?.position}</td>
                                  <td>
                                    {committeeactors3?.is_approved &&
                                      province_id && (
                                        <SignPics
                                          planApproval={true}
                                          province_id={province_id}
                                          // committee_report_no={committee_report_no}
                                          // is_paid={is_paid}
                                          userId={
                                            committeeactors_dynamica_id[2]
                                          }
                                        />
                                      )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          )}
                          {isSignsTableShow && !imported_mainObject && (
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th colSpan="2" className="center">
                                    اللجنة الفنية
                                  </th>
                                </tr>
                                <tr>
                                  <th colSpan="2" className="center">
                                    الـوكــلاء
                                  </th>
                                </tr>
                                <tr>
                                  <td style={{ textAlign: "center" }}>
                                    أعضاء اللجنة الفنية
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    التوقيع
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>{committeeactors1?.position}</td>
                                  <td>
                                    {committeeactors1?.is_approved &&
                                      province_id && (
                                        <SignPics
                                          planApproval={true}
                                          province_id={province_id}
                                          // committee_report_no={committee_report_no}
                                          // is_paid={is_paid}
                                          userId={
                                            committeeactors_dynamica_id[4]
                                          }
                                        />
                                      )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>{committeeactors4?.position}</td>
                                  <td>
                                    {committeeactors4?.is_approved &&
                                      province_id && (
                                        <SignPics
                                          planApproval={true}
                                          province_id={province_id}
                                          // committee_report_no={committee_report_no}
                                          // is_paid={is_paid}
                                          userId={
                                            committeeactors_dynamica_id[1]
                                          }
                                        />
                                      )}
                                  </td>
                                </tr>
                                {isSignAmin && (
                                  <tr>
                                    <td>{committeeactors5?.position}</td>
                                    <td>
                                      {committeeactors5?.is_approved &&
                                        province_id && (
                                          <SignPics
                                            planApproval={true}
                                            province_id={province_id}
                                            // committee_report_no={committee_report_no}
                                            // is_paid={is_paid}
                                            userId={
                                              committeeactors_dynamica_id[0]
                                            }
                                          />
                                        )}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          )}
                          {isMsa7aTableShow && !imported_mainObject && (
                            <table className="table table-bordered">
                              <tr>
                                <td style={{ textAlign: "center" }}>
                                  إدارة المساحة
                                </td>
                                <td style={{ textAlign: "center" }}>الاسم</td>
                                <td style={{ textAlign: "center" }}>التوقيع</td>
                                <td style={{ textAlign: "center" }}>
                                  ختم إدارة المساحة
                                </td>
                              </tr>
                              <tr>
                                <td style={{ textAlign: "center" }}>المساح</td>
                                <td style={{ textAlign: "center" }}>
                                  {survey_user?.name || "ماجد عوض الصمان"}
                                </td>
                                <td>
                                  {province_id && (
                                    <SignPics
                                      province_id={province_id}
                                      committee_report_no={committee_report_no}
                                      is_paid={is_paid}
                                      userId={survey_user?.id}
                                    />
                                  )}
                                </td>
                                <td rowSpan={3}></td>
                              </tr>
                              <tr style={{ height: "35px" }}>
                                <td colSpan={3}></td>
                              </tr>
                              <tr>
                                <td style={{ textAlign: "center" }}>
                                  مدير إدارة المساحة
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  {survey_manager?.name ||
                                    "مساعد بن مفضي الحربي"}
                                </td>
                                <td>
                                  {province_id && (
                                    <SignPics
                                      province_id={province_id}
                                      committee_report_no={committee_report_no}
                                      is_paid={is_paid}
                                      userId={survey_manager?.id}
                                    />
                                  )}
                                </td>
                              </tr>
                            </table>
                          )}
                          {isMunTableShow && !imported_mainObject && (
                            <table className="table table-bordered">
                              <tr>
                                <td style={{ textAlign: "center" }}>
                                  بلدية محافظة القطيف
                                </td>
                                <td style={{ textAlign: "center" }}>الاسم</td>
                                <td style={{ textAlign: "center" }}>التوقيع</td>
                                <td style={{ textAlign: "center" }}>الختم</td>
                              </tr>
                              <tr>
                                <td>مدير إدارة الأراضي</td>
                                <td></td>
                                <td></td>
                                <td rowSpan={2}></td>
                              </tr>
                              <tr>
                                <td>رئيس بلدية محافظة القطيف</td>
                                <td></td>
                                <td></td>
                              </tr>
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ZoomSlider>
              </Col>
            </Row>
            <Row
              className="rowPadding rowPageBorder"
              style={{ direction: "ltr" }}
              type="flex"
            >
              <Col span={4} className="flexCol1">
                <div className="div-border-arabic">
                  <h4 style={{ textAlign: "center" }}>التطبيق علي الطبيعة</h4>
                  <p>
                    تم تطبيق المخطط علي الطبيعة ووجد مطابقا للصك والطبيعة
                    ولايوجد ما يحول دون تنفيذه واعتماده
                  </p>
                  {(city != "الخبر" || city_code != "10506") && (
                    <div
                      style={{
                        marginBottom: "4vh",
                        zoom: ".8",
                        whiteSpace: "nowrap",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                      }}
                    >
                      <div style={{ display: "grid", gridGap: "30px" }}>
                        <p>المساح</p>
                        <p></p>
                      </div>
                      <div style={{ display: "grid", gridGap: "30px" }}>
                        <p>الختم</p>
                        <p></p>
                      </div>
                      <div style={{ display: "grid", gridGap: "30px" }}>
                        <p>مصادقة مدير إدارة المساحة</p>
                        <p></p>
                      </div>
                    </div>
                  )}
                  {(city == "الخبر" || city_code == "10506") && (
                    <div
                      style={{
                        marginBottom: "4vh",
                        zoom: ".8",
                        whiteSpace: "nowrap",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                      }}
                    >
                      <div style={{ display: "grid", gridGap: "30px" }}>
                        <p>المساح</p>
                        <p></p>
                      </div>
                      <div style={{ display: "grid", gridGap: "40px" }}>
                        <p>مدير إدارة الأراضي والمساحة</p>
                        <p>أ / ياسر بن محماس الجعيد</p>
                      </div>
                      <div style={{ display: "grid", gridGap: "40px" }}>
                        <p>رئيس بلدية محافظة الخبر</p>
                        <p>م / مشعل بن الحميدي الوهبي</p>
                      </div>
                    </div>
                  )}
                  {owner_acceptance && (
                    <div className="div-border-arabic">
                      <h4 style={{ textAlign: "center" }}>موافقة المالك</h4>
                      <p>{owner_acceptance}</p>
                      <p>{convertToArabic(bda2l)}</p>
                      <table
                        className="table table-bordered"
                        style={{ marginBottom: "4vh" }}
                      >
                        <tr>
                          {/* <td>ختم إدارة المساحة</td> */}
                          <td>الإسم</td>
                          <td>التوقيع</td>
                          {/* <td>إدارة المساحة</td> */}
                        </tr>
                      </table>
                    </div>
                  )}
                </div>
              </Col>
              <Col span={3} className="flexCol1">
                <div className="div-border-arabic ">
                  <img src="images/2-681x.PNG"></img>
                </div>
              </Col>
              <Col span={4} className="flexCol1">
                <div className="div-border-arabic">
                  <h4>إحصائية الموقع</h4>
                  <table
                    className="table table-bordered"
                    style={{ marginTop: "15px" }}
                  >
                    <tr>
                      <td>عدد قطع الأراضي</td>
                      <td>عدد الخدمات العامة</td>
                      <td colSpan={2}>عدد المرافق الحكومية</td>
                    </tr>
                    <tr>
                      <td>{this.convertEnglishToArabic(parcel_count)}</td>
                      <td>{this.convertEnglishToArabic(services_count)}</td>
                      <td colSpan={2}>
                        <table className="table table-bordered">
                          <tr>
                            <td>مواقف</td>
                            <td>حدائق</td>
                          </tr>
                          <tr>
                            <td>
                              {this.convertEnglishToArabic(parking_count)}
                            </td>
                            <td>{this.convertEnglishToArabic(garden_count)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <h4>
                    مساحة المخطط :- {convertToArabic((+parcel_area).toFixed(2))}{" "}
                    م٢
                  </h4>
                  <h4>
                    النسبة التخطيطية المقتطعة :-{" "}
                    {convertToArabic(cut_area_percentage)} %
                  </h4>
                  <h4>
                    نسبة مساحة الخدمات :- {convertToArabic(services_percentage)}{" "}
                    %{" "}
                  </h4>
                  {streetlengthsPercentage != "0" &&
                    streetlengthsPercentage != "" && (
                      <>
                        <h4>
                          نسبة أطوال الشوارع :-{" "}
                          {convertToArabic(streetlengthsPercentage)} م ط / هكتار{" "}
                        </h4>
                        <table
                          className="table table-bordered"
                          style={{ textAlign: "center" }}
                        >
                          <tr>
                            <td>أقصى معدل لأطوال الشوارع في الهكتار</td>
                            <td>متوسط مساحة القطعة في المخطط (م٢)</td>
                          </tr>
                          <tr>
                            <td>١٣٠ م ط / هكتار</td>
                            <td>٣٠٠</td>
                          </tr>
                          <tr>
                            <td>١٢٠ م ط / هكتار</td>
                            <td>٤٠٠</td>
                          </tr>
                          <tr>
                            <td>١١٠ م ط / هكتار</td>
                            <td>٦٠٠</td>
                          </tr>
                          <tr>
                            <td>١٠٠ م ط / هكتار</td>
                            <td>٨٠٠</td>
                          </tr>
                          <tr>
                            <td>٩٥ م ط / هكتار</td>
                            <td>١٠٠٠</td>
                          </tr>
                          <tr>
                            <td>٨٠ م ط / هكتار</td>
                            <td>٢٠٠٠</td>
                          </tr>
                          <tr>
                            <td>٧٥ م ط / هكتار</td>
                            <td>٢٥٠٠</td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              الحد الأقصى لمعدل أطوال الشوارع يزداد كلما صغرت
                              متوسط مساحة القطع في المخطط
                            </td>
                          </tr>
                        </table>
                      </>
                    )}
                </div>
              </Col>{" "}
              <Col span={3} className="flexCol1">
                <div className="div-border-arabic">
                  <img src="images/ar.PNG"></img>
                </div>
              </Col>{" "}
              <Col span={3} className="flexCol1">
                <div className="div-border-arabic">
                  <h4>نتائج تحليل التربة لموقع المخطط</h4>
                  <p>أعد تقرير التربة من مكتب :- {office_name}</p>
                  <p>
                    جهد التربة التصميمي :- {convertToArabic(gohd)} كجم / سم٢
                  </p>
                  <p>
                    {" "}
                    عمق التأسيس :- {convertToArabic(depth)} م تحت مستوي الشارع
                    المجاور
                  </p>
                  <p>نوع التأسيس :- {type}</p>
                  <p>
                    الهبوط الكلي المسموح به :-
                    {convertToArabic(over_all_down)} ملم
                  </p>
                  <p>
                    الهبوط المتفاوت المسموح به :-{" "}
                    {convertToArabic(over_all_different)} ملم
                  </p>
                  <p>
                    عمق منسوب المياة الجوفية :- {convertToArabic(depth_water)}
                  </p>
                  <p>التوصيات الخاصة للبناء على الموقع :- {recommendtion}</p>
                </div>
              </Col>
              <Col span={7} className="flexCol1">
                <div className="div-border-arabic">
                  <Row
                    style={{
                      borderBottom: "1px solid",
                      paddingBottom: "12px",
                      alignItems: "center",
                    }}
                  >
                    <Col span={6}>
                      <div style={{ justifySelf: "center" }}>
                        <img
                          style={{ width: "60px" }}
                          src="images/logo2.png"
                        ></img>
                      </div>
                    </Col>
                    <Col span={12}>
                      {" "}
                      <div style={{ textAlign: "center" }}>
                        <h6 style={{ fontSize: "20px" }}>
                          وزارة الشئون البلدية والقروية
                        </h6>
                        <h6 style={{ fontSize: "20px" }}>
                          أمانة المنطقة الشرقية
                        </h6>
                        <h6 style={{ fontSize: "20px" }}>
                          الإدارة العامة للتخطيط العمراني
                        </h6>
                      </div>
                    </Col>
                    <Col span={6}>
                      {" "}
                      <div style={{ justifySelf: "center" }}>
                        <img
                          style={{ width: "60px" }}
                          src="images/logo3.png"
                        ></img>
                      </div>
                    </Col>
                  </Row>

                  <Row
                    style={{ borderBottom: "1px solid", paddingBottom: "12px" }}
                  >
                    <Col span={18}>
                      <table
                        className="table table-bordered"
                        style={{ marginTop: "10px" }}
                      >
                        <tr>
                          <td>المدينة</td>
                          <td>{city}</td>
                        </tr>
                        <tr>
                          <td>الحي</td>
                          <td>{district}</td>
                        </tr>
                        <tr>
                          <td>المحافظة</td>
                          <td>{sub_city}</td>
                        </tr>
                        <tr>
                          <td>المنطقة</td>
                          <td>الشرقية</td>
                        </tr>
                      </table>
                    </Col>{" "}
                    <Col span={6}>
                      <div style={{ paddingLeft: "10px" }}>
                        <p>مخطط أرض المواطن / </p>
                        <p>
                          {owners_name} {plan_description} بالمعاملة رقم{" "}
                          {convertToArabic(request_no)}
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <div
                    style={{ borderBottom: "1px solid", paddingBottom: "12px" }}
                  >
                    <Row className="rowPadding">
                      <Col span={6}>
                        <div style={{ paddingRight: "10px" }}>
                          {" "}
                          <div
                            style={{
                              borderBottom: "1px solid",
                            }}
                          >
                            <p>رقم المخطط :- {convertToArabic(plan_no)}</p>
                          </div>
                          <div
                            style={{
                              borderBottom: "1px solid",
                            }}
                          >
                            <p>تاريخ الإعداد</p>
                            <p>{convertToArabic(preparedDate)} هـ</p>
                          </div>
                          <div>
                            <p>تاريخ الإعتماد</p>
                            <p>{convertToArabic(approvalDate)} هـ</p>
                          </div>
                        </div>
                      </Col>
                      {!imported_mainObject && (
                        <Col span={18}>
                          <table
                            className="table table-bordered"
                            style={{ marginTop: "10px" }}
                          >
                            <tr>
                              <td>الوظيفة</td>
                              <td>الإسم</td>
                              <td>التوقيع</td>
                            </tr>
                            <tr>
                              <td>المكتب الهندسي المصمم</td>
                              <td colSpan="2">{creator_user_name}</td>
                              {/* <td></td> */}
                            </tr>
                            {/* {isMMSignShow && ( */}
                            <tr>
                              <td>المهندس المختص</td>
                              <td>المهندس / {eng_user_name}</td>
                              <td>
                                {province_id && approvalDate && (
                                  <SignPics
                                    committee_report_no={committee_report_no}
                                    is_paid={is_paid}
                                    province_id={province_id}
                                    userId={userIdeng}
                                  />
                                )}
                              </td>
                            </tr>
                            {/* )} */}

                            <tr>
                              <td>{committeeactors2?.position}</td>
                              <td>المهندس / {committeeactors2?.name}</td>
                              {/* <td>مدير إدارة التخطيط</td>
                            <td>م / محمد بن سعيد الدوسري</td> */}
                              <td>
                                {" "}
                                {committeeactors2?.is_approved &&
                                  province_id &&
                                  approvalDate && (
                                    <SignPics
                                      province_id={province_id}
                                      committee_report_no={committee_report_no}
                                      is_paid={is_paid}
                                      userId={committeeactors_dynamica_id[3]}
                                    />
                                  )}
                              </td>
                            </tr>

                            <tr>
                              <td>{committeeactors3?.position}</td>
                              <td>المهندس / {committeeactors3?.name}</td>
                              {/* <td>مدير عام التخطيط العمراني</td>
                            <td>م / فواز بن فهد العتيبي</td> */}
                              <td>
                                {" "}
                                {committeeactors3?.is_approved &&
                                  province_id &&
                                  approvalDate && (
                                    <SignPics
                                      province_id={province_id}
                                      committee_report_no={committee_report_no}
                                      is_paid={is_paid}
                                      userId={committeeactors_dynamica_id[2]}
                                    />
                                  )}
                              </td>
                            </tr>

                            {committeeactors1?.name && (
                              <tr>
                                <td>{committeeactors1?.position}</td>
                                <td>المهندس / {committeeactors1?.name}</td>
                                <td>
                                  {" "}
                                  {committeeactors1?.is_approved &&
                                    province_id &&
                                    approvalDate && (
                                      <SignPics
                                        province_id={province_id}
                                        committee_report_no={
                                          committee_report_no
                                        }
                                        is_paid={is_paid}
                                        userId={committeeactors_dynamica_id[4]}
                                      />
                                    )}
                                </td>
                              </tr>
                            )}

                            <tr>
                              <td>{committeeactors4?.position}</td>
                              <td>المهندس / {committeeactors4?.name}</td>
                              {/* <td>وكيل الأمين للتعمير والمشاريع</td>
                            <td>م / مازن بن عادل بخرجي</td> */}
                              <td>
                                {" "}
                                {committeeactors4?.is_approved &&
                                  province_id &&
                                  approvalDate && (
                                    <SignPics
                                      province_id={province_id}
                                      committee_report_no={committee_report_no}
                                      is_paid={is_paid}
                                      userId={committeeactors_dynamica_id[1]}
                                    />
                                  )}
                              </td>
                            </tr>
                          </table>

                          <div
                            style={{
                              borderTop: "2px solid #000",
                              paddingTop: "10px",
                            }}
                          >
                            <p>يعتمد {committeeactors5?.position}</p>

                            <p>المهندس / {committeeactors5?.name}</p>
                            {/* <p>يعتمد أمين المنطقة الشرقية</p>
                          <p>المهندس / فهد بن محمد الجبير</p> */}
                            <p>التوقيع</p>
                            {committeeactors5?.is_approved &&
                              province_id &&
                              approvalDate && (
                                <SignPics
                                  province_id={province_id}
                                  committee_report_no={committee_report_no}
                                  is_paid={is_paid}
                                  userId={committeeactors_dynamica_id[0]}
                                />
                              )}
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                </div>
                {/* {cutes?.length > 0 && (
                  <div style={{ direction: "rtl" }}>
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>الاتجاهات</th>
                          <th>شمال / شرق</th>
                          <th>شمال / غرب</th>
                          <th>جنوب / شرق</th>
                          <th>جنوب / غرب</th>
                        </tr>
                      </thead>
                      <tbody>
                        <td>مساحة الشطفة</td>
                        <td>
                          {convertToArabic(cutes[0].NORTH_EAST_DIRECTION)}
                        </td>
                        <td>
                          {convertToArabic(cutes[0].NORTH_WEST_DIRECTION)}
                        </td>
                        <td>
                          {convertToArabic(cutes[0].SOUTH_EAST_DIRECTION)}
                        </td>
                        <td>
                          {convertToArabic(cutes[0].SOUTH_WEST_DIRECTION)}
                        </td>
                      </tbody>
                    </table>
                  </div>
                )}
                {electric_room_area > 0 && (
                  <div>
                    <span>
                      إجمالي مساحة غرفة الكهرباء :-{" "}
                      {convertToArabic(electric_room_area)} م٢
                    </span>
                  </div>
                )} */}
              </Col>
            </Row>
          </div>
        </div>
      </>
    );
  }
}
