import React, { Component } from "react";
import { useEffect, useState } from "react";
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

function handleMenuClick(e) {
  console.log("click", e);
}
function navigate(url) {
  // const { history } = this.props;
  // history(url);
}
function signOut(removeUser) {
  removeUser();
  window.localStorage.clear();
  window.open("/home", "_self");
}
export function Header({
  currentApp,
  user,
  countTabsCount,
  setCountTab,
  removeUser,
  headerData,
}) {
  const [request_no, setReqNo] = useState("");
  const [CurrentStep, setCurrentStep] = useState("");
  const [color, setColor] = useState("");
  const [arabicName, setAraName] = useState("");
  const [workflowName, setWorkflowName] = useState("");
  const [home, setHome] = useState("");
  // console.log("user", props);
  useEffect(() => {
    setReqNo(localStorage.getItem("req_no"));
    setCurrentStep(localStorage.getItem("CurrentStep"));
    setWorkflowName(localStorage.getItem("workFlowName"));
    // const request = new Request(
    //   workFlowUrl + "/applications/allApplications?pageSize=100",
    //   {
    //     headers: {
    //       authorization: `bearer ${localStorage.token}`,
    //     },
    //   }
    // );
    // fetch(request)
    //   .then(async (res) => {
    //     if (res.ok) {
    //       const results = (await res.json()).results;
    //       let appsArabicNames = {};
    //       results.forEach((r) => {
    //         appsArabicNames[r.id] = r.translate_ar_caption;
    //       });
    //       setAllAppsAraName({ appsArabicNames });
    //     }
    //   })
    //   .catch((err) => console.log(err));
  }, []);

  // console.log(arabicName, color);
  // console.log("ddd", headerData);
  let menu = (
    <Menu>
      <Menu.Item key="1">
        <a
          href={`${hostUpload + "/home/UserProfile"}`}
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
                href={`${hostUpload + "/home/Apps"}`}
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
          onClick={() => {
            signOut(removeUser);
          }}
          style={{ border: "none", textAlign: "right", paddingRight: "0" }}
        >
          تسجيل خروج
        </Button>
      </Menu.Item>
    </Menu>
  );
  // return <div></div>;

  // class Header extends Component {
  //   name = " إدارة الرخص التجارية والمشاريع الكبرى";
  //   state = {
  //     appIdState: "",
  //     appsArabicNames: {},
  //     addTaskModalShow: false,
  //     showTicketsMenu: false,
  //   };

  //   componentDidMount() {
  //     // }
  //   }
  //   //  window.esriToken =
  //   state = {
  //     active: "",
  //   };

  // localStorage.removeItem("user");
  // delete window.localStorage["token"];

  //this.props.history.push('/testgis/#/home')

  // static getDerivedStateFromProps(props, state) {
  //   const {
  //     history: {
  //       location: { pathname },
  //     },
  //   } = props;
  //   return {
  //     active: pathname,
  //   };
  // }
  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   const { history, change } = nextProps;
  //   if (history.location.pathname.includes("submissions")) {
  //     change("ButtonsForm", "create", "");
  //   }
  //   return !isEqual(
  //     { props: this.props, state: this.state },
  //     { state: nextState, props: nextProps }
  //   );
  // }

  return (
    <div>
      <section className="hidd ">
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
                  href={`${hostUpload + "/home/ContactUs"}`}
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
                  src="../images/logo2.png"
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
                          href={`${hostURL + "/mahamy/tickets/add"}`}
                          target="_blank"
                        >
                          <img
                            className=""
                            alt="ticketIcon"
                            // onClick={this.openAddTaskModal}
                            src={addTicketIcon}
                          />
                          <span>تذكرة جديدة</span>
                        </a>
                      ) : (
                        <a href={`${hostURL + "/home/Login"}`}>
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
                      <a href={`${hostURL}/mahamy/tickets`} target="_blank">
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
              {/* {user ? (
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
              ) : null} */}
              <Media query="(max-width: 768px)">
                {(matches) =>
                  matches ? null : (
                    <>
                      <a
                        href={`${hostUpload + "/home/Apps"}`}
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
                      src="../images/avatarImg.png"
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
            background: color ? `#${color}` : "",
          }}
        >
          {/* <span className="headerNameSpan"></span> */}
          <p className="">
            <span>
              <span>
                <i className="fa fa-home" aria-hidden="true"></i>
              </span>
              <span> {!isEmpty(arabicName) ? arabicName : ""}</span>
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
    </div>
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("actions")(Header))
);
