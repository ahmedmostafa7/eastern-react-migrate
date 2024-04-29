import { APPLICATIONS, COMMITTEES, GROUPS } from "../";
import { workFlowUrl } from "configFiles/config";

export const WORKFLOW_TITLE = {
  primaryKey: "id",
  apiUrl: "/WorkFlow",
  label: "Workflows",
  singleLabel: "workflow title",
  icon: "global",
  views: ["name", "no_steps", "app_id", "is_deactivated"],
  show: "name",
  hide_edit: ["no_steps"],
  hide_new: ["no_steps"],
  search_with: ["name"],
  onRowClicked: (record, props) => {
    const { fillSteps, history } = props;
    fillSteps(record.steps);
    history.push(`/administration/work_flow/${record.id}`);
  },
  preSubmit: {
    new: {
      convertBoolToInt: ["validate_identify_parcel", "check_land_contract"],
    },
    edit: {
      convertBoolToInt: ["validate_identify_parcel", "check_land_contract"],
    },
  },
  fields: {
    name: {
      required: true,
      label: "Name",
      uniqueNameWithUrl: {
        url: "/WorkFlow/uniqueName",
        //name_key: 'key',
        value_key: "q",
      },
    },
    app_id: {
      label: "Application",
      field: "select",
      fetch: `${workFlowUrl}${APPLICATIONS.apiUrl}`,
      moduleName: "APPLICATIONS",
      label_key: APPLICATIONS.show,
      value_key: APPLICATIONS.primaryKey,
      api_config: { params: { pageSize: 2000 } },
    },
    // committee_id: {
    //     label: 'Committee',
    //     field: 'select',
    //     fetch: `${workFlowUrl}${COMMITTEES.apiUrl}`,
    //     moduleName: 'COMMITTEES',
    //     label_key: COMMITTEES.show,
    //     value_key: COMMITTEES.primaryKey,
    //     api_config: { params: { pageSize: 2000 } },
    // },
    group_creator: {
      label: "Workflow Principal",
      field: "select",
      fetch: `${workFlowUrl}${GROUPS.apiUrl}`,
      moduleName: "GROUPS",
      label_key: GROUPS.show,
      value_key: GROUPS.primaryKey,
      api_config: { params: { pageSize: 2000 } },
    },
    // print_state: {
    //     label: 'Print File',
    //     field: 'select',
    //     data: [
    //         { label: 'فرز ارض فضاء', value: '#/split_merge/print_parcel/' },
    //         { label: 'فرز دوبلكسات', value: '#/split_merge/print_duplixs/' },
    //         { label: 'فرز وحدات عقارية', value: '#/split_merge/print_appartments/' },
    //     ]
    // },
    is_deactivated: {
      label: "State",
      field: "radio",
      options: [
        { label: "Active", value: false },
        { label: "Not active", value: true },
      ],
    },
    check_land_contract: {
      label: "Issue multiple requests on land",
      field: "boolean",
    },
    validate_identify_parcel: {
      label: "Validate selected lands",
      field: "boolean",
    },
    // translate: {
    //     label: 'Translation file',
    //     // unique: true
    // },
    no_steps: {
      label: "Number of Steps",
      show: "steps.length",
    },
  },
};
