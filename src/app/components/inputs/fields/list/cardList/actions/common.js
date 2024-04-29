import React from 'react';
import { Popconfirm } from 'antd';
export const mainStyle = ({ t, ...props }) => (
    <a onClick={props.clickAction}>
        <span className="icon-color remark-icons" style={{fontSize:'17px'}}><i className={props.icon} aria-hidden="true"></i>
        </span>
    </a>)

export const confirmAction = ({ t, ...props }) => (
    <Popconfirm title={t(`actions:${props.msg}`)} placement='bottom' onConfirm={props.clickAction} okText={t("actions:Submit")} cancelText={t("actions:Cancel")}>
        <a>
            <span className="icon-color remark-icons" style={{fontSize:'17px'}}><i className={props.icon} aria-hidden="true"></i></span>
        </a>
    </Popconfirm>)