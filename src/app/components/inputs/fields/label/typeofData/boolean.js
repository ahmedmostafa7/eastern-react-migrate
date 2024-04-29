import React, { Component } from 'react'

export  class boolean extends Component {

  render() {
    const {data,t} = this.props
    
    return (
      <div>
        {data ? t('Yes') : t('No')}
      </div>
    )
  }
}
