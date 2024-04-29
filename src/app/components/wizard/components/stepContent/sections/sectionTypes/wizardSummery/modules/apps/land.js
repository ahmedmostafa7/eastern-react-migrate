import {
  checkImportedMainObject,
  convertToArabic,
  localizeNumber,
} from "../../../../../../../../inputs/fields/identify/Component/common/common_func";
import { contract_Parcel_Changes } from "../../../../../../../../wizard/modulesObjects/contract_update/steps/request_module/update_contract_submission_data";
import { cloneDeep, isEmpty } from "lodash";
import {
  lands_statements,
  municipality_statements,
  plan_statements,
} from "../../../../../../../modulesObjects/investment_sites/create";
import {
  create_landsallotment,
  review_landsallotment_munplan,
  review_landsallotment_munsurvey,
} from "../../../../../../../modulesObjects/lands_allotment/create";
import { adle_statement_propertycheck } from "../../../../../../../modulesObjects/property_check/create";
import {
  Create_Plan_Approval_Request,
  addmission,
  tabtiriplans_survey_planapproval,
} from "../../../../../../../modulesObjects/plan_approval/create";
import {
  approval_approve_paying_propertyremoval,
  approve_amin_decision_start_propertyremoval,
  compensation_shake_propertyremoval,
  create_propertyremoval_requests,
  financial_connection_propertyremoval,
  prepare_approve_paying_report_propertyremoval,
  prepare_decision_start_propertyremoval,
  prepare_limitation_reports_propertyremoval,
  primary_price_propertyremoval,
  print_approve_paying_report_propertyremoval,
  print_decision_start_propertyremoval,
  print_primary_price_propertyremoval,
  survplan_cads_propertyremoval,
  wakilamin_efada_propertyremoval,
} from "../../../../../../../modulesObjects";

