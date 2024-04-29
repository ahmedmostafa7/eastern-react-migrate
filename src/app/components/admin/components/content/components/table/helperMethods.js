import React from "react";
import { Divider, Tooltip } from "antd";
import Icon from "app/components/icon";
import { apply_permissions } from "app/helpers/functions";
import { map, pick, get, pickBy } from "lodash";
import * as fieldValues from "app/helpers/fieldValues";

export function buildColumns(currentModule, props) {
  const columns = pick(currentModule.fields, currentModule.views);
  const colWidth = 100 / (Object.keys(columns).length + 1) + "%";
  const { t } = props;
  return [
    ...map(columns, (field, key) => ({
      dataIndex: field.show || key,
      title: t("labels:" + field.label),
      key,
      width: colWidth,
      render: (text, item, itemIndex) =>
        tableRenderFunction(field, text, item, props),
    })),
    buildActions(currentModule, colWidth, props),
  ];
}

function tableRenderFunction(field, text, record, props) {
  return get(fieldValues, field.field, (text) => text)(
    text,
    record,
    field,
    props
  );
}
function buildActions(currentModule, colWidth, props) {
  const { t } = props;
  const allActions = {
    edit: {
      label: "Edit",
      icon: "fas fa-edit",
      permissions: get(currentModule, "actions_permissions.edit"),
      function: "updateCurrentItem",
    },
    delete: {
      label: "Delete",
      icon: "fas fa-trash",
      permissions: get(currentModule, "actions_permissions.delete"),
      function: "deleteCurrentItem",
    },
    ...get(currentModule, "actions", {}),
  };
  const actions = {
    title: t("Actions"),
    key: "actions",
    dataIndex: "actions",
    width: colWidth,
    render: (text, item, itemIndex) => {
      const filteredActions = pickBy(allActions, (action, key) =>
        apply_permissions(item, action, "permissions", this.props)
      );
      return (
        <span>
          {map(filteredActions, (action, key) => (
            <span key={key}>
              <Tooltip placement="bottom" title={t(`actions:${action.label}`)}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    get(
                      currentModule.actionFuncs,
                      action.function || key,
                      () => {}
                    )({ item, itemIndex }, action.params, props)
                  }
                >
                  <Icon icon={action.icon} />
                </span>
                {/* </a> */}
              </Tooltip>
              <Divider type="vertical" />
            </span>
          ))}
        </span>
      );
    },
  };
  return actions;
}
