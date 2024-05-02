import { workFlowUrl } from "imports/config";
import { get, omit, isEmpty } from "lodash";
import applyFilters from "main_helpers/functions/filters";
import { ownerFields } from "./fields";
import { host } from "imports/config";
import { message } from "antd";
import { uuid } from "uuidv4";
import axios from "axios";
import { convertToArabic } from "../../../app/components/inputs/fields/identify/Component/common/common_func";
// import { ownerData } from "../../components/wizard/components/stepContent/sections/sectionTypes/wizardSummery/modules/apps/owner";
export default {
  number: 1,
  label: "Owner Data",
  preSubmit(values, currentStep, props) {
    var ownerValuesObj = get(values, "ownerData.owners", {});
    var ownerMobile = Object.values(ownerValuesObj).map((d) => d.mobile)[0];
    console.log("ov", ownerMobile);
    return new Promise(function (resolve, reject) {
      const { t } = props;

      if (values["ownerData"].owner_type != "2") {
        let owner_d = values["ownerData"].owners;
        let updatedOwners = Object.keys(owner_d)
          .map((d) => {
            let phone;
            if (owner_d[d].phone) {
              if (owner_d[d].phone.startsWith("966")) {
                phone = owner_d[d].phone.replace("966", "");
              } else {
                phone = owner_d[d].phone;
              }

              if (!phone.match(/^\d{9}$/)) {
                window.notifySystem(
                  "error",
                  convertToArabic("يجب التأكد من رقم الهاتف مكون من 9 ارقام")
                );
                return reject();
              }
            }

            let mobile;

            if (owner_d[d].mobile.startsWith("966")) {
              mobile = owner_d[d].mobile.replace("966", "");
            } else {
              mobile = owner_d[d].mobile;
            }

            if (!mobile.match(/^\d{9}$/)) {
              window.notifySystem(
                "error",
                convertToArabic("يجب التأكد من رقم الجوال مكون من 9 ارقام")
              );
              return reject();
            }

            if (!mobile.startsWith("5")) {
              window.notifySystem(
                "error",
                convertToArabic("لا بد أن يبدأ رقم الجوال بالرقم 5")
              );
              return reject();
            }

            return {
              ...owner_d[d],
              phone:
                (owner_d[d].phone &&
                  (owner_d[d].phone.startsWith("966")
                    ? owner_d[d].phone
                    : "966" + owner_d[d].phone)) ||
                "",
              mobile:
                (owner_d[d].mobile &&
                  (owner_d[d].mobile.startsWith("966")
                    ? owner_d[d].mobile
                    : "966" + owner_d[d].mobile)) ||
                "",
              type: values.ownerData.owner_type, //owner_d[d].type ||
            };
          })
          .reduce((a, v) => ({ ...a, [v.main_id]: v }), {});
        // let phone_num=get(owner_d,"")

        values["ownerData"].owners = updatedOwners;
        // if (!formIsValid) {
        //   reject();
        // } else {
      }
      return resolve(values);
      // }
    });
  },
  sections: {
    ownerData: {
      init_data: (values, props) => {
        const user = applyFilters({ path: "user.user.owner_id" });
        // let loginUserId = localStorage.getItem("user").id;
        if (user && !get(props, "mainObject.ownerData.ownerData.owners")) {
          axios.get(`${workFlowUrl}/api/owner/${user}`).then(({ data }) => {
            props.change("ownerData.owners", {
              [data.id]: {
                ...data,
                main_id: data.id,
              },
            });
          });
        }
      },
      label: "Owner Data",
      type: "inputs",

      fields: {
        owner_type: {
          className: "owner_types",
          field: "radio",
          initValue: "1",
          hideLabel: true,
          label: "owner type",
          options: {
            person: {
              label: "Person",
              value: "1",
            },
            org: {
              label: "Organization",
              value: "2",
            },
            special: {
              label: "Special",
              value: "3",
            },
            others: {
              label: "Others",
              value: "4",
            },
          },
          //onChange(value, option, values, props) {},
          onClick: (evt, props) => {
            if (
              (["1", "3", "4"].indexOf(props.input.value) != -1 &&
                evt.target.value == "2") ||
              (props.input.value == "2" &&
                ["1", "3", "4"].indexOf(evt.target.value) != -1)
            ) {
              props.change("ownerData", {});
            }
            props.input.onChange(evt.target.value);
          },
        },
        add_owner: {
          permission: {
            show_match_value: { owner_type: ["1", "3"] },
          },
          field: "button",
          hideLabel: true,
          // className:'btn',
          text: "اضافة",
          // permission: {
          //   show_every: ["ownerData.owner_type"],
          // },
          changeText: true,
          action: {
            type: "custom",
            action(props, stepItem) {
              const fields = get(
                ownerFields,
                stepItem?.owner_type || stepItem?.["ownerData"]?.owner_type,
                {}
              );
              props.setMain("Popup", {
                popup: {
                  type: "create",
                  childProps: {
                    fields,
                    //initialValues: d,
                    ok(values) {
                      let mobile = values.mobile.replace("966", "");
                      if (!mobile.startsWith("5")) {
                        window.notifySystem(
                          "error",
                          convertToArabic("لا بد أن يبدأ رقم الجوال بالرقم 5")
                        );
                        return Promise.reject();
                      }
                      const id = values.id || uuid();
                      props.change("ownerData.owners", {
                        ...(stepItem.owners || stepItem?.["ownerData"]?.owners),
                        [id]: {
                          ...values,
                          phone:
                            values.phone && values.phone.includes("966")
                              ? values.phone
                              : "966" + values.phone,
                          mobile:
                            values.mobile && values.mobile.includes("966")
                              ? values.mobile
                              : "966" + values.mobile,
                          type:
                            stepItem.owner_type ||
                            stepItem?.["ownerData"]?.owner_type,
                          main_id: id,
                        },
                      });
                      return Promise.resolve(true);
                    },
                  },
                },
              });
            },
          },
        },
        // owner: {
        //   field: "search",
        //   search_match: "eq",
        //   label: "search",
        //   placeholder: "البحث برقم الهوية أو كود الجهة أو رقم السجل التجاري",
        //   owner: true,
        //   deps: ["values.owner_type", "values.owners"],
        //   min: 7,
        //   url: `${workFlowUrl}/owners/search`,
        //   filter_key: "q",
        //   label_key: "ssn",
        //   label_value: "ssn",
        //   params: {
        //     owner_type: "owner_type",
        //   },
        //   onSelect(value, option, values, props) {
        //     const owners = values.owners || {};
        //     props.change("ownerData.owners", {
        //       ...owners,
        //       [option.id]: { ...option, main_id: option.id },
        //     });
        //   },
        // },
        owner_ssn: {
          field: "search",
          search_match: "eq",
          label: "Search with id",
          deps: ["values.owner_type", "values.owners"],
          placeholder: "البحث برقم الهوية أو كود الجهة أو رقم السجل التجاري",
          min: 7,
          url: `${workFlowUrl}/owners/search`,
          filter_key: "q",
          label_key: "ssn",
          label_value: "ssn",
          params: {
            owner_type: "owner_type",
          },
          onSelect(value, option, values, props) {
            const owners = values.owners || {};
            props.change("ownerData.owners", {
              ...owners,
              [option.id]: { ...option, main_id: option.id },
            });
          },
          permission: {
            show_match_value: { owner_type: "1" },
          },
        },
        entity_id: {
          showSearch: true,
          moduleName: "entity_id",
          label: "اسم الجهة",
          placeholder: "من فضلك اسم الجهة",
          field: "select",
          label_key: "name",
          value_key: "id",
          api_config: { params: { pageIndex: 1, pageSize: 1000 } },
          fetch: `${workFlowUrl}/api/entity`,
          required: true,
          selectChange: (val, rec, props) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            if (rec) {
              values.ownerData["entity"] = rec;
              values.ownerData["entity_type_id"] = rec.entity_type_id || 1;
            }
          },
          permission: {
            show_match_value: { owner_type: "2" },
          },
        },
        entity_type_id: {
          moduleName: "entity_type_id",
          label: "نوع الجهة",
          required: true,
          field: "radio",
          className: "radio_allotment",
          options: [
            { label: "حكومي", value: 1 },
            { label: "مركز أهلي", value: 2 },
            { label: "جمعيات خيرية", value: 3 },
          ],
          initValue: 1,
          permission: {
            show_match_value: { owner_type: "2" },
          },
        },
        // owner_code_registration: {
        //   field: "search",
        //   search_match: "eq",
        //   label: "Search with id",
        //   deps: ["values.owner_type", "values.owners"],
        //   placeholder: "البحث برقم الهوية أو كود الجهة أو رقم السجل التجاري",
        //   min: 7,
        //   url: `${workFlowUrl}/owners/search`,
        //   filter_key: "q",
        //   label_key: "code_registeration",
        //   label_value: "code_registeration",
        //   params: {
        //     owner_type: "owner_type",
        //   },
        //   onSelect(value, option, values, props) {
        //     const owners = values.owners || {};
        //     props.change("ownerData.owners", {
        //       ...owners,
        //       [option.id]: { ...option, main_id: option.id },
        //     });
        //   },
        //   permission: {
        //     show_match_value: { owner_type: "2" },
        //   },
        // },
        owner_commercial_registration: {
          field: "search",
          search_match: "eq",
          label: "Search with id",
          deps: ["values.owner_type", "values.owners"],
          placeholder: "البحث برقم الهوية أو كود الجهة أو رقم السجل التجاري",
          min: 7,
          url: `${workFlowUrl}/owners/search`,
          filter_key: "q",
          label_key: "commercial_registeration",
          label_value: "commercial_registeration",
          params: {
            owner_type: "owner_type",
          },
          onSelect(value, option, values, props) {
            const owners = values.owners || {};
            props.change("ownerData.owners", {
              ...owners,
              [option.id]: { ...option, main_id: option.id },
            });
          },
          permission: {
            show_match_value: { owner_type: "3" },
          },
        },
        owners: {
          label: "Owners",
          className: "owner_label",
          field: "list",
          fields: {
            name: { head: "Name" },
            address: { head: "Address" },
            actions: {
              type: "actions",
              head: "",
              actions: {
                edit: {
                  action(props, d, stepItem) {
                    if (/^(00966|966|\+966)([0-9]{9})$/.test(d.phone)) {
                      //
                      d.phone = d.phone.replace(/00966|966|\+966/, "");
                    }
                    if (/^(00966|966|\+966)([0-9]{9})$/.test(d.mobile)) {
                      //
                      d.mobile = d.mobile.replace(/00966|966|\+966/, "");
                    }

                    const fields = get(
                      ownerFields,
                      //d.type ||
                      (d.ssn && 1) ||
                        (d.code_regesteration && 2) ||
                        (d.commercial_registeration && 3) ||
                        4,
                      {}
                    );
                    //
                    props.setMain("Popup", {
                      popup: {
                        type: "create",
                        childProps: {
                          fields,
                          initialValues: d,
                          // filter: {edit: true},
                          ok(values) {
                            let mobile = values.mobile.replace("966", "");
                            if (!mobile.startsWith("5")) {
                              window.notifySystem(
                                "error",
                                convertToArabic(
                                  "لا بد أن يبدأ رقم الجوال بالرقم 5"
                                )
                              );
                              return Promise.reject();
                            }
                            const id = values.main_id || values.id || uuid();
                            let owners =
                              props.mainValues ||
                              stepItem.ownerData.ownerData.owners ||
                              stepItem.owners ||
                              stepItem?.["ownerData"]?.owners ||
                              {};
                            if (id) {
                              Object.keys(owners).forEach((key) => {
                                if (owners[key].main_id == id) {
                                  owners[key] = {
                                    ...values,
                                    phone: values.phone.includes("966")
                                      ? values.phone
                                      : "966" + values.phone,
                                    mobile: values.mobile.includes("966")
                                      ? values.mobile
                                      : "966" + values.mobile,
                                  };
                                }
                              });
                              props.change("ownerData.owners", {
                                ...owners,
                              });
                            } else {
                              props.change("ownerData.owners", {
                                ...owners,
                                [id]: {
                                  ...values,
                                  phone: values.phone.includes("966")
                                    ? values.phone
                                    : "966" + values.phone,
                                  mobile: values.mobile.includes("966")
                                    ? values.mobile
                                    : "966" + values.mobile,
                                },
                              });
                            }
                            return Promise.resolve(true);
                          },
                        },
                      },
                    });
                  },
                  text: "Edit",
                  className: "btn btn-warning",
                  icon: "edit-pen",
                },
                delete: {
                  action(props, d, stepItem) {
                    const user = applyFilters({ path: "user.user.owner_id" });
                    let owners =
                      props.mainValues ||
                      stepItem.ownerData.ownerData.owners ||
                      stepItem.owners ||
                      stepItem?.["ownerData"]?.owners ||
                      {};
                    if (user == (d.main_id || d.id)) {
                      return;
                    }
                    const data = omit(owners, d.main_id || d.id);
                    props.change("ownerData.owners", isEmpty(data) ? "" : data);
                  },
                  text: "Delete",
                  className: " btn btn-danger ",
                },
              },
            },
          },
          required: true,
          permission: {
            show_match_value: { owner_type: ["1", "3", "4"] },
          },
        },
        has_representer: {
          label: "Has Representer",
          field: "boolean",
          // permission: {
          //     show_every: ["ownerData.owners"]
          // }
          permission: {
            show_match_value: { owner_type: ["1", "3", "4"] },
          },
        },
      },
    },
    representerData: {
      label: "Representer Data",
      type: "inputs",
      init_data: (values, props) => {
        const user = applyFilters({ path: "user.user.owner_id" });
        if (user && !get(props, "mainObject.ownerData.representerData.reps")) {
          axios.get(`${workFlowUrl}/api/owner/${user}`).then(({ data }) => {
            props.change("representerData.reps", [data]);
          });
        }
      },
      permission: {
        show_every: ["ownerData.has_representer"],
      },
      fields: {
        add_rep: {
          field: "button",
          hideLabel: true,
          text: "Add Representer",
          action: {
            type: "custom",
            action(props, stepItem) {
              const fields = get(ownerFields, "1", {});
              props.setMain("Popup", {
                popup: {
                  type: "create",
                  childProps: {
                    fields,
                    ok(values) {
                      props.change("representerData.reps", [values]);
                      return Promise.resolve(values);
                    },
                  },
                },
              });
            },
          },
        },
        rep_search: {
          field: "search",
          search_match: "eq",
          label: "Search Representer",
          url: `${workFlowUrl}/owners/search`,
          filter_key: "q",
          min: 7,
          label_key: "ssn",
          label_value: "ssn",
          params: {
            owner_type: "1",
          },
          onSelect(value, option, values, props) {
            // const reps = values.reps || []
            props.change("representerData.reps", [option]);
          },
        },
        reps: {
          label: "Representer Data",
          field: "list",

          fields: {
            name: { head: "Name" },
            address: { head: "Address" },
            actions: {
              type: "actions",
              head: "",
              actions: {
                edit: {
                  text: "Edit",
                  action(props, d) {
                    const fields = get(ownerFields, "1", {});
                    props.setMain("Popup", {
                      popup: {
                        type: "create",
                        childProps: {
                          fields,
                          initialValues: d,
                          // filter: {edit: true},
                          ok(values) {
                            props.change("representerData.reps", [values]);
                            return Promise.resolve(true);
                          },
                        },
                      },
                    });
                  },
                  icon: "edit-pen",
                  className: "btn btn-warning",
                  onOk: {
                    action: "add",
                  },
                },
                delete: {
                  text: "Delete",
                  className: " btn btn-danger ",
                  icon: "delete",
                  action(props, d, stepItem) {
                    props.change("representerData.reps", []);
                  },
                },
              },
            },
          },
          required: true,
        },
      },
    },
    representData: {
      label: "Represent Data",
      type: "inputs",
      permission: {
        show_every: ["ownerData.has_representer"],
      },
      fields: {
        image: {
          label: "Represent Sak Image",
          // hideLabel: true,
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
          maxNumOfFiles: 1,
        },
        sak_number: {
          label: "Represent Sak Number",
          placeholder: "من فضلك ادخل رقم صك الوكالة",
          maxLength: 10,
          required: true,
        },
        sak_date: {
          label: "Represent Sak Date",
          placeholder: "من فضلك ادخل تاريخ الإصدار",
          field: "hijriDatePicker",
          lessThanToday: true,
          required: true,
        },
        issuer: {
          label: "Issuer",
          placeholder: "من فضلك اختر جهة الإصدار",
          field: "search",
          url: `${workFlowUrl}/courts/searchname/procurationcredence`,
          saveTo: "issuerData",
          label_key: "name",
          required: true,
          filter_key: "q",
        },
        note: {
          label: "Notes",
          placeholder: "من فضلك ادخل هنا ملاحظات صك الوكالة",
          field: "textArea",
        },
      },
    },
  },
};
