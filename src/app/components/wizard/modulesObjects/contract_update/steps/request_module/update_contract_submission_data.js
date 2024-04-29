import { postItem, fetchData } from "app/helpers/apiMethods";
import applyFilters from "main_helpers/functions/filters";
import { workFlowUrl, host, backEndUrlforMap, printHost } from "imports/config";
import { map, get, assign, cloneDeep, filter, isEmpty } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import { withTranslation } from "react-i18next";
import { localizeNumber } from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { settingMainObject } from "../../../../components/stepContent/actions/actionFunctions/apiActions";

const clearCheckboxes = (props) => {
  props.change("update_contract_submission_data.update_owner_date", 0);
  props.change("update_contract_submission_data.modify_length_boundries", 0);
  props.change(
    "update_contract_submission_data.modify_transaction_type_dukan",
    0
  );
  props.change("update_contract_submission_data.modify_area_increase", 0);
  props.change("update_contract_submission_data.modify_area_decrease", 0);
  props.change("update_contract_submission_data.update_lengths_units", 0);
  props.change("update_contract_submission_data.update_district_name", 0);
  props.change("update_contract_submission_data.update_plan_number", 0);
  props.change("update_contract_submission_data.update_block", 0);
  props.change("update_contract_submission_data.update_paper_contract", 0);
  props.change(
    "update_contract_submission_data.splite_parcels_by_one_contarct",
    0
  );
};
const onChangeValidate = (props, evt) => {
  let { values, mainObject, change } = props;

  let newValues = values?.parcels || {};
  let edits = {
    ...values,
    [props?.input?.name?.split(".")[1]]:
      [
        "update_contract_submission_data.modify_area_increase",
        "update_contract_submission_data.modify_area_decrease",
        "update_contract_submission_data.update_block",
        "update_contract_submission_data.update_plan_number",
        "update_contract_submission_data.update_district_name",
        "update_contract_submission_data.update_lengths_units",
        "update_contract_submission_data.modify_length_boundries",
      ].indexOf(props?.input?.name) != -1 && evt?.target?.checked,
  };

  contract_Parcel_Changes(evt?.target?.checked, edits, newValues, mainObject);
  if (
    !values?.modify_length_boundries &&
    !values?.modify_area_increase &&
    !values?.modify_area_decrease &&
    !values?.update_lengths_units &&
    !values?.update_district_name &&
    !values?.update_plan_number &&
    !values?.update_block &&
    !values?.splite_parcels_by_one_contarct &&
    !values?.marge_contracts_for_parcels
  ) {
    delete values?.newMainObject?.landData;
  }

  let editableFields = check_fields(
    props?.input?.name,
    evt?.target?.checked,
    values
  );
  // PLAN_NO, PARCEL_BLOCK_NO, DISTRICT_NAME, PARCEL_AREA
  //setData(values?.newMainObject?.landData?.selectedParcels || []);

  change("update_contract_submission_data.parcels", {
    data:
      [
        ...(editableFields
          .filter((field) => field.status)
          .map((field) => field.fieldName) || []),
      ].length > 0 //||
        ? // ["update_contract_submission_data.update_lengths_units"].indexOf(
          //   props.input.name
          // ) != -1 ||
          // ["update_contract_submission_data.modify_length_boundries"].indexOf(
          //   props.input.name
          // ) != -1
          [...(newValues?.newMainObject?.landData?.selectedParcels || [])]
        : [],
    fields_enable_editing: [
      ...(editableFields
        .filter((field) => field.status)
        .map((field) => field.fieldName) || []),
    ],
    update_lengths_units:
      ["update_contract_submission_data.update_lengths_units"].indexOf(
        props?.input?.name
      ) != -1
        ? evt?.target?.checked
        : values?.update_lengths_units,
    modify_length_boundries:
      ["update_contract_submission_data.modify_length_boundries"].indexOf(
        props?.input?.name
      ) != -1
        ? evt?.target?.checked
        : values?.modify_length_boundries,
    newMainObject: newValues?.newMainObject,
  });
  props?.input?.onChange(evt?.target?.checked);
};

