import React, { Component } from 'react'

export default class selectEditingWorkFlow extends Component {

  getMasar(type) {

    let types = [
      { label: "تعديل بيانات جغرافية", value: "edit" },
      { label: "حذف بيانات جغرافية", value: "delete" },
      { label: "تحديث الإحداثيات", value: "update_geo" }];

    return types.find((t) => t.value == type)?.label;
  }


  render() {

    const { mainObject: { selectEditingWorkFlow: { selectWorkFlow: { workflowType } } } } = this.props

    return (
      <div>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>
                مسار العمل
              </td>
              <td>
                {this.getMasar(workflowType)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
