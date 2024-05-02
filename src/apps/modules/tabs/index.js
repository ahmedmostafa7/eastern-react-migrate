import { Layout, Tabs, Row, Col, Tooltip } from "antd";
import React, { Component } from "react";
import { get, map, sortBy, head, isEmpty } from "lodash";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { withRouter } from "apps/routing/withRouter";
import * as tabsObject from "./tabsObject";
import axios from "axios";
import * as contents from "./contents";
import * as Modals from "app/components/modals";
import { withTranslation } from "react-i18next";
import Media from "react-media";
import { workFlowUrl, filesHost } from "../../../imports/config";
import {
  localizeNumber,
  convertToEnglish,
  copyUser,
} from "../../../app/components/inputs/fields/identify/Component/common/common_func";
import InvestIndicatorsComponent from "./tabsObject/InvestIndicatorsComponent";
// import FollowingRequests from "./contents/FollowingRequests/following_requests"
// import { FollowingRequests } from "./tabsObject/following_request"
const TabPane = Tabs.TabPane;
const { Content } = Layout;

class tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sideOpened: true,
      sideTopOpened: false,
      count: 0,
      appId: "",
    };
    let app_name_url = window.location.href;
    localStorage.setItem("app_url", app_name_url);

    props.removeCahce(props.currentTab);
  }
  openSideMenu = (e) => {
    this.setState({ sideOpened: true, sideTopOpened: true });
  };
  closeSideMenu = (e) => {
    this.setState({ sideOpened: false, sideTopOpened: false });
  };
  onTabChanged(key) {
    const { setCurrentTab, removeCahce } = this.props;
    setCurrentTab(key);
    removeCahce(key);
    this.setState({ sideOpened: false, sideTopOpened: false });
  }
  componentDidMount() {
    const {
      tabs,
      currentApp,
      setCountTab,
      location,
      match,
      setWorkflows,
      setMo3yna,
    } = this.props;
    let appName = match.params.app;
    localStorage.removeItem("req_no");
    localStorage.removeItem("CurrentStep");
    localStorage.removeItem("workFlowName");
    let SplitappName = "splitandmerge." + appName;

    let userApplications = [
      ...JSON.parse(localStorage.getItem("user")).groups.map((x) =>
        x.groups_permissions.map((f) => f.applications)
      ),
    ];

    let appId = userApplications
      .map((x) => x.map((lk) => lk))
      .map((d) =>
        d.find((x) => x.name.toLowerCase() == SplitappName.toLowerCase())
      )
      .filter((d) => d)
      .map((xx) => xx.id)[0];
    this.setState({ appId });
    window.Supporting = {};
    // currentApp;
    let countUrl = `/submission/counts?appid=${appId}`;
    axios
      .get(workFlowUrl + countUrl)
      .then(({ data }) => {
        this.setState({ count: data });
        setCountTab(data);
      })
      .catch((e) => {});
    setWorkflows([]);
    setMo3yna({});
  }

  //shouldComponentUpdate
  getGE(inboxUrl) {
    axios
      .get(workFlowUrl + inboxUrl)
      .then(({ data }) => {
        this.setState({ count: data.count });
      })
      .catch((e) => {});
    // return this.state.count;
  }
  render() {
    const {
      currentTab = "",
      removeCahce,
      modal = {},
      removeModal,
      t,
      app_name,
      setCurrentApp,
      tabs,
      currentApp,
      setCurrentTab,
      countTabsCount,
      user,
    } = this.props;
    let { count } = this.state;

    let ShowModal = get(Modals, modal.type);

    let tabPanes = map(tabs, (value, key) => {
      return {
        ...get(tabsObject, key, () => {})(
          { ...currentApp, user: copyUser({ user }) } || {}
        ),
        key,
      };
    });
    let countTabs = tabPanes.map((d) => ({
      ...d,
      count: localizeNumber(
        countTabsCount
          ? countTabsCount[d.label] == undefined
            ? ""
            : countTabsCount[d.label]
          : count[d.label] == undefined
          ? ""
          : count[d.label]
      ),
    }));
    // this.setState({ appId: currentApp && currentApp.id });

    const sortedTabs = sortBy(countTabs, (tab) => tab.number);
    const filterTabs = sortedTabs.filter((d) => d.label != null);

    tabPanes = filterTabs.map((tab) => {
      if (tab) {
        return (
          <TabPane
            tab={
              <Tooltip
                title={this.state.sideOpened ? "" : t(tab.label)}
                placement="left"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      // display: "grid",
                      alignItems: "center",
                      gridTemplateColumns: "auto auto ",
                      justifyContent: "right",
                    }}
                  >
                    <img
                      src={tab.icon}
                      style={{ width: "35px" }}
                      className={
                        this.state.sideOpened
                          ? "px-2 img-fluid reportIconColor"
                          : "sideImgClose px-2 img-fluid reportIconColor"
                      }
                    />
                    <span
                      style={{
                        whiteSpace: this.state.sideOpened
                          ? "break-spaces"
                          : "unset",
                      }}
                      className={
                        this.state.sideOpened
                          ? "sideLabelOpen"
                          : "sideLabelClose"
                      }
                    >
                      {t(tab.label)}
                    </span>
                  </div>
                  <span className="badge">{tab.count}</span>
                </div>
              </Tooltip>
            }
            key={tab.key}
          ></TabPane>
        );
      }
    });
    // <contents.TabButtons {...{ currentApp }} style={{ margin: "20px" }} />;
    // console.log(tabs)
    const tab =
      sortedTabs.filter((_tab) => convertToEnglish(_tab.count) > 0)[0] ||
      sortedTabs.find(
        (_tab) => !convertToEnglish(_tab.count) && _tab.number == 7
      ) ||
      head(sortedTabs);

    if (count && typeof count == "object" && tab && !currentTab) {
      const currentT = get(tab, "key", "");
      setCurrentTab(currentT);
      setCurrentApp(app_name);
      removeCahce(currentT);
    }

    let comp = get(tabsObject, currentTab, () => {})(
      { ...currentApp, user: copyUser({ user }) } || {}
    );
    let ContentComponent = comp
      ? get(contents, get(comp, "content.type"), () => <div></div>)
      : () => <div></div>;
    localStorage.setItem("appname", app_name);
    localStorage.setItem("appId", currentApp && currentApp.id);
    localStorage.setItem(
      "arabicName",
      currentApp && currentApp.translate_ar_caption
    );

    return (
      <Media query="(max-width: 1020px)">
        {(matches) =>
          matches ? (
            <div className="media_resolution">
              <i
                className="fas fa-solid fa-bars"
                style={{
                  cursor: "pointer",
                  fontSize: "25px",
                  paddingTop: "10px",
                  marginRight: "10px",
                  textAlign: "right",
                  width: "95%",
                }}
                onClick={
                  this.state.sideTopOpened
                    ? this.closeSideMenu
                    : this.openSideMenu
                }
              ></i>
              {this.state.sideTopOpened ? (
                <Tabs
                  activeKey={currentTab}
                  onChange={this.onTabChanged.bind(this)}
                  type="card"
                  className={this.state.sideTopOpened ? "" : "pt-5 "}
                  style={{ textAlign: "right" }}
                  tabPosition="top"
                >
                  {tabPanes}
                </Tabs>
              ) : null}
              <Layout
                className={
                  currentTab == "STATISTICS" || currentTab == "RATING"
                    ? "searchBack statisticsComponent"
                    : "searchBack"
                }
                currentTab={currentTab}
                id={this.state.sideTopOpened ? "searchBackMobile" : ""}
              >
                <Content class currentTab={currentTab}>
                  <ContentComponent key={currentTab} {...comp} />
                </Content>
              </Layout>

              {ShowModal ? (
                <ShowModal handleCancel={removeModal} {...comp} />
              ) : null}
            </div>
          ) : (
            <div>
              <Row className="media_resolution">
                <Col
                  // className="pr-4"
                  xl={{ span: this.state.sideOpened ? 20 : 23 }}
                  md={{ span: this.state.sideOpened ? 18 : 23 }}
                >
                  {!this.state.sideOpened ? null : (
                    <i
                      onClick={this.closeSideMenu}
                      className="fas fa-chevron-right closeSideMenuArrow"
                    ></i>
                  )}
                  <Layout
                    className={
                      currentTab == "STATISTICS" || currentTab == "RATING"
                        ? "searchBack statisticsComponent"
                        : comp?.moduleName == "INVESTMENT_INDICATORS"
                        ? "statisticsComponent"
                        : "searchBack statisticsComponent"
                    }
                  >
                    <Content class>
                      {comp?.moduleName == "INVESTMENT_INDICATORS" ? (
                        <InvestIndicatorsComponent />
                      ) : null}
                      <ContentComponent
                        key={currentTab}
                        {...comp}
                        id={this?.state?.appId}
                      />
                    </Content>
                    {/* <Content class>

                      {comp?.moduleName == "FOLLOWING_REQUESTS" ? (
                        <FollowingRequests />
                      ) : null}
                      <ContentComponent key={currentTab} {...comp} />
                    </Content> */}
                  </Layout>
                </Col>
                <Col
                  style={{ zoom: "0.95" }}
                  xl={{ span: this.state.sideOpened ? 4 : 1 }}
                  md={{ span: this.state.sideOpened ? 6 : 1 }}
                  // style={{ width: this.state.sideOpened ? "100%" : "20px" }}
                  className={
                    this.state.sideOpened
                      ? "sideMenuShown sideMenuu "
                      : "sideMenuHidden sideMenuu"
                  }
                >
                  {!this.state.sideOpened ? (
                    <i
                      onClick={this.openSideMenu}
                      className=" fas fa-chevron-left openSideMenuArrow "
                    ></i>
                  ) : null}
                  <Tabs
                    className={this.state.sideOpened ? "" : "pt-5 "}
                    style={{ textAlign: "right" }}
                    activeKey={currentTab}
                    onChange={this.onTabChanged.bind(this)}
                    type="card"
                    tabPosition="right"
                  >
                    {tabPanes}
                  </Tabs>
                </Col>
                {ShowModal ? (
                  <ShowModal handleCancel={removeModal} {...comp} />
                ) : null}
              </Row>
            </div>
          )
        }
      </Media>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation("tabs")(tabs))
);
