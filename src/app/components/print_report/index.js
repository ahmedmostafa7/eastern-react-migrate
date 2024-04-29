import React, { Component } from "react";
import { get, map, omit, last, head, orderBy } from "lodash";
import { fetchData } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
import { backEndUrlforMap } from "configFiles/config";
import moment from "moment-hijri";
import Header from "app/components/print/header";
const sub_status = {
  1: "جديد",
  2: "معدل",
  3: "مؤرشف",
};

const sub_type = {
  1: "خاص",
  2: "حكومي",
  3: "حكومي",
};

const credentials = {
  1: "أمانة",
  2: "وزارة",
  3: "وزارة",
};

const one_day_ms = 1000 * 60 * 60 * 24;

class printReport extends Component {
  state = {
    reportList: [],
  };

  formatDate(dateArray) {
    const dateArrayInt = map(dateArray, (value) => parseInt(value));
    return new Date(dateArrayInt[2], dateArrayInt[1] - 1, dateArrayInt[0]);
  }

  componentDidMount() {
    const { t } = this.props;
    const submissions = get(window, "submissions", []);
    let list = [...this.state.reportList];

    fetchData(`/Steps/isOut`).then(
      (data) => {
        let maktabStepId = data;

        submissions.map((val, index) => {
          let submission_history = get(val, "submission_history", {});
          let maktab_time = 0;

          const lastDate = moment(
            last(submission_history).created_date,
            "iD/iM/iYYYY"
          ).format("D/M/YYYY");
          const firstDate = moment(
            head(submission_history).created_date,
            "iD/iM/iYYYY"
          ).format("D/M/YYYY");
          let all_time =
            this.formatDate(lastDate.split("/")) -
            this.formatDate(firstDate.split("/"));

          all_time = all_time / one_day_ms;

          submission_history.map((hist, index) => {
            if (hist.step_id == maktabStepId) {
              let miladeyStart = moment(
                hist.created_date,
                "iD/iM/iYYYY"
              ).format("D/M/YYYY");
              let miladeyEnd = moment(
                submission_history[index + 1].created_date,
                "iD/iM/iYYYY"
              ).format("D/M/YYYY");

              let startDate = this.formatDate(miladeyStart.split("/"));
              let endDate = this.formatDate(miladeyEnd.split("/"));

              maktab_time = maktab_time + (endDate - startDate);
            }
          });

          maktab_time = maktab_time / one_day_ms;
          list[index] = {
            maktab_time, // مدة الانجاز لدى المكتب الهندسي
            all_time, // مدة الانجاز الاجمالية
            rest_time: all_time - maktab_time, // مدة الانجاز لدى ادارة التخطيط
          };

          const url = `${backEndUrlforMap}${get(
            val,
            "submission_file_path",
            ""
          )}mainObject.json`;
          fetchData(url)
            .then((resp) => {
              resp =
                (typeof resp == "string" &&
                  JSON.parse(window.lzString.decompressFromBase64(resp))) ||
                resp;
              let number_of_lands = 0;
              let area = 0;
              map(
                omit(get(resp, "plan_budget.plan_budget.percentages", {}), [
                  "Sum",
                ]),
                (single) => {
                  single.map((singleLand) => {
                    if (singleLand.number_of_pieces) {
                      number_of_lands =
                        number_of_lands + parseInt(singleLand.number_of_pieces);
                      area = area + parseFloat(singleLand.area);
                    }
                  });
                }
              );

              list[index] = {
                ...list[index],
                plan_name: get(resp, "landData.landData.plan_name", ""), // اسم المخطط
                plan_number: get(resp, "landData.landData.land_number", ""), // رقم المخطط
                land_usage: get(resp, "landData.landData.land_usage", ""), // الاستخدام -> id
                district: get(resp, "landData.landData.district_id", ""), // الحي -> id
                engineering: get(resp, "basic_data.basic_data.name", ""), // المكتب الهندسي
                date: get(resp, "firstApproval.firstApproval.ruling_year", ""), //
                credentials: get(
                  credentials,
                  get(resp, "firstData.firstData.credentials", ""),
                  ""
                ), //جهة الاعتماد
                submission_state: get(
                  sub_status,
                  get(resp, "firstData.firstData.submission_type", ""),
                  ""
                ), //وضع المخطط
                submission_type: get(
                  sub_type,
                  get(resp, "ownerData.ownerData.owner_type", ""),
                  ""
                ), // نوع المخطط
                number_of_lands, // عدد القطع
                area, // المساحة م2
              };
              this.setState({ reportList: list });
            })
            .catch((err) => handleErrorMessages(err, t));
        });
      },
      (err) => handleErrorMessages(err, t)
    );
  }