export const landData = (stepItem, object, module, stepModuleId) => {
  if (
    [14, 1, 30].indexOf(module?.app_id) == -1 &&
    [14, 1, 30].indexOf(module?.record?.app_id) == -1
  ) {
    if (!stepItem.submission_data && stepItem.landData.lands) {
      if (
        [25, 27].indexOf(module?.app_id) == -1 &&
        [25, 27].indexOf(module?.record?.app_id) == -1
      ) {
        let lands = [
          {
            label: "submissionType",
            type: "landData",
            isRequestModule: true,
          },
        ];

        lands.push({
          label: "submissionType",
          type: "landData",
          isRequestModule: false,
          module_ids: [59, 58, 63, 74],
        });

        return lands;
      } else {
        return [
          {
            label: "submissionType",
            type:
              (([25].indexOf(module?.app_id) != -1 ||
                [25].indexOf(module?.record?.app_id) != -1) &&
                "landData_allotment") ||
              "landData",
            isRequestModule: true,
          },
          {
            label: "submissionType",
            type:
              (([25].indexOf(module?.app_id) != -1 ||
                [25].indexOf(module?.record?.app_id) != -1) &&
                "landData_allotment") ||
              "landData",
            isRequestModule: false,
            module_ids: [91, 92],
          },
        ];
      }
    } else {
      return [
        {
          label: "Parcels",
          type: "identify",
          isRequestModule: true,
        },
      ];
    }
  } else if (
    [30].indexOf(module?.app_id) != -1 ||
    [30].indexOf(module?.record?.app_id) != -1
  ) {
    return [
      {
        label: (stepModuleId == 146 && "التقدير المالي") || "submissionType",
        type: (stepModuleId == 146 && "summery") || "landData",
        isRequestModule: false,
        data: {
          data: stepItem.landData,
          sectionName: ["landData"],
          forms: prepare_limitation_reports_propertyremoval.steps,
          module_id: prepare_limitation_reports_propertyremoval.module_id
        },
        module_ids: (stepModuleId == 146 && [146]) || [125],
      },
    ];
  } else {
    if (!checkImportedMainObject({ mainObject: object })) {
      let data = [];
      stepItem?.landData?.lands?.parcels?.forEach((parcel, index) => {
        data.push({
          label: localizeNumber(`بيانات الأرض ${index + 1}`),
          type: "UpdateContract_landData",
          isRequestModule: true,
          data: { isNew: false, parcel, screenshotURL: stepItem.screenshotURL },
        });
      });

      var parcelsList =
        object?.data_msa7y.msa7yData.cadDetails.suggestionsParcels;
      if (object?.waseka.waseka.sakType == "2") {
        parcelsList = [
          object?.data_msa7y.msa7yData.cadDetails.suggestionsParcels[0],
        ];
      }

      parcelsList.forEach(function (prcl, key) {
        prcl.parcelData = cloneDeep(
          object?.landData?.landData?.lands?.parcels[0]?.parcelData
        );
        prcl.attributes = cloneDeep(
          object?.landData?.landData?.lands?.parcels[0]?.attributes
        );
        prcl.attributes["PARCEL_PLAN_NO"] = prcl["parcel_name"];
        prcl.attributes["area"] = prcl["area"];
        if (prcl.parcelData) {
          prcl.parcelData["north_length"] = prcl.data[0].totalLength;
          prcl.parcelData["north_desc"] = prcl.north_Desc;
          prcl.parcelData["east_length"] = prcl.data[1].totalLength;
          prcl.parcelData["east_desc"] = prcl.east_Desc;
          prcl.parcelData["west_length"] = prcl.data[3].totalLength;
          prcl.parcelData["west_desc"] = prcl.west_Desc;
          prcl.parcelData["south_length"] = prcl.data[4].totalLength;
          prcl.parcelData["south_desc"] = prcl.south_Desc;
        }
      });

      parcelsList?.forEach((parcel, index) => {
        data.push({
          label: localizeNumber(`بيانات الأرض - جديد ${index + 1}`),
          isNew: true,
          type: "UpdateContract_landData",
          isRequestModule: true,
          data: {
            isNew: true,
            parcel,
            screenshotURL: stepItem.screenshotURL,
          },
        });
      });
      return [...data];
    } else {
      return [];
    }
  }
};
export const financial_Connection = (stepItem, object, module) => {
  return [
    {
      label: "التسعير المبدئي",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.financial_Connection,
        sectionName: ["financial_Connection"],
        forms: financial_connection_propertyremoval.steps,
      },
      module_ids: [129],
    },
  ];
};
export const primary_pricing = (stepItem, object, module) => {
  return [
    {
      label: "التسعير المبدئي",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.primary_pricing,
        sectionName: ["primary_pricing"],
        forms: primary_price_propertyremoval.steps,
      },
      module_ids: [126],
    },
  ];
};
export const efada_municipality_statements = (stepItem, object, module) => {
  return [
    {
      label: "إفادة البلدية",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.efada_municipality_statements,
        sectionName: ["efada_municipality_statements", "site_data_services"],
        forms: municipality_statements.steps,
      },
      module_ids: [99],
    },
  ];
};
export const prepare_decision_print = (stepItem, object, module) => {
  return [
    {
      label: "اعداد قرار البدء في الاجراءات",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.prepare_decision_print,
        sectionName: "prepare_decision_print",
        forms: prepare_decision_start_propertyremoval.steps,
      },
      module_ids: [130],
    },
  ];
};

export const approved_assessment_print = (stepItem, object, module) => {
  return [
    {
      label: "محضر لجنة التقدير المبدئي",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.approved_assessment_print,
        sectionName: "approved_assessment_print",
        forms: print_primary_price_propertyremoval.steps,
      },
      module_ids: [128],
    },
  ];
};
export const approve_amin_prepare_decision_print = (
  stepItem,
  object,
  module
) => {
  return [
    {
      label: "قرار اعداد البدء في الاجراءات",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.approve_amin_prepare_decision_print,
        sectionName: "approve_amin_prepare_decision_print",
        forms: approve_amin_decision_start_propertyremoval.steps,
      },
      module_ids: [131],
    },
  ];
};

export const approved_prepare_decision_print = (stepItem, object, module) => {
  return [
    {
      label: "قرار البدء في الاجراءات",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.approved_prepare_decision_print,
        sectionName: "approved_prepare_decision_print",
        forms: print_decision_start_propertyremoval.steps,
      },
      module_ids: [132],
    },
  ];
};

