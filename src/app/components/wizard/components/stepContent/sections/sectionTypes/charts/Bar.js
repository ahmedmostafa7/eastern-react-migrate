import React, { Component } from 'react'
import {Bar} from 'react-chartjs-2'

export class bar extends Component {
  render() {
    const {data, options} = this.props
    return (
        <Bar
        data={data}
        // width={100}
        // height={50}
        options={options}/> 
        
    )
  }
}
