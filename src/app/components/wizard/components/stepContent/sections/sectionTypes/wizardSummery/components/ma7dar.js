import React, { Component } from "react";
import { host } from "imports/config";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
class ma7dar extends Component {
  print() {
    const {
      currentModule: { record },
    } = this.props;

    let id = record.id;
    window.open(printHost + `/#/addedparcel_temp3/${id}`, "_blank");
  }
  render() {
    // let x = localStorage.getItem("edit_price");
    // let ma7dar_mola5s = this.props.mainObject.ma7dar.ma7dar_mola5s;
    let ma7dar_mola5s =
      (!this.props?.treeNode?.option?.data?.ma7dar_mola5s &&
        this.props?.data?.ma7dar_mola5s) ||
      this.props?.treeNode?.option?.data?.ma7dar_mola5s;
    let imgSrc = (ma7dar_mola5s && ma7dar_mola5s["attachment"]) || "";
    // console.log("GG", this.props.mainObject.ma7dar.ma7dar_mola5s);
    return (
      <>
        {ma7dar_mola5s && (
          <div>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>تاريخ المحضر</td>
                  <td>{ma7dar_mola5s["date"]}</td>
                </tr>
                <tr>
                  <td>سعر المتر</td>
                  <td>{ma7dar_mola5s["meter_price"]}</td>
                </tr>

                <tr>
                  <td> سعر المتر بالحروف</td>
                  <td>{ma7dar_mola5s["text_meter"]}</td>
                </tr>
                <tr>
                  <td>القيمة الاجمالية</td>
                  <td>{ma7dar_mola5s["declaration"]}</td>
                </tr>
                <tr>
                  <td>القيمة الاجمالية بالحروف</td>
                  <td>{ma7dar_mola5s["text_declaration"]}</td>
                </tr>
                <tr>
                  <td>نسخة من محضر لجنة التقدير</td>
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
                  <td>طباعة محضر التقدير</td>
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
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(ma7dar));
