import React, { Component } from 'react'
import { DatePicker } from 'antd';
import moment from "moment";
export default class datePicker extends Component {
  render() {
      const {className, input:{value,...input}, type, label, placeholder }=this.props
    return (
      <DatePicker {...{ className }} {...input} value={value ? moment(value):undefined} type={type}  placeholder={placeholder || label} />   
    )
  }
}
