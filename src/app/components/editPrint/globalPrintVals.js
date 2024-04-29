import moment from "moment-hijri";
import {
  CalculateFees,
  CalculateTotalFees,
} from "../../../main_helpers/functions/fees";
import { convertToArabic } from "../inputs/fields/identify/Component/common/common_func";
export function getValuesFromMainObj(
  props,
  mainObject,
  submissionData,
  printId,
  printName,
  printObj
) {
  const allData = [];

  //start bind from submission
  let checkBoundries = printObj?.checkBoundries;
  let title1 =
    printObj?.printTextEdited &&
    (Object.values(printObj?.printTextEdited)[0]?.title1 || "");
  let title2 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title2;
  let title3 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title3;
  let title4 =
    printObj?.printTextEdited &&
    (Object.values(printObj?.printTextEdited)[0]?.title4 || "");
  let title5 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title5;
  let title6 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title6;
  let title7 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title7;
  let title8 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title8;
  let title9 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title9;
  let title10 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title10;
  let title11 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title11;
  let title12 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title12;
  let title13 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title13;
  let title14 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title14;
  let title15 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title15;
  let title16 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title16;
  let title17 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title17;
  let title18 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title18;
  let title19 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title19;
  let title22 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title22;
  let ZoomRatio =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.zoomRatio;
  // let title3 = Object.values(printObj?.printTextEdited)[0]?.title3;
  let request_number = submissionData?.request_no;
  let create_date = submissionData?.create_date;
  let create_date_Gregorian = new Date(
    moment(submissionData?.create_date, "iD/iM/iYYYY").format("YYYY-M-D")
  );
  let thresholdDate = new Date(
    moment("16/08/1443", "iD/iM/iYYYY").format("YYYY-M-D")
  );
  //
  let app_id = submissionData?.app_id;
  let workflow_id = submissionData?.workflow_id;
  let workflows_id = submissionData?.workflows?.id;
  let is_approved = submissionData?.is_approved;
  let user = submissionData?.CreatorUser;
  let committee_report_no = submissionData?.committee_report_no;
  let committeeactors =
    submissionData?.committees?.committee_actors ||
    submissionData?.CurrentStep?.signatures ||
    [];
  let is_paid =
    submissionData?.submission_invoices?.filter(
      (invoice) => invoice?.is_paid == true
    )?.length == submissionData?.submission_invoices?.length ||
    submissionData?.is_paid;
  let kroky_subject =
    mainObject?.landData?.landData?.krokySubject ||
    mainObject?.landData?.landData?.submissionType;
  //start bind from submission
  let boundry_check = mainObject?.contractUpdate_checkBoundries;
  let coordinates = [];
  let inx = 0;
  mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.forEach(
    (sug_parc) => {
      sug_parc?.polygon_unprojected?.rings?.forEach((ring) => {
        ring?.forEach((point) => {
          if (
            !coordinates.filter((pt) => pt.x == point.x && pt.y == point.y)
              .length
          ) {
            inx++;
            point[2] = inx;
            coordinates.push(point);
          }
        });
      });
    }
  );
  // start kroky owner

  var owners =
    mainObject?.ownerData &&
    Object?.keys(mainObject?.ownerData?.ownerData?.owners)?.map((ownerKey) => {
      return {
        owner_name: mainObject?.ownerData?.ownerData?.owners[ownerKey].name,
        identity:
          mainObject?.ownerData?.ownerData?.owners[ownerKey].ssn ||
          mainObject?.ownerData?.ownerData?.owners[ownerKey]
            .code_regesteration ||
          mainObject?.ownerData?.ownerData?.owners[ownerKey]
            .commercial_registeration,
        identity_label:
          (mainObject?.ownerData?.ownerData?.owners[ownerKey].ssn &&
            "رقم السجل المدنى") ||
          (mainObject?.ownerData?.ownerData?.owners[ownerKey]
            .code_regesteration &&
            "كود الجهة") ||
          (mainObject?.ownerData?.ownerData?.owners[ownerKey]
            .commercial_registeration &&
            "السجل التجاري"),
      };
    });
  let owner_type = mainObject?.ownerData?.ownerData?.owner_type;
  // var ownerdesc = "";
  // var kind = "";
  // if (owner) {
  //   if (owner.ssn) {
  //     ownerdesc = "المواطن / " + owner.name;
  //   } else if (owner.commercial_registeration) {
  //     ownerdesc = "الشركة / " + owner.name;
  //   } else if (owner.code_regesteration) {
  //     ownerdesc = "الجهة / " + owner.name;
  //   }

  //   if (owner.ssn) {
  //     kind = "المواطن "; //"/ " + owner.name;
  //   } else if (owner.commercial_registeration) {
  //     kind = "الشركة "; // + owner.name;
  //   } else if (owner.code_regesteration) {
  //     kind = "الجهة "; //+ owner.name;
  //   }
  // }
  // let owner_name = mainObject?.owners_data?.owners[0]?.name;
  // let identity = mainObject?.owners_data?.owners[0]?.ssn;
  // end kroky owner

  // start kroky skok
  let skok =
    mainObject?.waseka?.waseka?.table_waseka &&
    Object.values(
      (
        mainObject?.waseka?.waseka?.table_waseka_fullList ||
        mainObject?.waseka?.waseka?.table_waseka
      )?.reduce(
        (groups, item) => ({
          ...groups,
          [item.number_waseka]: [...(groups[item.number_waseka] || []), item],
        }),
        {}
      )
    )?.map((itemArr) => {
      return {
        ...itemArr[0],
      };
    });
  //
  // let sak_number = mainObject?.waseka?.waseka?.table_waseka[0]?.number_waseka;
  // let sak_date = mainObject?.waseka?.waseka?.table_waseka[0]?.date_waseka;
  // let issuer_name =
  //   mainObject?.waseka?.waseka?.table_waseka?.[0]?.waseka_search;
  // end kroky skok

  // start kroky landdata

  let city =
    mainObject?.landData?.landData?.municipality?.name ||
    mainObject?.landData?.landData?.MUNICIPALITY_NAME ||
    mainObject?.landData?.landData?.lands?.parcels[0]?.attributes
      ?.MUNICIPALITY_NAME ||
    mainObject?.landData?.landData?.lands?.parcels[0]?.attributes?.CITY_NAME;
  let district_name =
    mainObject?.landData?.landData?.DISTRICT ||
    mainObject?.landData?.landData?.lands?.parcels[0]?.attributes
      ?.DISTRICT_NAME;
  let street_name =
    mainObject?.landData?.landData?.STREET_NAME ||
    mainObject?.landData?.landData?.lands?.parcels[0]?.attributes?.STREET_NAME;
  let plan_no =
    mainObject?.landData?.landData?.PLAN_NO ||
    mainObject?.landData?.landData?.lands?.parcels[0]?.attributes?.PLAN_NO;
  let subdivision_description =
    mainObject?.landData?.landData?.DIVISION_NO ||
    mainObject?.landData?.landData?.lands?.parcels[0]?.attributes
      ?.SUBDIVISION_DESCRIPTION;
  let subdivision_type =
    mainObject?.landData?.landData?.lands?.parcels[0]?.attributes
      ?.SUBDIVISION_TYPE;
  let block_no =
    mainObject?.landData?.landData?.BLOCK_NO ||
    mainObject?.landData?.landData?.lands?.parcels[0]?.attributes
      ?.PARCEL_BLOCK_NO;

  block_no =
    ["null", "Null", null, undefined].indexOf(block_no) != -1
      ? undefined
      : block_no;

  let parcel_no =
    mainObject?.landData?.landData?.PARCEL_PLAN_NO ||
    mainObject?.landData?.landData?.lands?.parcels
      .map(
        (parcel) =>
          (parcel?.attributes?.PARCEL_PLAN_NO.indexOf("/") > -1 &&
            parcel?.attributes?.PARCEL_PLAN_NO.split("/")
              .map((element) => element.trim())
              .join(" / ")) ||
          parcel?.attributes?.PARCEL_PLAN_NO
      )
      .join(" - ");
  let parcel_type =
    mainObject?.landData?.landData?.lands?.parcelData?.parcel_type;
  let approved_Image =
    mainObject?.landData?.landData?.lands?.parcelData?.approved_Image ||
    mainObject?.landData?.landData?.public_Image;
  let previous_Image =
    mainObject?.landData?.screenshotURL ||
    mainObject?.landData?.landData?.image_uploader;
  let have_electric_room =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.temp?.have_electric_room ||
    false;
  let electric_room_area =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.temp?.electric_room_area ||
    "";
  let parcelCutter =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.survayParcelCutter ||
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.temp?.survayParcelCutter;
  let hasParcelCutter =
    parcelCutter &&
    Object.values(parcelCutter[0])?.filter(
      (parcelCutter) => parcelCutter != "" && parcelCutter != "الشطفة"
    ).length > 0;
  let survayParcelCutter = parcelCutter;

  //
  let total_deduction =
    (+electric_room_area || 0) +
    ((parcelCutter &&
      +Object.values(parcelCutter[0])
        ?.filter(
          (parcelCutter) => parcelCutter != "" && parcelCutter != "الشطفة"
        )
        .reduce((b, a) => +a + +b, 0)
        .toFixed(2)) ||
      0);

  let parcelData = mainObject?.landData?.landData?.lands?.parcelData;
  let suggestedParcels =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels;
  let sum = (items, prop) => {
    if (items?.filter((d) => d).length > 0) {
      return items?.reduce((a, b) => {
        return (
          a + ((typeof b[prop] == "string" && parseFloat(b[prop])) || b[prop])
        );
      }, 0);
    }
  };
  let sak_totalArea =
    mainObject?.landData?.landData?.area ||
    sum(
      mainObject?.landData?.landData?.lands?.parcels.map((parcel) => {
        return parcel.attributes;
      }),
      "PARCEL_AREA"
    )?.toFixed(2);
  let nature_totalArea = sum(
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels,
    "area"
  )?.toFixed(2);
  // end kroky landdata

  // start contract msa7y data

  let north_length =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.data[0]?.totalLength;
  let north_desc =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.north_Desc;
  let north_letter =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.north_length_text;
  let south_length =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.data[4]?.totalLength;
  let south_desc =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.south_Desc;
  let south_letter =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.south_length_text;
  let east_length =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.data[1]?.totalLength;
  let east_desc =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.east_Desc;
  let east_letter =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.east_length_text;
  let west_length =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.data[3]?.totalLength;
  let west_desc =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.west_Desc;
  let west_letter =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.west_length_text;
  let nature_totalArea_letter =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.area_text;
  // let total_area =
  //   (mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0],"area").toFixed(2);
  let sak_type = mainObject?.waseka?.waseka?.sakType;
  let municipality_name =
    mainObject?.landData?.landData?.MUNICIPALITY_NAME ||
    mainObject?.landData?.landData?.lands?.parcels[0]?.attributes
      ?.MUNICIPALITY_NAME;

  let municipality_name_code =
    mainObject?.landData?.landData?.lands?.parcels[0]?.attributes
      ?.MUNICIPALITY_NAME_Code;

  municipality_name =
    Number(municipality_name_code) ||
    municipality_name_code ||
    (Number(municipality_name) && municipality_name);

  let committeeactor_signature = committeeactors?.find(
    (actor) =>
      (actor?.user?.id || actor?.users?.id) ==
      mainObject?.signatures?.signatures?.commit_actors[0]
  );
  let signature_issuers_name = mainObject?.signatures?.signatures?.sak_search;
  let signature_issuers_is_court =
    mainObject?.signatures?.signatures?.issuers?.is_court;
  // end contract msa7y data

  // start contract submission data
  let dukan =
    mainObject?.update_contract_submission_data?.update_contract_submission_data
      ?.modify_transaction_type_dukan;
  // start contract submission data

  // start contract emdaa
  let surveyManagerName =
    mainObject?.surveyManagerUser?.surveyManagerName ||
    mainObject?.surveyManagerName;
  let surveyName = mainObject?.surveyUser?.surveyName || mainObject?.surveyName;
  // end contract emdaa

  // start note
  let office_remark =
    mainObject?.approvalSubmissionNotes?.notes?.notes[0]?.notes;
  // end note

  let print_state =
    (submissionData.app_id == 14 && "A4") || (mainObject.print_state ||= "A3");

  ///// wahid
  let committeeactors_dynamica_id = (
    submissionData?.committees?.committee_actors ||
    submissionData?.CurrentStep?.signatures
  )?.reduce((b, a) => b.concat(a?.user?.id || a?.users?.id), []);

  let userIdeng = mainObject?.engUserNameToPrint?.engUser?.id;
  let userIdsurvmanager = mainObject?.surveyManagerUser?.user?.id;
  let userIdsurv = mainObject?.surveyUser?.user?.id;
  let contract_sign_lagnh =
    mainObject?.signatures?.signatures?.commit_actors[0];

  let export_no = submissionData?.export_no;
  let export_date = submissionData?.export_date;
  let invoices = submissionData?.submission_invoices;
  if (mainObject?.fees?.feesInfo && invoices?.length) {
    mainObject.fees.feesInfo.feesList = invoices?.map((invoice) => ({
      ...invoice,
      // increasePercentage: invoice.description
      //   .split(",")[1]
      //   .toString()
      //   .match(/\d+/),
    }));
  }

  let approval_fees_exporter =
    mainObject?.engUserNameToPrint?.engUser?.name ||
    mainObject?.engUserNameToPrint?.engUserName;
  let fees_exporter =
    mainObject?.fees_exporter?.exporterUser?.name ||
    mainObject?.fees_exporter?.name;
  let fees = convertToArabic(
    (mainObject?.fees?.feesInfo?.feesValue &&
      mainObject?.fees?.feesInfo?.feesList?.length &&
      ` ${CalculateTotalFees(mainObject?.fees?.feesInfo || {}, false)} ريال`) ||
      (!mainObject?.fees?.feesInfo?.feesValue &&
        mainObject?.fees?.feesInfo?.feesList?.length &&
        `${mainObject?.fees?.feesInfo?.feesList.reduce((a, b) => {
          return a + b.fees;
        }, 0)}  ريال`) ||
      submissionData?.fees ||
      `${submissionData?.submission_invoices?.reduce(
        (a, b) => a + b.fees,
        0
      )} ريال`
  );
  let invoice_number =
    submissionData?.submission_invoices
      ?.map((invoice) => invoice.invoice_number)
      ?.join(", ") || submissionData?.invoice_number;
  let invoice_date =
    submissionData?.submission_invoices
      ?.map((invoice) => invoice.invoice_date)
      ?.join(", ") || submissionData?.invoice_date;
  let update_contract_type = mainObject?.waseka?.waseka?.sakType;
  let newParcels =
    mainObject?.update_contract_submission_data?.update_contract_submission_data
      ?.parcels?.newMainObject?.landData?.selectedParcels;
  let modify_area_increase =
    [1, true].indexOf(
      mainObject?.update_contract_submission_data
        ?.update_contract_submission_data?.modify_area_increase
    ) != -1
      ? true
      : false;
  let surv_remark = mainObject?.remark?.comment;
  let cadImage =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
      ?.approved_Image;

  let fullBoundryParcel =
    suggestedParcels?.filter(
      (parcel) =>
        parcel?.isFullBoundry ||
        parcel?.polygon?.isFullBoundry ||
        parcel.parcel_name == "حدود المعاملة"
    )[0] ||
    (suggestedParcels?.filter(
      (parcel) => !parcel?.isFullBoundry && !parcel?.polygon?.isFullBoundry
    ).length == 1 &&
      suggestedParcels?.filter(
        (parcel) => !parcel?.isFullBoundry && !parcel?.polygon?.isFullBoundry
      )[0]);
  let nonFullBoundryParcel = suggestedParcels?.filter(
    (parcel) => !parcel?.isFullBoundry && !parcel?.polygon?.isFullBoundry
  );
  ///////////
  allData.push({
    request_number: request_number,
    create_date: create_date,
    create_date_Gregorian: create_date_Gregorian,
    thresholdDate: thresholdDate,
    app_id,
    workflow_id: workflow_id,
    workflows_id: workflows_id,
    is_approved: is_approved,
    committee_report_no: committee_report_no,
    print_state,
    committeeactors,
    committeeactor_signature,
    kroky_subject: kroky_subject,
    owners: owners,
    surv_remark,
    cadImage,
    modify_area_increase,
    export_no,
    export_date,
    update_contract_type,
    boundry_check,
    title1,
    title2,
    title3,
    title4,
    title5,
    title6,
    title7,
    title8,
    title9,
    title10,
    title11,
    title12,
    title13,
    title14,
    title15,
    title16,
    title17,
    title18,
    title19,
    title22,
    checkBoundries,
    newParcels,
    coordinates: coordinates,
    skok: skok,
    city: city,
    district_name: district_name,
    street_name: street_name,
    plan_no: plan_no,
    subdivision_description: subdivision_description,
    subdivision_type: subdivision_type,
    block_no: block_no,
    parcel_no: parcel_no,
    parcel_type: parcel_type,
    office_remark,
    approved_Image,
    previous_Image,
    have_electric_room,
    electric_room_area,
    hasParcelCutter,
    mainObject,
    survayParcelCutter,
    parcelData,
    suggestedParcels,
    sak_totalArea,
    nature_totalArea,
    user,
    north_length,
    south_length,
    east_length,
    west_length,
    printId,
    printObj,
    north_desc,
    south_desc,
    ZoomRatio,
    east_desc,
    west_desc,
    north_letter,
    south_letter,
    east_letter,
    west_letter,
    nature_totalArea_letter,
    // total_area,
    sak_type,
    municipality_name,
    signature_issuers_name,
    signature_issuers_is_court,
    dukan,
    surveyManagerName,
    surveyName,
    fullBoundryParcel,
    nonFullBoundryParcel,
    approval_fees_exporter,
    fees_exporter,
    fees,
    invoice_date,
    invoice_number,
    invoices,
    owner_type,
    is_paid,
    committeeactors_dynamica_id,
    userIdeng,
    userIdsurvmanager,
    userIdsurv,
    contract_sign_lagnh,
    total_deduction,
    t: props.t,
  });
  return allData;
  // console.log("gaga");
}