export const prepare_limitation_reports_print = (stepItem, object, module) => {
  return [
    {
      label: "اعداد محضر وصف وحصر المشتملات",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.prepare_limitation_reports_print,
        sectionName: "prepare_limitation_reports_print",
        forms: prepare_limitation_reports_propertyremoval.steps,
      },
      module_ids: [146],
    },
  ];
};

export const prepare_approve_paying_report_print = (
  stepItem,
  object,
  module
) => {
  return [
    {
      label: "اعداد خطاب الموافقة على صرف التعويض",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.prepare_approve_paying_report_print,
        sectionName: "prepare_approve_paying_report_print",
        forms: prepare_approve_paying_report_propertyremoval.steps,
      },
      module_ids: [147],
    },
  ];
};

export const approval_approve_paying_print = (stepItem, object, module) => {
  return [
    {
      label: "الموافقة على صرف التعويض",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.approval_approve_paying_print,
        sectionName: "approval_approve_paying_print",
        forms: approval_approve_paying_propertyremoval.steps,
      },
      module_ids: [148],
    },
  ];
};

export const print_approve_paying_print = (stepItem, object, module) => {
  return [
    {
      label: "خطاب الموافقة على صرف التعويض",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.print_approve_paying_print,
        sectionName: "print_approve_paying_print",
        forms: print_approve_paying_report_propertyremoval.steps,
      },
      module_ids: [149],
    },
  ];
};

export const compensation_shake = (stepItem, object, module) => {
  return [
    {
      label: "صرف التعويض",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.compensation_shake,
        sectionName: "compensation_shake",
        forms: compensation_shake_propertyremoval.steps,
      },
      module_ids: [150],
    },
  ];
};

export const efada_plan_statements = (stepItem, object, module) => {
  return [
    {
      label: "إفادة إدارة التخطيط",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.efada_plan_statements,
        sectionName: "efada_plan_statements",
        forms: plan_statements.steps,
      },
      module_ids: [98],
    },
  ];
};

export const efada_lands_statements = (stepItem, object, module) => {
  return [
    {
      label: "إفادة الأراضي والممتلكات",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.efada_lands_statements,
        sectionName: "efada_lands_statements",
        forms: lands_statements.steps,
      },
      module_ids: [97],
    },
  ];
};

export const destinationData = (stepItem, object, module) => {
  return [
    {
      label:
        ([2210].indexOf(module.record.workflow_id) != -1 &&
          "بيانات الجهة الحكومية") ||
        "destinationData",
      type: "summery",
      isRequestModule: true,
      data: {
        data: stepItem.destinationData,
        sectionName: (module?.record?.app_id == 30 && ["destinationData"]) || [
          "destinationData",
          "allotment_type",
        ],
        forms:
          (module?.record?.app_id == 30 &&
            create_propertyremoval_requests.steps) ||
          create_landsallotment.steps,
      },
      module_ids: [90, 123],
    },
  ];
};

export const letter = (stepItem, object, module) => {
  return [
    {
      label: "letter",
      type: "summery",
      isRequestModule: true,
      data: {
        data: stepItem.letter,
        sectionName: "letter",
        forms: create_landsallotment.steps,
      },
      module_ids: [90],
    },
  ];
};

export const attachments = (stepItem, object, module) => {
  return [
    {
      label: "attachments",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.attachments,
        sectionName: "attachments",
        forms: review_landsallotment_munplan.steps,
      },
      module_ids: [91],
    },
  ];
};
export const beneficiary_attachments = (stepItem, object, module) => {
  return [
    {
      label: "موافقة الجهة المستفيدة",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.beneficiary_attachments,
        sectionName: "beneficiary_attachments",
        forms: review_landsallotment_munsurvey.steps,
      },
      module_ids: [92],
    },
  ];
};

