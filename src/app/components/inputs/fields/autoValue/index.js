import React, { Component } from 'react'
import * as valueFunctions from './autoValueFunctions'
import{get, isEmpty} from 'lodash'

export default class autoValue extends Component {

    constructor(props) {
        super(props)
        const { input:{value, onChange}, value_func } = props;
        const showValue = isEmpty(value)? get(valueFunctions, value_func, () => value)(value) : value
        onChange(showValue);
    }

  render() {
    const { input:{value, onChange}, value_func } = props;

    const showValue = isEmpty(value)? get(valueFunctions, value_func, () => value)(value) : value
    onChange(showValue);

    return (
      <label>{value}</label>
    )
  }
}