const reset_edit_for_field = (items, newValues, mainObject) => {
  var defaults = mainObject.landData.landData.lands.parcels;
  var msa7yParcels =
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels;
  var edits = newValues?.newMainObject?.landData?.selectedParcels;

  Object.keys(items).forEach((key, index) => {
    var field = check_fields(key, items[key], newValues).find(
      (field) => field.sectionFieldName == key
    );
    if (field && !items[key]) {
      edits.forEach((parcel, index) => {
        let krokiParcel = defaults[0];
        // .find(
        //   (_default) =>
        //     localizeNumber(parcel.attributes.PARCEL_PLAN_NO.trim()).indexOf(localizeNumber(_default.attributes.PARCEL_PLAN_NO.trim())) != -1
        // );

        let msa7yParcel = msa7yParcels.find(
          (msa7yParcel) =>
            localizeNumber(msa7yParcel.parcel_name.trim()) ==
            localizeNumber(parcel.attributes.PARCEL_PLAN_NO.trim())
        );

        if (
          ["NA1", "NA2", "PARCEL_AREA"].indexOf(field.fieldName) == -1 &&
          krokiParcel
        ) {
          parcel.attributes[field.fieldName] =
            krokiParcel.attributes[field.fieldName];
        }

        if (
          field.fieldName == "PARCEL_AREA" &&
          (!items["modify_area_decrease"] ||
            items["modify_area_decrease"] == 0) &&
          (!items["modify_area_increase"] ||
            items["modify_area_increase"] == 0) &&
          msa7yParcel
        ) {
          parcel.attributes[field.fieldName] = msa7yParcel.area;
        }

        if (field.fieldName == "NA2" && msa7yParcel) {
          parcel.parcelData.north_length =
            typeof parcel.parcelData.north_length == "object"
              ? {
                  inputValue: msa7yParcel.data[0].totalLength,
                  extValue: parcel.parcelData.north_length.extValue,
                }
              : msa7yParcel.data[0].totalLength;

          parcel.parcelData.south_length =
            typeof parcel.parcelData.south_length == "object"
              ? {
                  inputValue: msa7yParcel.data[4].totalLength,
                  extValue: parcel.parcelData.south_length.extValue,
                }
              : msa7yParcel.data[4].totalLength;

          parcel.parcelData.east_length =
            typeof parcel.parcelData.east_length == "object"
              ? {
                  inputValue: msa7yParcel.data[1].totalLength,
                  extValue: parcel.parcelData.east_length.extValue,
                }
              : msa7yParcel.data[1].totalLength;

          parcel.parcelData.west_length =
            typeof parcel.parcelData.west_length == "object"
              ? {
                  inputValue: msa7yParcel.data[3].totalLength,
                  extValue: parcel.parcelData.west_length.extValue,
                }
              : msa7yParcel.data[3].totalLength;
        }

        if (field.fieldName == "NA1" && msa7yParcel) {
          let initialExtValue = "متر";
          parcel.parcelData.north_length =
            typeof parcel.parcelData.north_length == "object"
              ? {
                  inputValue: parcel.parcelData.north_length.inputValue,
                  extValue: initialExtValue,
                }
              : parcel.parcelData.north_length;

          parcel.parcelData.south_length =
            typeof parcel.parcelData.south_length == "object"
              ? {
                  inputValue: parcel.parcelData.south_length.inputValue,
                  extValue: initialExtValue,
                }
              : parcel.parcelData.south_length;

          parcel.parcelData.east_length =
            typeof parcel.parcelData.east_length == "object"
              ? {
                  inputValue: parcel.parcelData.east_length.inputValue,
                  extValue: initialExtValue,
                }
              : parcel.parcelData.east_length;

          parcel.parcelData.west_length =
            typeof parcel.parcelData.west_length == "object"
              ? {
                  inputValue: parcel.parcelData.west_length.inputValue,
                  extValue: initialExtValue,
                }
              : parcel.parcelData.west_length;
        }
      });
    }
  });
};

const check_fields = (name, checked, values) => {
  let editableFields = [
    {
      fieldName: "NA1",
      status: "update_contract_submission_data.update_lengths_units".includes(
        name
      )
        ? checked
        : values?.update_lengths_units,
      sectionFieldName: "update_lengths_units",
    },
    {
      fieldName: "NA2",
      status:
        "update_contract_submission_data.modify_length_boundries".includes(name)
          ? checked
          : values?.modify_length_boundries,
      sectionFieldName: "modify_length_boundries",
    },
    {
      fieldName: "PARCEL_BLOCK_NO",
      status: "update_contract_submission_data.update_block".includes(name)
        ? checked
        : values?.update_block,
      sectionFieldName: "update_block",
    },
    {
      fieldName: "PLAN_NO",
      status: "update_contract_submission_data.update_plan_number".includes(
        name
      )
        ? checked
        : values?.update_plan_number,
      sectionFieldName: "update_plan_number",
    },
    {
      fieldName: "DISTRICT_NAME",
      status: "update_contract_submission_data.update_district_name".includes(
        name
      )
        ? checked
        : values?.update_district_name,
      sectionFieldName: "update_district_name",
    },
  ];

  let parcelAreaField = editableFields.findIndex(
    (field) => field.fieldName == "PARCEL_AREA"
  );
  if ("update_contract_submission_data.modify_area_increase".includes(name)) {
    if (parcelAreaField == -1) {
      editableFields.push({
        fieldName: "PARCEL_AREA",
        status: checked,
        sectionFieldName: "modify_area_increase",
      });
    } else {
      editableFields[parcelAreaField].status = checked;
    }
  } else {
    // values.modify_area_increase

    if (parcelAreaField == -1) {
      editableFields.push({
        fieldName: "PARCEL_AREA",
        status: values?.modify_area_increase,
        sectionFieldName: "modify_area_increase",
      });
    } else {
      editableFields[parcelAreaField].status = values?.modify_area_increase;
    }
  }

  if ("update_contract_submission_data.modify_area_decrease".includes(name)) {
    if (parcelAreaField == -1) {
      editableFields.push({
        fieldName: "PARCEL_AREA",
        status: checked,
        sectionFieldName: "modify_area_decrease",
      });
    } else {
      editableFields[parcelAreaField].status = checked;
    }
  } else {
    if (parcelAreaField == -1) {
      editableFields.push({
        fieldName: "PARCEL_AREA",
        status: values?.modify_area_decrease,
        sectionFieldName: "modify_area_decrease",
      });
    } else {
      editableFields[parcelAreaField].status = values?.modify_area_decrease;
    }
  }

  return editableFields;
};
const remapTheLengthsAndUnits = (psl) => {
  let initialExtValue = "متر";
  if (typeof psl?.parcelData?.east_length == "string") {
    psl.parcelData.east_length = {
      inputValue: psl.parcelData.east_length,
      extValue: initialExtValue,
    };
  }
  if (typeof psl?.parcelData?.west_length == "string") {
    psl.parcelData.west_length = {
      inputValue: psl.parcelData.west_length,
      extValue: initialExtValue,
    };
  }
  if (typeof psl?.parcelData?.south_length == "string") {
    psl.parcelData.south_length = {
      inputValue: psl.parcelData.south_length,
      extValue: initialExtValue,
    };
  }
  if (typeof psl?.parcelData?.north_length == "string") {
    psl.parcelData.north_length = {
      inputValue: psl.parcelData.north_length,
      extValue: initialExtValue,
    };
  }
};

