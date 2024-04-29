import React, { Component } from 'react'
import moment from 'moment';

export  class date extends Component {
  render() {
    const {data}=this.props
    return (
      <div>
        {moment(data)}
      </div>
    )
  }
}
