import React, { Component } from 'react'
import { Slider } from 'antd';

export default class slider extends Component {
  render() {
      const { input: { value, ...input }, type, label, max=100 ,min=0, className}=this.props
    return (
      <Slider {...{ className }} value={value} {...input} max={Number(max)} min={Number(min)} label={label} type={type} />
    )
  }
}
