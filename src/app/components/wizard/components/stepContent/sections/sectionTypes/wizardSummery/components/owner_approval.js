import React, { Component } from "react";
import { host } from "configFiles/config";
export default class OwnerApproval extends Component {
  render() {
    const { owner_approval } = this.props.mainObject.owner_approval;
    console.log("GG", owner_approval);
    return (
      <>
        <div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>موافقة المالك</td>
                <td>
                  {owner_approval["acceptOrReject"] == "1"
                    ? " موافق "
                    : " غير موافق"}
                </td>
              </tr>

              {owner_approval["details"] && (
                <tr>
                  <td>السبب </td>
                  <td>{owner_approval["details"]}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
