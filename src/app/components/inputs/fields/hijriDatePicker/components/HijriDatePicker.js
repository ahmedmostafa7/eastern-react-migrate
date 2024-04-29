import React, { Component } from "react";
import styled from "styled-components";
import moment from "moment-hijri";
import onClickOutside from "react-onclickoutside";
import DayNames from "./DayNames.js";
import MonthList from "./MonthsList";
import YearsList from "./YearsList";
import MonthDaysView from "./MonthDaysView";
import { Input, Popover } from "antd";
import { withTranslation } from "react-i18next";
import { get } from "lodash";

const HijriCalender = styled.div`
  width: 266px;
  direction: rtl;
  background: #ffffff;
  padding: 15px;
  border: 1px solid #ddd;
  margin-top: 2px;
  font-family: serif;
  box-sizing: unset;
  -webkit-box-sizing: unset;
  font-size: 14px;
  border-radius: 4px;
`;

const HijriCalenderControls = styled.div`
  direction: rtl;
  text-align: center;
`;

const ControlButton = styled.button`
  position: absolute;
  border: 0px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  background-color: #fff;
  :hover {
    color: #888888;
  }
  :focus {
    outline: unset;
  }
`;
const PreviousButton = styled(ControlButton)`
  right: 15px;
`;

const NextButton = styled(ControlButton)`
  left: 15px;
`;
const MonthName = styled.strong``;

const YearAndMonthList = styled.div`
  margin-top: 10px;
`;

class HijriDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: get(props, "value")
        ? moment(
            get(props, "value", ""),
            props.dateFormat || "iYYYY/iMM/iDD"
          ).locale("en")
        : moment().locale("en"),
      calenderShown: false,
      maxDate: get(props, "value")
        ? moment(
            get(props, "value", ""),
            props.dateFormat || "iYYYY/iMM/iDD"
          ).locale("en")
        : moment().locale("en"),
    };
  }

  handleClickOutside = (evt) => {
    this.setState({
      calenderShown: false,
    });
  };

  subtractMonth = () => {
    this.setState((prevState) => ({
      currentTime: prevState.currentTime.subtract(1, "iMonth"),
    }));
  };

  addMonth = () => {
    this.setState((prevState) => ({
      currentTime: prevState.currentTime.add(1, "iMonth"),
    }));
  };

  setSelectedDate = (event) => {
    const {
      dateFormat = "iYYYY/iMM/iDD",
      input: { onChange = () => {} },
    } = this.props;
    let time = this.state.currentTime;
    time.iDate(parseInt(event.target.value, 10));
    onChange(time.format(dateFormat));
    this.setState({
      calenderShown: false,
    });
  };

  getMonthStartDayName = () => {
    let time = this.state.currentTime;
    time.startOf("iMonth");
    return time.format("dd");
  };

  showCalender = () => {
    this.setState({
      calenderShown: true,
    });
  };

  handelMonthChange = (event) => {
    let time = this.state.currentTime;
    time.iMonth(parseInt(event.target.value, 10));
    this.setState({
      currentTime: time,
    });
  };

  handelYearChange = (event) => {
    let time = this.state.currentTime;
    time.iYear(parseInt(event.target.value, 10));
    this.setState({
      currentTime: time,
    });
  };

  handelOnChange = (event) => {
    //
  };

  renderYearAndMonthList() {}

  render() {
    const {
      className,
      input,
      t,
      dateFormat = "iYYYY/iMM/iDD",
      placeholder,
      disabled,
    } = this.props;
    return (
      <div onClickOutside={this.handleClickOutside.bind(this)}>
        {/* <Manager> */}
        {/* <Reference> */}
        {/* {({ ref }) => ( */}
        <Popover
          getPopupContainer={(trigger) => trigger.parentNode}
          visible={this.state.calenderShown}
          placement="bottom"
          content={
            <div>
              <HijriCalender maxDate={moment().locale("en")}>
                <HijriCalenderControls>
                  <PreviousButton onClick={this.subtractMonth} type="button">
                    {"<"}
                  </PreviousButton>
                  <MonthName>
                    {t(this.state.currentTime.format("iMMMM")) +
                      " (" +
                      this.state.currentTime.format("iMM") +
                      ") " +
                      this.state.currentTime.format("iYYYY")}
                  </MonthName>
                  <NextButton onClick={this.addMonth} type="button">
                    {" "}
                    {">"}{" "}
                  </NextButton>
                  <YearAndMonthList>
                    <YearsList
                      currentTime={this.state.currentTime}
                      onChange={this.handelYearChange}
                    />
                    <MonthList
                      currentTime={this.state.currentTime}
                      onChange={this.handelMonthChange}
                    />
                  </YearAndMonthList>
                </HijriCalenderControls>
                <DayNames />
                <MonthDaysView
                  currentTime={this.state.currentTime}
                  dateFormat={dateFormat}
                  selectedDate={get(input, "value")}
                  setSelectedDate={this.setSelectedDate}
                />
              </HijriCalender>
            </div>
          }
        >
          <Input
            type="text"
            {...{ className }}
            {...input}
            {...{ placeholder }}
            onFocus={this.showCalender}
            disabled={disabled}
            readOnly
          />
        </Popover>

        {/* )} */}
        {/* </Reference> */}
        {/* </Manager> */}
      </div>
    );
  }
}

export default onClickOutside(withTranslation("labels")(HijriDatePicker));
