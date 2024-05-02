import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { withRouter } from "apps/routing/withRouter";
import { Button, Menu, Dropdown, notification, Tooltip } from "antd";
import { Icon } from "@ant-design/compatible";
import Media from "react-media";
import * as contents from "../../../../apps/modules/tabs/contents";
import { isEmpty, isEqual } from "lodash";
import NotifyIcon from "../../../../main_helpers/notifications/NotifyIcon";
import generateNotification from "../../../../main_helpers/notifications/generateNotification";
import incrementTabsCounts from "../../../../main_helpers/notifications/incrementTabsCounts";
import { convertToArabic } from "app/components/inputs/fields/identify/Component/common/common_func";
import { workFlowUrl } from "imports/config";
import ticketGroupIcon from "app/components/tickets/ticketIcon.svg";
import ticketsInboxIcon from "app/components/tickets/ticketsInboxIcon.svg";
import addTicketIcon from "app/components/tickets/addTicketIcon.svg";

class Header extends Component {
  name = " إدارة الرخص التجارية والمشاريع الكبرى";
  state = {
    appIdState: "",
    appsArabicNames: {},
    addTaskModalShow: false,
    showTicketsMenu: false,
  };

  componentDidMount() {
    // console.log("popp", this.props);
    const { location } = this.props;
    let localAppName = localStorage.getItem("appname");
    // let appName;
    let appName = location.pathname
      .replace("/submissions/", "")
      .replace("/", "");
    if (
      // localAppName !== null ||
      appName.includes("undefined") ||
      appName.includes("wizardById")
    ) {
      appName = localAppName.replace("splitandmerge.", "");
    }

    console.log("appn", appName);
    let SplitappName = "splitandmerge." + appName;
    let userApplications = [
      ...JSON.parse(localStorage.getItem("user")).groups.map((x) =>
        x.groups_permissions.map((f) => f.applications)
      ),
    ];
    console.log("up", userApplications);
    let AlluserApps = userApplications?.reduce((a, b) => {
      return [...a, ...b];
    }, []);
    // if (!/\d/.test(appName)) {
    let arabicName = AlluserApps?.find(
      (x) => x.name.toLowerCase() == SplitappName.toLowerCase()
    )?.translate_ar_caption;

    let englishName = AlluserApps?.find(
      (x) => x.name.toLowerCase() == SplitappName.toLowerCase()
    )?.name;
    let AppColor = AlluserApps?.find(
      (x) => x.name.toLowerCase() == SplitappName.toLowerCase()
    )?.color;

    this.setState({ AppColor, arabicName, englishName });

    const request = new Request(
      workFlowUrl + "/applications/allApplications?pageSize=100",
      {
        headers: {
          authorization: `bearer ${localStorage.token}`,
        },
      }
    );
    fetch(request)
      .then(async (res) => {
        if (res.ok) {
          const results = (await res.json()).results;
          let appsArabicNames = {};
          results.forEach((r) => {
            appsArabicNames[r.id] = r.translate_ar_caption;
          });
          this.setState({ appsArabicNames });
        }
      })
      .catch((err) => console.log(err));

    if (appName.toLowerCase() == "addedparcels") {
      window.isPlusApp = true;
      window.isAkarApp = false;
    } else if (appName.toLowerCase() == "tamlikakar") {
      window.isAkarApp = true;

      window.isPlusApp = false;
    } else if (
      // window.location.href.indexOf("admin") > -1 ||
      window.location.href.indexOf("steps") > -1
    ) {
      window.isPlusApp = false;
      window.isAkarApp = false;
      this.setState({ arabicName: " إدارة النظام", AppColor: "" }) +
        window.appversion;
    } else {
      window.isAkarApp = false;

      window.isPlusApp = false;
    }
    // }
  }
  //  window.esriToken =
  state = {
    active: "",
  };
  handleMenuClick(e) {
    console.log("click", e);
  }
  navigate(url) {
    const { history } = this.props;
    history.push(url);
  }
  signOut() {
    this.props.removeUser();
    window.localStorage.clear();
    window.open("/home", "_self");
    // localStorage.removeItem("user");
    // delete window.localStorage["token"];

    //this.props.history.push('/testgis/#/home')
  }

