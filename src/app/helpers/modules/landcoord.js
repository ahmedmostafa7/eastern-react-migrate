import { message } from "antd";
import { host } from "imports/config";
import { isEmpty } from "lodash";
import { getMap } from "main_helpers/functions/filters/state";
import {
  mapSreenShot,
  convertToEnglish,
  getMapGraphics,
} from "../../../app/components/inputs/fields/identify/Component/common/common_func";

export default {
  number: 2,
  label: "Land Data",
  preSubmit(values, currentStep, props) {
    //return values
    const { t } = props;
    return new Promise(function (resolve, reject) {
      console.log(values);
      console.log(props);
      console.log(
        props.mainObject.serviceSubmissionType.submission.utilitytype_id == 4
      );

      console.log(
        props.mainObject.serviceSubmissionType.submission.utilitytype_id
      );
      if (!values.landData || !values.landData.lands) {
        message.error("من فضلك قم بأختيار الأرض");
        reject();
      } else {
        var parcelCount = values?.landData?.lands?.parcels?.length;
        values.landData.area = 0;
        var invalid = false;
        values?.landData?.lands?.parcels?.forEach(function (val, key) {
          if (val.attributes.PARCEL_AREA) {
            values.landData.area += parseFloat(
              convertToEnglish(val.attributes.PARCEL_AREA)
            );
          } else {
            invalid = true;
          }
        });

        if (invalid) {
          window.notifySystem("error", t("messages:ParcelArea"));
          return reject();
        }

        if (parcelCount > 0 && isEmpty(values.landData.lands.parcelData)) {
          window.notifySystem(
            "error",
            t("messages:PARCELDESCRIPTIONANDBOUNDARIES")
          );
          return reject();
        }

        if (
          !window.Supporting ||
          (window.Supporting && !window.Supporting?.residentialLands)
        ) {
          if (parcelCount > 1) {
            if (
              values?.landData?.lands?.parcels?.filter((parcel) => {
                return (
                  [20, 50].indexOf(parcel.attributes.PARCEL_MAIN_LUSE_Code) !=
                  -1
                );
              }).length < 1 &&
              !(
                props.mainObject.serviceSubmissionType &&
                props.mainObject.serviceSubmissionType.submission
                  .utilitytype_id == 4
              )
            ) {
              message.error(
                "لا يمكن انشاء معاملة على هذه الأراضي . يرجي اختيار احد الأراضي تجارية"
              );
              return reject();
            } else {
              delete values.landData.lands.temp.map;
            }
          } else {
            if (
              values?.landData?.lands?.parcels?.filter((parcel) => {
                return (
                  [20, 50].indexOf(parcel.attributes.PARCEL_MAIN_LUSE_Code) !=
                  -1
                );
              }).length == 1 ||
              (values?.landData?.lands?.parcels &&
                !values?.landData?.lands?.parcels[0]?.attributes
                  ?.PARCEL_SPATIAL_ID) ||
              (props.mainObject?.serviceSubmissionType &&
                props.mainObject?.serviceSubmissionType?.submission
                  .utilitytype_id == 4)
            ) {
              delete values.landData.lands.temp.map;
            } else {
              message.error(
                "لا يمكن انشاء معاملة على هذه الأرض . يرجي اختيار احد الأراضي التجارية"
              );
              return reject();
            }
          }
        }

        let mapObj = getMap();
        if (mapObj) {
          values.landData.lands.mapGraphics =
            (mapObj && getMapGraphics(mapObj)) || [];
          mapSreenShot(
            mapObj,
            (result) => {
              values.landData.lands.screenshotURL = result.value;
              values.landData.previous_Image = result.value;

              return resolve(values);
            },
            () => {
              window.notifySystem("error", t("Failed to update"));
            },
            false,
            "landData"
          );
        } else {
          return resolve(values);
        }
      }
    });
  },
  //description: 'this is the Second Step description',
  sections: {
    landData: {
      label: "Land Data",
      type: "inputs",
      required: true,
      fields: {
        type: {
          hideLabel: true,
          name: "ParcelChooseType",
          field: "radio",
          initValue: 1,
          options: [
            {
              label: "بيانات الأرض",
              value: 1,
            },
            {
              label: "الأحداثيات",
              value: 2,
            },
          ],
          onClick: (evt, props) => {
            props.input.onChange(evt.target.value);
            props.change("landData.lands", {
              isReset: true,
              value: evt.target.value,
            });
          },
        },
        lands: {
          hideLabel: true,
          field: "IdentifyCoord",
          className: "land_data",
          deps: ["values.ParcelChooseType"],
        },
        /*parcelImage: {
          label: 'صورة للأرض',
          field: 'simpleUploader',
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: 'image/*,.pdf',
          required: true,
          permission:{ show_match_value: { ParcelChooseType: 1 }}
        },*/
        /*krokyParcelImage: {
          label: 'صورة كروكي للأرض',
          field: 'simpleUploader',
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: 'image/*,.pdf',
          required: true,
          permission:{ show_match_value: { ParcelChooseType: 2 }}
        },
        photoParcelImage: {
          label: 'صورة فوتوغرافية للأرض',
          field: 'simpleUploader',
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: 'image/*,.pdf',
          required: true,
          permission:{ show_match_value: { ParcelChooseType: 2 }}
        },*/
      },
    },
    /*submission_data: {
      label: "بيانات الموقع ( حسب الصك )",
      className: "parcelInfo",
      type: "inputs",
      fields: {
        north_desc: {
            label: "North Description",
            required: true
        },
          north_length: {
              label: "North Length",
              maxLength: 6,
              digits: true,
              required: true
          },

          south_desc: {
            label: "South Description",
            required: true
        },
          south_length: {
              digits: true,
              maxLength: 6,
              label: "South Length",
              required: true
          },

          east_desc: {
            label: "East Description",
            required: true
        },
          east_length: {
              maxLength: 6,
              digits: true,
              label: "East Length",
              required: true
          },
          west_desc: {
            label: "West Description",
            required: true
        },
          west_length: {
              digits: true,
              maxLength: 6,
              label: "West Length",
              required: true
          },
        
      }
    }*/
  },
};
