import React, { Component } from 'react'
import { addFeaturesMapLayers } from '../../../../../../../inputs/fields/identify/Component/mapviewer/config';

export default class mapEditFeatures extends Component {

  state = {

  }

  formatNumber(num) {
    return (+num).toFixed(2).replace(/[.,]00$/, "");
  }

  componentDidMount() {
    let layerInfo = addFeaturesMapLayers[this.props.mainObject.locationData.uploadFileDetails.layerName]

    this.setState({
      editableFeatures: this.props.mainObject.mapEditFeatures.editableFeatures,
      layerInfo: layerInfo
    })
  }

  render() {

    
    const { editableFeatures, layerInfo } = this.state;

    return (
      <div>
        {editableFeatures && <table
          className="table table-bordered" style={{ width: '100%' }}>
          <thead>
            <tr>
              {layerInfo?.outFields?.filter((x) => !x.notInclude)?.map((field) => {
                return (<th>{field.arName}</th>)
              })}
            </tr>

          </thead>
          <tbody>
            {editableFeatures.map((feature, index) => {
              return (
                <tr>
                  {layerInfo?.outFields?.filter((x) => !x.notInclude)?.map((field) => {
                    return (<td>{(isNaN(feature.attributes[field.name]) || !feature.attributes[field.name]) ? (feature.attributes[field.name] || 'غير متوفر') : this.formatNumber(feature.attributes[field.name])}</td>)
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>}
      </div>
    )
  }
}
