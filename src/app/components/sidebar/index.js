import React, { Component } from "react";
import { Menu, Layout } from "antd";
import { withTranslation } from "react-i18next";
import { withRouter } from "apps/routing/withRouter";
import { get, map, sortBy, reverse } from "lodash";
import Icon from "app/components/icon";
import memoize from "memoize-one";
import style from "./style.less";
const { Sider } = Layout;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    const { sortBy: sorter, items } = props;

    this.items = sortBy(
      map(items, (value, key) => ({ ...value, key })),
      sorter
    );
    this.state = {
      collapsed: false,
    };
  }

  getCurrentItemWithRoute = memoize((pathname) => {
    const { onItemChange } = this.props;
    const sortedItems = reverse(
      sortBy(this.items, (item) => get(item, "url.length"))
    );
    const foundApp = get(
      sortedItems.find((item) => pathname.includes(item.url)),
      "key"
    );
    if (foundApp) {
      onItemChange(foundApp);
      return foundApp;
    }
  });

  toggleCollapsed() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  navigateTo(url) {
    const { history, baseUrl = "", items } = this.props;
    if (get(items, [this.currentItem, "url"]) != url) {
      history.push(`${baseUrl}/${url}`);
      this.setState({ ...this.state, url }); //just to force rerender
    }
  }

  changeItem(item) {
    const { withRoute, onItemChange } = this.props;
    if (withRoute) {
      this.navigateTo(item.url);
    } else {
      if (item.key != this.state.currentItem) {
        onItemChange(item.key);
        this.setState({ ...this.state, currentItem: item.key });
      }
    }
  }

  render() {
    let { t, history, withRoute } = this.props;
    this.currentItem = withRoute
      ? this.getCurrentItemWithRoute(history.location.pathname)
      : this.state.currentItem;
    if (!this.currentItem) {
      this.changeItem.call(this, get(this.items, "[0]"));
    }
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        trigger={null}
        style={{ width: "256px" }}
      >
        <Menu theme="dark" mode="inline" selectedKeys={[this.currentItem]}>
          {map(this.items, (item) => {
            const { key, icon, label } = item;
            return (
              <Menu.Item key={key} onClick={this.changeItem.bind(this, item)}>
                <Icon icon={icon} />
                <span>{" " + t(label || key) + " "} </span>
              </Menu.Item>
            );
          })}
        </Menu>
        <Icon
          onClick={this.toggleCollapsed.bind(this)}
          className={style.collapseIcon}
          icon={this.state.collapsed ? "menu-fold" : "menu-unfold"}
        />
      </Sider>
    );
  }
}
export default withRouter(withTranslation("labels")(Sidebar));
