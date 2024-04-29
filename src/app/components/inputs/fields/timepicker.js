import React, { Component } from 'react'
import { TimePicker } from 'antd';
import moment from "moment";

export  default class timePicker extends Component {
  render() {
      const {input:{value,...input},type,label,placeholder, format="HH:mm:ss", className }=this.props
    return (
      <TimePicker {...{ className }} value={value ? moment(value, format) : undefined} {...input} type={type} placeholder={placeholder || label}/>
    )
  }
}
