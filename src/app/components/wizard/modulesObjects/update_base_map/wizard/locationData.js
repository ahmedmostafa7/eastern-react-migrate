import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";

var XLSX = require("xlsx");

import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import { addFeaturesMapLayers } from "../../../../inputs/fields/identify/Component/mapviewer/config";
import {
  readExcel,
  uploadGISFile,
} from "../../../../inputs/fields/identify/Component/common/common_func";
const _ = require("lodash");
export default {
  label: "رفع بيانات المواقع",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      if (props?.mainApp?.uploadFileDetails) {
        if (
          props?.mainApp?.uploadFileDetails?.googlePoints?.length ||
          props?.mainApp?.uploadFileDetails?.fileData
        ) {
          values.uploadFileDetails = { ...props.mainApp.uploadFileDetails };
          return resolve(values);
        } else {
          if (
            props?.mainApp?.uploadFileDetails?.fileType == "google" &&
            props?.mainApp?.uploadFileDetails?.googlePoints?.length == 0
          ) {
            window.notifySystem("error", "يجب إضافة عدد من النقاط");
            reject();
          } else if (props?.mainApp?.uploadFileDetails?.fileData) {
            window.notifySystem("error", "الملف لا يحتوى على عناصر");
            reject();
          } else {
            window.notifySystem("error", "يجب عليك ربط الحقول");
            reject();
          }
        }
      } else {
        window.notifySystem("error", "يجب عليك إضافة البيانات");
        reject();
      }
    });
  },
  sections: {
    locationData: {
      label: "رفع بيانات المواقع",
      className: "radio_det",
      fields: {
        layerName: {
          label: "الطبقة",
          placeholder: "من فضلك اختر اسم الطبقة",
          type: "input",
          field: "select",
          name: "layerName",
          data: Object.keys(addFeaturesMapLayers).map((layer) => {
            return {
              ...addFeaturesMapLayers[layer],
              value: layer,
              layerName: addFeaturesMapLayers[layer].label,
            };
          }),
          required: true,
          selectChange: (val, rec, props) => {
            if (
              props?.mainObject?.locationData?.locationData?.layerName != val
            ) {
              if (rec?.type == "point") {
                props.setSelector("uploadFileType", {
                  data: [
                    { label: "CAD File", value: "cad" },
                    { label: "Excel File", value: "excel" },
                    { label: "KMZ or KML", value: "kml" },
                    { label: "Shape File", value: "shape" },
                    { label: "Google Link", value: "google" },
                  ],
                });
              } else {
                props.setSelector("uploadFileType", {
                  data: [
                    { label: "CAD File", value: "cad" },
                    { label: "Excel File", value: "excel" },
                    { label: "KMZ or KML", value: "kml" },
                    { label: "Shape File", value: "shape" },
                  ],
                });
              }

              props.change("locationData.uploadFileType", "");
            }

            props.change("locationData.annotationTable", {
              layerName: props.values
                ? props.values.layerName
                : props?.mainObject?.locationData?.locationData?.layerName,
              checkGoogleLink: true,
              clearAll:
                props?.mainObject?.locationData?.locationData?.layerName != val
                  ? true
                  : false,
            });

            if (props?.mainObject?.locationData?.locationData?.layerName != val)
              props.change("locationData.image_uploader", "");
          },
        },
        uploadFileType: {
          label: "اختر طريقة رفع بيانات الموقع",
          placeholder: "من فضلك اختر طريقة رفع بيانات الموقع",
          type: "input",
          field: "select",
          name: "uploadFileType",
          moduleName: "uploadFileType",
          data: [
            { label: "CAD File", value: "cad" },
            { label: "Excel File", value: "excel" },
            { label: "Google Link", value: "google" },
            { label: "KMZ or KML", value: "kml" },
            { label: "Shape File", value: "shape" },
          ],
          selectChange: (val, rec, props) => {
            if (
              props?.mainObject?.locationData?.locationData?.uploadFileType !=
              val
            )
              props.change("locationData.image_uploader", "");

            if (val == "cad") {
              window.acceptFile = ".dwg";
              if (document.getElementById("file")) {
                document.getElementById("file").accept = ".dwg";
              }
            } else if (val == "excel") {
              window.acceptFile = ".xlsx,.xls";
              if (document.getElementById("file"))
                document.getElementById("file").accept = ".xlsx,.xls";
            } else if (val == "kml") {
              window.acceptFile = ".kmz";
              if (document.getElementById("file"))
                document.getElementById("file").accept = ".kmz";
            } else if (val == "shape") {
              window.acceptFile = ".shx,.shp.xml,.shp,.prj,.dbf,.cpg,.sbn,.sbx";
              if (document.getElementById("file"))
                document.getElementById("file").accept =
                  ".shx,.shp.xml,.shp,.prj,.dbf,.cpg,.sbn,.sbx";
            }

            props.change("locationData.annotationTable", {
              fileType: props.values.uploadFileType,
              layerName: props.values.layerName,
              checkGoogleLink: true,
              clearAll:
                props?.mainObject?.locationData?.locationData?.uploadFileType !=
                val
                  ? true
                  : false,
            });
          },
          required: true,
          permission: {
            show_every: ["layerName"],
          },
        },
        image_uploader: {
          label: "تحميل الملف",
          field: "simpleUploader",
          moduleName: "image_uploader",
          name: "image_uploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: window.acceptFile,
          multiple: false,
          init: () => {
            document.getElementById("file").accept = window.acceptFile;
          },
          permission: {
            hide_if_props_equal_multiple: [
              { key: "values.uploadFileType", value: "google" },
              { key: "values.uploadFileType", value: "shape" },
            ],
            show_every: ["uploadFileType"],
          },
          required: true,
          postRequest: (uploadedUrl, props) => {
            if (uploadedUrl && props.values) {
              store.dispatch({ type: "Show_Loading_new", loading: true });

              if (props.values.uploadFileType == "excel") {
                /* set up async GET request */
                readExcel(uploadedUrl, (res) => {
                  props.change("locationData.annotationTable", {
                    data: res,
                    justInvoked: true,
                    fileType: props.values.uploadFileType,
                    layerName: props.values.layerName,
                  });
                });
              } else {
                let params, outputName, processingToolUrl;

                if (props.values.uploadFileType == "kml") {
                  params = {
                    KML_File_Name: uploadedUrl,
                  };
                  //outputName = "Output_JSON";
                  processingToolUrl = `${window.restServicesPath.replace(
                    "/Eastern",
                    ""
                  )}/KMLToJSON/GPServer/KMLToJSON`;
                } else if (props.values.uploadFileType == "cad") {
                  params = {
                    CAD_File_Name: uploadedUrl,
                  };
                  processingToolUrl = `${window.restServicesPath.replace(
                    "/Eastern",
                    ""
                  )}/CADToJSON/GPServer/CADToJSON`;
                }

                uploadGISFile(
                  processingToolUrl,
                  params,
                  (data) => {
                    props.change("locationData.annotationTable", {
                      data: data.value,
                      justInvoked: true,
                      fileType: props.values.uploadFileType,
                      layerName: props.values.layerName,
                    });
                    store.dispatch({
                      type: "Show_Loading_new",
                      loading: false,
                    });
                  },
                  outputName
                );
              }
            } else {
              props.change("locationData.annotationTable", {
                clearAll: true,
              });
            }
          },
        },
        shape_uploader: {
          label: "تحميل الملف",
          field: "simpleUploader",
          moduleName: "shape_uploader",
          name: "shape_uploader",
          uploadUrl: `${host}/uploadShpeFiles`,
          fileType: window.acceptFile,
          multiple: true,
          init: () => {
            document.getElementById("file").accept = window.acceptFile;
          },
          permission: {
            show_if_val_equal: { key: "uploadFileType", value: "shape" },
            show_every: ["uploadFileType"],
          },
          required: true,
          postRequest: (uploadedUrl, props) => {
            if (uploadedUrl && props.values) {
              store.dispatch({ type: "Show_Loading_new", loading: true });

              let params, outputName, processingToolUrl;

              params = {
                ShapeFile_Name: uploadedUrl[0], //'SubAttachments/uploadMultifiles/d994c7a9-e085-4633-8d47-0800ac263a84/SDE.Landbase_Parcel_1/SDE.shp',
              };

              processingToolUrl = `${window.restServicesPath.replace(
                "/Eastern",
                ""
              )}/ShapeFileToJSON/GPServer/ShapeFileToJSON`;

              //outputName = "Output_JSON";

              uploadGISFile(
                processingToolUrl,
                params,
                (data) => {
                  if (data.value?.features?.length) {
                    props.change("locationData.annotationTable", {
                      data: data.value,
                      justInvoked: true,
                      fileType: props.values.uploadFileType,
                      layerName: props.values.layerName,
                    });
                  } else {
                    window.notifySystem("error", "الملف لا يحتوي على بيانات");
                  }
                  store.dispatch({
                    type: "Show_Loading_new",
                    loading: false,
                  });
                },
                outputName
              );
            } else {
              props.change("locationData.annotationTable", {
                clearAll: true,
              });
            }
          },
        },
        annotationTable: {
          moduleName: "annotationTable",
          label: "",
          field: "annotationTable",
          permission: {
            show_every: ["uploadFileType"],
          },
        },
      },
    },
  },
};
