import React, { Component } from 'react'
import { Switch } from 'antd';

export default class singleSwitch extends Component {
  render() {
      const {className,input:{value,...input},type}=this.props
    return (
        <Switch {...input} checked={value} type={type} {...{className}}/>
    )
  }
}
