import React from "react";
import { Tooltip, Popconfirm, Divider } from "antd";

export const mainStyle = ({ t, ...props }) => (
  <span>
    <Tooltip placement="bottom" title={t(`actions:${props.name}`)}>
      <a onClick={props.clickAction}>
        <span>
          <i className={props.icon} aria-hidden="true"></i>
        </span>
      </a>
    </Tooltip>
    <Divider type="vertical" />
  </span>
);

export const confirmAction = ({ t, ...props }) => (
  <Popconfirm
    title={t(`actions:${props.msg}`)}
    placement="top"
    onConfirm={props.clickAction}
    okText={t("actions:Yes")}
    cancelText={t("actions:No")}
  >
    <Tooltip placement="bottom" title={t(`actions:${props.name}`)}>
      <a>
        <span>
          <i className={props.icon} aria-hidden="true"></i>
        </span>
      </a>
    </Tooltip>
    <Divider type="vertical" />
  </Popconfirm>
);
