import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Row, Col } from "antd";
class Header extends Component {
  render() {
    const { name, dates } = this.props;
    return (
      <div className="mt-4">
        <Row>
          <Col span={8} style={{ textAlign: "center" }}>
            <img
              src="images/saudiVision2.png"
              alt="logo"
              style={{ width: "85px" }}
            />
          </Col>
          <Col span={8} style={{ textAlign: "center" }}>
            <div className="header-title">
              <h1>{name}</h1>
              {dates && <h1>{dates}</h1>}
            </div>
          </Col>{" "}
          <Col span={8} style={{ textAlign: "center" }}>
            <img src="images/logo2.png" style={{ width: "80px" }} alt="" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Header;
