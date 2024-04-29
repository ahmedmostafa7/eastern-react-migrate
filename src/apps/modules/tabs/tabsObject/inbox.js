import { workFlowUrl } from "imports/config";
import React, { Component } from "react";
import { get } from "lodash";
import { convertToArabic } from "../../../../app/components/inputs/fields/identify/Component/common";
import { Popover, Icon, Modal } from "antd";
import { checkTabsColumnsByAppId } from "../tableActionFunctions";
const fieldsWithCount = (appId) => {
  return [
    {
      label: "Request number",
      name: "request_no",
      sorter: "sortReqNum",
      field: "text",
    },
    {
      label: "Create date",
      name: "create_date",
      sorter: "sortDate",
      field: "textDate",
    },
    {
      label: "Committee report number",
      name: (appId == 16 && "request_no") || "committee_report_no",
      // field: "custom",
      // fun(val, record) {
      //
      //   if (appId == 16 && record.currentStep.index > 20) {
      //     return get(record, "request_no");
      //   }
      //   return get(record, "committee_report_no", val);
      // },
      sorter: "sortReqNum",
      visible: (rec) => {
        return appId == 16 ? false : true;
      },
    },
    {
      label: "Export number",
      name: "export_no",
      sorter: "sortNum",
    },
    {
      label: "Creator name",
      name: "CreatorUser.name",
      field: "custom",
      fun(val, record) {
        if (!get(record, "CreatorUser")) {
          return get(record, "owner_name");
        }
        return get(record, "CreatorUser.engineering_companies.name", val);
      },
      sorter: "sortName",
    },
    {
      label: "التكرار",
      name: "history_count",
      field: "custom",
      fun(val, record) {
        if (!get(record, "history_count")) {
          return "";
        }

        return (
          <Popover
            placement={"top"}
            content={<>{convertToArabic(get(record, "referer_user"))}</>}
            trigger="hover"
          >
            {convertToArabic(get(record, "history_count", val))}
          </Popover>
        );
      },
      sorter: "sortName",
    },
    {
      label: (appId == 26 && "Department Name") || "Owner name",
      name: (appId == 26 && "CreatorUser.departments.name") || "owner_name",
      sorter: "sortName",
    },
    {
      label: "Step name",
      name: "CurrentStep.name",
      sorter: "sortName",
      filtering: true,
    },
    {
      label: "Type",
      placeholder: "Type",
      name: "workflows",
      field: "select",
      moduleName: "workflows",
      show: "workflows",
      //fetch: `${workFlowUrl}/workflow/GetCreatedStepInWorkFlow/${appId}`,
      fetch: `${workFlowUrl}/workFlow/GetCreatedStepInWorkFlow/${appId}`,
      value_key: "id",
      label_key: "name",
    },
  ];
};
const fieldsWithoutCounts = (appId) => {
  return [
    {
      label: "Request number",
      name: "request_no",
      sorter: "sortReqNum",
      field: "text",
    },
    {
      label: "Create date",
      name: "create_date",
      sorter: "sortDate",
      field: "textDate",
    },
    {
      label: "Committee report number",
      name: (appId == 16 && "request_no") || "committee_report_no",
      // field: "custom",
      // fun(val, record) {
      //
      //   if (appId == 16 && record.currentStep.index > 20) {
      //     return get(record, "request_no");
      //   }
      //   return get(record, "committee_report_no", val);
      // },
      sorter: "sortReqNum",
      visible: (rec) => {
        return appId == 16 ? false : true;
      },
    },
    {
      label: "Export number",
      name: "export_no",
      sorter: "sortNum",
    },
    {
      label: "Creator name",
      name: "CreatorUser.name",
      field: "custom",
      fun(val, record) {
        if (!get(record, "CreatorUser")) {
          return get(record, "owner_name");
        }
        return get(record, "CreatorUser.engineering_companies.name", val);
      },
      sorter: "sortName",
    },
    {
      label: (appId == 26 && "Department Name") || "Owner name",
      name: (appId == 26 && "CreatorUser.departments.name") || "owner_name",
      sorter: "sortName",
    },
    {
      label: "Step name",
      name: "CurrentStep.name",
      sorter: "sortName",
      filtering: true,
    },
    {
      label: "Type",
      placeholder: "Type",
      name: "workflows",
      field: "select",
      moduleName: "workflows",
      show: "workflows",
      //fetch: `${workFlowUrl}/workflow/GetCreatedStepInWorkFlow/${appId}`,
      fetch: `${workFlowUrl}/workFlow/GetCreatedStepInWorkFlow/${appId}`,
      value_key: "id",
      label_key: "name",
    },
  ];
};
export const RUNNING_SUBMISSIONS = ({ id: appId }) => ({
  number: 1,
  label: "Inbox",
  name: "inbox",
  moduleName: "RUNNING_SUBMISSIONS",
  apiUrl: `/submission/GetRunningSubmissions/false/${appId}${
    (appId == 29 && "?pageSize=18") || ""
  }`,
  content: {
    type: "tabsTable",
    searchWith: ["request_no"],
    filters: ["workflows", "CurrentStep.name"],
    // main_filters: {
    //     step: {
    //         label: 'Current Step',
    //         name: 'CurrentStep.name'
    //     }
    // },
    views: [
      "request_no",
      "committee_report_no",
      "export_no",
      "CreatorUser.name",
      "history_count",
      "create_date",
      "owner_name",
      "CurrentStep.name",
      "CreatorUser.departments.name",
    ],
    id: ["id"],
    actions: "common",
    fields: checkTabsColumnsByAppId(
      appId,
      appId == 16
        ? [...fieldsWithCount(appId)]
        : [...fieldsWithoutCounts(appId)]
    ),
  },
  icon: "images/inbox.svg",
});
