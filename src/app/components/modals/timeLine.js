import React, { Component } from "react";
import { Modal, Timeline, Row, Col } from "antd";
import { Icon } from "@ant-design/compatible";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { split } from "lodash";
import { mapStateToProps } from "./mapping";
import { localizeNumber } from "../../../app/components/inputs/fields/identify/Component/common/common_func";
const Item = Timeline.Item;

class timeLineComponent extends Component {
  render() {
    const {
      handleCancel,
      t,
      modal: { title, data, isScalated },
      user,
    } = this.props;

    return (
      <Modal
        title={localizeNumber(
          t(title.split(",")[0]) + ` , ${title.split(",")[1]}`
        )}
        visible={true}
        onCancel={handleCancel}
        footer={null}
      >
        <Row
          type="flex"
          justify="center"
          style={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}
        >
          <Col span={4} style={{ textAlign: "center" }}>
            <p className="timelineGreenCircle"></p>
            <p className="timlineLabelCircle">منتهي</p>
          </Col>{" "}
          <Col span={4} style={{ textAlign: "center" }}>
            <p className="timelineBlueCircle"></p>
            <p className="timlineLabelCircle">جاري</p>
          </Col>{" "}
          <Col span={4} style={{ textAlign: "center" }}>
            <p className="timelineGrayCircle"></p>
            <p className="timlineLabelCircle">قادم</p>
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <p className="timelineYellowCircle"></p>
            <p className="timlineLabelCircle">متأخر</p>
          </Col>
        </Row>

        <Timeline mode="alternate">
          {data &&
            data.map(
              ({
                status,
                name,
                stepActionUserName,
                userNamePosition,
                // userNameDeptartment,
                date,
                datePeriod,
              }) => {
                let val =
                  date && date.includes("T") ? split(date, "T", 1)[0] : date;
                let color = (isScalated && "Yellow") || null,
                  dot = null;
                status == 1
                  ? (dot =
                      (!isScalated && (
                        <Icon type="clock-circle" theme="twoTone" />
                      )) ||
                      null)
                  : (color = status == 0 ? "green" : "grey");
                return (
                  <Item
                    color={color}
                    dot={dot}
                    className={
                      (datePeriod == undefined || datePeriod == false) &&
                      val == undefined
                        ? ""
                        : "datePeriodHeight"
                    }
                  >
                    <ul>
                      <li className="timelineName">{name}</li>
                      <li className="timelineDate">
                        {val && localizeNumber(`${val} هـ`)}
                      </li>
                      <li className="timelineDate">
                        {stepActionUserName || ""}
                      </li>
                      <li className="timelineDate">{userNamePosition || ""}</li>
                      {/* <li className="timelineDate">
                        {userNameDeptartment || ""}
                      </li> */}
                      <li className="timeLinePeriod">
                        {(datePeriod && datePeriod) || ""}
                      </li>
                    </ul>
                  </Item>
                );
              }
            )}
        </Timeline>
      </Modal>
    );
  }
}

export const timeLine = connect(mapStateToProps)(
  withTranslation("modals")(timeLineComponent)
);
