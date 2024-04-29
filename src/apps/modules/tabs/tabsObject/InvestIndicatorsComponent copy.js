import React, { useEffect, useState } from "react"
import { Row, Col } from "antd"
import PieIndicator from "./investIndicators-Components/PieIndicator"
import { groupBy, map } from "lodash"
import BarIndicator from "./investIndicators-Components/BarIndicator"
import axios from "axios"
export default function InvestIndicatorsComponent({ id }) {
  let appId = localStorage.getItem("appId")
  const [delayed, setDelayed] = useState([])
  const [municipality_delayed, setMunDelayed] = useState([])
  const [progress, setProgress] = useState([])
  const [landChart, setLandChart] = useState([])
  const [munChart, setMunChart] = useState([])
  const [planChart, setPlanChart] = useState([])
  const [landsEfadaCountCurrent, setLandCurrent] = useState([])
  const [landsEfadaCountFinished, setLandFinished] = useState([])
  const [municipalityEfadaCountCurrent, setMunCurrent] = useState([])
  const [municipalityEfadaCountFinished, setMunFinished] = useState([])
  const [planEfadaCountCurrent, setPlanCurrent] = useState([])
  const [planEfadaCountFinished, setPlanFinished] = useState([])
  useEffect(() => {


    axios
      .get(window.host + `/submission/statistics/workflow/${2154}/SubmnsCountPerStep?delayedOnly=true`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        console.log(res)
        let delayed = res.data.map(d => ({
          "name": d.categoryName, "value": d.count
        })).filter(x => x.name != null)
        console.log(groupBy(delayed, "name"))
        let groupedDelayed = map(groupBy(delayed, "name"), (v, k) => {
          return {
            "name": k,
            "value": (v.map(x => x.value)).reduce((a, b) => a + b, 0)
          }
        })
        setDelayed(groupedDelayed)

        console.log(groupedDelayed)
      });
    axios
      .get(window.host + `/submission/statistics/workflow/${2154}/SubmnsCountPerStep?delayedOnly=false`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        console.log(res)
        setProgress(res.data.map(d => ({
          "name": d.name, "عدد المعاملات": d.count
        })))
      });
    axios
      .get(window.host + `/submission/statistics/workflow/2154/SubmnsCountPerMunStep?delayedOnly=true`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })

      .then((res) => {
        console.log(res)
        setMunDelayed(res.data.map(d => ({
          "name": d.munName, "value": d.count
        })))
      });
    axios
      .get(window.host + `/submission/statistics/InvestmentEfadaCount`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        let landsEfadaCount = res.data.landsEfadaCount
        let municipalityEfadaCount = res.data.municipalityEfadaCount
        let planEfadaCount = res.data.planEfadaCount

        let planEfada = ["موافق على طرح النشاط و جارية", "مرفوض طرح النشاط و جارية", "موافق على طرح النشاط و منتهية", "مرفوض طرح النشاط و منتهية"]
        let landEfada = ["عائدة للأمانة و جارية", "غير عائدة للأمانة و جارية", "عائدة للأمانة و منتهية", "غير عائدة للأمانة و منتهية"]
        let munEfada = ["يوجد عائق و جارية", "لا يوجد عائق و جارية", "يوجد عائق و منتهية", "لا يوجد عائق و منتهية"]

        setPlanChart(convertDataToChart(planEfadaCount, planEfada))
        setLandChart(convertDataToChart(landsEfadaCount, landEfada))
        setMunChart(convertDataToChart(municipalityEfadaCount, munEfada))
        setPlanFinished(sumSubmission(planEfadaCount.finished))
        setPlanCurrent(sumSubmission(planEfadaCount.current))
        setLandCurrent(sumSubmission(landsEfadaCount.current))
        setLandFinished((sumSubmission(landsEfadaCount.finished)))
        setMunCurrent(sumSubmission(municipalityEfadaCount.current))
        setMunFinished(sumSubmission(municipalityEfadaCount.finished))
        console.log(planChart, munChart, landChart)

        // let planEfadaCountChartData =


        // setLandsEfadaCount(res?.data?.landsEfadaCount)
        // setMunicipalityEfadaCount(res?.data?.municipalityEfadaCount)
        // setPlanEfadaCount(res?.data?.planEfadaCount)
      });
  }, [])

  const sumSubmission = (obj) => {
    return Object.values(obj).reduce((a, b) => a + b, 0)
  }
  const convertDataToChart = (obj, names) => {
    let totalChartData = Object.values(obj).map(d => Object.values(d)).flatMap(d => d)

    return names.map((f, k) => ({
      name: f,
      value: totalChartData[k]
    }))


  }

  return (
    <div className="indicators">

      <Row style={{ marginTop: "20px" }}>
        <Col md={{ span: 12 }} xl={{ span: 7 }} sm={{ span: 24 }}>
          {/* <h5>المعاملات المتأخرة للبلديات</h5> */}
          <h5>أعداد المواقع بالمعاملات المتأخرة للبلديات</h5>
          <PieIndicator height="100%" data={municipality_delayed} />
        </Col>
        <Col md={{ span: 12 }} xl={{ span: 10 }} sm={{ span: 24 }} style={{ borderLeft: "3px solid #00726f", marginBottom: "50px" }}>

          <h5> المعاملات الجارية</h5>{" "}
          <BarIndicator height="100%" count="count" data={progress} />
        </Col>
        <Col
          md={{ span: 12 }}
          xl={{ span: 7 }}
          sm={{ span: 24 }}
          style={{ borderLeft: "3px solid #00726f", marginBottom: "50px" }}>
          <h5>المعاملات المتأخرة</h5>
          <PieIndicator height="100%" data={delayed} />
        </Col>
        <p style={{ textAlign: "right", marginTop: "30px" }}>
          حساب المعاملات المتأخرة بعد تجاوز ال <strong>٣</strong> أيام
        </p>

        <hr />

        <Col
          md={{ span: 12 }}
          xl={{ span: 8 }}
          sm={{ span: 24 }}
        >
          <h5> الإستعلام عن المواقع بالبلديات</h5>{" "}
          <PieIndicator height="95%" data={munChart} />
          <div className="siteNumbers">
            <p>{municipalityEfadaCountCurrent}</p>
            <h6>
              ,<br /> المواقع الجارية <br style={{ paddingTop: "5px" }} />
              المستعلم عنها
            </h6>
          </div>
          <div className="siteNumbers siteNumbers1">
            <p>{municipalityEfadaCountFinished}</p>
            <h6>
              المواقع المنتهية <br style={{ paddingTop: "5px" }} />
              المستعلم عنها
            </h6>
          </div>
        </Col>
        <Col
          md={{ span: 12 }}
          xl={{ span: 8 }}
          sm={{ span: 24 }}
          style={{ borderLeft: "3px solid #00726f" }}>
          <h5> الإستعلام عن المواقع بالتخطيط العمراني</h5>{" "}
          <PieIndicator height="95%" data={planChart} />
          <div className="siteNumbers">
            <p>{planEfadaCountCurrent}</p>
            <h6>
              المواقع الجارية <br style={{ paddingTop: "5px" }} />
              المستعلم عنها
            </h6>
          </div>
          <div className="siteNumbers siteNumbers1">
            <p>{planEfadaCountFinished}</p>
            <h6>
              المواقع المنتهية <br style={{ paddingTop: "5px" }} />
              المستعلم عنها
            </h6>
          </div>
        </Col>

        <Col
          md={{ span: 12 }}
          xl={{ span: 8 }}
          sm={{ span: 24 }}
          style={{ borderLeft: "3px solid #00726f" }}>
          <h5> الإستعلام عن المواقع بالأراضي والممتلكات</h5>{" "}
          <PieIndicator height="95%" data={landChart} />
          <div className="siteNumbers">
            <p>{landsEfadaCountCurrent}</p>
            <h6>
              المواقع الجارية <br style={{ paddingTop: "5px" }} />
              المستعلم عنها
            </h6>
          </div>
          <div className="siteNumbers siteNumbers1">
            <p>{landsEfadaCountFinished}</p>
            <h6>
              المواقع المنتهية <br style={{ paddingTop: "5px" }} />
              المستعلم عنها
            </h6>
          </div>
        </Col>
      </Row>
    </div>
  )
}