export const letter_print = (stepItem, object, module, stepModuleId) => {
  return (
    ([121, 139].indexOf(stepModuleId) == -1 && [
      {
        label: "",
        type: "letter_print",
        isRequestModule: false,
        module_ids: [106, 105, 111],
      },
    ]) || [
      {
        label: "خطاب تبليغ كتابة العدل",
        type: "summery",
        isRequestModule: false,
        data: {
          data: stepItem.letter_print,
          sectionName: "letter_print",
          forms: tabtiriplans_survey_planapproval.steps,
        },
        module_ids: [121, 139],
      },
    ]
  );
};

export const afada_adle_statements = (stepItem, object, module) => {
  return [
    {
      label: "إفادة كتابة العدل عن سريان مفعول الصك",
      type: "afada_adle_statements",
      isRequestModule: false,
      data: {
        data: stepItem.afada_adle_statements,
        sectionName: "afada_adle_statements",
        forms: adle_statement_propertycheck.steps,
      },
      module_ids: [107],
    },
  ];
};

export const judge_letter = (stepItem, object, module) => {
  return [
    {
      label: "بيانات الحكم القضائي / الخطاب",
      type: "summery",
      isRequestModule: true,
      data: {
        data: stepItem.judge_letter,
        sectionName: "judge_letter",
        forms: create_propertyremoval_requests.steps,
      },
    },
  ];
};
export const project_attachments = (stepItem, object, module) => {
  return [
    {
      label: "اسم المشروع ومرفقاته",
      type: "summery",
      isRequestModule: true,
      data: {
        data: stepItem.project_attachments,
        sectionName: "project_attachments",
        forms: create_propertyremoval_requests.steps,
      },
    },
  ];
};

export const efada_wakil_statements = (stepItem, object, module) => {
  return [
    {
      label: "افادة وكيل الأمين للتعميير والمشاريع",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.efada_wakil_statements,
        sectionName: "efada_wakil_statements",
        forms: wakilamin_efada_propertyremoval.steps,
      },
      module_ids: [124],
    },
  ];
};

export const financial_connection = (stepItem, object, module) => {
  return [
    {
      label: "الارتباط المالي",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.financial_connection,
        sectionName: "financial_connection",
        forms: financial_connection_propertyremoval.steps,
      },
      module_ids: [129],
    },
  ];
};

export const band_data = (stepItem, object, module) => {
  return [
    {
      label: "بيانات البند",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.band_data,
        sectionName: "band_data",
        forms: financial_connection_propertyremoval.steps,
      },
      module_ids: [129],
    },
  ];
};

export const akar_data = (stepItem, object, module) => {
  return [
    {
      label: "بيانات العقار",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem.akar_data,
        sectionName: "akar_data",
        forms: survplan_cads_propertyremoval.steps,
      },
      module_ids: [125],
    },
  ];
};

export const update_contract_submission_data = (stepItem, object, module) => {
  return (
    (!checkImportedMainObject({ mainObject: object }) && [
      {
        label: "update_contract_submission_data",
        type: "update_contract_submission_data",
        isRequestModule: true,
        data: stepItem.update_contract_submission_data,
      },
    ]) ||
    []
  );
};

export const mun_remark = (stepItem, object, module) => {
  return [
    {
      label: "اعتماد حالة الأرض",
      type: "mun_remark",
      isRequestModule: false,
      module_ids: [8],
    },
  ];
};
export const locationData = (stepItem, object) => {
  return [
    {
      label: "بيانات المواقع",
      type: "location_data",
      isRequestModule: true,
      module_ids: [95],
    },
  ];
};
export const mapEditFeatures = (stepItem, object) => {
  return [
    {
      label: "مراجعة بيانات المواقع",
      type: "map_edit_features",
      isRequestModule: true,
      module_ids: [95],
    },
  ];
};
export const editUpdateCreate = (stepItem, object) => {
  return [
    {
      label: "مراجعة بيانات المعاملة",
      type: "edit_update_features",
      isRequestModule: true,
      module_ids: [86],
    },
  ];
};

export const selectEditingWorkFlow = (stepItem, object) => {
  return [
    {
      label: "مراجعة مسار العمل ",
      type: "select_editing_workFlow",
      isRequestModule: true,
      module_ids: [86],
    },
  ];
};

export const investType = (stepItem, object) => {
  return [
    {
      label: "تحديد نوع الاستثمار",
      type: "investType",
      isRequestModule: true,
      module_ids: [96],
    },
  ];
};

