import React, { Component } from 'react'

export default class locationData extends Component {
  render() {

    const { uploadFileDetails } = this.props.mainObject.locationData;

    return (
      <div>
        <table className="table table-bordered">
          <tbody>
            <tr>
              {uploadFileDetails?.activeLayerDetails?.label &&
              <td>
                اسم الطبقة
              </td>}
              {uploadFileDetails?.activeLayerDetails?.label && 
              <td>
                {uploadFileDetails.activeLayerDetails.label}
              </td>}
            </tr>
            <tr>
              <td>
                نوع الملف المرفوع
              </td>
              <td>
                {uploadFileDetails.fileType}
              </td>
            </tr>
            {uploadFileDetails?.activeLayerDetails?.outFields?.filter((x) => x.mappingField).map((outField) => {
              return (
                <tr>
                  <td>
                    {outField.arName}
                  </td>
                  <td>
                    {outField.mappingField}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}
