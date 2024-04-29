import React, { Component } from "react";
import AdminSideMenu from "./layout/AdminSideMenu";
import AdminContent from "./AdminContent/AdminContent";
import { Row, Col, Pagination } from "antd";
import Users from "./AdminContent/ContentPages/Users";
import Municipality from "./AdminContent/ContentPages/Municipality";
import Departments from "./AdminContent/ContentPages/Departments";
// import Owners from "./AdminContent/ContentPages/Owners";
import JobTitle from "./AdminContent/ContentPages/JobTitle";
import Nationalities from "./AdminContent/ContentPages/Nationalities";
import Technical from "./AdminContent/ContentPages/Technical";
import Issuer from "./AdminContent/ContentPages/Issuer";
import IssuerTypes from "./AdminContent/ContentPages/IssuerTypes";
import WorkFlow from "./AdminContent/ContentPages/WorkFlow";
import Apps from "./AdminContent/ContentPages/Apps";
import News from "./AdminContent/ContentPages/News";
import AdminGroups from "./AdminContent/ContentPages/AdminGroups";
import WorkflowSteps from "./AdminContent/ContentPages/WorkflowSteps";
export default class AdminMainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sideOpened: true,
      selectedLink: 1,
      dataCount: 0,
      sideLinks: [
        {
          id: 1,
          name: "البلديات",
          icon: "images/adminIcons/munIcon.png",
          component: <Municipality getTableData={this.getTableData} />,
        },
        {
          id: 2,
          name: "الأقسام",
          icon: "images/adminIcons/depIcon.png",
          component: <Departments getTableData={this.getTableData} />,
        },
        {
          id: 3,
          name: "المستخدمين",
          icon: "images/adminIcons/usersIcon.png",
          component: <Users getTableData={this.getTableData} />,
        },
        {
          id: 4,
          name: "المجموعات",
          icon: "images/adminIcons/groupIcon.png",
          component: <AdminGroups getTableData={this.getTableData} />,
        },
        {
          id: 5,
          name: "المسميات الوظيفية",
          icon: "images/adminIcons/jobTitle.png",
          component: <JobTitle getTableData={this.getTableData} />,
        },
        // {
        //   id: 6,
        //   name: "الملاك",
        //   icon: "images/adminIcons/usersIcon.png",
        //   component: <Owners getTableData={this.getTableData} />,
        // },
        {
          id: 6,
          name: "الجنسيات",
          icon: "images/adminIcons/nationalityIcon.png",
          component: <Nationalities getTableData={this.getTableData} />,
        },
        // {
        //   id: 7,
        //   name: "اللجان الفنية",
        //   icon: "images/adminIcons/techIcon.png",
        //   component: <Technical getTableData={this.getTableData} />,
        // },
        {
          id: 8,
          name: "جهات الإصدار",
          icon: "images/adminIcons/issuerIcon.png",
          component: <Issuer getTableData={this.getTableData} />,
        },
        {
          id: 9,
          name: "أنواع جهات الإصدار",
          icon: "images/adminIcons/issuerTypeIcon.png",
          component: <IssuerTypes getTableData={this.getTableData} />,
        },
        {
          id: 10,
          name: "مسارات العمل",
          icon: "images/adminIcons/workflow.png",
          component: <WorkFlow getTableData={this.getTableData} />,
        },
        {
          id: 11,
          name: "التطبيقات",
          icon: "images/adminIcons/appsIcon.png",
          component: <Apps getTableData={this.getTableData} />,
        },
        // {
        //   id: 12,
        //   name: "الأخبار",
        //   icon: "images/adminIcons/news.png",
        //   component: <News getTableData={this.getTableData} />,
        // },
      ],
      columns: [],
      tableData: {},
    };
  }

  getTableData = (columns, tableData, dataCount) => {
    this.setState({
      columns: columns,
      tableData: tableData,
      dataCount: dataCount,
    });
  };

  openSideMenu = (e) => {
    this.setState({ sideOpened: true });
  };
  closeSideMenu = (e) => {
    this.setState({ sideOpened: false });
  };
  onChange = (page) => {
    console.log(page);
  };
  passSelectedLink = ({ item, key }) => {
    this.setState({ selectedLink: key });
    console.log("sele", this.state.selectedLink);
  };
  render() {
    let stepsContent = localStorage.getItem("stepsContent");
    return (
      <div className="adminMainPage">
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
            <AdminContent
              columns={this.state.columns}
              tableData={this.state.tableData}
              getTableData={this.getTableData}
              dataCount={this.state.dataCount}
              sideLinks={this.state.sideLinks}
              selectedLink={this.state.selectedLink}
            />
            {/* <Pagination
              defaultCurrent={1}
              onChange={this.onChange}
              hideOnSinglePage={true}
              pageSize={12}
              defaultPageSize={12}
              total={this?.state?.dataCount}
            /> */}
          </Col>

          {/* <Col
              xl={{ span: this.state.sideOpened ? 20 : 23 }}
              md={{ span: this.state.sideOpened ? 18 : 23 }}
            >
              <WorkflowSteps
                columns={this.state.columns}
                tableData={this.state.tableData}
                getTableData={this.getTableData}
                dataCount={this.state.dataCount}
                sideLinks={this.state.sideLinks}
                selectedLink={this.state.selectedLink}
              />
            </Col> */}
          {/* )} */}
          <Col
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
            <AdminSideMenu
              passSelectedLink={this.passSelectedLink}
              sideLinks={this.state.sideLinks}
              selectedLink={this.state.selectedLink}
              sideOpened={this.state.sideOpened}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