export const duplix_building_details = (stepItem, object, module) => {
  return [
    {
      label: "تفاصيل المبنى",
      type: "duplix_building_details",
      isRequestModule: true,
    },
  ];
};

export const duplix_checktor = (stepItem, object, module) => {
  return [
    {
      label: "التقرير الفني",
      type: "duplix_checktor",
      isRequestModule: true,
    },
  ];
};

export const LandWithCoordinate = (stepItem, object, module) => {
  return [
    {
      label: "Parcels",
      type: "LandWithCoordinate",
      isRequestModule: true,
    },
  ];
};

export const suggestParcel = (stepItem, object, module) => {
  return [
    {
      label: "suggestParcel",
      type: "suggestParcel",
      isRequestModule: true,
    },
  ];
};
export const buy_zayda = (stepItem, object, module) => {
  return [
    {
      label: "buyzayda",
      type: "buyzayda",
      isRequestModule: false,
      module_ids: [65],
    },
  ];
};

export const ma7dar = (stepItem, object, module) => {
  return [
    {
      label: "ma7dar",
      type: "ma7dar",
      isRequestModule: false,
      module_ids: [67],
      data: object.ma7dar,
    },
  ];
};

export const e3adt_ma7dar = (stepItem, object, module) => {
  return [
    {
      label: "ma7dar",
      type: "ma7dar",
      isRequestModule: false,
      module_ids: [83],
      data: object.e3adt_ma7dar,
    },
  ];
};

export const ApprovalGis_1 = (stepItem, object, module) => {
  return [
    {
      label: "ApprovalGis_1",
      type: "ApprovalGis_1",
      isRequestModule: false,
      module_ids: [80],
    },
  ];
};

export const admissions = (stepItem, object, module) => {
  return [
    {
      label: "Admissions",
      type: "Admissions",
      isRequestModule: false,
      module_ids: [44, 120],
    },
  ];
};

export const tabtiriPlans_attachments = (stepItem, object, module) => {
  return [
    {
      label: "tabtiriPlans_attachments",
      type: "tabtiriPlans_attachments",
      isRequestModule: false,
      module_ids: [45],
    },
  ];
};

export const ApprovalGis_2 = (stepItem, object, module) => {
  return [
    {
      label: "ApprovalGis_2",
      type: "ApprovalGis_2",
      isRequestModule: false,
      module_ids: [81],
    },
  ];
};
export const ApprovalGis_3 = (stepItem, object, module) => {
  return [
    {
      label: "ApprovalGis_3",
      type: "ApprovalGis_3",
      isRequestModule: false,
      module_ids: [82],
    },
  ];
};
export const sellingConfirmation = (stepItem, object, module) => {
  return [
    {
      label: "sellingConfirmation",
      type: "confirm_1",
      isRequestModule: false,
      module_ids: [66],
    },
  ];
};
export const sellingConfirmation_2 = (stepItem, object, module) => {
  return [
    {
      label: "sellingConfirmation_2",
      type: "confirm_2",
      isRequestModule: false,
      module_ids: [70],
    },
  ];
};
export const sellingConfirmation_3 = (stepItem, object, module) => {
  return [
    {
      label: "sellingConfirmation_3",
      type: "confirm_3",
      isRequestModule: false,
      module_ids: [71],
    },
  ];
};

export const fees = (stepItem, object, module) => {
  return [
    {
      label:
        module?.app_id == 16 || module?.record?.app_id == 16
          ? "fees"
          : module?.app_id == 16 || module?.record?.app_id == 22
          ? "fees_addedparcels"
          : "fees",
      type:
        module?.app_id == 16 || module?.record?.app_id == 16
          ? "fees"
          : module?.app_id == 16 || module?.record?.app_id == 22
          ? "fees_addedparcels"
          : "fees",
      isRequestModule: false,
      module_ids: [56, 73],
    },
  ];
};

export const debagh = (stepItem, object, module) => {
  return [
    {
      label:
        (module.record.app_id == 25 && "اصدار قرار التخصيص") ||
        "طباعة محضر اللجنة الفنية",
      type: (module.record.app_id == 25 && "debagh_allotment") || "debagh",
      isRequestModule: false,
      module_ids: [60, 93, 103, 94],
    },
  ];
};

