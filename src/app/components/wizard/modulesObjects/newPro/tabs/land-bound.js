import { workFlowUrl, host } from "imports/config";
import { fetchData } from "app/helpers/apiMethods";
import { map, get, isEmpty } from "lodash";
import { postItem, updateItem } from "app/helpers/apiMethods";
import { printHost } from "imports/config";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
export default {
  label: "حدود الأرض",
  preSubmit(values, currentStep, props) {
    //return values
    console.log(values);
    return new Promise(function (resolve, reject) {
      if (
        (props?.formValues?.bound || values?.bound).parcels_bounds.polygons
          .filter((polygon) => {
            return (
              polygon?.layerName &&
              polygon?.layerName?.toLowerCase() != "plus"?.toLowerCase() &&
              polygon?.layerName?.toLowerCase() != "notPlus"?.toLowerCase()
            );
          })
          .find((polygon) => {
            return (
              isEmpty(polygon?.north) ||
              isEmpty(polygon?.west) ||
              isEmpty(polygon?.south) ||
              isEmpty(polygon?.east)
            );
          }) != undefined
      ) {
        message.error("من فضلك قم بإدخال أطوال الحدود بالحروف");
        // throw "error in land selection"
        return reject();
      }
      return resolve(props.formValues || values);
    });
  },
  sections: {
    bound: {
      label: "أطوال حدود الأرض",
      init_data: (values, props, fields) => {
        const { mainObject, change } = props;
        const formValues = applyFilters({
          key: "FormValues",
          form: "stepForm",
        });

        if (!formValues?.bound) {
          setTimeout(() => {
            change("bound.parcels_bounds", {
              polygons: [
                ...(mainObject?.suggestParcel?.suggestParcel.suggestParcels?.polygons.find(
                  (p) => {
                    return (
                      (p.polygon && p.polygon.layer == "full_boundry") ||
                      (p.layerName && p.layerName == "full_boundry")
                    );
                  }
                ) ||
                  mainObject?.suggestParcel?.suggestParcel.suggestParcels?.polygons.filter(
                    (p) => {
                      return (
                        (p.polygon && p.polygon.layer == "boundry") ||
                        (p.layerName && p.layerName == "boundry")
                      );
                    }
                  )),
              ],
            });
          }, 300);
        } else if (formValues?.bound && !formValues?.bound?.parcels_bounds) {
          let polygons = [
            ...(mainObject?.suggestParcel?.suggestParcel.suggestParcels?.polygons.find(
              (p) => {
                return (
                  (p.polygon && p.polygon.layer == "full_boundry") ||
                  (p.layerName && p.layerName == "full_boundry")
                );
              }
            ) ||
              mainObject?.suggestParcel?.suggestParcel.suggestParcels?.polygons.filter(
                (p) => {
                  return (
                    (p.polygon && p.polygon.layer == "boundry") ||
                    (p.layerName && p.layerName == "boundry")
                  );
                }
              )),
          ];
          if (formValues?.bound?.north && polygons) {
            polygons[0].north = formValues?.bound?.north;
          }
          if (formValues?.bound?.south && polygons) {
            polygons[0].south = formValues?.bound?.south;
          }
          if (formValues?.bound?.east && polygons) {
            polygons[0].east = formValues?.bound?.east;
          }
          if (formValues?.bound?.west && polygons) {
            polygons[0].west = formValues?.bound?.west_text;
          }

          setTimeout(() => {
            change("bound.parcels_bounds", {
              polygons: polygons,
            });
          }, 300);
        }
      },
      fields: {
        parcels_bounds: {
          label: "أطوال حدود الأرض",
          field: "SuggestParcel",
          className: "land_data",
          boundsOnly: true,
          moduleName: "parcels_bounds",
          boundsFields: {
            north: [
              {
                name: "north_Desc",
                type: "text",
                placeholder: "وصف الحد الشمالي",
                disabled: true,
              },
              {
                name: "north",
                type: "text",
                placeholder: "طول الحد الشمالي بالحروف",
              },
            ],
            south: [
              {
                name: "south_Desc",
                type: "text",
                placeholder: "وصف الحد الجنوبي",
                disabled: true,
              },
              {
                name: "south",
                type: "text",
                placeholder: "طول الحد الجنوبي بالحروف",
              },
            ],
            west: [
              {
                name: "weast_Desc",
                type: "text",
                placeholder: "وصف الحد الغربي",
                disabled: true,
              },
              {
                name: "west",
                type: "text",
                placeholder: "طول الحد الغربي بالحروف",
              },
            ],
            east: [
              {
                name: "east_Desc",
                type: "text",
                placeholder: "وصف الحد الشرقي",
                disabled: true,
              },
              {
                name: "east",
                type: "text",
                placeholder: "طول الحد الشرقي بالحروف",
              },
            ],
          },
        },
        // north_bound: {
        //   label: "طول الحد الشمالي (م)",
        //   // hideLabel: true,
        //   field: "calculator",
        //   func: "get_bounds",
        //   deps: "north",
        // },

        // north: {
        //   label: "طول الحد الشمالي بالحروف",
        //   required: true,
        // },

        // south_bound: {
        //   label: "طول الحد الجنوبي (م)",
        //   // hideLabel: true,
        //   field: "calculator",
        //   func: "get_bounds",
        //   deps: "south",
        // },

        // south: {
        //   label: "طول الحد الجنوبي بالحروف",
        //   required: true,
        // },

        // east_bound: {
        //   label: "طول الحد الشرقي (م)",
        //   // hideLabel: true,
        //   field: "calculator",
        //   func: "get_bounds",
        //   deps: "east",
        // },

        // east: {
        //   label: "طول الحد الشرقي بالحروف",
        //   required: true,
        // },

        // west: {
        //   label: "طول الحد الغربي (م)",
        //   // hideLabel: true,
        //   field: "calculator",
        //   func: "get_bounds",
        //   deps: "weast",
        //   // values: "west_gela",
        // },

        // west_text: {
        //   label: "طول الحد الغربي بالحروف",
        //   required: true,
        // },
      },
    },
  },
};
