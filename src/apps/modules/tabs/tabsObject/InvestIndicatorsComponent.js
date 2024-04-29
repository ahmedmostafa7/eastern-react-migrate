import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "antd";
import PieIndicator from "./investIndicators-Components/PieIndicator";
import { groupBy, map } from "lodash";
import BarIndicator from "./investIndicators-Components/BarIndicator";
import axios from "axios";
export default function InvestIndicatorsComponent() {
  const [delayed, setDelayed] = useState([]);
  const [municipality_delayed, setMunDelayed] = useState([]);
  const [progress, setProgress] = useState([]);
  const [landChart, setLandChart] = useState([]);
  const [munChart, setMunChart] = useState([]);
  const [planChart, setPlanChart] = useState([]);

  const [activities, setActivities] = useState([]);
  const [landsEfadaCount, setLandEfadaCount] = useState([]);
  const [allefada, setAllEfada] = useState([]);

  const [sumCount, setAllSubmissionsCount] = useState([]);
  useEffect(() => {
    axios
      .get(
        window.host +
          `/submission/statistics/workflow/${2154}/SubmnsCountPerStep?delayedOnly=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        let delayed = res.data
          .map((d) => ({
            name: d.categoryName,
            value: d.count,
          }))
          .filter((x) => x.name != null);
        console.log(groupBy(delayed, "name"));
        let groupedDelayed = map(groupBy(delayed, "name"), (v, k) => {
          return {
            name: k,
            "عدد المعاملات": v.map((x) => x.value).reduce((a, b) => a + b, 0),
          };
        }).filter((x) => x.name != "البلديات");
        setDelayed(groupedDelayed);

        console.log("[[[", groupedDelayed);
      });
    axios
      .get(window.host + `/submission/statistics/InvestmentActivitiesCount`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setActivities(
          res.data.map((d) => ({
            name: d.activity,
            "عدد المعاملات": d.count,
          }))
        );
      });
    axios
      .get(
        window.host +
          `/submission/statistics/workflow/${2154}/SubmnsCountPerStep?delayedOnly=false`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setProgress(
          res.data
            .map((d) => ({
              name: d.name,
              "عدد المعاملات": d.count,
            }))
            .filter((x) => x.name != "تحديث طبقة الاستثمارات")
        );
      });

    axios
      .get(
        window.host +
          `/submission/statistics/workflow/2154/SubmnsCountPerMunStep?delayedOnly=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      )

      .then((res) => {
        console.log(res);
        let MunCategory = res.data.map((d) => ({
          name: d.munName,
          "عدد المعاملات": d.steps
            .flatMap((x) => x)
            .filter((s) => s.categoryName == "البلديات")
            .map((x) => x.count)
            .reduce((a, b) => a + b, 0),
        }));

        setMunDelayed(MunCategory);

        // let munName = res.data.map(x => x.munName)

        // let groupedDelayed = map(groupBy(MunDelayed, "categoryName"), (v, k) => {
        //   return {
        //     name: k,
        //     "عدد المعاملات": v.map((x) => x.count).reduce((a, b) => a + b, 0),
        //   };
        // });

        console.log("edede", MunCategory);
      });
    axios
      .get(window.host + `/submission/statistics/InvestmentEfadaCountSummary`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        let landsEfadaCount = res?.data.landsEfadaCount;
        let municipalityEfadaCount = res?.data.municipalityEfadaCount;
        let planEfadaCount = res?.data.planEfadaCount;
        let allefadaArr = [];
        allefadaArr.push(
          {
            name: "عائدة للأمانة",
            value: landsEfadaCount.accepted,
          },
          { name: "غير عائدة للأمانة", value: landsEfadaCount.rejected },
          { name: "موافق", value: planEfadaCount.accepted },
          { name: "مرفوض", value: planEfadaCount.rejected },
          { name: "لايوجد عائق", value: municipalityEfadaCount.accepted },
          {
            name: "يوجد عائق",
            value: municipalityEfadaCount.rejected,
          }
        );

        setAllEfada(allefadaArr);
        setLandEfadaCount(landsEfadaCount);
        setAllSubmissionsCount(
          Object.values(landsEfadaCount).reduce((a, b) => a + b, 0)
        );
        // setAllSubmissionsCount(allefadaArr.map(x => x.value).reduce((a, b) => a + b, 0))
        // allefadaArr.map(d=>d)
        // setPlanChart(sumSubmission(planEfadaCount, "planEfada"));
        // setLandChart(sumSubmission(landsEfadaCount, "landEfada"));
        // setMunChart(sumSubmission(municipalityEfadaCount, "munEfada"));
        console.log(allefadaArr, landsEfadaCount);
      });
  }, []);

  const sumSubmission = (obj, name) => {
    return { name: name, value: Object.values(obj).reduce((a, b) => a + b, 0) };
  };

  return (
    <div className="indicators">
      <Row style={{ margin: "25px" }}>
        {/* <Col md={{ span: 12 }} xl={{ span: 4 }} sm={{ span: 24 }}>
         
          <h5>أعداد المواقع بالمعاملات المتأخرة للبلديات</h5>
          <PieIndicator height="100%" data={municipality_delayed} />
        </Col> */}

        <Col md={{ span: 12 }} xl={{ span: 8 }} sm={{ span: 24 }}>
          <h5> المعاملات الجارية</h5>{" "}
          <BarIndicator
            height="100%"
            count="count"
            data={progress}
            color={"#11823b"}
          />
        </Col>
        <Col
          md={{ span: 12 }}
          xl={{ span: 8 }}
          sm={{ span: 24 }}
          style={{ borderLeft: "3px solid #00726f", marginBottom: "50px" }}
        >
          <h5> الاستعلام عن المواقع </h5>
          <PieIndicator height="100%" data={allefada} />
          <div className="siteNumbers" style={{ zoom: 0.7 }}>
            <p>{sumCount}</p>
            <h6>اجمالى المواقع المستعلم عنها</h6>
          </div>
          {/* <div style={{ marginTop: "-14vh", textAlign: "right" }}>
            <table className="table table-bordered">
              {allSubmissions.map((x, k) => {
                return (
                  <tr>
                    <td>
                      <Button
                        className="btn ant-btn-circle"
                        style={{ background: COLORS[k], borderRadius: "50%" }}
                      ></Button>
                    </td>
                    <td>{x.name}</td>
                    <td>{x.value}</td>
                  </tr>
                );
              })}
            </table>
          </div> */}
        </Col>
        <Col
          md={{ span: 12 }}
          xl={{ span: 8 }}
          sm={{ span: 24 }}
          // className="delayed"
          style={{ borderLeft: "3px solid #00726f", marginBottom: "50px" }}
        >
          <h5>المعاملات المتأخرة</h5>

          <BarIndicator
            //noLabels
            height="100%"
            data={delayed.concat(municipality_delayed)}
            //table={true}
            //hideLegend={true}
            color={"#FF0000"}
          />
          <p style={{ textAlign: "right", position: "absolute" }}>
            حساب المعاملات المتأخرة بعد تجاوز ال <strong>٣</strong> أيام
          </p>
          {/* <div style={{ marginTop: "-14vh", textAlign: "right" }}>
            <table className="table table-bordered">
              {delayed.map((x, k) => {
                return (
                  <tr>
                    <td>
                      {" "}
                      <Button
                        className="btn ant-btn-circle"
                        style={{
                          background: x.value > 0 ? COLORS[k] : "",
                          borderRadius: "50%",
                        }}
                      ></Button>
                    </td>
                    <td>{x.name}</td>
                    <td>{x.value}</td>
                  </tr>
                );
              })}
            </table>
          </div> */}
        </Col>

        <Col
          md={{ span: 12 }}
          xl={{ span: 2 }}
          sm={{ span: 24 }}
          style={{ marginTop: "7vh" }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                border: "2px solid",
                padding: "20px",
                display: "grid",
                backgroundColor: "#11823b",
                color: "white",
                borderRadius: "10px",
              }}
            >
              <span>معتمدة</span>
              <span style={{ fontSize: "18px" }}>
                {landsEfadaCount.accepted}
              </span>
            </p>
            <p
              style={{
                border: "2px solid",
                padding: "20px",
                display: "grid",
                backgroundColor: "#FF0000",
                color: "white",
                borderRadius: "10px",
              }}
            >
              <span> غير معتمدة</span>
              <span style={{ fontSize: "18px" }}>
                {landsEfadaCount.rejected}
              </span>
            </p>
          </div>
        </Col>
        <Col
          md={{ span: 12 }}
          xl={{ span: 20 }}
          sm={{ span: 24 }}
          className="activitiesClass"
          style={{ zoom: ".65", marginLeft: "10vw" }}
        >
          <h5 style={{ textAlign: "right", marginTop: "65px" }}>
            الأنشطة المقترحة{" "}
          </h5>
          <BarIndicator height="100%" data={activities} />
          {console.log("heeeeeeeeeeeeeh", activities)}
        </Col>
      </Row>
    </div>
  );
}