export const tabsSummary = (stepItem, object, module) => {
  return [
    {
      label: "tabsSummary",
      type: "tabsSummary",
    },
  ];
};

export const data_msa7y = (stepItem, object, module) => {
  // var reqType = object.landData.landData.lands.req_type;
  // var requestType = object.landData.requestType;

  var views = [];
  if (
    checkImportedMainObject({ mainObject: object }) &&
    ([14, 1].indexOf(module?.app_id) != -1 ||
      [14, 1].indexOf(module?.record?.app_id) != -1)
  ) {
    views = [
      {
        label: "submissionType",
        type: "landData",
        isRequestModule: true,
      },
    ];
  } else {
    var cadDetails = object?.data_msa7y?.msa7yData?.cadDetails;
    if (cadDetails) {
      cadDetails?.suggestionsParcels?.map((parcel, index) => {
        parcel.deducted_area =
          (!cadDetails.temp.isPlan &&
            ((parcel?.polygon?.isFullBoundry &&
              !parcel?.cuttes_area &&
              cadDetails?.suggestionsParcels
                .filter((subParcel) => !subParcel?.isFullBoundry)
                .reduce((a, b) => a + +b.area, 0)) ||
              (parcel?.cad_area &&
                (+parcel?.cad_area)?.toFixed(2) -
                  (cadDetails?.cuttes_area || parcel?.cuttes_area)) ||
              parcel.area)) ||
          parcel.area - (cadDetails?.cuttes_area || 0);
        views.splice(views.length, 0, {
          tabType: "parcels",
          label:
            (([23, 34].indexOf(module.id) != -1 ||
              [1928, 1949, 2048].indexOf(module.record.workflow_id) != -1 ||
              cadDetails?.temp?.isFarz) &&
              convertToArabic(parcel.parcel_name)) ||
            convertToArabic(`بيانات الرفع المساحي ${index + 1}`),
          type: "msa7yData",
          data: parcel,
          isRequestModule: true,
        });

        if (
          ((module?.app_id == 14 || module?.record?.app_id == 14) &&
            parcel?.survayParcelCutter?.length &&
            Object.values(parcel?.survayParcelCutter[0]).filter(
              (parcelCutter) =>
                parcelCutter != "" &&
                parcelCutter != "الشطفة" &&
                typeof parcelCutter != "object"
            ).length) ||
          parcel?.have_electric_room
        ) {
          delete parcel?.survayParcelCutter[0]?.editable;
          views.splice(views.length, 0, {
            tabType: "cuttes",
            label: `شطفات للقطعة رقم ${convertToArabic(parcel.parcel_name)}`,
            type: "msa7yData",
            data: {
              cuttes: parcel?.survayParcelCutter[0],
              have_electric_room: parcel?.have_electric_room,
              electric_room_area: parcel?.electric_room_area,
              electric_room_place: parcel?.electric_room_place,
            },
            isRequestModule: true,
          });
        }
      });

      if (
        (module?.app_id != 14 &&
          module?.record?.app_id != 14 &&
          cadDetails?.survayParcelCutter?.length &&
          Object.values(cadDetails?.survayParcelCutter[0]).filter(
            (parcelCutter) =>
              parcelCutter != "" &&
              parcelCutter != "الشطفة" &&
              typeof parcelCutter != "object"
          ).length) ||
        (cadDetails?.temp && cadDetails?.temp?.have_electric_room)
      ) {
        delete cadDetails.survayParcelCutter[0].editable;
        views.splice(views.length, 0, {
          tabType: "cuttes",
          label: `شطفات الأرض`,
          type: "msa7yData",
          data: {
            cuttes: cadDetails.survayParcelCutter[0],
            have_electric_room: cadDetails?.temp?.have_electric_room,
            electric_room_area: cadDetails?.temp?.electric_room_area,
          },
          isRequestModule: true,
        });
      }
    }
  }
  return views;
};
export const sugLandData = (stepItem, object, module) => {
  var views = [];
  var lands = object.sugLandData.sugLandData.lands;
  if (lands) {
    lands.suggestedParcels.map((parcel, index) => {
      var label = localizeNumber(
        (([23].indexOf(module.id) != -1 ||
          [1968].indexOf(module.record.workflow_id) != -1) &&
          parcel.attributes.PARCEL_PLAN_NO) ||
          parcel.attributes.PARCELNAME
      );

      views.splice(views.length, 0, {
        tabType: "parcels",
        label: label,
        type: "sugLandData",
        data: parcel.attributes,
        isRequestModule: true,
      });
    });
  }
  return views;
};