  render() {
    console.log("State", this.state.reportList);
    return (
      <div className="table-report-container">
        <Header />
        <div className="table-pr">
          <div style={{ display: "grid", justifyContent: "flex-end" }}>
            <button
              className="btn btn-warning hidd"
              onClick={() => {
                window.print();
              }}
            >
              طباعه
            </button>
          </div>
          <table className="table table-bordered" style={{ marginTop: "3%" }}>
            <thead>
              <th>م</th>
              <th>اسم المدينة او القرية</th>
              <th> اسم المخطط</th>
              <th> رقم المخطط</th>
              <th>الاستخدام </th>
              <th>الحى</th>
              <th> المكتب الهندسى</th>
              <th>
                {" "}
                الاعتماد<div>التاريخ</div>
              </th>
              <th>
                جهه الاعتماد
                <td className="grid3">
                  <div className="first f-a">الوزارة </div>
                  <div>|</div>
                  <div className="f-a">الامانة</div>
                </td>
              </th>
              <th>
                وضع المخطط
                <td className="grid3">
                  <div className="first f-a">جديد </div>
                  <div>|</div>
                  <div className="f-a">معدل</div>
                </td>
              </th>
              <th>
                نوع المخطط
                <td className="grid3">
                  <div className="first f-a">خاص </div>
                  <div>|</div>
                  <div className="f-a">حكومي</div>
                </td>
              </th>
              <th>مده الانجاز لدى المكتب الهندسى</th>
              <th>مدى الانجاز لدى ادارة التخطيط</th>
              <th>مده الانجاز الاجمالية</th>
              <th>عدد القطع</th>
              <th>المساحة/م2</th>
            </thead>
            <tbody>
              {this.state.reportList.map((d, k) => {
                console.log("fff", d);
                return (
                  <tr key={k}>
                    <td>{k + 1}</td>
                    <td> الرياض</td>
                    <td>{get(d, "plan_name", "بدون")}</td>
                    <td>{get(d, "plan_number", "بدون")}</td>
                    <td>{get(d, "land_usage", "بدون")}</td>
                    <td>{get(d, "district", "بدون")}</td>
                    <td>{get(d, "engineering", "بدون")}</td>
                    <td>{get(d, "date", "بدون")}</td>

                    <td>
                      <span className="grid2">
                        {get(d, "credentials", "بدون").includes("وزارة") ? (
                          <span className="icon-color">
                            <i
                              className={"fa fa-check-circle"}
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                        ) : (
                          <span className="icon-color-red">
                            <i className={"fa fa-times"} aria-hidden="true"></i>{" "}
                          </span>
                        )}
                        {get(d, "credentials", "بدون").includes("امانة") ? (
                          <span className="icon-color">
                            <i
                              className={"fa fa-check-circle"}
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                        ) : (
                          <span className="icon-color-red">
                            <i className={"fa fa-times"} aria-hidden="true"></i>{" "}
                          </span>
                        )}
                      </span>
                    </td>

                    <td>
                      <span className="grid2">
                        {get(d, "submission_state", "بدون").includes("جديد") ? (
                          <span className="icon-color">
                            <i
                              className={"fa fa-check-circle"}
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                        ) : (
                          <span className="icon-color-red">
                            <i className={"fa fa-times"} aria-hidden="true"></i>{" "}
                          </span>
                        )}
                        {get(d, "submission_state", "بدون").includes("معدل") ? (
                          <span className="icon-color">
                            <i
                              className={"fa fa-check-circle"}
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                        ) : (
                          <span className="icon-color-red">
                            <i className={"fa fa-times"} aria-hidden="true"></i>{" "}
                          </span>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="grid2">
                        {get(d, "submission_type", "بدون").includes("خاص") ? (
                          <span className="icon-color">
                            <i
                              className={"fa fa-check-circle"}
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                        ) : (
                          <span className="icon-color-red">
                            <i className={"fa fa-times"} aria-hidden="true"></i>{" "}
                          </span>
                        )}
                        {get(d, "submission_type", "بدون").includes("حكومى") ? (
                          <span className="icon-color">
                            <i
                              className={"fa fa-check-circle"}
                              aria-hidden="true"
                            ></i>{" "}
                          </span>
                        ) : (
                          <span className="icon-color-red">
                            <i className={"fa fa-times"} aria-hidden="true"></i>{" "}
                          </span>
                        )}
                      </span>
                    </td>

                    <td>{get(d, "maktab_time", "بدون")}</td>
                    <td>{get(d, "rest_time", "بدون")}</td>
                    <td>{get(d, "all_time", "بدون")}</td>
                    <td>{get(d, "number_of_lands", "بدون")}</td>
                    <td>{get(d, "area", "بدون")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default printReport;
