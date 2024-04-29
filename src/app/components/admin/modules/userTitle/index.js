import { workFlowUrl } from "imports/config";
import {
  GROUPS,
  DEPARTMENTS,
  POSITIONS,
  MUNICIPALITIES,
  ENGINEERING_COMPANIES,
  ISSUERS,
} from "../";

export const USER_TITLE = {
  primaryKey: "id",
  apiUrl: "/Users",
  label: "User Titles",
  singleLabel: "user title",
  icon: "global",
  views: ["name", "username", "is_active", "address"],
  hide_new: ["is_active"],
  //hide_edit: ['user_type', 'password', 'confirmPassword', 'is_active'],
  hide_edit: ["password", "confirmPassword", "is_active"],
  search_with: ["name"],
  show: "name",
  deleteMessage: "unable to delete user because he belongs to groups",
  preSubmit: {
    new: {
      addValue: { is_active: 1 },
      addValue: { position_id: 1 },
      convertArrayToObjectArray: { field: "users_groups", key: "group_id" },
      removeValue: ["confirmPassword"],
    },
    edit: {
      convertArrayToObjectArray: { field: "users_groups", key: "group_id" },
      removeValue: ["user_type", "groups", "password"],
      persistValue: ["is_active", "position_id"],
    },
    changePassword: {
      removeValue: "confirmPassword",
    },
  },
  preOpen: {
    edit: {
      convertObjectArrayToArray: { field: "users_groups", key: "group_id" },
      //addValueConditional: { key: "user_type", value: ["province_id", "minicipality_id", "engcompany_id", "issuer_id"] },
    },
  },
  actions: {
    changePassword: {
      label: "Change Password",
      icon: "fa fa-key",
    },
    freeze: {
      label: "Freeze",
      icon: "fa fa-times",
      permissions: {
        show_match_value: { is_active: 1 },
      },
    },
    activate: {
      label: "Activate",
      icon: "fa fa-check",
      permissions: {
        show_match_value: { is_active: [0, null, undefined, false] },
      },
    },
  },
  fields: {
    // user_type: {
    //     label: "User Type",
    //     field: "select",
    //     data: [
    //         { label: 'مستخدم امانة', value: "province_id" },
    //         { label: 'مستخدم بلدية', value: "minicipality_id" },
    //         { label: 'مستخدم مكتب هندسى', value: "engcompany_id" },
    //         { label: 'مستخدم جهة اصدار', value: "issuer_id" },
    //     ],
    //     required: true
    // },
    name: {
      required: true,
      label: "Name",
    },
    username: {
      label: "Username",
      required: true,
      // unique: true,
    },
    password: {
      label: "Password",
      type: "password",
      required: true,
    },
    confirmPassword: {
      label: "Confirm Password",
      type: "password",
      required: true,
      match: "password",
    },
    is_active: {
      label: "Status",
      field: "boolean",
    },
    address: {
      label: "Address",
      required: true,
    },
    phone: {
      label: "Phone Number",
      type: "number",
      required: true,
    },
    mobile: {
      label: "Mobile Number",
      type: "number",
      required: true,
    },
    email: {
      label: "Email Address",
      emailValid: true,
      required: true,
    },
    users_groups: {
      label: "Groups",
      field: "multiSelect",
      label_key: GROUPS.show,
      value_key: GROUPS.primaryKey,
      moduleName: "GROUPS",
      fetch: `${workFlowUrl}${GROUPS.apiUrl}`,
      api_config: { params: { pageSize: 2000 } },
      //required: true
    },
    // province_id: {
    //     label: 'Province',
    //     disabled: true,
    //     field: 'select',
    //     data: [{ label: 'امانة المنطقة الشرقية', value: 2 }],
    //     VALUE: 2,
    //     permission: {
    //         show_match_value: { user_type: 'province_id' }
    //     }
    // },
    // minicipality_id: {
    //     label: 'Municipality',
    //     field: 'select',
    //     fetch: `${workFlowUrl}${MUNICIPALITIES.apiUrl}`,
    //     moduleName: 'MUNICIPALITIES',
    //     label_key: MUNICIPALITIES.show,
    //     value_key: MUNICIPALITIES.primaryKey,
    //     api_config: { params: { pageSize: 2000 } },
    //     permission: {
    //         show_match_value: { user_type: 'minicipality_id' }
    //     }
    // },
    // department_id: {
    //     label: 'Department',
    //     field: 'select',
    //     fetch: `${workFlowUrl}${DEPARTMENTS.apiUrl}`,
    //     moduleName: 'DEPARTMENTS',
    //     label_key: DEPARTMENTS.show,
    //     value_key: DEPARTMENTS.primaryKey,
    //     api_config: { params: { pageSize: 2000 } },
    //     permission: {
    //         show_match_value: {
    //             user_type: ['province_id', 'minicipality_id']
    //         }
    //     }
    // },
    // position_id: {
    //     label: 'Position',
    //     field: 'select',
    //     fetch: `${workFlowUrl}${POSITIONS.apiUrl}`,
    //     moduleName: 'POSITIONS',
    //     label_key: POSITIONS.show,
    //     value_key: POSITIONS.primaryKey,
    //     api_config: { params: { pageSize: 2000 } },
    //     permission: {
    //         show_match_value: {
    //             user_type: ['province_id', 'minicipality_id']
    //         }
    //     }
    // },
    // engcompany_id: {
    //     label: 'Engineering Company',
    //     field: 'select',
    //     fetch: `${workFlowUrl}${ENGINEERING_COMPANIES.apiUrl}`,
    //     moduleName: 'ENGINEERING_COMPANIES',
    //     label_key: ENGINEERING_COMPANIES.show,
    //     value_key: ENGINEERING_COMPANIES.primaryKey,
    //     api_config: { params: { pageSize: 2000 } },
    //     permission: {
    //         show_match_value: { user_type: "engcompany_id" }
    //     }
    // },
    // issuer_id: {
    //     label: 'Issuers',
    //     field: 'select',
    //     fetch: `${workFlowUrl}${ISSUERS.apiUrl}`,
    //     moduleName: 'ISSUERS',
    //     label_key: ISSUERS.show,
    //     value_key: ISSUERS.primaryKey,
    //     api_config: { params: { pageSize: 2000 } },
    //     permission: {
    //         show_match_value: { user_type: "issuer_id" }
    //     }
    // },
  },
};