export const krar_amin = (stepItem, object, module) => {
  return [
    {
      label: "krar_amin",
      type: "karar_amin",
      isRequestModule: false,
      module_ids: [68],
    },
  ];
};
export const print_takreer = (stepItem, object, module) => {
  return [
    {
      label: "print_takreer",
      type: "print_takreer",
      isRequestModule: false,
      module_ids: [47, 89],
    },
  ];
};
export const lagna_karar = (stepItem, object, module) => {
  return [
    {
      label: "lagna_karar",
      type: "lagna_karar",
      isRequestModule: false,
      module_ids: [42, 84],
    },
  ];
};
export const lagna_notes = (stepItem, object, module) => {
  return [
    {
      label: "lagna_notes",
      type: "lagna_notes",
      isRequestModule: false,
      module_ids: [42],
    },
  ];
};

export const print_notes = (stepItem, object, module) => {
  return [
    {
      label: "print_notes",
      type: "print_notes",
      isRequestModule: false,
      module_ids: [42, 100],
    },
  ];
};

export const plans = (stepItem, object, module) => {
  return [
    {
      label: "plans",
      type: "plans",
      isRequestModule: true,
      data: {
        planDetails: stepItem.plansData.planDetails,
      },
    },
  ];
};
export const executive_lagna_print = (stepItem, object, module) => {
  return [
    {
      label: "طباعة محضر اللجنة التنفيذية",
      type: "executive_lagna_print",
      isRequestModule: false,
      module_ids: [112, 113],
    },
  ];
};
export const tabtiriPlans = (stepItem, object, module) => {
  let views = [
    // {
    //   label: "tabtiriPlans",
    //   type: "plans",
    //   isRequestModule: true,
    //   data: {
    //     planDetails: stepItem.tabtiriPlansData.planDetails,
    //   },
    // },
    {
      label: "tabtiriPlans",
      type: "plans",
      isRequestModule: false,
      module_ids: [52, 45],
      data: {
        planDetails: stepItem.tabtiriPlansData.planDetails,
      },
    },
  ];

  return views;
};
export const bda2l = (stepItem, object, module) => {
  return [
    {
      label: "bda2l",
      type: "bda2l",
      isRequestModule: false,
      module_ids: [42, 39],
    },
  ];
};
export const khetab = (stepItem, object, module) => {
  return [
    {
      label: "khetab",
      type: "khetab",
      isRequestModule: false,
      module_ids: [72],
    },
  ];
};
export const owner_approval = (stepItem, object, module) => {
  return [
    {
      label: "owner_approval",
      type: "owner_approval",
      isRequestModule: false,
      module_ids: [73],
    },
  ];
};

export const approvals = (stepItem, object, module) => {
  return [
    {
      label: "المرفقات",
      type: "attachments",
      isRequestModule: false,
      module_ids: [61],
      data: { objectName: "approvals", data: stepItem.approvals },
    },
  ];
};

export const final_approvals = (stepItem, object, module) => {
  return [
    {
      label: "المرفقات النهائية",
      type: "attachments",
      isRequestModule: false,
      module_ids: [75],
      data: { objectName: "final_approvals", data: stepItem.final_approvals },
    },
  ];
};

export const final_approvals_attahments = (stepItem, object, module) => {
  return [
    {
      label: "اعتماد المرفقات النهائية",
      type: "attachments",
      isRequestModule: false,
      module_ids: [79],

      data: {
        objectName: "final_approvals_attahments",
        data: stepItem.final_approvals,
      },
    },
  ];
};

