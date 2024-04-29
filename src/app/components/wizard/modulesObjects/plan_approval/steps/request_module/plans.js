import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { map, get, assign } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import applyFilters from "main_helpers/functions/filters";
import { withTranslation } from "react-i18next";
import {
  uploadGISFile,
  getInfo,
  queryTask,
  objectPropFreqsInArray,
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
  getFileName,
  checkUploadedLayersFullyContainedByBoundry,
  getMapGraphics,
  decoder,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
import { basicMapOperations } from "main_helpers/variables/mapOperations";
import { checkAppMainLayers } from "app/helpers/errors";
export default {
  label: "المخططات المقترحة",
  className: "moktrr7a",
  preSubmit(values, currentStep, props) {
    const {
      t,
      currentModule: { record },
    } = props;
    return new Promise(function (resolve, reject) {
      var mapObj = getMap();
      // if (props.mainObject &&
      //     ((props.mainObject.authorities_approvals && (props.mainObject.authorities_approvals.using == 'planApproval.RESIDENTIALLBL'))
      //     ||
      //     (props.mainObject.govAuthorities_approvals && props.mainObject.govAuthorities_approvals.using == 'planApproval.GOVRESIDENTIALLBL')
      //     ||
      //     (props.mainObject.authorities_approvals && (props.mainObject.authorities_approvals.using == 'planApproval.INDUSTRIALLBL') && props.mainObject.msa7yData && props.mainObject.msa7yData.cadDetails && props.mainObject.msa7yData.cadDetails.isWithinUrbanBoundry)
      //     ||
      //     (props.mainObject.govAuthorities_approvals && props.mainObject.govAuthorities_approvals.using == 'planApproval.GOVINDUSTRIALLBL' && props.mainObject.msa7yData && props.mainObject.msa7yData.cadDetails && props.mainObject.msa7yData.cadDetails.isWithinUrbanBoundry)

      // )) {
      //     if (!values.plansData.image_uploader1 || !values.plansData.image_uploader2 || !values.plansData.image_uploader3){
      //       window.notifySystem('error', 'cadData:THREEPLANSAREMANDATORY');
      //       return reject();
      //     }
      // }
      // else {
      if (
        values.plansData.image_uploader1 ||
        values.plansData.image_uploader2 ||
        values.plansData.image_uploader3
      ) {
        if (mapObj) {
          if (
            values?.plansData?.planDetails?.uplodedFeatures?.[
              values.plansData.planDetails.selectedCADIndex
            ] &&
            checkUploadedLayersFullyContainedByBoundry(
              values?.plansData?.planDetails?.uplodedFeatures?.[
                values.plansData.planDetails.selectedCADIndex
              ],
              props.mainObject.submission_data.mostafed_data.e3adt_tanzem,
              record?.request_no
            )
          ) {
            if (mapObj) {
              (
                props?.formValues?.plansData || values?.plansData
              ).mapviewer.mapGraphics =
                (window.loadedLayers.length && window.loadedLayers) ||
                (mapObj && getMapGraphics(mapObj)) ||
                [];
              window.loadedLayers = [];
              // (
              //   props.formValues.plansData || values.plansData
              // ).planDetails.uplodedFeatures = [null, null, null];
              // function printResult(result) {
              //   (
              //     props?.formValues?.plansData || values?.plansData
              //   ).planDetails.approved_Image = result.value;

              //   return resolve({ ...props.formValues });
              // }
              // mapSreenShot(mapObj, printResult, false, "plans");
            }
            return resolve(props.formValues || values);
          } else {
            return reject();
          }
        } else {
          return resolve({ ...values });
        }
      } else {
        window.notifySystem("error", t("cadData:INSERTONEPLANATLEAST"));
        return reject();
      }
      //}
    });
  },
  sections: {
    plansData: {
      label: "المخططات المقترحة",
      className: "radio_det plans123Data",
      fields: {
        image_uploader1: {
          label: "المخطط المقترح الأول",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".DWG",
          multiple: false,
          required: true,
          // hideLabel: true,
          deps: ["values.image_uploader2"],
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            console.log(values);
            var isUploader2Set = get(values, "plansData.image_uploader2", "");
            return isUploader2Set != "";
          },
          preRequest: (props) => {},
          postRequest: (uploadedUrl, props) => {
            if (uploadedUrl) {
              store.dispatch({ type: "Show_Loading_new", loading: true });
              uploadGISFile(
                `${window.restServicesPath}/GeoData_SuggestedPlans/GPServer/GeoData_SuggestedPlans`,
                {
                  CAD_File_Name: uploadedUrl,
                },
                (data) => {
                  data.value = decoder(data.value);

                  const {
                    currentModule: { record },
                  } = props;
                  data.value.annotations.forEach((feature) => {
                    feature.shape.spatialReference = new esri.SpatialReference(
                      32639
                    );
                    feature = new esri.geometry.Point(feature);
                  });

                  Object.values(data.value.shapeFeatures).forEach(
                    (features) => {
                      features.forEach((feature) => {
                        feature.spatialReference = new esri.SpatialReference(
                          32639
                        );
                        if (feature.rings) {
                          feature = new esri.geometry.Polygon(feature);
                        } else if (feature.paths) {
                          feature = new esri.geometry.Polyline(feature);
                        }
                      });
                    }
                  );

                  if (
                    checkAppMainLayers(props, data.value, false) &&
                    checkUploadedLayersFullyContainedByBoundry(
                      data.value,
                      props.mainObject.submission_data.mostafed_data
                        .e3adt_tanzem,
                      record?.request_no
                    )
                  ) {
                    props.change("plansData.mapviewer", {
                      ...props.values.mapviewer,
                      mapGraphics: [],
                    });
                    props.change("plansData.planDetails", {
                      perfectCad: data.value,
                      secondCad: null,
                      thirdCad: null,
                      justInvoked: true,
                      hide_details: false,
                    });
                  }
                  store.dispatch({ type: "Show_Loading_new", loading: false });
                }
              );
            } else {
              store.dispatch({ type: "Show_Loading_new", loading: true });
              props.change("plansData.planDetails", {
                perfectCad: null,
                secondCad: null,
                thirdCad: null,
                justInvoked: true,
                hide_details: true,
              });
              store.dispatch({ type: "Show_Loading_new", loading: false });
            }
          },
        },
        image_uploader2: {
          label: "المخطط المقترح الثاني",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".DWG",
          multiple: false,
          // hideLabel: true,
          deps: ["values.image_uploader1", "values.image_uploader3"],
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            console.log(values);
            var isUploader1Set = get(values, "plansData.image_uploader1", "");
            var isUploader3Set = get(values, "plansData.image_uploader3", "");
            return isUploader1Set == "" || isUploader3Set != "";
          },
          preRequest: (props) => {},
          postRequest: (uploadedUrl, props) => {
            if (uploadedUrl) {
              store.dispatch({ type: "Show_Loading_new", loading: true });
              uploadGISFile(
                `${window.restServicesPath}/GeoData_SuggestedPlans/GPServer/GeoData_SuggestedPlans`,
                {
                  CAD_File_Name: uploadedUrl,
                },
                (data) => {
                  data.value = decoder(data.value);
                  const {
                    currentModule: { record },
                  } = props;
                  data.value.annotations.forEach((feature) => {
                    feature.shape.spatialReference = new esri.SpatialReference(
                      32639
                    );
                  });

                  data.value.annotations.forEach((feature) => {
                    feature.shape.spatialReference = new esri.SpatialReference(
                      32639
                    );
                    feature = new esri.geometry.Point(feature);
                  });

                  Object.values(data.value.shapeFeatures).forEach(
                    (features) => {
                      features.forEach((feature) => {
                        feature.spatialReference = new esri.SpatialReference(
                          32639
                        );
                        if (feature.rings) {
                          feature = new esri.geometry.Polygon(feature);
                        } else if (feature.paths) {
                          feature = new esri.geometry.Polyline(feature);
                        }
                      });
                    }
                  );
                  if (
                    checkAppMainLayers(props, data.value, false) &&
                    checkUploadedLayersFullyContainedByBoundry(
                      data.value,
                      props.mainObject.submission_data.mostafed_data
                        .e3adt_tanzem,
                      record?.request_no
                    )
                  ) {
                    const { values } = props;
                    var uplodedFeatures = get(
                      values,
                      "planDetails.uplodedFeatures",
                      undefined
                    );
                    props.change("plansData.mapviewer", {
                      ...props.values.mapviewer,
                      mapGraphics: [],
                    });
                    props.change("plansData.planDetails", {
                      perfectCad: uplodedFeatures?.[0],
                      secondCad: data.value,
                      thirdCad: null,
                      hide_details: false,
                      justInvoked: true,
                    });
                  }
                  store.dispatch({ type: "Show_Loading_new", loading: false });
                }
              );
            } else {
              const values = applyFilters({
                key: "FormValues",
                form: "stepForm",
              });
              store.dispatch({ type: "Show_Loading_new", loading: true });
              props.change("plansData.planDetails", {
                perfectCad:
                  values?.plansData?.planDetails?.uplodedFeatures?.[0],
                secondCad: null,
                thirdCad: null,
                hide_details: false,
                justInvoked: true,
              });
              store.dispatch({ type: "Show_Loading_new", loading: false });
            }
          },
        },
        image_uploader3: {
          label: "المخطط المقترح الثالث",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".DWG",
          multiple: false,
          // hideLabel: true,
          deps: ["values.image_uploader2"],
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            console.log(values);
            var isUploader2Set = get(values, "plansData.image_uploader2", "");
            return isUploader2Set == "";
          },
          preRequest: (props) => {},
          postRequest: (uploadedUrl, props) => {
            if (uploadedUrl) {
              store.dispatch({ type: "Show_Loading_new", loading: true });
              uploadGISFile(
                `${window.restServicesPath}/GeoData_SuggestedPlans/GPServer/GeoData_SuggestedPlans`,
                {
                  CAD_File_Name: uploadedUrl,
                },
                (data) => {
                  data.value = decoder(data.value);
                  const {
                    currentModule: { record },
                  } = props;
                  data.value.annotations.forEach((feature) => {
                    feature.shape.spatialReference = new esri.SpatialReference(
                      32639
                    );
                    feature = new esri.geometry.Point(feature);
                  });

                  Object.values(data.value.shapeFeatures).forEach(
                    (features) => {
                      features.forEach((feature) => {
                        feature.spatialReference = new esri.SpatialReference(
                          32639
                        );
                        if (feature.rings) {
                          feature = new esri.geometry.Polygon(feature);
                        } else if (feature.paths) {
                          feature = new esri.geometry.Polyline(feature);
                        }
                      });
                    }
                  );
                  if (
                    checkAppMainLayers(props, data.value, false) &&
                    checkUploadedLayersFullyContainedByBoundry(
                      data.value,
                      props.mainObject.submission_data.mostafed_data
                        .e3adt_tanzem,
                      record?.request_no
                    )
                  ) {
                    const { values } = props;
                    var uplodedFeatures = get(
                      values,
                      "planDetails.uplodedFeatures",
                      []
                    );
                    props.change("plansData.mapviewer", {
                      ...props.values.mapviewer,
                      mapGraphics: [],
                    });
                    props.change("plansData.planDetails", {
                      perfectCad: uplodedFeatures?.[0],
                      secondCad: uplodedFeatures?.[1],
                      thirdCad: data.value,
                      justInvoked: true,
                      hide_details: false,
                    });
                  }
                  store.dispatch({ type: "Show_Loading_new", loading: false });
                }
              );
            } else {
              store.dispatch({ type: "Show_Loading_new", loading: true });
              const values = applyFilters({
                key: "FormValues",
                form: "stepForm",
              });

              props.change("plansData.planDetails", {
                perfectCad:
                  values?.plansData?.planDetails?.uplodedFeatures?.[0],
                secondCad: values?.plansData?.planDetails?.uplodedFeatures?.[1],
                thirdCad: null,
                justInvoked: true,
                hide_details: false,
              });
              store.dispatch({ type: "Show_Loading_new", loading: false });
            }
          },
        },
        mapviewer: {
          label: "طبقات الخريطة",
          moduleName: "mapviewer",
          field: "msa7yData",
          zoomfactor: 25,
          activeHeight: false,

          cad: {},
          baseMapUrl: window.planMapEditing + "MapServer",
          enableDownloadCad: false,
          className: "moktr7a",
          hideLabel: true,
          ...basicMapOperations,
        },
        planDetails: {
          label: "",
          moduleName: "mapviewer",
          field: "plansData_new",
          isInViewMode: false,
          hideLabel: true,
          forAddingPlans: true,
        },
      },
    },
  },
};
