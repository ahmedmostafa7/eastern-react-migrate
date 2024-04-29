import React, { Component } from "react";
import axios from "axios";
import { get, isEmpty } from "lodash";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
import moment from "moment-hijri";
import { convertToArabic } from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { Row, Col } from "antd";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";

export default class Farz extends Component {
  state = { data: [] };
  componentDidMount() {
    console.log("match_id", this.props.match.params.id);
  }

  render() {
    return (
      <div className="table-report-container">
        {" "}
        <ReactToPrint
          trigger={() => {
            return (
              <div className="">
                <button
                  className="btn add-btnT printBtn"
                  onClick={() => {
                    window.print();
                  }}
                >
                  طباعة
                </button>
              </div>
            );
          }}
          content={() => this.componentRef}
        />
        <div
          className="table-pr"
          style={{ border: "1px solid", padding: "10px", margin: "5px" }}
          ref={(el) => (this.componentRef = el)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              borderBottom: "1px solid",
            }}
          >
            <div
              className="rightPart"
              style={{ borderLeft: "1px solid", textAlign: "center" }}
            >
              <p>رقم المعاملة و تاريخ</p>
              <p></p>
            </div>
            <div className="leftPart">
              <div className="upperImg" style={{ borderBottom: "1px solid" }}>
                <img src="images/north.png" />
              </div>

              <div className="lowerImg" style={{ borderBottom: "1px solid" }}>
                <img src="images/north.png" />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <div
              className="rightDown"
              style={{ textAlign: "center", borderLeft: "1px solid" }}
            >
              <p>تم اعداد </p>
            </div>
            <div className="leftDown">
              <p>صاحب الفضل</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