const reset_Parcels = (items, values, mainObject, is_merge) => {
  if (is_merge) {
    values.newMainObject.landData.selectedParcels = [];
    values?.newMainObject?.landData?.selectedParcels?.push(
      cloneDeep(mainObject.landData.landData.lands.parcels[0])
    );
  }

  if (values?.newMainObject?.landData?.selectedParcels?.length > 0) {
    values?.newMainObject?.landData?.selectedParcels?.forEach(function (
      val,
      key
    ) {
      var prcl = {};
      if (
        !is_merge &&
        values?.newMainObject?.landData?.selectedParcels?.length > 1
      ) {
        prcl = filter(
          mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels,
          (d) => {
            return (
              localizeNumber(d.parcel_name.trim()) ==
              localizeNumber(val.attributes.PARCEL_PLAN_NO.trim())
            );
          }
        )[0];
      } else
        prcl =
          mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0];

      if (prcl) {
        if (is_merge) {
          val.attributes.PARCEL_PLAN_NO = prcl.parcel_name.trim();
        }
        val.attributes.PARCEL_AREA = prcl.area;
        values.newMainObject.landData.selectedParcels[key].parcelData =
          cloneDeep(
            values?.newMainObject?.landData?.selectedParcels[key]?.parcelData
          ) || {};
        values.newMainObject.landData.selectedParcels[key].parcelData.area =
          val.attributes.PARCEL_AREA;
        values.newMainObject.landData.selectedParcels[
          key
        ].parcelData.cuttes_area = prcl.cuttes_area;
        if (mainObject?.waseka?.waseka?.sakType == "4") {
          values.newMainObject.landData.selectedParcels[
            key
          ].parcelData.cuttes_area = prcl.cuttes_area;
        }
        values.newMainObject.landData.selectedParcels[
          key
        ].parcelData.area_text = prcl.area_text;
        values.newMainObject.landData.selectedParcels[
          key
        ].parcelData.north_desc = prcl.north_Desc;
        values.newMainObject.landData.selectedParcels[
          key
        ].parcelData.north_length = prcl.data[0].totalLength;
        values.newMainObject.landData.selectedParcels[
          key
        ].parcelData.south_desc = prcl.south_Desc;
        values.newMainObject.landData.selectedParcels[
          key
        ].parcelData.south_length = prcl.data[4].totalLength;
        values.newMainObject.landData.selectedParcels[
          key
        ].parcelData.east_desc = prcl.east_Desc;
        values.newMainObject.landData.selectedParcels[
          key
        ].parcelData.east_length = prcl.data[1].totalLength;
        values.newMainObject.landData.selectedParcels[
          key
        ].parcelData.west_desc = prcl.west_Desc;
        values.newMainObject.landData.selectedParcels[
          key
        ].parcelData.west_length = prcl.data[3].totalLength;

        delete val.attributes.PARCEL_AREA_UNIT;
        delete val.attributes.PARCEL_AREA_UNIT_NAME;

        delete values?.newMainObject?.landData?.selectedParcels[key]?.parcelData
          .east_length_unit;
        delete values?.newMainObject?.landData?.selectedParcels[key]?.parcelData
          .east_length_unit_name;
        delete values?.newMainObject?.landData?.selectedParcels[key]?.parcelData
          .north_length_unit;
        delete values?.newMainObject?.landData?.selectedParcels[key]?.parcelData
          .north_length_unit_name;
        delete values?.newMainObject?.landData?.selectedParcels[key]?.parcelData
          .south_length_unit;
        delete values?.newMainObject?.landData?.selectedParcels[key]?.parcelData
          .south_length_unit_name;
        delete values?.newMainObject?.landData?.selectedParcels[key]?.parcelData
          .west_length_unit;
        delete values?.newMainObject?.landData?.selectedParcels[key]?.parcelData
          .west_length_unit_name;
      }
    });
  }
};
export const contract_Parcel_Changes = (val, items, values, mainObject) => {
  if (val && !values?.newMainObject?.landData?.selectedParcels) {
    values.newMainObject = values?.newMainObject || {};
    values.newMainObject.landData = {};

    values.newMainObject.landData.scale = cloneDeep(
      mainObject?.landData?.landData?.scale || "1 : 1000"
    );

    values.newMainObject.landData.screenshotURL = cloneDeep(
      mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels[0]
        ?.approved_Image
    );

    let temp = mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
      ?.filter((msa7yParcel) => !msa7yParcel.polygon.isFullBoundry)
      ?.map((parcel) => {
        let krokiParcel = mainObject?.landData?.landData?.lands?.parcels[0];
        // .find(
        //   (kroki) =>
        //     localizeNumber(parcel.parcel_name.trim()).indexOf(
        //       localizeNumber(kroki.attributes.PARCEL_PLAN_NO.trim().trim())
        //     ) != -1
        // );
        let attrs = {
          PARCEL_PLAN_NO: parcel.parcel_name.trim(),
          PARCEL_AREA: parcel.area,
          PARCEL_BLOCK_NO: krokiParcel?.attributes?.PARCEL_BLOCK_NO,
          PLAN_NO: krokiParcel?.attributes?.PLAN_NO,
          DISTRICT_NAME: krokiParcel?.attributes?.DISTRICT_NAME,
          SUBDIVISION_TYPE: krokiParcel?.attributes?.SUBDIVISION_TYPE,
          SUBDIVISION_DESCRIPTION:
            krokiParcel?.attributes?.SUBDIVISION_DESCRIPTION,
          USING_SYMBOL: krokiParcel?.attributes?.USING_SYMBOL,
          SUB_MUNICIPALITY_NAME: krokiParcel?.attributes?.SUB_MUNICIPALITY_NAME,
          SUB_MUNICIPALITY_NAME_Code:
            krokiParcel?.attributes?.SUB_MUNICIPALITY_NAME_Code,
          MUNICIPALITY_NAME: krokiParcel?.attributes?.MUNICIPALITY_NAME,
          MUNICIPALITY_NAME_Code:
            krokiParcel?.attributes?.MUNICIPALITY_NAME_Code,
          CITY_NAME: krokiParcel?.attributes?.CITY_NAME,
          CITY_NAME_Code: krokiParcel?.attributes?.CITY_NAME_Code,
          BLOCK_SPATIAL_ID: krokiParcel?.attributes?.BLOCK_SPATIAL_ID,
          PARCEL_SPATIAL_ID: krokiParcel?.attributes?.PARCEL_SPATIAL_ID,
        };
        return {
          attributes: attrs,
          parcelData: {
            parcel_type: krokiParcel?.parcelData?.parcel_type,
          },
          geometry: parcel.polygon,
        };
      });

    values.newMainObject.landData.selectedParcels = cloneDeep(
      temp // mainObject?.landData?.landData?.lands?.parcels
    );

    if (mainObject?.waseka?.waseka?.sakType != "2") {
      // split contract
      if (values?.newMainObject?.landData?.selectedParcels?.length > 0) {
        reset_Parcels(items, values, mainObject);
      }
    } else {
      // marge contracts
      reset_Parcels(items, values, mainObject, true);
    }
  } else {
    reset_edit_for_field(items, values, mainObject);
  }
};

