import React, { Component } from 'react'
import {date as Date} from './date';

 export class string extends Component {
  render() {
     const {data,t} = this.props
     const datetime= /\d{4,4}-\d{2,2}-\d{2,2}/;

     let item = datetime.test(data) ? <Date data={data}/> : data

      return (
        <div>
          {item}
        </div>
      )
  }
}
