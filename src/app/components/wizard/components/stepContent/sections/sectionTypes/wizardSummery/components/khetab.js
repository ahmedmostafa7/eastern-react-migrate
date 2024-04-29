import React, { Component } from "react";
import { host } from "imports/config";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
class khetab extends Component {
  print() {
    const {
      currentModule: { record },
    } = this.props;

    let id = record.id;
    window.open(printHost + `/#/addedparcel_temp2/${id}`, "_blank");
  }
  render() {
    const { khetab } = this.props.mainObject.khetab;
    let imgSrc = (khetab && khetab["attachment"]) || "";
    console.log("GG", this.props.mainObject.ma7dar_mola5s);
    return (
      <>
        <div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>نسخة من خطاب كتابة العدل </td>
                {imgSrc ? (
                  <td>
                    <a href={window.filesHost + `${imgSrc}`} target="_blank">
                      الملف المرفق
                    </a>
                  </td>
                ) : (
                  <td></td>
                )}
              </tr>
              {/* <tr>
                <td>خطاب كتابة العدل</td>
                <td>
                  <button
                    className="btn add-btnT"
                    onClick={this.print.bind(this)}
                  >
                    طباعة
                  </button>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(khetab));
