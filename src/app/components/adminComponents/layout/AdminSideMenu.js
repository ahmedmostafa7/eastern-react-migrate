import React, { useState } from "react";
import { Menu } from "antd";
export default function AdminSideMenu(props) {
  return (
    <Menu
      defaultSelectedKeys={["1"]}
      inlineCollapsed={props.sideOpened}
      mode="inline"
      onSelect={props.passSelectedLink}
    >
      {props.sideLinks.map((link) => (
        <Menu.Item key={link.id}>
          <img
            id="adminSideIcon"
            src={link.icon}
            style={{ width: "35px" }}
            className={
              props.sideOpened
                ? "px-2 img-fluid"
                : "sideImgClose px-2 img-fluid"
            }
          />
          <span className={props.sideOpened ? "" : "sideLabelClose"}>
            {link.name}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );
}
