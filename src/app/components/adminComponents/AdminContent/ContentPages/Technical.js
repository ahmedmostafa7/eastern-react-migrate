import React, { Component } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { Select, Form, Row, Col, Input } from "antd";
export default class Technical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      searchText: "",
      columns: [
        {
          title: "الاسم",
          dataIndex: "name",
          key: "name",
          render: (text) => <a>{text}</a>,
        },
        {
          title: "أعضاء اللجنة الفنية",
          dataIndex: "members",
          key: "members",
          render: (text) => <a>{text}</a>,
        },
        {
          title: "الإجراء",
          dataIndex: "action",
          key: "action",
          render: (text, record) => (
            <>
              <Button className="follow">
                <i className="fas fa-wrench"></i>
              </Button>
              <Button className="btn-danger">
                <i className="fas fa-times"></i>
              </Button>
            </>
          ),
        },
      ],

      data: [
        {
          key: "1",
          name: "لجنة 1",
        },
        {
          key: "2",
          name: "لجنة 2",
        },
        {
          key: "3",
          name: "لجنة 2",
        },
      ],
    };
  }
  componentDidMount() {
    // this.props.getTableData(
    //   this.state.columns,
    //   this.state.data,
    //   res.data.count
    // );
  }
  handleSelectName = (e) => {};
  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <div className="baladyaAdmin">
        <Button className="follow">إضافة جديد</Button>
        <Row>
          <Col
            md={{ span: 24 }}
            lg={{ span: 12 }}
            style={{ paddingRight: "10px" }}
          >
            <Select
              virtual={false}
              showSearch
              allowClear
              // onChange={this.handleSelectName}
              // value={this.state.name}
              placeholder="اختر اسم"
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              {/* <Select.Option></Select.Option> */}
            </Select>
          </Col>
          <Col md={{ span: 24 }} lg={{ span: 12 }}>
            <Input
              name="searchText"
              onChange={this.handleUserInput}
              value={this.state.searchText}
              placeholder="ابحث..."
            />
          </Col>
        </Row>
      </div>
    );
  }
}