  static getDerivedStateFromProps(props, state) {
    const {
      history: {
        location: { pathname },
      },
    } = props;
    return {
      active: pathname,
    };
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { history, change } = nextProps;
    if (history.location.pathname.includes("submissions")) {
      change("ButtonsForm", "create", "");
    }
    return !isEqual(
      { props: this.props, state: this.state },
      { state: nextState, props: nextProps }
    );
  }

  render() {
    console.log("اللون", this.state, this.props);
    const { user, currentApp, countTabsCount, setCountTab, history } =
      this.props;
    const { appIdState, appsArabicNames, englishName } = this.state;
    let isAdminPage = englishName?.toLowerCase().includes("admin");
    // console.log("co", currentApp, this.props);
    let request_no = localStorage.getItem("req_no");
    let home = history.location.pathname.includes("submissions") ? true : false;
    let CurrentStep = localStorage.getItem("CurrentStep");
    let workflowName = localStorage.getItem("workFlowName");
    // let appId = localStorage.getItem("appId");
    // let localAppName = localStorage.getItem("appName");
    // console.log("ee", localAppName);
    let menu = (
      <Menu>
        <Menu.Item key="1">
          <a
            href={`${window.hostUpload + "/home/UserProfile"}`}
            className="portalnavitem"
          >
            الصفحة الشخصية
          </a>
        </Menu.Item>

        <Menu.Item key="2">
          <Media query="(max-width: 768px)">
            {(matches) =>
              matches ? (
                <a
                  href={`${window.hostUpload + "/home/Apps"}`}
                  className="portalnavitem "
                >
                  تطبيقاتي
                </a>
              ) : null
            }
          </Media>
        </Menu.Item>

        <Menu.Item key="3">
          <Button
            className="portalnavitem"
            onClick={this.signOut.bind(this)}
            style={{ border: "none", textAlign: "right", paddingRight: "0" }}
          >
            تسجيل خروج
          </Button>
        </Menu.Item>
      </Menu>
    );

    return (
      <section className="hidd ">
        <link rel="stylesheet" href="../css/main.css" />
        <header id="header">
          <div className="top-bar">
            <div className="big-logo portalNavbar1">
              <ul className="rightUl">
                <li>
                  <a
                    className="iconLink"
                    href="https://www.youtube.com/channel/UC5k-pTxG2WTlj0Bbzcmk6RA"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-youtube youtubeIcon"></i>
                  </a>
                </li>
                <span className="navitemBorder"></span>
                <li className="centerLi">
                  <a
                    className="iconLink"
                    href="https://twitter.com/easterneamana/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-twitter twitterIcon"></i>
                  </a>
                </li>
                <span className="navitemBorder "></span>
                <a
                  href={`${window.hostUpload + "/home/ContactUs"}`}
                  className="portalnavitem "
                >
                  تواصـل معنا
                </a>
                <span className="navitemBorder"></span>
              </ul>
            </div>
            <div className="middleHeader">
              <a href="/home">
                <img
                  src="images/logo2.png"
                  style={{ width: "45px", float: "right" }}
                  alt=""
                  className="ml-3 mr-1"
                />
              </a>
              <span className="noMobile">
                الـبــوابــة الـجـغـرافـيـة لأمـانة المنطـقة الشـرقـيـة
              </span>
            </div>
            {/* <div className="middleHeaderTitle"> </div> */}
            <div
              style={{
                justifySelf: "flex-end",
                display: "flex",
              }}
            >
              <Dropdown
                className="serviceNavItem"
                getPopupContainer={(trigger) => trigger.parentNode}
                trigger={["click"]}
                overlay={
                  <Menu>
                    <Menu.Item>
                      {user ? (
                        <a
                          href={`${window.hostURL + "/mahamy/tickets/add"}`}
                          target="_blank"
                        >
                          <img
                            className=""
                            alt="ticketIcon"
                            onClick={this.openAddTaskModal}
                            src={addTicketIcon}
                          />
                          <span>تذكرة جديدة</span>
                        </a>
                      ) : (
                        <a href={`${window.hostURL + "/home/Login"}`}>
                          <img
                            className=""
                            alt="ticketIcon"
                            src={addTicketIcon}
                          />{" "}
                          <span>تذكرة جديدة</span>
                        </a>
                      )}
                    </Menu.Item>
                    <hr />
                    <Menu.Item>
                      <a
                        href={`${window.hostURL}/mahamy/tickets`}
                        target="_blank"
                      >
                        <img
                          className=""
                          alt="ticketIcon"
                          src={ticketsInboxIcon}
                        />
                        <span>التذاكر الجارية</span>
                      </a>
                    </Menu.Item>
                  </Menu>
                }
                placement="bottomLeft"
                arrow
              >
                <Tooltip placement="right" title="الدعم الفني">
                  <img
                    className=""
                    alt="ticketIcon"
                    src={ticketGroupIcon}
                    style={{ cursor: "pointer" }}
                  />
                  <span className="navitemBorder"></span>
                </Tooltip>
              </Dropdown>
              {user ? (
                <NotifyIcon
                  //appsIds={[appIdState && appIdState]}
                  appsIds={[1, 5, 8, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]}
                  userToken={localStorage.token}
                  generateNotification={(n) =>
                    generateNotification(n, appsArabicNames)
                  }
                  onNotificationArrived={(n) =>
                    incrementTabsCounts(n, countTabsCount, setCountTab)
                  }
                  baseUrl={window.workFlowUrl}
                />
              ) : null}
              <Media query="(max-width: 768px)">
                {(matches) =>
                  matches ? null : (
                    <>
                      <a
                        href={`${window.hostUpload + "/home/Apps"}`}
                        className="portalnavitem mr-4 noMobile"
                      >
                        تطبيقاتي
                      </a>
                      <span className="navitemBorder noMobile"></span>
                    </>
                  )
                }
              </Media>
              {user ? (
                <Dropdown
                  overlay={menu}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  trigger={["click"]}
                >
                  <Button
                    className="profile"
                    style={{ padding: "0", boxShadow: "none" }}
                  >
                    <img
                      style={{ width: "auto", height: "30px" }}
                      src="images/avatarImg.png"
                      className="img-fluid pl-3"
                      alt="userPhoto"
                    />
                    <Media query="(max-width: 768px)">
                      {(matches) =>
                        matches ? (
                          <>
                            {user && String(user.name).slice(0, 11)}
                            <span>..</span>{" "}
                          </>
                        ) : (
                          user && user.name
                        )
                      }
                    </Media>
                    <Icon type="down" />
                  </Button>
                </Dropdown>
              ) : (
                false
              )}
            </div>
          </div>
        </header>
        {/* {console.log("currentApp", currentApp)} */}
        <header
          className={home ? "appNameHeader_flex" : "appNameHeader_grid"}
          style={{
            background: this.state.AppColor ? `#${this.state.AppColor}` : "",
          }}
        >
          {/* <span className="headerNameSpan"></span> */}
          <p className="">
            <span>
              <span>
                <i className="fa fa-home" aria-hidden="true"></i>
              </span>
              <span>
                {" "}
                {!isEmpty(this.state.arabicName) ? this.state.arabicName : ""}
              </span>
            </span>

            {!home && (
              <div style={{ display: "flex" }} className="noMobile">
                {!isEmpty(workflowName) ? (
                  <span>
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    <span>{workflowName}</span>
                  </span>
                ) : (
                  <span></span>
                )}

                {!isEmpty(request_no) ? (
                  <span>
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    <span>{convertToArabic(request_no)}</span>
                  </span>
                ) : (
                  <span></span>
                )}

                {CurrentStep && (
                  <div>
                    <span>
                      {" "}
                      <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    </span>
                    <span>{convertToArabic(CurrentStep)}</span>
                  </div>
                )}
              </div>
            )}
            {home && (
              <contents.TabButtons
                {...{ currentApp }}
                home={home}
                style={{ margin: "20px", textAlign: "center" }}
              />
            )}
          </p>{" "}
        </header>
      </section>
    );
  }
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("actions")(Header))
);
