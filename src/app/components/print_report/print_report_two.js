import React, { Component } from "react";
import { get } from "lodash";
import { message, Button } from "antd";
import axios from "axios";
// import mainObject from './main_object'
import { workFlowUrl, backEndUrlforMap } from "../../../imports/config";
import Committee from "app/helpers/modules/imp_project/committee";
import {
  max,
  isObject,
  mergeWith,
  isNumber,
  mapValues,
  sortBy,
  filter,
} from "lodash";

export default class Report extends Component {
  state = {
    mainObject: null,
    request_no: "",
  };

  getName(type) {
    let names = {
      "Under Ground": "القبو",
      "Ground Attached": "ملحق أرض",
      Ground: "دور أرضي",
      Level: "مستوي",
      Outside: "ملحق خارجي",
      Mezaneen: "ميزانين",
      Repeated: "دور متكرر",
      "Upper Attached": "ملحق علوي",
      Amin: "الامين",
      "Amin Representer": "وكيل الامين للتعمير والمشاريع",
      "Representer Helper": "مساعد وكيل الامين للتعمير والمشاريع",
      "Project Manager": "مدير ادارة المشاريع الكبري",
      "Important Project Engineer": "مهندس مشاريع هامة",
      House: "سكني",
      Trade: "تجاري",
      Service: "خدمة",
      Manage: "إداري",
    };
    return names[type];
  }

  componentDidMount() {
    let self = this;
    axios
      .get(workFlowUrl + "/api/Submission/" + this.props.params.id)
      .then(({ data }) => {
        let submission = data;
        /*if(!submission.committee_report_no){
        return
      }*/

        // submission.committees.committee_actors =
        // sortBy(filter(Committee.sections.members.fields, (d, key) =>
        // (get(submission.committees.committee_actors, key, false))), 'index')
        // data = mainObject
        axios
          .get(backEndUrlforMap + data.submission_file_path + "mainObject.json")
          //.get("http://localhost:8080/www/mainObject.json")
          .then((data) => {
            data.data =
              (typeof data.data == "string" &&
                JSON.parse(window.lzString.decompressFromBase64(data.data))) ||
              data.data;
            var mainObject = data.data;
            //
            submission.committees = submission.committees || {};
            //submission.committees.committee_actors = sortBy(filter(Committee.sections.members.fields, (d, key) => (get(data, `data.committee.members.${key}`, false))), 'index')
            submission.committees.committee_actors =
              mainObject.committee.members.main;

            var prepareCommitteeActors = [];
            Object.keys(submission?.committees?.committee_actors).forEach(
              (key) => {
                prepareCommitteeActors.push(
                  submission?.committees?.committee_actors[key]
                );
              }
            );

            prepareCommitteeActors = prepareCommitteeActors.filter((item) => {
              return item.active;
            });
            prepareCommitteeActors = prepareCommitteeActors.sort((a, b) =>
              a.sign_order > b.sign_order
                ? 1
                : b.sign_order > a.sign_order
                ? -1
                : 0
            );

            submission.committees.committee_actors = prepareCommitteeActors;

            //

            const buildings = data.data.building.buildingData.buildings;
            const merged = Object.keys(buildings).map((t) =>
              mapValues(buildings[t], (d, k) => {
                if (!this.keys.includes(k)) {
                  return Number(d) * Number(buildings[t].repeat);
                }
                if (isObject(d)) {
                  return this.mappingFields(d, buildings[t]);
                }
                return d;
              })
            );
            const totals = mergeWith({}, ...merged, (objVal, srcVal, key) => {
              if (!isObject(objVal)) {
                console.log(key);
                if (this.maxKeys.includes(key)) {
                  return max([objVal, srcVal]);
                }
                return isNumber(objVal)
                  ? Number(objVal) + Number(srcVal)
                  : srcVal;
              }
              return {
                ...objVal,
                ...srcVal,
              };
            });

            //  .keys(data.data.building.buildingData.buildings)
            let temp = [];
            Object.keys(totals.floors).map((key, index) => {
              let floor = totals.floors[key];
              let f = temp.find((d) => {
                return d.type == floor.type;
              });
              if (f) {
                f.area += floor.area * +floor.repeat;
                f.floorCount += +floor.repeat * +totals.repeat;
                f.unitsCount += floor.flats
                  ? Object.keys(floor.flats).length *
                    +floor.repeat *
                    +totals.repeat
                  : 0;
              } else {
                floor.area = floor.area * +floor.repeat;
                floor.floorCount = +floor.repeat * +totals.repeat;
                floor.unitsCount = floor.flats
                  ? Object.keys(floor.flats).length *
                    +floor.repeat *
                    +totals.repeat
                  : 0;

                temp.push(floor);
              }
            });

            totals.floorsCalc = temp;

            data.data.building.buildingData.buildings = totals;

            self.setState({ mainObject: data.data, submission: submission });
          })
          .catch((data) => {
            message.error("حدث خطأ");
          });
      })
      .catch((data) => {
        console.log(data);
        message.error("حدث خطأ");
      });
  }