export default {
  label: "UPDATECONTRACTNEWDATA",
  preSubmit(values, currentStep, props) {
    const { t } = props;
    return new Promise(function (resolve, reject) {
      let valid = true;
      let objectValid = true;
      // const vals = applyFilters({
      //   key: "FormValues",
      //   form: "stepForm",
      // });
      if (
        !props.mainObject.waseka &&
        !props.mainObject.data_msa7y &&
        (!(props.formValues || values).update_contract_submission_data
          .imported_mainObject ||
          ((props.formValues || values).update_contract_submission_data
            .imported_mainObject &&
            typeof (props.formValues || values).update_contract_submission_data
              .imported_mainObject == "boolean"))
      ) {
        objectValid = false;
      }
      if (
        (props.formValues || values).update_contract_submission_data.sakType ==
          "3" &&
        [11].indexOf(
          Object.keys(values.update_contract_submission_data).filter(
            (key) =>
              (typeof (props.formValues || values)
                .update_contract_submission_data[key] == "boolean" ||
                typeof (props.formValues || values)
                  .update_contract_submission_data[key] == "number") &&
              !(props.formValues || values).update_contract_submission_data[key]
          ).length
        ) != -1
      ) {
        valid = false;
      }

      if (!valid) {
        window.notifySystem("error", "يجب اختيار غرض واحد على الأقل");
        return reject();
      }
      if (!objectValid) {
        window.notifySystem(
          "error",
          "يجب اعادة اختيار رقم معاملة التدقيق المكاني"
        );
        return reject();
      } else {
        return resolve(props.formValues || values);
      }
    });
  },
  sections: {
    update_contract_submission_data: {
      label: "الغرض من تحديث الصك",
      className: "radio_det_check",
      init_data: (values, props, fields) => {
        let parcels = get(
          props.mainObject,
          "landData.landData.lands.parcels",
          []
        );
        let options = [];
        if (parcels.length > 1) {
          options = [
            {
              label: "فرز صكوك",
              value: "1",
            },
            {
              label: "تحديث صك ورقي",
              value: "4",
            },
          ];
        } else {
          options = [
            {
              label: "تحديث صك الكتروني",
              value: "3",
            },
            {
              label: "تحديث صك ورقي",
              value: "4",
            },
          ];
        }

        props.setSelector("sakType", {
          options: options,
          required: true,
        });

        // if (
        //   props.mainObject?.update_contract_submission_data
        //     ?.update_contract_submission_data?.sakType == "3"
        // ) {
        //   setTimeout(() => {
        //     clearCheckboxes(props);
        //     props.change(
        //       "update_contract_submission_data.sakType",
        //       "4" //(parcels.length > 1 && "4") || "3"
        //     );

        //     const values = applyFilters({
        //       key: "FormValues",
        //       form: "stepForm",
        //     });

        //
        //     props.setMainObject({
        //       ...props.mainObject,
        //       update_contract_submission_data: values,
        //     });
        //   }, 300);
        // }

        // props.change(
        //   "update_contract_submission_data.sakType",
        //    (parcels.length > 1 && "4") || "3"
        // );
      },
      fields: {
        request_no: {
          moduleName: "request_no",
          field: "search",
          className: "sakText",
          search_match: "includes",
          label: "رقم معاملة التدقيق المكاني",
          placeholder: "البحث برقم المعاملة",
          url: `${workFlowUrl}/submission/GetFinishedRequestsNoList`,
          filter_key: "requestNo",
          label_key: "id",
          label_value: "id",
          searchOnLoad: true,
          params: {
            AppId: "29",
          },
          preRequest: (props) => {
            let { params, setSelector } = props;
            if (
              !params.SubRequestNo &&
              props?.currentModule?.record?.request_no
            ) {
              setSelector("request_no", {
                params: {
                  ...params,
                  SubRequestNo: props.currentModule.record.request_no,
                },
              });
            }
          },
          onSelect(value, option, values, props) {
            const config = {
              app_id: 29,
              request_no: value,
            };
            fetchData(`${workFlowUrl}/search` + "?" + `pageNum=${1}`, {
              params: config,
            }).then((data) => {
              fetchData(
                backEndUrlforMap +
                  data.results[0].submission_file_path +
                  "mainObject.json"
              ).then((data) => {
                data =
                  (typeof data == "string" &&
                    JSON.parse(window.lzString.decompressFromBase64(data))) ||
                  data;
                window.Supporting = data.Supporting;
                if (
                  props.currentModule.record.workflow_id == 2088 &&
                  [10513, 10501, 10512, 10516].indexOf(
                    data.landData.landData.lands.parcels[0].attributes
                      .MUNICIPALITY_NAME_Code
                  ) == -1
                ) {
                  window.notifySystem(
                    "error",
                    "برجاء تقديم الطلب باستخدام مسار عمل (طلب تحديث بيانات الصك للأراضي المخططة بالبلديات)",
                    10
                  );
                } else if (
                  props.currentModule.record.workflow_id == 2128 &&
                  [10513, 10501, 10512, 10516].indexOf(
                    data.landData.landData.lands.parcels[0].attributes
                      .MUNICIPALITY_NAME_Code
                  ) != -1
                ) {
                  window.notifySystem(
                    "error",
                    "برجاء تقديم الطلب باستخدام مسار عمل (طلب تحديث بيانات الصك للأراضي المخططة)",
                    10
                  );
                } else if (
                  data.landData.landData.lands.selectedMoamlaType == 2 &&
                  props.currentModule.record.app_id == 14
                ) {
                  delete props.mainObject.waseka;
                  delete props.mainObject.data_msa7y;
                  delete props.mainObject.approvalSubmissionNotes;
                  props.setMainObject({ ...props.mainObject });
                  clearCheckboxes(props);
                  props.change(
                    "update_contract_submission_data.imported_mainObject",
                    data
                  );
                  let parcels = get(
                    data,
                    "landData.landData.lands.parcels",
                    []
                  );
                  let options = [];
                  if (parcels.length > 1) {
                    options = [
                      {
                        label: "فرز صكوك",
                        value: "1",
                      },
                      {
                        label: "تحديث صك ورقي",
                        value: "4",
                      },
                    ];
                  } else {
                    options = [
                      {
                        label: "تحديث صك الكتروني",
                        value: "3",
                      },
                      {
                        label: "تحديث صك ورقي",
                        value: "4",
                      },
                    ];
                  }

                  props.setSelector("sakType", {
                    options: options,
                    required: true,
                  });

                  // props.change(
                  //   "update_contract_submission_data.sakType",
                  //   "" //(parcels.length > 1 && "4") || "3"
                  // );

                  // setTimeout(() => {
                  //   delete props.mainObject.waseka;
                  //   delete props.mainObject.data_msa7y;
                  //   delete props.mainObject.approvalSubmissionNotes;
                  //   props.setMainObject({ ...props.mainObject });
                  //   clearCheckboxes(props);
                  //   props.change(
                  //     "update_contract_submission_data.sakType",
                  //     "4" //(parcels.length > 1 && "4") || "3"
                  //   );
                  // }, 500);

                  props.change(
                    "update_contract_submission_data.sakType",
                    (parcels.length > 1 && "1") || "3"
                  );
                } else {
                  window.notifySystem(
                    "error",
                    "عذرا! لا يمكن تقديم معاملة تحديث صكوك بمعاملة تدقيق مكاني بغرض فرز الأراضي",
                    10
                  );
                }
              });
            });
          },
        },
        sakType: {
          label: "نوع الوثيقة",
          className: "sakType",
          required: true,
          field: "radio",
          options: [],
          moduleName: "sakType",
          permission: {
            show_every: ["imported_mainObject"],
          },
          onClick: (evt, props) => {
            const {
              input: { onChange },
              change,
              setSelector,
              mainObject,
              setMainObject,
              user,
              currentStep,
            } = props;

            clearCheckboxes(props);
            onChange(evt.target.value);
          },
        },
        update_owner_date: {
          label: "CONTRACTUPDATEOWNWEDATA",
          field: "boolean",
          permission: { show_match_value: { sakType: "3" } },
          // onChangeValidate: (props, evt) => {
          //   let {
          //     values,
          //     mainObject: {
          //       ownerData: { ownerData },
          //     },
          //     input: { onChange },
          //   } = props;

          //   if (evt.target.checked) {
          //     values.newMainObject = {};
          //     values.newMainObject.owners_data = {};
          //     values.newMainObject.owners_data.owners = cloneDeep(
          //       ownerData.owners
          //     );
          //     values.newMainObject.owners_data.owners_model = cloneDeep(
          //       ownerData.owners_model
          //     );
          //     if (ownerData.has_representer) {
          //       values.newMainObject.owners_data.has_representer =
          //         ownerData.has_representer;
          //       values.newMainObject.owners_data.issuer_Id =
          //         ownerData.issuer_Id;
          //       values.newMainObject.owners_data.issuer_date =
          //         ownerData.issuer_date;
          //       values.newMainObject.owners_data.issuers = cloneDeep(
          //         ownerData.issuers
          //       );
          //       values.newMainObject.owners_data.notes = ownerData.notes;
          //       values.newMainObject.owners_data.representative_image =
          //         cloneDeep(ownerData.representative_image);
          //       values.newMainObject.owners_data.representer = cloneDeep(
          //         ownerData.representer
          //       );
          //       values.newMainObject.owners_data.representer[0].original = true;

          //       values.newMainObject.owners_data.representer_id = cloneDeep(
          //         ownerData.representer_id
          //       );
          //       values.newMainObject.owners_data.representive_contract_number =
          //         values.representive_contract_number ||
          //         ownerData.representive_contract_number;
          //     }

          //     Object.values(values.newMainObject.owners_data.owners).forEach(
          //       function (val, key) {
          //         val.original = true;
          //       }
          //     );
          //   } else {
          //     delete values?.newMainObject?.owners_data;
          //     if (values?.newMainObject?.owners_data?.has_representer) {
          //       delete values?.newMainObject?.owners_data.has_representer;
          //       delete values?.newMainObject?.owners_data.representer;
          //       delete values?.newMainObject?.owners_data.representer_id;
          //       delete values?.newMainObject?.owners_data
          //         .representive_contract_number;
          //       delete values?.newMainObject?.owners_data.issuer_Id;
          //       delete values?.newMainObject?.owners_data.issuers;
          //       delete values?.newMainObject?.owners_data.issuer_date;
          //       delete values?.newMainObject?.owners_data.representative_image;
          //       delete values?.newMainObject?.owners_data.notes;
          //     }
          //   }

          //   onChange(evt.target.checked);
          // },
          // permission: {
          //   show_props_not_equal_list: [
          //     {
          //       key: "mainObject.waseka.waseka.sakType",
          //       value: "4",
          //     },
          //   ],
          // },
        },
        modify_length_boundries: {
          label: "CONTRACTUPDATEBOUNDRIESMODIFICATION",
          field: "boolean",
          permission: { show_match_value: { sakType: "3" } },
          // onChangeValidate: onChangeValidate,
          // permission: {
          //   show_props_not_equal_list: [
          //     {
          //       key: "mainObject.waseka.waseka.sakType",
          //       value: "4",
          //     },
          //   ],
          // },
          //   preSubmitValidation: function (values, props) {
          //     const { mainObject, t } = props;
          //     var out = true;
          //     values.parcels.newMainObject.landData.selectedParcels.forEach(
          //       function (prcl, key) {
          //         let psl;
          //         if (mainObject.waseka.waseka.sakType != 2) {
          //           psl = filter(
          //             mainObject.landData.landData.lands.parcels,
          //             (parcel) => {
          //               return (
          //                 localizeNumber(prcl.attributes.PARCEL_PLAN_NO.trim()).indexOf(
          //                   localizeNumber(parcel.attributes.PARCEL_PLAN_NO.trim())
          //                 ) != -1
          //               );
          //             }
          //           )[0];
          //         } else {
          //           psl = mainObject.landData.landData.lands.parcels[0];
          //         }
          //         remapTheLengthsAndUnits(psl);
          //         if (psl) {
          //           var isEditsDone =
          //             (typeof psl.parcelData.east_length == "object" &&
          //               psl.parcelData.east_length.inputValue !=
          //                 prcl.parcelData.east_length.inputValue) ||
          //             (typeof psl.parcelData.north_length == "object" &&
          //               psl.parcelData.north_length.inputValue !=
          //                 prcl.parcelData.north_length.inputValue) ||
          //             (typeof psl.parcelData.south_length == "object" &&
          //               psl.parcelData.south_length.inputValue !=
          //                 prcl.parcelData.south_length.inputValue) ||
          //             (typeof psl.parcelData.west_length == "object" &&
          //               psl.parcelData.west_length.inputValue !=
          //                 prcl.parcelData.west_length.inputValue);

          //           if (!isEditsDone) {
          //             out = false;
          //             return;
          //           }
          //         }
          //       }
          //     );
          //     if (!out) {
          //       window.notifySystem(
          //         "error",
          //         t("messages:MODIFY_LENGTH_BOUNDRIES_CHECK")
          //       );
          //     }
          //     return out;
          //   },
        },
        modify_transaction_type_dukan: {
          label: "DUKANTRANSACTIONTYPE",
          field: "boolean",
          permission: { show_match_value: { sakType: "3" } },
          // onChangeValidate: onChangeValidate,
          // permission: {
          //   show_props_not_equal_list: [
          //     {
          //       key: "mainObject.waseka.waseka.sakType",
          //       value: "4",
          //     },
          //   ],
          // },
          // preSubmitValidation: function (values, props) {
          //   const { mainObject } = props;
          //   if (mainObject?.waseka?.waseka?.sakType != "4")
          //     return values.modify_transaction_type_dukan == 1;
          // },
        },
        // modify_area_increase: {
        //   label: "CONTRACTUPDATEAREAMODIFICATIONINC",
        //   field: "boolean",
        //   deps: ["values.modify_area_decrease"],
        //   //onChangeValidate: onChangeValidate,
        //   disabled: (props) => {
        //     const values = applyFilters({
        //       key: "FormValues",
        //       form: "stepForm",
        //     });

        //     return Boolean(
        //       get(
        //         values,
        //         "update_contract_submission_data.modify_area_decrease",
        //         false
        //       )
        //     );
        //   },
        //   permission: { show_match_value: { sakType: "3" } },
        //   // permission: {
        //   //   show_props_not_equal_list: [
        //   //     {
        //   //       key: "mainObject.waseka.waseka.sakType",
        //   //       value: "4",
        //   //     },
        //   //   ],
        //   // },
        //   //   preSubmitValidation: function (values, props) {
        //   //     const { mainObject, t } = props;
        //   //     var out = false;
        //   //     var total_sug_parc_areas = _(
        //   //       mainObject?.landData?.landData?.lands?.parcels
        //   //     ).reduce((memo, val) => {
        //   //       return +memo + +val.attributes.PARCEL_AREA;
        //   //     }, 0);
        //   //     if (
        //   //       values?.parcels?.newMainObject?.landData?.selectedParcels
        //   //         ?.length == 1
        //   //     ) {
        //   //       if (
        //   //         +total_sug_parc_areas <
        //   //         +values.parcels.newMainObject.landData.selectedParcels[0]
        //   //           .attributes.PARCEL_AREA
        //   //       ) {
        //   //         out = true;
        //   //       }
        //   //     } else {
        //   //       var msa7yTotalArea = _(
        //   //         values?.parcels?.newMainObject?.landData?.selectedParcels
        //   //       ).reduce((memo, val) => {
        //   //         return +memo + +val.attributes.PARCEL_AREA;
        //   //       }, 0);

        //   //       if (+total_sug_parc_areas < +msa7yTotalArea) {
        //   //         out = true;
        //   //       }
        //   //     }

        //   //     if (!out) {
        //   //       window.notifySystem("error", t("messages:MODIFY_AREA_INCREASE"));
        //   //     }
        //   //     return out;
        //   //   },
        // },
        // modify_area_decrease: {
        //   label: "CONTRACTUPDATEAREAMODIFICATIONDEC",
        //   field: "boolean",
        //   deps: ["values.modify_area_increase"],
        //   //onChangeValidate: onChangeValidate,
        //   disabled: (props) => {
        //     const values = applyFilters({
        //       key: "FormValues",
        //       form: "stepForm",
        //     });

        //     return Boolean(
        //       get(
        //         values,
        //         "update_contract_submission_data.modify_area_increase",
        //         false
        //       )
        //     );
        //   },
        //   permission: { show_match_value: { sakType: "3" } },
        //   //   permission: {
        //   //     show_props_not_equal_list: [
        //   //       {
        //   //         key: "mainObject.waseka.waseka.sakType",
        //   //         value: "4",
        //   //       },
        //   //     ],
        //   //   },
        //   //   preSubmitValidation: function (values, props) {
        //   //     const { mainObject, t } = props;
        //   //     var out = false;
        //   //     var total_sug_parc_areas = _(
        //   //       mainObject?.landData?.landData?.lands?.parcels
        //   //     ).reduce((memo, val) => {
        //   //       return +memo + +val.attributes.PARCEL_AREA;
        //   //     }, 0);
        //   //     if (
        //   //       values?.parcels?.newMainObject?.landData?.selectedParcels
        //   //         ?.length == 1
        //   //     ) {
        //   //       if (
        //   //         +total_sug_parc_areas >
        //   //         +values.parcels.newMainObject.landData.selectedParcels[0]
        //   //           .attributes.PARCEL_AREA
        //   //       ) {
        //   //         out = true;
        //   //       }
        //   //     } else {
        //   //       var msa7yTotalArea = _(
        //   //         values?.parcels?.newMainObject?.landData?.selectedParcels
        //   //       ).reduce((memo, val) => {
        //   //         return +memo + +val.attributes.PARCEL_AREA;
        //   //       }, 0);

        //   //       if (+total_sug_parc_areas > +msa7yTotalArea) {
        //   //         out = true;
        //   //       }
        //   //     }

        //   //     if (!out) {
        //   //       window.notifySystem("error", t("messages:MODIFY_AREA_DECREASE"));
        //   //     }
        //   //     return out;
        //   //   },
        // },
        update_lengths_units: {
          label: "CONTRACTUPDATELENGTHSUNITS",
          field: "boolean",
          permission: { show_match_value: { sakType: "3" } },
          // onChangeValidate: onChangeValidate,
          // permission: {
          //   show_props_not_equal_list: [
          //     {
          //       key: "mainObject.waseka.waseka.sakType",
          //       value: "4",
          //     },
          //   ],
          // },
          // preSubmitValidation: function (values, props) {
          //   const { mainObject, t } = props;
          //   var out = true;
          //   values.parcels.newMainObject.landData.selectedParcels.forEach(
          //     function (prcl, key) {
          //       let psl;
          //       if (mainObject.waseka.waseka.sakType != 2) {
          //         psl = filter(
          //           mainObject.landData.landData.lands.parcels,
          //           (parcel) => {
          //             return (
          //               localizeNumber(prcl.attributes.PARCEL_PLAN_NO.trim()).indexOf(
          //                 localizeNumber(parcel.attributes.PARCEL_PLAN_NO.trim())
          //               ) != -1
          //             );
          //           }
          //         )[0];
          //       } else {
          //         psl = mainObject.landData.landData.lands.parcels[0];
          //       }
          //       remapTheLengthsAndUnits(psl);
          //       if (psl) {
          //         var isEditsDone =
          //           (typeof psl.parcelData.east_length == "object" &&
          //             psl.parcelData.east_length.extValue !=
          //               prcl.parcelData.east_length.extValue) ||
          //           (typeof psl.parcelData.north_length == "object" &&
          //             psl.parcelData.north_length.extValue !=
          //               prcl.parcelData.north_length.extValue) ||
          //           (typeof psl.parcelData.south_length == "object" &&
          //             psl.parcelData.south_length.extValue !=
          //               prcl.parcelData.south_length.extValue) ||
          //           (typeof psl.parcelData.west_length == "object" &&
          //             psl.parcelData.west_length.extValue !=
          //               prcl.parcelData.west_length.extValue);

          //         if (!isEditsDone) {
          //           out = false;
          //           return;
          //         }
          //       }
          //     }
          //   );
          //   if (!out) {
          //     window.notifySystem(
          //       "error",
          //       t("messages:MODIFY_LENGTH_BOUNDRIES_CHECK")
          //     );
          //   }
          //   return out;
          // },
        },
        update_district_name: {
          label: "CONTRACTUPDATEDISTRECTNAME",
          field: "boolean",
          permission: { show_match_value: { sakType: "3" } },
          // onChangeValidate: onChangeValidate,
          // permission: {
          //   show_props_not_equal_list: [
          //     {
          //       key: "mainObject.waseka.waseka.sakType",
          //       value: "4",
          //     },
          //   ],
          // },
          // preSubmitValidation: function (values, props) {
          //   const { mainObject, t } = props;
          //   var out = false;
          //   for (
          //     var i = 0;
          //     i < values.parcels.newMainObject.landData.selectedParcels.length;
          //     i++
          //   ) {
          //     if (
          //       mainObject.landData.landData.lands.parcels[i].attributes
          //         .DISTRICT_NAME !=
          //       values.parcels.newMainObject.landData.selectedParcels[i]
          //         .attributes.DISTRICT_NAME
          //     ) {
          //       out = true;
          //       break;
          //     }
          //   }
          //   if (!out) {
          //     window.notifySystem("error", t("messages:UPDATE_DISTRICT_NAME"));
          //   }
          //   return out;
          // },
        },
        update_plan_number: {
          label: "CONTRACTUPDATEPLANENUMBER",
          field: "boolean",
          permission: { show_match_value: { sakType: "3" } },
          // onChangeValidate: onChangeValidate,
          // permission: {
          //   show_props_not_equal_list: [
          //     {
          //       key: "mainObject.waseka.waseka.sakType",
          //       value: "4",
          //     },
          //   ],
          // },
          // preSubmitValidation: function (values, props) {
          //   const { mainObject, t } = props;
          //   var out = false;
          //   for (
          //     var i = 0;
          //     i < values.parcels.newMainObject.landData.selectedParcels.length;
          //     i++
          //   ) {
          //     if (
          //       mainObject.landData.landData.lands.parcels[i].attributes
          //         .PLAN_NO !=
          //       values.parcels.newMainObject.landData.selectedParcels[i]
          //         .attributes.PLAN_NO
          //     ) {
          //       out = true;
          //       break;
          //     }
          //   }
          //   if (!out) {
          //     window.notifySystem("error", t("messages:UPDATE_PLAN_NUMBER"));
          //   }
          //   return out;
          // },
        },
        update_block: {
          label: "CONTRACTUPDATEBLOCK",
          field: "boolean",
          permission: { show_match_value: { sakType: "3" } },
          // onChangeValidate: onChangeValidate,
          // permission: {
          //   show_props_not_equal_list: [
          //     {
          //       key: "mainObject.waseka.waseka.sakType",
          //       value: "4",
          //     },
          //   ],
          // },
          // preSubmitValidation: function (values, props) {
          //   const { mainObject, t } = props;
          //   var out = false;
          //   for (
          //     var i = 0;
          //     i < values.parcels.newMainObject.landData.selectedParcels.length;
          //     i++
          //   ) {
          //     if (
          //       mainObject.landData.landData.lands.parcels[i].attributes
          //         .PARCEL_BLOCK_NO !=
          //       values.parcels.newMainObject.landData.selectedParcels[i]
          //         .attributes.PARCEL_BLOCK_NO
          //     ) {
          //       out = true;
          //       break;
          //     }
          //   }
          //   if (!out) {
          //     window.notifySystem("error", t("messages:UPDATE_BLOCK"));
          //   }
          //   return out;
          // },
        },
        update_paper_contract: {
          label: "CONTRACTUPDATEPAPERCONTRACT",
          field: "boolean",
          permission: { show_match_value: { sakType: "4" } },
          init_data: (props) => {
            props.input.onChange(1);
          },
          disabled: true,
        },
        splite_parcels_by_one_contarct: {
          label: "CONTRACTUPDATETOONECONTRACT",
          field: "boolean",
          permission: { show_match_value: { sakType: "1" } },
          init_data: (props) => {
            props.input.onChange(1);
          },
          disabled: true,
        },
        // marge_contracts_for_parcels: {
        //   label: "CONTRACTUPDATEMARGECONTRACTS",
        //   field: "boolean",
        //   // init_data: (props) => {
        //   //   const {
        //   //     mainObject,
        //   //     input: { onChange },
        //   //   } = props;
        //   //   if (mainObject?.waseka?.waseka?.sakType == "2") {
        //   //     onChange(1);
        //   //   } else onChange(0);
        //   // },
        //   // disabled: function (props) {
        //   //   const { mainObject } = props;
        //   //   return mainObject?.waseka?.waseka?.sakType == "2";
        //   // },
        //   // permission: {
        //   //   show_props_equal_list: [
        //   //     {
        //   //       key: "mainObject.waseka.waseka.sakType",
        //   //       value: "2",
        //   //     },
        //   //   ],
        //   // },
        // },
        // parcels: {
        //   moduleName: "parcels",
        //   label: "بيانات الأرض",
        //   deps: [
        //     "values.modify_area_increase",
        //     "values.modify_area_decrease",
        //     "values.update_lengths_units",
        //     "values.update_district_name",
        //     "values.update_plan_number",
        //     "values.update_block",
        //     "values.modify_length_boundries",
        //   ],
        //   hideLabel: true,
        //   field: "SelectedParcelsView",
        //   className: "land_data",
        //   fields_enable_editing: [],
        //   parcel_fields: [
        //     "PARCEL_PLAN_NO",
        //     "PARCEL_AREA",
        //     "PARCEL_BLOCK_NO",
        //     "PLAN_NO",
        //     "DISTRICT_NAME",
        //     "SUBDIVISION_TYPE",
        //     "SUBDIVISION_DESCRIPTION",
        //     "USING_SYMBOL",
        //   ],
        //   parcel_fields_headers: [
        //     "اسم / وصف الأرض",
        //     "المساحة (م2)",
        //     "رقم البلك",
        //     "رقم المخطط",
        //     "الحي",
        //     "نوع التقسيم",
        //     "اسم التقسيم",
        //     "رمز الاستخدام",
        //   ],
        //   action: (values, props, state) => {},
        //   multiple: false,
        // },
      },
    },
  },
};
