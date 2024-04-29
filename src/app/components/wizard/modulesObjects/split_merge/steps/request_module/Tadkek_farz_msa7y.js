import { workFlowUrl, host, backEndUrlforMap, printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { map, get, assign, isEmpty } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import { withTranslation } from "react-i18next";
import {
  redrawNames,
  uploadGISFile,
  getInfo,
  queryTask,
  objectPropFreqsInArray,
  objectPropFreqsInArrayForKroki,
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
  getFileName,
  getPacrelNoAngle,
  formatPythonObjectForFarz,
  convertToArabic,
  localizeNumber,
  getMapGraphics,
  convertToEnglish,
  validation,
  validationWithoutPromise,
  validationList,
} from "../../../../../inputs/fields/identify/Component/common/common_func";
import applyFilters from "main_helpers/functions/filters";
import { getMap } from "main_helpers/functions/filters/state";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
import { checkAppMainLayers } from "app/helpers/errors";
export default {
  label: "الرفع المساحي",
  preSubmit(values, currentStep, props) {
    const { t } = props;

    var mapObj = getMap();
    return new Promise(function (resolve, reject) {
      let valid = true;
      let requirParcelsNames = false;
      if (
        !(props?.formValues?.tadkek_msa7yData || values?.tadkek_msa7yData)
          .cadDetails?.suggestionsParcels?.length
      ) {
        valid = false;
      }

      (
        props?.formValues?.tadkek_msa7yData || values?.tadkek_msa7yData
      ).cadDetails?.suggestionsParcels?.forEach(function (ele, key) {
        // if (!ele.area_text) {
        //   areaTextValid = false;
        // }

        if (
          !ele.east_Desc ||
          !ele.west_Desc ||
          !ele.north_Desc ||
          !ele.south_Desc
        ) {
          valid = false;
        }
        if (
          !ele.parcel_name ||
          (ele.parcel_name && ele.parcel_name.indexOf("أرض رقم") != -1)
        ) {
          requirParcelsNames = true;
        }
      });

      if (requirParcelsNames) {
        window.notifySystem(
          "error",
          t("messages:REQUIRNAMESUGGESTIONVALIDATIONMSG"),
          10
        );
      }

      if (!valid) {
        window.notifySystem(
          "error",
          t("messages:WRONGSUGGESTIONVALIDATIONMSG"),
          10
        );
      }

      // if (!areaTextValid) {
      //   window.notifySystem(
      //     "error",
      //     t("messages:MUSTENTERELECTRICROOMAREATEXT"), 10
      //   );
      // }

      if (mapObj) {
        (
          props?.formValues?.tadkek_msa7yData || values?.tadkek_msa7yData
        ).mapviewer.mapGraphics = (mapObj && getMapGraphics(mapObj)) || [];
      }
      if (valid && !requirParcelsNames) {
        return resolve(props.formValues || values);
      } else {
        return reject();
      }
    });
  },
  sections: {
    tadkek_msa7yData: {
      label: "الرفع المساحي",
      className: "radio_det",
      fields: {
        requestType: {
          label: "Submission Type",
          field: "select",
          showSearch: true,
          moduleName: "requestType",
          label_key: "name",
          value_key: "id",
          data: [
            {
              id: 1,
              name: "فرز",
            },
            {
              id: 2,
              name: "دمج",
            },
          ],
          init: (props) => {
            if (!props.input.value) {
              props.input.onChange(1);
            }
          },
          required: true,
          onSelect: (value, props) => {
            let { params, setSelector } = props;
            if (!props?.currentModule?.record?.request_no) {
              setSelector("request_no", {
                text: "",
                dataSource: [],
              });
              props.change("tadkek_msa7yData.cadDetails", {
                isReset: true,
              });
            } else {
              if (props.input.value) {
                props.input.onChange(props.input.value);
              }
            }
          },
        },
        request_no: {
          moduleName: "request_no",
          field: "search",
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
          postRequest: (props, results) => {
            if (props.currentModule.record.request_no) {
              return [{ id: props.values.request_no }];
            }
          },
          // permission: {
          //   show_match_value: { requestType: 1 },
          //   show_match_value: { requestType: 2 },
          // },
          onSelect: async (value, option, values, props) => {
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
              ).then(async (data) => {
                data =
                  (typeof data == "string" &&
                    JSON.parse(window.lzString.decompressFromBase64(data))) ||
                  data;
                window.Supporting = data.Supporting;
                if (
                  data.landData.landData.lands.selectedMoamlaType == 1 &&
                  props.currentModule.record.app_id == 1
                ) {
                  let values = data.landData;
                  let validDataRetreiving = true;
                  const formValues = applyFilters({
                    key: "FormValues",
                    form: "stepForm",
                  });
                  let requestType = formValues.tadkek_msa7yData.requestType;
                  const { t } = props;
                  var parcelSymbols = [
                    "س1",
                    "س1-أ - سكني",
                    "س1-أ – سكني",
                    "س1-ب - سكني",
                    "س1-ب – سكني",
                    "س2",
                    "س1-أ",
                    "س1-أ/ص",
                    "س1-ب",
                    "س1-ب/ص",
                    "س2-أ",
                    "س2-أ/ص",
                    "س2-ب",
                    "س2-ب/ص",
                    "س3-أ",
                    "س3-أ/ص",
                    "س3-ب",
                    "س3-ب/ص",
                    "ت-10",
                    "ت-10/ص",
                    "ت-12",
                    "ت-12/ص",
                    "ت-15",
                    "ت-15/ص",
                    "ت-2",
                    "ت-2/ص",
                    "ت-3",
                    "ت-3/ص",
                    "ت-5",
                    "ت-5/ص",
                    "ت1-أ",
                    "ت1-أ/ص",
                    "ت1-ب",
                    "ت1-ب/ص",
                    "ت2-أ",
                    "ت2-أ/ص",
                    "خ ت",
                  ];
                  /// identfiy_parcel.selectedParcels[0].attributes.SUBDIVISION_TYPE
                  var isparcel = true;
                  if (values.landData && values.landData.lands.parcels) {
                    let area = 0;

                    var invalid;

                    values.landData.lands.parcels.forEach(async (val, key) => {
                      if (
                        !invalid &&
                        [10501, 10506, 10513].indexOf(
                          val.attributes.MUNICIPALITY_NAME_Code
                        ) != -1
                      ) {
                        if (
                          requestType == 1 ||
                          (requestType == 2 &&
                            values.landData.lands.parcels.length == 1)
                        ) {
                          if (
                            val.attributes.USING_SYMBOL_Code == "س1-أ" &&
                            val.attributes.UNITS_NUMBER &&
                            (!val.attributes.UNITS_NUMBER_Code ||
                              val.attributes.UNITS_NUMBER_Code == 1) &&
                            (!window.Supporting ||
                              (window.Supporting &&
                                !window.Supporting.UNITS_NUMBER))
                          ) {
                            invalid = 1;
                          } else if (
                            val.attributes.USING_SYMBOL_Code == "س1-أ" &&
                            !val.attributes.UNITS_NUMBER
                          ) {
                            invalid = 2;
                          }
                        }
                      }
                      if (!invalid) {
                        if (val.attributes.PARCEL_AREA) {
                          area += parseFloat(
                            convertToEnglish(val.attributes.PARCEL_AREA)
                          );
                        } else {
                          invalid = 3;
                        }
                      }
                    });

                    if (invalid == 1) {
                      window.notifySystem(
                        "error",
                        "عذرا، لا يمكن تقديم طلب فرز على هذه الأرض ( لان عدد الوحدات يساوي وحدة واحدة بالقطعة )",
                        10
                      );
                      validDataRetreiving = false;
                    }

                    if (invalid == 2) {
                      window.notifySystem(
                        "error",
                        "عذرا، لا يمكن تقديم طلب فرز على هذه الأرض ( لان عدد الوحدات غير متوفر )",
                        10
                      );
                      validDataRetreiving = false;
                    }

                    if (invalid == 3) {
                      window.notifySystem(
                        "error",
                        t("messages:ParcelArea"),
                        10
                      );
                      validDataRetreiving = false;
                    }

                    if (
                      !window.Supporting ||
                      (window.Supporting && !window.Supporting.OverArea)
                    ) {
                      if (
                        (requestType == 1 ||
                          (requestType == 2 &&
                            values.landData.lands.parcels.length == 1)) &&
                        area >= 10000
                      ) {
                        window.notifySystem(
                          "error",
                          t("messages:allowedArea"),
                          10
                        );
                        validDataRetreiving = false;
                      }
                    }
                  }

                  if (!values.landData) {
                    window.notifySystem(
                      "error",
                      t("messages:validboundries"),
                      10
                    );
                    validDataRetreiving = false;
                  }

                  var errorInParcelData = true;
                  var invalid = false;
                  if (values.landData.lands.parcels) {
                    values.landData.lands.parcels.forEach(function (elem) {
                      elem.valid = false;
                      if (isparcel && !invalid) {
                        if (
                          parcelSymbols
                            .map((arrItem) =>
                              arrItem?.replace(/\s/g, "")?.trim()
                            )
                            .indexOf(
                              elem.attributes.USING_SYMBOL?.replace(
                                /\s/g,
                                ""
                              )?.trim()
                            ) == -1
                        ) {
                          // elem.attributes.USING_SYMBOL_Code ||
                          invalid = true;
                        } else {
                          elem.valid = true;
                        }
                      }
                      // else {
                      //   elem.valid = true;
                      // }
                      if (
                        !elem.attributes.PARCEL_AREA ||
                        !elem.attributes.USING_SYMBOL ||
                        !elem.valid
                      ) {
                        errorInParcelData = false;
                        return;
                      }
                    });

                    if (
                      (!window.Supporting ||
                        (window.Supporting &&
                          !window.Supporting.UsingSymbol)) &&
                      (requestType == 1 ||
                        (requestType == 2 &&
                          values.landData.lands.parcels.length == 1))
                    ) {
                      if (invalid) {
                        window.notifySystem(
                          "error",
                          t("messages:USINGSYMBOLCHECKERS"),
                          10
                        );
                        validDataRetreiving = false;
                      }

                      if (!errorInParcelData) {
                        window.notifySystem(
                          "error",
                          t("messages:errorInParcelData"),
                          10
                        );
                        validDataRetreiving = false;
                      }
                    }
                  } else {
                    validDataRetreiving = false;
                  }

                  if (values.landData.lands.parcels && requestType) {
                    if (
                      requestType == 1 &&
                      values.landData.lands.parcels.length > 1
                    ) {
                      window.notifySystem(
                        "error",
                        t("messages:wrongFarzOneParcel"),
                        10
                      );
                      validDataRetreiving = false;
                    } else if (
                      requestType == 2 &&
                      values.landData.lands.parcels.length <= 1
                    ) {
                      window.notifySystem(
                        "error",
                        t("messages:validRequestTypes"),
                        10
                      );
                      validDataRetreiving = false;
                    }
                  } else {
                    validDataRetreiving = false;
                  }

                  if (
                    values.landData.lands.parcels?.filter((r) =>
                      isEmpty(r.parcelData)
                    ).length > 0
                  ) {
                    window.notifySystem(
                      "error",
                      t("messages:PARCELDESCRIPTIONANDBOUNDARIES")
                    );
                    validDataRetreiving = false;
                  }

                  if (validDataRetreiving) {
                    let i = 1;
                    // values.landData.lands.parcels.forEach(
                    //   async (val, key) => {
                    //if (validDataRetreiving) {
                    let parcelValid = await validationList(
                      values.landData.lands.parcels,
                      props
                    );
                    if (parcelValid) {
                      if (!props.currentModule.record.request_no) {
                        delete props.mainObject.waseka;
                        delete props.mainObject.data_msa7y;
                      }
                      //delete props.mainObject.approvalSubmissionNotes;
                      props.setMainObject({ ...props.mainObject });
                      props.change(
                        "tadkek_msa7yData.imported_mainObject",
                        data
                      );
                      props.change(
                        "tadkek_msa7yData.image_uploader",
                        data?.data_msa7y?.msa7yData?.image_uploader
                      );
                      //data?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.[1]?.approved_Image
                      props.change("tadkek_msa7yData.mapviewer", {
                        isApplyTadkekMsa7yData: true,
                      });
                      props.change("tadkek_msa7yData.cadDetails", {
                        isApplyTadkekMsa7yData: true,
                      });
                    } else {
                      validDataRetreiving = false;
                      props.change(
                        "tadkek_msa7yData.imported_mainObject",
                        null
                      );
                      props.change("tadkek_msa7yData.image_uploader", "");
                      props.change("tadkek_msa7yData.cadDetails", {
                        isReset: true,
                      });
                    }
                    // }
                    //   }
                    // );
                  } else {
                    props.change("tadkek_msa7yData.imported_mainObject", null);
                    props.change("tadkek_msa7yData.image_uploader", "");
                    props.change("tadkek_msa7yData.cadDetails", {
                      isReset: true,
                    });
                  }
                } else {
                  window.notifySystem(
                    "error",
                    "عذرا! لا يمكن تقديم معاملة فرز الأراضي بمعاملة تدقيق مكاني بغرض تحديث الصكوك",
                    10
                  );
                  props.change("tadkek_msa7yData.imported_mainObject", null);
                  props.change("tadkek_msa7yData.image_uploader", "");
                  props.change("tadkek_msa7yData.cadDetails", {
                    isReset: true,
                  });
                }
              });
            });
          },
        },
        mapviewer: {
          label: "طبقات الخريطة",
          moduleName: "mapviewer",
          field: "msa7yData",
          zoomfactor: 25,
          activeHeight: false,
          ...extraMapOperations,
          cad: {},
          baseMapUrl: window.mapUrl,
          enableDownloadCad: true,
          hideLabel: true,
          fullMapWidth: true,
          isStatlliteMap: false,
          isGeographic: true,
        },
        cadDetails: {
          label: "تفاصيل الكاد",
          moduleName: "mapviewer",
          field: "cadData", // دي لازم تبقا  submitCADSuggestedData
          isView: false,
          hideLabel: true,
          inputs: {
            north: [
              {
                placeholder: "من فضلك ادخل وصف الحد الشمالي",
                name: "north_Desc",
              },
            ],
            east: [
              {
                placeholder: "من فضلك ادخل وصف الحد الشرقي",
                name: "east_Desc",
              },
            ],
            west: [
              {
                placeholder: "من فضلك ادخل وصف الحد الغربي",
                name: "west_Desc",
              },
            ],
            south: [
              {
                placeholder: "من فضلك ادخل وصف الحد الجنوبي",
                name: "south_Desc",
              },
            ],
          },
        },
        image_uploader_img: {
          label: "صورة فوتوغرافية للأرض",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*",
          multiple: false,
          required: true,
        },
        VIOLATION_STATE: {
          moduleName: "VIOLATION_STATE",
          // required: true,
          label: "مخالفات",
          placeholder: "من فضلك ادخل المخالفات",
          field: "textArea",
        },
        CHANGEPARCEL: {
          moduleName: "CHANGEPARCEL",
          //required: true,
          label:
            "وجود اختلاف بين استمارة التطبيق على الطبيعة وصك الملكية عن بيانات الخريطة",
          field: "boolean",
        },
        CHANGEPARCELReason: {
          moduleName: "CHANGEPARCELReason",
          required: true,
          label: "وجه الإختلاف",
          placeholder: "من فضلك ادخل وجه الإختلاف",
          field: "textArea",
          permission: {
            show_match_value: { CHANGEPARCEL: true },
          },
        },
      },
    },
  },
};