  mappingFields = (obj, build) => {
    return mapValues(obj, (d, k) => {
      if (isObject(d)) {
        return this.mappingFields(d, build);
      }
      if (!this.keys.includes(k)) {
        return Number(d) * Number(build.repeat);
      }
      return d;
    });
  };
  keys = [
    "floors",
    "height",
    "flats",
    "far",
    "type",
    "repeat",
    "name",
    "flat_name",
    "flat_use",
    "main_id",
    "use",
    "surround",
  ];
  maxKeys = ["height"];
  obKeys = ["floors", "surround"];

  print() {
    window.print();
  }
  render() {
    //
    const mainObject = this.state.mainObject;
    console.log("ddd", mainObject);
    const building =
      mainObject &&
      mainObject.building &&
      mainObject.building.buildingData.buildings;

    return (
      mainObject && (
        <div className="report_two_container">
          <div>
            <button
              className="btn btn-warning hidd"
              style={{
                float: "left",
              }}
              onClick={this.print.bind(this)}
            >
              طباعة
            </button>
          </div>
          <div className="report-two">
            <div
              style={{
                textAlign: "center",
              }}
            >
              <h5>المملكة العربية السعودية</h5>
              <h4>وزارة الشئون البلدية و القروية</h4>
              <h6>أمانة المنطقة الشرقية</h6>
              <h6>إدارة الرخص التجارية والمشاريع الكبرى {window.appvesrion}</h6>
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 3fr",
                    justifyItems: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>اسم صاحب الرخصه:</span>
                  <span>
                    {mainObject.ownerData &&
                      mainObject.ownerData.ownerData.owners[
                        Object.keys(mainObject.ownerData.ownerData.owners)[0]
                      ].name}
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 3fr",
                    justifyItems: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>رقم السجل التجاري :</span>
                  <span>
                    {mainObject.ownerData &&
                      mainObject.ownerData.ownerData.owners[
                        Object.keys(mainObject.ownerData.ownerData.owners)[0]
                      ].ssn}
                  </span>
                </div>
              </div>
            </div>
            <div
              style={{
                gridColumn: "1/4",
                margin: "10px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(9,auto)",
                  justifyItems: "right",
                  gridGap: "10px",
                }}
              >
                {mainObject.sakData &&
                  Object.keys(mainObject.sakData.sakData.saks).map((d, k) => {
                    return (
                      <div
                        key={k}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gridGap: "18px",
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: "bold" }}>رقم الصك :</span>{" "}
                          {mainObject.sakData.sakData.saks[d].number}{" "}
                        </div>
                        <div>
                          {" "}
                          <span style={{ fontWeight: "bold" }}>
                            تاريخه :
                          </span>{" "}
                          {mainObject.sakData.sakData.saks[d].date}
                        </div>
                        <div>
                          {" "}
                          <span style={{ fontWeight: "bold" }}>
                            مصدره :
                          </span>{" "}
                          {mainObject.sakData.sakData.saks[d].issuer}
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(9,auto)",
                  justifyItems: "right",
                  gridGap: "10px",
                }}
              >
                <span style={{ fontWeight: "bold" }}>رقم قطعة الارض:</span>
                <span>
                  {mainObject.landData.landData.lands.parcels
                    .map((d) => {
                      return d.attributes.PARCEL_PLAN_NO;
                    })
                    .join(",")}
                </span>
                <span style={{ fontWeight: "bold" }}>:بالمخطط</span>
                <span>
                  {
                    mainObject.landData.landData.lands.parcels[0].attributes
                      .PLAN_NO
                  }
                </span>
                <span style={{ fontWeight: "bold" }}>بحى:</span>
                <span>
                  {
                    mainObject.landData.landData.lands.parcels[0].attributes
                      .DISTRICT_NAME
                  }
                </span>
              </div>

              <div
                style={{
                  gridColumn: "1/4",
                }}
              >
                <span>المبنى عبارة عن</span>: تجاري<span></span>
              </div>
            </div>

            <div
              style={{
                gridColumn: "2/3",
                gridRow: "1/4",
              }}
            >
              <img
                style={{
                  width: "150px",
                  marginRight: "20px",
                }}
                src="images/logo2.png"
              />
              <div style={{ textAlign: "center" }}>
                <p>رخصة موافقة مبدئية</p>
                <p>مدة صلاحية استخدامها 90 يوم</p>
              </div>
            </div>
            <div
              style={{
                gridColumn: "3/4",
                gridRow: "1",
              }}
            >
              <div>
                <span>رقم الرخصة</span>:
                <span>{this.state.submission.committee_report_no}</span>
              </div>
              <div>
                <span>تاريخ صدورها :</span>

                <span>{this.state.submission.committee_date}</span>
              </div>
              <div>
                <span>تاريخ انتهائها :</span>

                <span>10/5/1445</span>
              </div>
              <div>
                <span>نوع الرخصة :</span>

                <span>تجاري</span>
              </div>
              <div>
                <span>رقم الطلب :</span>

                <span>{this.state.submission.request_no}</span>
              </div>
              <div>
                <span>نوع الإصدار :</span>

                <span>رخصة جديدة</span>
              </div>
            </div>
          </div>
          <div className="tb_cont">
            <div>
              <h5 className="head_tb">
                الحدود و الابعاد و الارتدادات (للمتكرر) بالمتر
              </h5>

              <table className="table table-bordered">
                <thead>
                  <th>الجهه</th>
                  <th>حدودها</th>
                  <th>البروز</th>
                  <th>الابعاد(م)</th>
                  <th>الارتداد(م)</th>
                </thead>
                <tbody>
                  <tr>
                    <td>الشمال</td>
                    <td>{mainObject.landData.submission_data.north_desc}</td>
                    <td>{building.surround["north"].forward}</td>
                    <td>{mainObject.landData.submission_data.north_length}</td>
                    <td>{building.surround["north"].backward}</td>
                  </tr>
                  <tr>
                    <td>الجنوب</td>
                    <td>{mainObject.landData.submission_data.south_desc}</td>
                    <td>{building.surround["south"].forward}</td>
                    <td>{mainObject.landData.submission_data.south_length}</td>
                    <td>{building.surround["south"].backward}</td>
                  </tr>
                  <tr>
                    <td>الشرق</td>
                    <td>{mainObject.landData.submission_data.east_desc}</td>
                    <td>{building.surround["east"].forward}</td>
                    <td>{mainObject.landData.submission_data.east_length}</td>
                    <td>{building.surround["east"].backward}</td>
                  </tr>
                  <tr>
                    <td>الغرب</td>
                    <td>{mainObject.landData.submission_data.west_desc}</td>
                    <td>{building.surround["west"].forward}</td>
                    <td>{mainObject.landData.submission_data.west_length}</td>
                    <td>{building.surround["west"].backward}</td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td>مساحة الارض</td>
                    <td>
                      {mainObject.landData.landData.lands.parcels.reduce(
                        (a, b) => a + b.attributes.PARCEL_AREA,
                        0
                      )}
                    </td>
                    <td>م2</td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-bordered">
                <thead>
                  <th>نوع الطابق</th>
                  <th>عدد الطابق</th>
                  <th>عدد الوحدات</th>
                  <th>الاستخدام</th>
                  <th>المساحة</th>
                  <th>وحدة القياس</th>
                </thead>
                <tbody>
                  {Object.keys(building.floors).map((key, index) => {
                    const floor = building.floors[key];
                    return (
                      <tr key={key}>
                        <td>{this.getName(floor.type)}</td>
                        <td>{floor.floorCount}</td>
                        <td>{floor.unitsCount}</td>
                        <td>{this.getName(floor.flat_use) || "-"}</td>
                        <td>{floor.area}</td>
                        <td>م2</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td>الوارش</td>
                    <td>{building.warch} م</td>

                    <td>السور</td>
                    <td>{building.fence} م</td>
                  </tr>
                  <tr>
                    <td>مساحة البناء الكلى</td>
                    <td>
                      {building.total_area}
                      م2
                    </td>
                    <td>نسبة البناء</td>
                    <td>{building.building_ratio.toFixed(2)}%</td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td>المكتب الهندسى المصمم</td>
                    <td>{get(mainObject, "building.user.name")}</td>
                  </tr>
                  <tr>
                    <td>المكتب المشرف</td>
                    <td>{mainObject.approvals.approvals.engineering_super}</td>
                  </tr>
                </tbody>
              </table>
              {/* <div className="tb_notes">
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  ملاحظات :
                </span>
                <span>
                  اتخاذ الإجراءات اللازمة لمعالجة الأجزاء الصامتة للمباني
                  القائمة وعدم تركها دون تشطيب وكذلك الأسوار و الحوائط المطلة
                  على الجيران.
                </span>
              </div> */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,auto)",
                  justifyContent: "flex-start",
                  gridGap: "20px",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  رقم خطاب الدفاع المدنى
                </span>
                <span>
                  {mainObject.approvals.approvals.defnece_letter_number}
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  وتاريخه
                </span>
                <span>
                  {mainObject.approvals.approvals.defnece_letter_date}
                </span>
              </div>
            </div>
            <div className="img_cont">
              <div>
                <h5 className="head_tb">الواجهة</h5>
                <div
                  style={{
                    borderBottom: "1px solid",
                  }}
                >
                  <img
                    src={
                      workFlowUrl +
                      "/" +
                      mainObject.building.buildingData.side_image
                    }
                    style={{
                      width: "200px",
                    }}
                  />
                </div>
              </div>
              <div>
                <h5 className="head_tb">الموقع العام</h5>
                <div
                  style={{
                    borderBottom: "1px solid",
                  }}
                >
                  <img
                    src={
                      workFlowUrl +
                      "/" +
                      mainObject.building.buildingData.top_image
                    }
                    style={{
                      width: "200px",
                    }}
                  />
                </div>
              </div>
              <div>
                <h5 className="head_tb">الموقع بالنسبة للصورة الفضائية</h5>
                <div
                  style={{
                    borderBottom: "1px solid",
                  }}
                >
                  <img
                    src={
                      backEndUrlforMap +
                      mainObject.landData.submission_data.approvedUrl
                    }
                    style={{
                      width: "100%",
                    }}
                  />
                </div>
              </div>
              <div>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td
                        rowSpan="2"
                        style={{
                          verticalAlign: "middle",
                        }}
                      >
                        احداثيات الموقع
                      </td>
                      <td>
                        الشماليات :
                        <span
                          style={{
                            direction: "ltr",
                            display: "inline-block",
                          }}
                        >
                          {
                            mainObject.landData.landData.lands.parcels[0]
                              .attributes.PARCEL_LAT_COORD
                          }
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        الشرقيات :
                        <span
                          style={{
                            direction: "ltr",
                            display: "inline-block",
                          }}
                        >
                          {
                            mainObject.landData.landData.lands.parcels[0]
                              .attributes.PARCEL_LONG_COORD
                          }
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                className="tb_tanbeh"
                style={{
                  textAlign: "right",
                  margin: "11px",
                  zoom: ".62",
                }}
              >
                <p>
                  بخصوص الحصول على الموافقات المبدئية للمشاريع فإنها تمكن وتفتح
                  المجال للمالك والمكتب الهندسي لإنهاء عدد من الإجراءات اللي تخص
                  المشروع ويكون بعضها أساسياً للحصول على الرخصة النهائية وهي
                  ملخصة كالتالي: * متطلبات أساسية لإصدار الرخصة: - موافقة شركة
                  الكهرباء (شهادة التنسيق) لتحديد احمال المشروع وعدد الوحدات ((
                  هذه النقطه سيتم استبعادها بسبب ارتباطها في نظام بلدي )) -
                  موافقة ادارة الدفاع المدني - موافقة مصلحة المياه - متابعة
                  إدارة السلامة المرورية والحصول على موافقتها ( في حال تطلب
                  المشروع ) واعداد الدراسات المرورية اذا طُلبت من هذه الإدارة -
                  اعداد الدراسات البيئية ( اذا تطلب المشروع) - متابعة هيئة
                  السياحة والحصول على اعتمادها حسب متطلباتها في حال كان المشروع
                  سياحي -متابعة وزارة الصحه والحصول على اعتمادها حسب المتطلبات
                  في حال كان المشروع صحي - إعداد الرسومات التنفيذية للمشروع
                  لكافة التخصصات الهندسية ، الانشائي ، والميكانيكي، والكهربائي
                  وفق الكود السعودي -تسوير الارض بسور مؤقت حديدي او خشبي مع
                  توفير وسائل السلامه والبدء باعمال الحفر وتهيئة الارض قبل
                  الشروع في اعمال البناء * متطلبات غير أساسية لإصدار الرخصة
                  ولكنها مكملة لإنهاء المشروع بشكل صحيح: - عمل جسات التربة
                  للمشروع - اعداد دراسات جدوى للمشروع - ابرام عقود للاشراف او
                  التسويق للمشروع
                </p>
                {/* <h5>تنبيه</h5>
                  <h6>1- يلزم ان تكون الملاحق العلوية بالجزء الخلفى من المبنى</h6>
                  <h6>2-أى مخالفة لهذا الترخيص تطبق لائحة الغرامات والجزائات عن المخالفت البلدية
                    الصادرة بقرار مجلس الوزراء رقم (218) فى 8/6/1422 هـ</h6> */}
              </div>
              {/* <div
                  style={{
                  textAlign: 'right',
                  margin: '10px'
                }}>
                  <div>
                    <span style={{
                      fontWeight: 'bold'
                    }}>الرسوم المستحقة على الرخصة : 
                    </span>
                    <span style={{
                      fontWeight: 'bold'
                    }}>{this.state.submission.fees} ريال</span>
                  </div>
                  <div>
                    <span style={{
                      fontWeight: 'bold'
                    }}>
                      و تم سدادها بموجب الايصال رقم : 
                    </span>
                    <span style={{
                      fontWeight: 'bold'
                    }}>{this.state.submission.invoice_number}</span>
                  </div>
                 
                </div> */}
            </div>
            <div className="emda">
              {this.state.submission?.committees?.committee_actors.map(
                (item, key) => {
                  return <div key={key}>{this.getName(item.label)}</div>;
                }
              )}
            </div>
          </div>
        </div>
      )
    );
  }
}