export const serviceSubmissionType = (stepItem, object, module) => {
  return [
    {
      label: "serviceSubmissionType",
      type: "ServiceSubmissionType",
      isRequestModule: true,
      module_ids: [53],
    },
  ];
};

export const Conditions = (stepItem, object, module) => {
  return [
    {
      label: "Conditions",
      type: "Conditions",
      isRequestModule: false,
      module_ids: [54],
    },
  ];
};

export const Approval = (stepItem, object, module) => {
  return [
    {
      label: "Approval",
      type: "Approval",
      isRequestModule: true,
    },
  ];
};

export const supervision_attachments = (stepItem, object, module) => {
  return [
    {
      label: "بيانات مرحلة الإشراف",
      // type: "supervision_attachments",
      type: "summery",
      isRequestModule: false,
      data: {
        data: stepItem,
        sectionName: ["supervision_attachments", "supervision_letter"],
        forms: addmission.steps,
      },
      // isRequestModule: false,
      module_ids: [44],
    },
    // {
    //   label: "بيانات خطاب الإدارة العامة لإشراف",
    //  // type: "supervision_attachments",
    //   type: "summery",
    //   isRequestModule: false,
    //   data: {
    //     data: stepItem.supervision_letter,
    //     sectionName: ["supervision_letter"],
    //     forms: addmission.steps,
    //   },
    //  // isRequestModule: false,
    //   module_ids: [44],
    // },
  ];
};
export const submission_data_export = (stepItem, object, module) => {
  return [
    {
      label: "submission_data_export",
      type: "submission_data_export",
      isRequestModule: true,
      module_ids: [88],
    },
  ];
};

export const committee = (stepItem, object, module) => {
  return [
    {
      label: "Committee",
      type: "Committee",
      isRequestModule: false,
      module_ids: [55],
    },
  ];
};

export const All_Attachments = (stepItem, object, module) => {
  return [
    {
      label: "All_Attachments",
      type: "allattachments",
      isRequestModule: true,
      module_ids: [],
    },
  ];
};

// export const remarks = (stepItem, object, module) => {
//
//   return [
//     ...stepItem.map((item) => {
//       item.user = (!item.user && module.record.CreatorUser) || item.user;
//       item.step = (!item.step && module.record.CurrentStep) || item.step;
//       return {
//         label: item.step.name,
//         type: "remarks",
//         data: item,
//         isRequestModule: true,
//       };
//     }),
//   ];
// };

export const Takdem = (stepItem, object, module) => {
  return [
    {
      label: "notes",
      type: "notes_windows",
      isRequestModule: false,
    },
  ];
};
export const approvalSubmissionNotes = (stepItem, object, module) => {
  return [
    {
      label: "notes",
      type: "notes_windows",
      isRequestModule: true,
    },
  ];
};
export const approvalSubmissionNotes_2 = (stepItem, object, module) => {
  return [
    {
      label: "notes",
      type: "notes_windows",
      isRequestModule: true,
    },
  ];
};

export const printCreate = (stepItem, object, module) => {
  return [
    {
      label: "printCreate",
      type: "printCreate",
      isRequestModule: false,
      module_ids: [76],
    },
  ];
};
export const submission_data = (stepItem, object, module) => {
  return [
    {
      label: "submission_data",
      type: "submission_data",
      isRequestModule: true,
    },
  ];
};
export const requests = (stepItem, object, module) => {
  return [
    {
      label: "requests",
      type: "requests",
      isRequestModule: true,
    },
  ];
};
export const waseka = (stepItem, object, module) => {
  return [
    {
      label:
        (module?.app_id != 25 && module?.record?.app_id != 25 && "waseka") ||
        "كتابة العدل",
      type:
        (module?.app_id != 25 && module?.record?.app_id != 25 && "waseka") ||
        "summery",
      isRequestModule: true,
      data: {
        data: stepItem.waseka,
        sectionName: "waseka",
        forms: create_landsallotment.steps,
      },
      module_ids: [90],
    },
  ];
};

export const sakData = (stepItem, object, module) => {
  return [
    {
      label: "waseka",
      type: "SakData",
      isRequestModule: true,
    },
  ];
};
