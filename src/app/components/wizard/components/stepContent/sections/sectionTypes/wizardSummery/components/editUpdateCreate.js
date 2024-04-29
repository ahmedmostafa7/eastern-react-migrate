import React, { Component } from 'react'
import { editAndDeleteMapLayers, addFeaturesMapLayers } from '../../../../../../../inputs/fields/identify/Component/mapviewer/config';

export default class editUpdateCreate extends Component {

  state = {
    allFeatures: {}
  }

  formatNumber(num) {
    return (+num).toFixed(2).replace(/[.,]00$/, "");
  }

  componentDidMount() {

    
    this.setState({
      allFeatures: this.props.mainObject.editUpdateCreate.editableFeatures,
      originalFeatures: this.props.mainObject.editUpdateCreate.originalFeatures
    })
  }

  isHasDifference = (index, layer) => {

    let isDifference = false;
    editAndDeleteMapLayers[layer]?.outFields?.filter((x) => !x.notInclude)?.forEach((field) => {
      if (this.state.allFeatures[layer].features[index].attributes[field.name] != this.state.originalFeatures[layer].features[index].attributes[field.name]) {
        isDifference = true;
      }
    });

    return isDifference;
  }

  compareGeomtryDifference = (index, layer) => {

    try {
      return !window.geometryEngine.equals(
        this.state.allFeatures[layer].features[index].geometry,
        this.state.originalFeatures[layer].features[index].geometry
      );
    } catch (error) {

      let feature = this.state.allFeatures[layer].features[index].geometry;
      let originalFeature = this.state.originalFeatures[layer].features[index].geometry;
      let tempFeatureGeometry = null;
      let tempOriginalGeometry = null;

      delete feature.cache;
      delete originalFeature.cache;
      delete feature.spatialReference._geVersion;
      delete originalFeature.spatialReference._geVersion;

      if (feature.type == "polygon") {
        tempFeatureGeometry = new esri.geometry.Polygon(feature);
        tempOriginalGeometry = new esri.geometry.Polygon(originalFeature);
      }
      else if (feature.type == "point") {
        tempFeatureGeometry = new esri.geometry.Point(feature);
        tempOriginalGeometry = new esri.geometry.Point(originalFeature);
      }
      else {
        tempFeatureGeometry = new esri.geometry.Polyline(feature);
        tempOriginalGeometry = new esri.geometry.Polyline(originalFeature);
      }

      return !window.geometryEngine.equals(tempFeatureGeometry, tempOriginalGeometry);

    }

  }

  render() {

    const { allFeatures, originalFeatures } = this.state;

    return (
      <div>
        {Object.keys(allFeatures).map((layer) => {
          return (allFeatures[layer].features?.length ?
            <div>
              <div style={{ background: '#57779d', textAlign: "center", padding: '5px' }}>
                <label style={{
                  color: "white", float: 'none',
                  marginRight: '20px',
                  fontSize: '23px !important'
                }}>{editAndDeleteMapLayers[layer].name}</label>
              </div>
              {allFeatures[layer].features.map((feature, index) => {
                return (
                  feature.isDelete ?
                    <div className='editSummaryTable'>
                      <label>موقع {index + 1} : </label>
                      <table
                        className="table table-bordered centeredTable" style={{ width: '100%' }}>
                        <thead>
                          <tr>

                            {editAndDeleteMapLayers[layer]?.outFields?.filter((x) => !x.notInclude)?.map((field) => {
                              return (<th>{field.arName}</th>)
                            })}
                          </tr>

                        </thead>
                        <tbody>
                          <tr style={{ background: feature.isDelete ? '#ff000045' : '' }}>

                            {editAndDeleteMapLayers[layer]?.outFields?.filter((x) => !x.notInclude)?.map((field) => {
                              return (<td>{(isNaN(feature.attributes[field.name]) || !feature.attributes[field.name]) ? (feature.attributes[field.name] || 'غير متوفر') : this.formatNumber(feature.attributes[field.name])}</td>)
                            })}

                          </tr>
                        </tbody>
                      </table>
                    </div> :
                    (this.isHasDifference(index, layer) || this.compareGeomtryDifference(index, layer)) ?
                      <div className='editSummaryTable'>
                        <div style={{ textAlign: 'center', background: '#c9d3df' }}>
                          <label style={{ fontWeight: 'bold !important' }} >بيانات الموقع {index + 1}</label>
                        </div>
                        {<table
                          className="table table-bordered centeredTable" style={{ width: '100%' }}>
                          <thead>
                            <tr>
                              {editAndDeleteMapLayers[layer]?.outFields.filter((x) => x.isSummary)?.map((field) => {
                                return (<th>{field.arName}</th>)
                              })}
                            </tr>
                          </thead>
                          <tbody>

                            <tr>
                              {editAndDeleteMapLayers[layer]?.outFields?.filter((x) => x.isSummary)?.map((field) => {
                                return (
                                  <td>
                                    {originalFeatures[layer].features[index].attributes[field.name]}
                                  </td>
                                )
                              })}
                            </tr>
                          </tbody>
                        </table>}
                        <label>بيانات التعديل</label>
                        {this.isHasDifference(index, layer) ? <table
                          className="table table-bordered centeredTable" style={{ width: '100%' }}>
                          <thead>
                            <tr>
                              <th>البيانات</th>
                              <th>قبل</th>
                              <th>بعد</th>
                            </tr>
                          </thead>
                          <tbody>
                            {editAndDeleteMapLayers[layer]?.outFields?.filter((x) => !x.notInclude)?.map((field) => {
                              return (
                                allFeatures[layer].features[index].attributes[field.name] != originalFeatures[layer].features[index].attributes[field.name] ?
                                  <tr>
                                    <td>
                                      {field.arName}
                                    </td>
                                    <td>
                                      {originalFeatures[layer].features[index].attributes[field.name]}
                                    </td>
                                    <td>
                                      {feature.attributes[field.name]}
                                    </td>
                                  </tr> : <></>)
                            })}
                          </tbody>
                        </table> : <></>}
                        {this.compareGeomtryDifference(index, layer) ?
                          <div>
                            تم التعديل على أبعاد الموقع
                          </div> : <></>}
                      </div> : <></>)
              })
              }

            </div> : <></>)
        })}
      </div>
    )

  }
}
