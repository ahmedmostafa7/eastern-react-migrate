import React, { useState, useEffect, useContext } from "react";
import styled, { css } from "styled-components";
import { filesHost } from "imports/config";
import { Modal, Checkbox } from "antd";
import { PrintContext } from "../../../../editPrint/Print_data_Provider";
import axios from "axios";
import { postItem } from "app/helpers/apiMethods";
import { workFlowUrl, backEndUrlforMap } from "imports/config";
import SignPics from "../../../../editPrint/signPics";
import { get } from "lodash";
import {
  convertToArabic,
  localizeNumber,
  checkImage,
  getParcelLengthsForContractPrint,
  remove_duplicate,
} from "app/components/inputs/fields/identify/Component/common/common_func";
import { isEmpty } from "lodash";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import EditPrint from "app/components/editPrint";
const ContractPrint = (props) => {
  let {
    request_number,
    owners,
    ZoomRatio,
    skok,
    plan_no,
    parcel_no,
    district_name,
    block_no,
    subdivision_type,
    subdivision_description,
    printObj,
    create_date,
    printId,
    surv_remark,
    export_no,
    export_date,
    update_contract_type,
    newParcels,
    checkBoundries,
    modify_area_increase,
    cadImage,
    north_length,
    south_length,
    east_length,
    west_length,
    north_desc,
    south_desc,
    east_desc,
    west_desc,
    north_letter,
    south_letter,
    east_letter,
    west_letter,
    nature_totalArea_letter,
    committeeactors,
    suggestedParcels,
    sak_type,
    is_paid,
    municipality_name,
    signature_issuers_name,
    signature_issuers_is_court,
    committeeactor_signature,
    committee_report_no,
    dukan,
    title1,
    title2,
    title3,
    title4,
    title5,
    title6,
    title7,
    title8,
    title9,
    title10,
    title11,
    title12,
    title13,
    title14,
    title15,
    title16,
    title17,
    title18,
    title19,
    title20,
    title21,
    title22,
    title23,
    title24,
    title25,
    title26,
    title27,
    title28,
    title29,
    title30,
    title31,
    contract_sign_lagnh,
    title32,
    is_approved,
    surveyManagerName,
    surveyName,
    fullBoundryParcel,
    nonFullBoundryParcel,
    committeeactors_dynamica_id,
    userIdeng,
    userIdsurvmanager,
    userIdsurv,
    t,
    create_date_Gregorian,
    thresholdDate,
  } = useContext(PrintContext) ?? props.mo3aynaObject[0];
  console.log(committeeactors_dynamica_id);
  const [old1, setEdit1] = useState(
    "وعند تطبيق الصك علي الطبيعة و المخطط المعتمد لدينا اتضح أن أطوال و حدود و مساحة القطع صحيحة موضحة بالكروكي المرفق."
  );
  const [old2, setEdit2] = useState(
    "وعند تطبيق الصك علي الطبيعة و المخطط المعتمد لدينا اتضح أن أطوال و حدود و مساحة قطعة الأرض صحيحة موضحة بالكروكي المرفق."
  );
  const [old3, setEdit3] = useState(
    "نأمل الاطلاع وإجراء الفرز بموجبه مع أخذ مصادقة المالك علما بأن باقى المعلومات صحيحة."
  );
  const [old4, setEdit4] = useState(
    "و بعد أن تم تطبيق الصك على المخطط المعتمد و تبين أن صحة الحدود والأبعاد والمساحة الإجمالية كالتالي :"
  );
  const [old5, setEdit5] = useState(
    "و بعد أن تم تطبيق الصكوك على المخطط المعتمد و تبين أن صحة الحدود والأبعاد والمساحة الإجمالية بعد الدمج كالتالي :"
  );
  const [old6, setEdit6] = useState(
    "م٢ فقط لا غير حيث أصبحت الأطوال والمساحة الإجمالية بعد الزيادة كالتالي :"
  );
  const [old15, setEdit15] = useState("المساحة الإجمالية للأرض هي :");
  const [old16, setEdit16] = useState("وباقي معلومات الصك صحيحة .");
  const [old17, setEdit17] = useState("المساحة الإجمالية لكامل الأراضي هي :");
  const [old18, setEdit18] = useState(
    "لذا نأمل من فضيلتكم إجراء التهميش اللازم بما يفيد ذلك على الصكوك المذكورة و السجلات لديكم مع أخذ مصادقة المالك على ذلك"
  );
  const [old19, setEdit19] = useState(
    "وبعد ان تم تطبيق الصك على المخطط المعتمد وتبين أن صحة الحدود و الأبعاد و المساحة الإجمالية لكامل الأراضي هي"
  );
  const [old22, setEdit22] = useState(
    "وباقي معلومات الصك موضحة بالكروكيات المرفقة ."
  );
  let [hideBound, setHideBound] = useState(checkBoundries ?? false);

  useEffect(() => {
    checkBoundries && setHideBound(checkBoundries);
    console.log(hideBound);
  }, [checkBoundries]);
  console.log("d", nonFullBoundryParcel);

  // let title1 = printObj?.printTextEdited?.contract_update?.edit1;
  const onChange = (e, boundState) => {
    const url = "/Submission/SavePrint";
    const params = { sub_id: printId };

    let newPrintObj = printObj;

    // newMainObject.printTextEdited
    if (!newPrintObj?.checkBoundries) {
      newPrintObj.checkBoundries = {};
    }
    setHideBound(!boundState);

    // newPrintObj.checkBoundries = !hideBound;
    let newPrintObj_with_bound = {
      ...newPrintObj,
      checkBoundries: e.target.checked,
    };
    console.log(hideBound);
    return postItem(url, { newPrintObj: newPrintObj_with_bound }, { params });
  };
  console.log(
    "dataPrint",
    useContext(PrintContext),
    props.mo3aynaObject,
    nonFullBoundryParcel
  );
  const PrintContainer = styled.div`
    @media print {
      overflow: visible;
      height: auto;
    }
    display: grid;
    grid-gap: 5px;
    margin: 5px;
    height: 50vh;
    text-align: right !important;
    font-size: 1rem !important;
    padding: 10px;
    page-break-after: always;
    overflow: auto;
  `;
  const PrintContainerLast = styled.div`
    @media print {
      overflow: visible;
      height: auto;
    }
    display: grid;
    grid-gap: 5px;
    margin: 5px;
    height: 50vh;
    text-align: right !important;
    font-size: 1rem !important;
    padding: 10px;
    page-break-after: avoid;
    overflow: auto;
  `;

  const Description = styled.section.attrs({
    className: "",
  })``;
  `padding:5px`;
  const Notes = styled.section.attrs({
    className: "",
  })``;
  `padding:5px`;
  const NotesTable = styled.section.attrs({
    className: "notes_table",
  })``;
  `
    display: grid;
    grid-template-columns: 200px auto auto auto;
    align-items: center;
  `;

  const ImgContainer1 = styled.div`
    max-height: 40vh;
    justify-items: center;
    display: grid;
    max-width: 40vw;
    margin: auto;
    padding: 5px;
  `;

  const TableContainer = styled.table.attrs({
    className: "table table-bordered",
  })``;

  const LogoImg = styled.div`
    position: absolute;
    right: 1%;
    display: grid;
    height: 10vh;
    max-width: 8vw;
    align-items: center;
  `;
  const Text = styled.p`
    text-align: center;
  `;
  const ContainerGrid = styled.div`
    display: grid;
    grid-gap: 10px;
    margin: 10px;
  `;
  const ContainerFlex = styled.div`
    display: flex;

    justify-content: space-between;
    margin: 10px 45px 0 98px;
    vertical-align: middle !important;
  `;
  const LayoutCustomize = styled.section`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
  `;
  const Signature = styled.section`
    margin: 50px 50px 0px 50px;
    height: 10vh;
    grid-gap: 20px;
    display: grid;
    justify-content: flex-end;
  `;
  const BtnPrint = styled.button.attrs({
    className: "btn add-btnT printBtn",
  })`
    justify-self: flex-end;
    height: 5vh;
    margin-left: 10px;
  `;
  const Introduction = styled.section`
    display: flex;
    justify-content: space-between;
    padding: 5px;
    margin: 10px;
    align-items: center;
  `;
  let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
  return (
    <div
      className={
        !is_approved ? "watermark over-width" : "no-watermark over-width "
      }
    >
      <div
        style={{
          textAlign: "left",
          position: "absolute",
          left: "6vh",
          top: "3vh",
        }}
      >
        <p style={{ marginLeft: "50px" }}>
          <span>{localizeNumber(export_no || "")}</span>
        </p>

        <div style={{ marginTop: "14px" }}>
          <span style={{ marginLeft: "25px" }}>
            {localizeNumber(export_date?.split("/")[0] || "")}
          </span>
          {"    "}
          <span style={{ marginLeft: "20px" }}>
            {localizeNumber(export_date?.split("/")[1] || "")}
          </span>
          {"    "}
          <span style={{ marginLeft: "40px" }}>
            {localizeNumber(
              export_date
                ?.split("/")[2]
                .substring(2, export_date?.split("/")[2].length) || ""
            )}
          </span>
          {"    "}
        </div>
        {/* <div style={{ marginTop: "14px" }}>
              {(!(
                update_contract_type != "2" &&
                update_contract_type != "4" &&
                newParcels?.length > 1
              ) ||
                !(update_contract_type == "2")) && (
                <span style={{ marginLeft: "164px" }}>٢ </span>
              )}
              {((update_contract_type != "2" &&
                update_contract_type != "4" &&
                newParcels?.length > 1) ||
                update_contract_type == "2") && (
                <span style={{ marginLeft: "164px" }}>٣</span>
              )}
            </div> */}
      </div>
      <PrintContainer
        style={{ marginTop: "12vh" }}
        className={
          nonFullBoundryParcel &&
          nonFullBoundryParcel.length == 2 &&
          sak_type == "1"
            ? "two_parcel modal_min_height"
            : (nonFullBoundryParcel && nonFullBoundryParcel.length == 1) ||
              sak_type == "3" ||
              sak_type == "2" ||
              sak_type == "4"
            ? // &&sak_type == "3"
              "one_parcel modal_min_height"
            : "modal_min_height one_parcel"
        }
      >
        <BtnPrint
          onClick={() => {
            window.print();
          }}
        >
          طباعة
        </BtnPrint>
        <div
          className={
            nonFullBoundryParcel && nonFullBoundryParcel.length > 4
              ? "header_more_than_4"
              : ""
          }
        >
          <Introduction style={{ marginTop: "20px" }}>
            <div>
              {municipality_name != "10506" && (
                // municipality_name != "10513" && (
                <p>الإدارة العامة للتخطيط العمراني</p>
              )}
              {municipality_name != "10506" && (
                // municipality_name != "10513" && (
                <p>إدارة المساحة</p>
              )}
              {/* {municipality_name == "10513" && <p>بلدية الظهران</p>} */}
              {
                municipality_name == "10506" && <p>إدارة الأراضي والمساحة</p>
                //  || municipality_name == "10513"
              }
              <h4 style={{ marginTop: "20px" }}>
                فضيلة / رئيس {signature_issuers_name}
              </h4>
              <h5 style={{ fontWeight: "bold" }}>
                السلام عليكم و رحمة الله و بركاته ,,,
              </h5>
            </div>
            <div>
              {sak_type == "1" && (
                <p>
                  الموضوع:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    تحديث معلومات الصك مع الفرز
                  </span>
                </p>
              )}
              {sak_type == "2" && (
                <p>
                  الموضوع:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    تحديث معلومات الصك مع الدمج
                  </span>
                </p>
              )}
              {sak_type == "3" && (
                <p>
                  الموضوع:{" "}
                  <span style={{ fontWeight: "bold" }}>تحديث معلومات الصك</span>
                </p>
              )}
              {sak_type == "4" && (
                <p>
                  الموضوع:{" "}
                  <span style={{ fontWeight: "bold" }}>تحديث صك ورقي</span>
                </p>
              )}
              <h4 style={{ margin: "35px 70px" }}>حفظه الله</h4>
            </div>
          </Introduction>
          <Description>
            {sak_type == "1" && (
              <p>
                {" "}
                {(signature_issuers_is_court &&
                  "أسال الله لكم السداد والتوفيق وبعد،") ||
                  ""}
                <span>
                  نرفق لفضيلتكم الطلب المقدم بشأن فرز قطع الأراضي بالصك التالي
                  بياناته :-
                </span>
              </p>
            )}
            {sak_type == "2" && (
              <>
                {/* <p>أسال الله لكم السداد والتوفيق وبعد،</p> */}
                <p>
                  {" "}
                  {(signature_issuers_is_court &&
                    "أسال الله لكم السداد والتوفيق وبعد،") ||
                    ""}
                  <span>
                    نرفق لفضيلتكم الطلب المقدم بشأن دمج قطع الأراضي بالصك التالي
                    بياناته :-
                  </span>
                </p>
              </>
            )}
            {sak_type == "3" && (
              <p>
                {" "}
                {(signature_issuers_is_court &&
                  "أسال الله لكم السداد والتوفيق وبعد،") ||
                  ""}
                <span>
                  نرفق لفضيلتكم الطلب المقدم بشأن تحديث معلومات الصك التالي
                  بياناته :-
                </span>
              </p>
            )}
            {sak_type == "4" && (
              <>
                {/* <p>أسال الله لكم السداد والتوفيق وبعد،</p> */}
                <p>
                  {" "}
                  {(signature_issuers_is_court &&
                    "أسال الله لكم السداد والتوفيق وبعد،") ||
                    ""}
                  <span>
                    نرفق لفضيلتكم الطلب المقدم بشأن تحديث معلومات الصك التالي
                    بياناته :-
                  </span>
                </p>
              </>
            )}
          </Description>
        </div>
        <div
          className={
            nonFullBoundryParcel &&
            nonFullBoundryParcel.length > 4 &&
            sak_type == "1"
              ? "content_more_than_4"
              : ""
          }
        >
          <TableContainer className="table-boun">
            <tbody>
              <tr>
                <td>الاسم</td>
                <td>
                  {owners
                    ?.map((owner) => {
                      return owner.owner_name;
                    })
                    .join(" , ")}
                </td>
                <td>{owners && owners[0]?.identity_label}</td>
                <td>
                  {localizeNumber(
                    owners
                      ?.map((owner) => {
                        return owner?.identity;
                      })
                      .join(" , ")
                  )}
                </td>
              </tr>
              <tr>
                <td>{(sak_type == "2" && "أرقام الصكوك") || "رقم الصك"}</td>
                <td>
                  {(["2", "4"].indexOf(sak_type) != -1 &&
                    skok?.map((sak) => {
                      return (
                        <>
                          {`${localizeNumber(sak.number_waseka)}`}
                          <br />
                        </>
                      );
                    })) ||
                    (skok?.length && localizeNumber(skok[0]?.number_waseka))}
                </td>
                <td>بتاريخ</td>
                <td>
                  {(["2", "4"].indexOf(sak_type) != -1 &&
                    skok?.map((sak) => {
                      return (
                        <>
                          {`${convertToArabic(sak.date_waseka)} هجريا`}
                          <br />
                        </>
                      );
                    })) ||
                    (skok?.length &&
                      `${convertToArabic(skok[0]?.date_waseka)} هجريا`)}
                </td>
              </tr>
              <tr>
                {plan_no && (
                  <>
                    <td>رقم المخطط المعتمد</td>
                    <td>{localizeNumber(plan_no)}</td>
                  </>
                )}
                <td>
                  {(dukan && "رقم الدكان") ||
                    (sak_type == "2" && "أرقام قطع الأراضي") ||
                    "رقم القطعة"}
                </td>
                <td colSpan={(!plan_no && "3") || "0"}>
                  {localizeNumber(parcel_no)}
                </td>
              </tr>
              <tr>
                <td>اسم الحي</td>
                <td colSpan={(!block_no && "3") || "0"}>{district_name}</td>
                {block_no && <td>رقم البلك</td>}
                {block_no && <td>{localizeNumber(block_no)}</td>}
              </tr>
              {subdivision_description && (
                <tr>
                  <td>{subdivision_type}</td>
                  <td colSpan="3">{localizeNumber(subdivision_description)}</td>
                </tr>
              )}
            </tbody>
          </TableContainer>
          <Description>
            {nonFullBoundryParcel?.length > 1 &&
              nonFullBoundryParcel?.length <= 4 &&
              !modify_area_increase &&
              sak_type == "1" && (
                <p>
                  {/* وعند تطبيق الصك علي الطبيعة والمخطط المعتمد لدينا اتضح أن أطوال
                وحدود ومساحة القطع صحيحة موضحة بالكروكي المرفق. */}
                  <EditPrint
                    printObj={printObj}
                    id={printId}
                    path="contract_upadate.title1"
                    oldText={title1 || old1}
                  />
                  {/* <br />
                  <EditPrint
                    printObj={printObj}
                    id={printId}
                    path="contract_upadate.title3"
                    oldText={title3 || old3}
                  />
                  نأمل الاطلاع وإجراء الفرز بموجبه مع أخذ مصادقة المالك علما بأن
                باقى المعلومات صحيحة. */}
                </p>
              )}
            {nonFullBoundryParcel?.length == 1 &&
              !modify_area_increase &&
              sak_type == "1" && (
                <p>
                  {/* وعند تطبيق الصك علي الطبيعة والمخطط المعتمد لدينا اتضح أن أطوال
                وحدود ومساحة القطع صحيحة موضحة بالكروكي المرفق. */}
                  <EditPrint
                    printObj={printObj}
                    id={printId}
                    path="contract_upadate.title2"
                    oldText={title2 || old2}
                  />
                  {/* <br />
                  <EditPrint
                    printObj={printObj}
                    id={printId}
                    path="contract_upadate.title3"
                    oldText={title3 || old3}
                  />
                  نأمل الاطلاع وإجراء الفرز بموجبه مع أخذ مصادقة المالك علما بأن
                باقى المعلومات صحيحة. */}
                </p>
              )}
            {!modify_area_increase && sak_type != "2" && sak_type != "1" && (
              <p>
                {/* و بعد أن تم تطبيق الصك على المخطط المعتمد و تبين أن صحة الحدود و
              الأبعاد و المساحة الإجمالية كالتالي: */}
                <EditPrint
                  printObj={printObj}
                  id={printId}
                  path="contract_upadate.title4"
                  oldText={title4 || old4}
                />
              </p>
            )}
            {!modify_area_increase && sak_type == "2" && (
              <p>
                {/* و بعد أن تم تطبيق الصكوك على المخطط المعتمد و تبين أن صحة الحدود و
              الأبعاد و المساحة الإجمالية بعد الدمج كالتالي: */}
                <EditPrint
                  printObj={printObj}
                  id={printId}
                  path="contract_upadate.title5"
                  oldText={title5 || old5}
                />
              </p>
            )}
            {modify_area_increase && (
              <p>
                (
                {localizeNumber(
                  newParcels[0]?.attributes?.PARCEL_AREA_INCREASE?.toFixed(2) ||
                    ""
                )}
                )
                {/* م٢ فقط لا غير حيث أصبحت الأطوال والمساحة الإجمالية بعد الزيادة
              كالتالي : */}
                <EditPrint
                  printObj={printObj}
                  id={printId}
                  path="contract_upadate.title5"
                  oldText={title6 || old6}
                />
              </p>
            )}
          </Description>
          <ZoomSlider
            printObj={printObj}
            id={printId}
            path="contract_upadate.zoomRatio"
            ZoomRatio={
              ZoomRatio
                ? ZoomRatio
                : nonFullBoundryParcel &&
                  nonFullBoundryParcel.length == 2 &&
                  sak_type == "1"
                ? 0.88
                : (nonFullBoundryParcel && nonFullBoundryParcel.length == 1) ||
                  sak_type == "3" ||
                  sak_type == "2" ||
                  sak_type == "4"
                ? // &&sak_type == "3"
                  1.15
                : 1.15
            }
            className={
              nonFullBoundryParcel && nonFullBoundryParcel.length >= 3
                ? "ggt"
                : ""
            }
            // oldText={newRatio || old2}
          >
            {["2", "3", "4"].indexOf(sak_type) != -1 && (
              <div className="fdf">
                {/* <p>
                      الحدود و الأطوال و المساحة الإجمالية للقطعة رقم ({" "}
                      {localizeNumber(parcel?.parcel_name)} ) كالتالي :
                    </p> */}
                <div className="hidd">
                  <label>
                    {/* {hideBound == true ? "اظهار الحدود" : "اخفاء الحدود"} */}
                    <Checkbox
                      checked={hideBound}
                      // defaultChecked={checkBoundries == true || hideBound == true}
                      onChange={(e) => onChange(e, hideBound)}
                    >
                      إخفاء الحدود من الطباعة
                    </Checkbox>
                  </label>
                </div>
                <div className="kof">
                  {hideBound == false ? (
                    <NotesTable>
                      <div>
                        <div>
                          <p>شمالا بطول :</p>
                          <p>
                            {localizeNumber(
                              fullBoundryParcel?.data &&
                                (+fullBoundryParcel?.data[0]
                                  ?.totalLength)?.toFixed(2)
                            )}{" "}
                            م {/* {parcel?.north_length_text} */}
                            <EditPrint
                              printObj={printObj}
                              id={printId}
                              path="contract_upadate.title7"
                              oldText={
                                title7 || fullBoundryParcel?.north_length_text
                              }
                            />
                          </p>
                        </div>
                        <div>
                          <p>و يحدها :</p>
                          <p>
                            {/* {localizeNumber(parcel?.north_Desc)} */}
                            <EditPrint
                              printObj={printObj}
                              id={printId}
                              path="contract_upadate.title8"
                              oldText={
                                title8 ||
                                localizeNumber(fullBoundryParcel?.north_Desc)
                              }
                            />
                          </p>
                        </div>
                      </div>
                      <div>
                        <div>
                          <p>جنوبا بطول :</p>
                          <p>
                            {localizeNumber(
                              fullBoundryParcel?.data &&
                                (+fullBoundryParcel?.data[4]
                                  ?.totalLength)?.toFixed(2)
                            )}{" "}
                            م {/* {parcel?.south_length_text} */}
                            <EditPrint
                              printObj={printObj}
                              id={printId}
                              path="contract_upadate.title9"
                              oldText={
                                title9 || fullBoundryParcel?.south_length_text
                              }
                            />
                          </p>
                        </div>
                        <div>
                          <p>و يحدها :</p>
                          <p>
                            {/* {localizeNumber(parcel?.south_Desc)} */}
                            <EditPrint
                              printObj={printObj}
                              id={printId}
                              path="contract_upadate.title10"
                              oldText={
                                title10 ||
                                localizeNumber(fullBoundryParcel?.south_Desc)
                              }
                            />
                          </p>
                        </div>
                      </div>
                      <div>
                        <div>
                          <p>شرقا بطول :</p>
                          <p>
                            {localizeNumber(
                              fullBoundryParcel?.data &&
                                (+fullBoundryParcel?.data[1]
                                  ?.totalLength)?.toFixed(2)
                            )}{" "}
                            م {/* {parcel?.east_length_text} */}
                            <EditPrint
                              printObj={printObj}
                              id={printId}
                              path="contract_upadate.title11"
                              oldText={
                                title11 || fullBoundryParcel?.east_length_text
                              }
                            />
                          </p>
                        </div>
                        <div>
                          <p>و يحدها :</p>
                          <p>
                            {/* {localizeNumber(parcel?.east_Desc)} */}
                            <EditPrint
                              printObj={printObj}
                              id={printId}
                              path="contract_upadate.title12"
                              oldText={
                                title12 ||
                                localizeNumber(fullBoundryParcel?.east_Desc)
                              }
                            />
                          </p>
                        </div>
                      </div>
                      <div>
                        <div>
                          <p>غربا بطول :</p>
                          <p>
                            {localizeNumber(
                              fullBoundryParcel?.data &&
                                (+fullBoundryParcel?.data[3]
                                  ?.totalLength)?.toFixed(2)
                            )}{" "}
                            م {/* {parcel?.west_length_text} */}
                            <EditPrint
                              printObj={printObj}
                              id={printId}
                              path="contract_upadate.title13"
                              oldText={
                                title13 || fullBoundryParcel?.west_length_text
                              }
                            />
                          </p>
                        </div>
                        <div>
                          <p>و يحدها :</p>
                          <p>
                            {/* {localizeNumber(fullBoundryParcel?.west_Desc)} */}
                            <EditPrint
                              printObj={printObj}
                              id={printId}
                              path="contract_upadate.title14"
                              oldText={
                                title14 ||
                                localizeNumber(fullBoundryParcel?.west_Desc)
                              }
                            />
                          </p>
                        </div>
                      </div>
                    </NotesTable>
                  ) : (
                    ""
                  )}
                </div>
                <Notes>
                  <p className="wrap-p">
                    {/* المساحة الإجمالية للأرض هي : */}
                    <span>
                      <EditPrint
                        printObj={printObj}
                        id={printId}
                        path="contract_upadate.title15"
                        oldText={title15 || old15}
                      />{" "}
                    </span>
                    <span>
                      {localizeNumber(
                        fullBoundryParcel?.area &&
                          (+fullBoundryParcel?.area)?.toFixed(2)
                      )}{" "}
                      م٢
                    </span>
                    <span>
                      <EditPrint
                        printObj={printObj}
                        id={printId}
                        path="contract_upadate.title20"
                        oldText={title20 || fullBoundryParcel?.area_text}
                      />
                    </span>
                    <span>
                      {" "}
                      {((fullBoundryParcel?.electric_room_area ||
                        fullBoundryParcel?.electric_room_place ||
                        Object.values(
                          (fullBoundryParcel?.survayParcelCutter &&
                            fullBoundryParcel?.survayParcelCutter[0]) ||
                            {}
                        )
                          ?.filter(
                            (shatfa) => shatfa != "" && shatfa != "الشطفة"
                          )
                          ?.reduce(function (a, b) {
                            return +a + +b;
                          }, 0) > 0) &&
                        ` و ذلك بعد خصم `) ||
                        ""}
                    </span>
                    <span>
                      {((fullBoundryParcel?.electric_room_area ||
                        fullBoundryParcel?.electric_room_place) &&
                        `( غرفة الكهرباء `) ||
                        ""}{" "}
                    </span>
                    <span>
                      {(fullBoundryParcel?.electric_room_place &&
                        ` الواقعة في ( ${fullBoundryParcel?.electric_room_place} )`) ||
                        ""}{" "}
                    </span>
                    &nbsp;
                    <span>
                      {(fullBoundryParcel?.electric_room_area &&
                        `بمقدار ( ${localizeNumber(
                          fullBoundryParcel?.electric_room_area + " م٢"
                        )} )`) ||
                        ""}{" "}
                    </span>
                    &nbsp;
                    <span>
                      {(Object.values(
                        (fullBoundryParcel?.survayParcelCutter &&
                          fullBoundryParcel?.survayParcelCutter[0]) ||
                          {}
                      )
                        ?.filter((shatfa) => shatfa != "" && shatfa != "الشطفة")
                        ?.reduce(function (a, b) {
                          return +a + +b;
                        }, 0) > 0 &&
                        `الشطفة من ( ${Object.keys(
                          (fullBoundryParcel?.survayParcelCutter &&
                            fullBoundryParcel?.survayParcelCutter[0]) ||
                            {}
                        )
                          ?.filter(
                            (shatfa) =>
                              fullBoundryParcel?.survayParcelCutter &&
                              fullBoundryParcel?.survayParcelCutter[0][
                                shatfa
                              ] != "" &&
                              fullBoundryParcel?.survayParcelCutter &&
                              fullBoundryParcel?.survayParcelCutter[0][
                                shatfa
                              ] != "الشطفة"
                          )
                          ?.map((shatfa) => t(`labels:${shatfa}`))
                          ?.join(", ")} ) بمساحة ( ${localizeNumber(
                          parseFloat(
                            Object.values(
                              (fullBoundryParcel?.survayParcelCutter &&
                                fullBoundryParcel?.survayParcelCutter[0]) ||
                                {}
                            )
                              ?.filter(
                                (shatfa) => shatfa != "" && shatfa != "الشطفة"
                              )
                              ?.reduce(function (a, b) {
                                return +a + +b;
                              }, 0)
                              ?.toFixed(2)
                          )
                        )} م٢ )`) ||
                        ""}{" "}
                    </span>
                    <span>
                      {((fullBoundryParcel?.electric_room_area ||
                        fullBoundryParcel?.electric_room_place) &&
                        ` )`) ||
                        ""}
                    </span>
                    {/* . وباقي معلومات الصك صحيحة */}
                    <span>
                      <EditPrint
                        printObj={printObj}
                        id={printId}
                        path="contract_upadate.title16"
                        oldText={title16 || old16}
                      />
                    </span>
                  </p>
                  <div>
                    <p style={{ margin: 0 }}>
                      {/* لذا نأمل من فضيلتكم إجراء التهميش اللازم بما يفيد ذلك على الصكوك
                        المذكورة و السجلات لديكم مع أخذ مصادقة المالك على ذلك */}
                      <EditPrint
                        printObj={printObj}
                        id={printId}
                        path="contract_upadate.title18"
                        oldText={title18 || old18}
                      />
                    </p>
                    <p style={{ fontWeight: "bold", margin: 0 }}>
                      والسلام عليكـم ورحمة الله وبركـاته ،،،{" "}
                    </p>
                    {/* {municipality_name != "10506" &&
                      // municipality_name != "10513" &&
                      committee_report_no != null && (
                        <div>
                          <img src="images/malharby_sign.png" width="80px" />
                        </div>
                      )} */}
                    {municipality_name != "10506" &&
                      committee_report_no != null &&
                      province_id !== null && (
                        <div>
                          <img
                            src={`${filesHost}/users/${userIdsurvmanager}/sub_sign.png`}
                            width="80px"
                          />
                        </div>
                      )}
                  </div>
                </Notes>
              </div>
            )}
            {nonFullBoundryParcel &&
              nonFullBoundryParcel.length <= 4 &&
              sak_type == "1" &&
              nonFullBoundryParcel?.map((parcel, k) => {
                return (
                  <div
                    key={k}
                    className={
                      nonFullBoundryParcel && nonFullBoundryParcel.length == 4
                        ? "l4"
                        : "l3"
                    }
                  >
                    <p>
                      و الحدود و الأطوال و المساحة الإجمالية للقطعة رقم ({" "}
                      {convertToArabic(parcel?.parcel_name)} ) كالتالي :
                    </p>
                    <div className="hidd">
                      <label>
                        {/* {hideBound == true ? "اظهار الحدود" : "اخفاء الحدود"} */}
                        <Checkbox
                          checked={hideBound}
                          // defaultChecked={checkBoundries == true || hideBound == true}
                          onChange={(e) => onChange(e, hideBound)}
                        >
                          إخفاء الحدود من الطباعة
                        </Checkbox>
                      </label>
                    </div>
                    {hideBound == false ? (
                      <NotesTable>
                        <div>
                          <div>
                            <p>شمالا بطول :</p>
                            <p>
                              {localizeNumber(
                                (+parcel?.data[0]?.totalLength)?.toFixed(2)
                              )}{" "}
                              م{" "}
                              {/* {convertToArabic(parcel?.data[0]?.totalLength)} م{" "}
                            {parcel?.north_length_text} */}
                              <EditPrint
                                printObj={printObj}
                                id={printId}
                                path="contract_upadate.title7"
                                oldText={title23 || parcel?.north_length_text}
                              />
                            </p>
                          </div>
                          <div>
                            <p>و يحدها :</p>
                            <p>
                              {/* {localizeNumber(parcel?.north_Desc)} */}
                              <EditPrint
                                printObj={printObj}
                                id={printId}
                                path="contract_upadate.title8"
                                oldText={
                                  title24 || localizeNumber(parcel?.north_Desc)
                                }
                              />
                            </p>
                          </div>
                        </div>
                        <div>
                          <div>
                            <p>جنوبا بطول :</p>
                            <p>
                              {localizeNumber(
                                (+parcel?.data[4]?.totalLength)?.toFixed(2)
                              )}{" "}
                              م{" "}
                              {/* {convertToArabic(parcel?.data[4]?.totalLength)} م{" "}
                            {parcel?.south_length_text} */}
                              <EditPrint
                                printObj={printObj}
                                id={printId}
                                path="contract_upadate.title9"
                                oldText={title25 || parcel?.south_length_text}
                              />
                            </p>
                          </div>
                          <div>
                            <p>و يحدها :</p>
                            <p>
                              {/* {localizeNumber(parcel?.south_Desc)} */}
                              <EditPrint
                                printObj={printObj}
                                id={printId}
                                path="contract_upadate.title10"
                                oldText={
                                  title26 || localizeNumber(parcel?.south_Desc)
                                }
                              />
                            </p>
                          </div>
                        </div>
                        <div>
                          <div>
                            <p>شرقا بطول :</p>
                            <p>
                              {localizeNumber(
                                (+parcel?.data[1]?.totalLength)?.toFixed(2)
                              )}{" "}
                              م{" "}
                              {/* {convertToArabic(parcel?.data[1]?.totalLength)} م{" "}
                            {parcel?.east_length_text} */}
                              <EditPrint
                                printObj={printObj}
                                id={printId}
                                path="contract_upadate.title11"
                                oldText={title27 || parcel?.east_length_text}
                              />
                            </p>
                          </div>
                          <div>
                            <p>و يحدها :</p>
                            <p>
                              {/* {localizeNumber(parcel?.east_Desc)} */}
                              <EditPrint
                                printObj={printObj}
                                id={printId}
                                path="contract_upadate.title12"
                                oldText={
                                  title28 || localizeNumber(parcel?.east_Desc)
                                }
                              />
                            </p>
                          </div>
                        </div>
                        <div>
                          <div>
                            <p>غربا بطول :</p>
                            <p>
                              {localizeNumber(
                                (+parcel?.data[3]?.totalLength)?.toFixed(2)
                              )}{" "}
                              م{" "}
                              {/* {convertToArabic(parcel?.data[3]?.totalLength)} م{" "}
                            {parcel?.west_length_text} */}
                              <EditPrint
                                printObj={printObj}
                                id={printId}
                                path="contract_upadate.title13"
                                oldText={title29 || parcel?.west_length_text}
                              />
                            </p>
                          </div>
                          <div>
                            <p>و يحدها :</p>
                            <p>
                              {/* {localizeNumber(fullBoundryParcel?.west_Desc)} */}
                              <EditPrint
                                printObj={printObj}
                                id={printId}
                                path="contract_upadate.title14"
                                oldText={
                                  title30 || localizeNumber(parcel?.west_Desc)
                                }
                              />
                            </p>
                          </div>
                        </div>
                      </NotesTable>
                    ) : (
                      ""
                    )}
                    <Notes
                      className={
                        nonFullBoundryParcel?.length > 1
                          ? `noteTable${nonFullBoundryParcel?.length}`
                          : ""
                      }
                    >
                      <p>
                        {/* المساحة الإجمالية للأرض هي : */}
                        <span>
                          <EditPrint
                            printObj={printObj}
                            id={printId}
                            path="contract_upadate.title15"
                            oldText={title15 || old15}
                          />{" "}
                        </span>{" "}
                        {convertToArabic((+parcel?.area)?.toFixed(2))} م٢
                        {/* ( {parcel?.area_text} ) */}
                        <span>
                          <EditPrint
                            printObj={printObj}
                            id={printId}
                            path="contract_upadate.title20"
                            oldText={title31 || parcel?.area_text}
                          />
                        </span>
                        {((parcel?.electric_room_area ||
                          parcel?.electric_room_place) &&
                          `وذلك بعد خصم ( غرفة الكهرباء`) ||
                          ""}{" "}
                        {(parcel?.electric_room_place &&
                          `الواقعة في ${parcel?.electric_room_place}`) ||
                          ""}{" "}
                        {(parcel?.electric_room_area &&
                          `بمقدار (${convertToArabic(
                            parcel?.electric_room_area + "م2"
                          )})`) ||
                          ""}{" "}
                        {(Object.values(parcel?.survayParcelCutter[0] || {})
                          ?.filter(
                            (shatfa) => shatfa != "" && shatfa != "الشطفة"
                          )
                          ?.reduce(function (a, b) {
                            return +a + +b;
                          }, 0) > 0 &&
                          `الشطفة من (${Object.keys(
                            parcel?.survayParcelCutter[0] || {}
                          )
                            ?.filter(
                              (shatfaKey) =>
                                parcel?.survayParcelCutter[0][shatfaKey] !=
                                  "" &&
                                parcel?.survayParcelCutter[0][shatfaKey] !=
                                  "الشطفة"
                            )
                            ?.map((shatfaKey) => t(`labels:${shatfaKey}`))
                            ?.join(", ")}) بمساحة (${localizeNumber(
                            Object.values(parcel?.survayParcelCutter[0] || {})
                              ?.filter(
                                (shatfa) => shatfa != "" && shatfa != "الشطفة"
                              )
                              ?.reduce(function (a, b) {
                                return +a + +b;
                              }, 0)
                              ?.toFixed(2)
                          )} م٢)`) ||
                          ""}{" "}
                        {((parcel?.electric_room_area ||
                          parcel?.electric_room_place) &&
                          ` )`) ||
                          ""}
                        {/* . وباقي معلومات الصك صحيحة */}
                        {nonFullBoundryParcel.length == 1 && (
                          <span>
                            <EditPrint
                              printObj={printObj}
                              id={printId}
                              path="contract_upadate.title16"
                              oldText={title16 || old16}
                            />
                          </span>
                        )}
                      </p>
                    </Notes>
                  </div>
                );
              })}
            {nonFullBoundryParcel &&
              nonFullBoundryParcel.length <= 4 &&
              sak_type == "1" && (
                <div className="three_sections">
                  <Notes
                    className={
                      nonFullBoundryParcel?.length > 1
                        ? `noteTable${nonFullBoundryParcel?.length}`
                        : ""
                    }
                  >
                    {nonFullBoundryParcel?.length > 1 && (
                      <p>
                        {/* المساحة الإجمالية لكامل الأراضي هي : */}
                        <span>
                          <EditPrint
                            printObj={printObj}
                            id={printId}
                            path="contract_upadate.title17"
                            oldText={title17 || old17}
                          />{" "}
                        </span>{" "}
                        {localizeNumber(
                          nonFullBoundryParcel
                            .reduce((a, b) => a + +b.area, 0)
                            ?.toFixed(2)
                        )}{" "}
                        م٢
                        {/* ( {parcel?.area_text} ) */}
                        <span>
                          <EditPrint
                            printObj={printObj}
                            id={printId}
                            path="contract_upadate.title32"
                            oldText={title32 || fullBoundryParcel?.area_text}
                          />
                        </span>
                        {/* {((fullBoundryParcel?.electric_room_area ||
                          fullBoundryParcel?.electric_room_place ||
                          Object.values(
                            (fullBoundryParcel?.survayParcelCutter &&
                              fullBoundryParcel?.survayParcelCutter[0]) ||
                              {}
                          )
                            ?.filter(
                              (shatfa) => shatfa != "" && shatfa != "الشطفة"
                            )
                            ?.reduce(function (a, b) {
                              return +a + +b;
                            }, 0) > 0) &&
                          ` و ذلك بعد خصم `) ||
                          ""}
                        <span>
                          {((fullBoundryParcel?.electric_room_area ||
                            fullBoundryParcel?.electric_room_place) &&
                            `( غرفة الكهرباء `) ||
                            ""}{" "}
                        </span>
                        <span>
                          {(fullBoundryParcel?.electric_room_place &&
                            ` الواقعة في ( ${fullBoundryParcel?.electric_room_place} )`) ||
                            ""}{" "}
                        </span>
                        &nbsp;
                        <span>
                          {(fullBoundryParcel?.electric_room_area &&
                            `بمقدار ( ${localizeNumber(
                              fullBoundryParcel?.electric_room_area + " م٢"
                            )} )`) ||
                            ""}{" "}
                        </span>
                        &nbsp;
                        <span>
                          {(Object.values(
                            (fullBoundryParcel?.survayParcelCutter &&
                              fullBoundryParcel?.survayParcelCutter[0]) ||
                              {}
                          )
                            ?.filter(
                              (shatfa) => shatfa != "" && shatfa != "الشطفة"
                            )
                            ?.reduce(function (a, b) {
                              return +a + +b;
                            }, 0) > 0 &&
                            `الشطفة من ( ${Object.keys(
                              (fullBoundryParcel?.survayParcelCutter &&
                                fullBoundryParcel?.survayParcelCutter[0]) ||
                                {}
                            )
                              ?.filter(
                                (shatfa) =>
                                  fullBoundryParcel?.survayParcelCutter &&
                                  fullBoundryParcel?.survayParcelCutter[0][
                                    shatfa
                                  ] != "" &&
                                  fullBoundryParcel?.survayParcelCutter &&
                                  fullBoundryParcel?.survayParcelCutter[0][
                                    shatfa
                                  ] != "الشطفة"
                              )
                              ?.map((shatfa) => t(`labels:${shatfa}`))
                              ?.join(", ")} ) بمساحة ( ${localizeNumber(
                              parseFloat(
                                Object.values(
                                  (fullBoundryParcel?.survayParcelCutter &&
                                    fullBoundryParcel?.survayParcelCutter[0]) ||
                                    {}
                                )
                                  ?.filter(
                                    (shatfa) =>
                                      shatfa != "" && shatfa != "الشطفة"
                                  )
                                  ?.reduce(function (a, b) {
                                    return +a + +b;
                                  }, 0)
                                  ?.toFixed(2)
                              )
                            )} م٢ )`) ||
                            ""}{" "}
                        </span>
                        <span>
                          {((fullBoundryParcel?.electric_room_area ||
                            fullBoundryParcel?.electric_room_place) &&
                            ` )`) ||
                            ""}
                        </span> */}
                        {/* . وباقي معلومات الصك صحيحة */}
                        <span>
                          <EditPrint
                            printObj={printObj}
                            id={printId}
                            path="contract_upadate.title16"
                            oldText={title16 || old16}
                          />
                        </span>
                      </p>
                    )}
                    <Description>
                      {nonFullBoundryParcel?.length > 1 &&
                        nonFullBoundryParcel?.length <= 4 &&
                        !modify_area_increase &&
                        sak_type == "1" && (
                          <p>
                            <EditPrint
                              printObj={printObj}
                              id={printId}
                              path="contract_upadate.title3"
                              oldText={title3 || old3}
                            />
                            {/* نأمل الاطلاع وإجراء الفرز بموجبه مع أخذ مصادقة المالك علما بأن
                          باقى المعلومات صحيحة. */}
                          </p>
                        )}
                      {nonFullBoundryParcel?.length == 1 &&
                        !modify_area_increase &&
                        sak_type == "1" && (
                          <p>
                            <EditPrint
                              printObj={printObj}
                              id={printId}
                              path="contract_upadate.title3"
                              oldText={title3 || old3}
                            />
                            {/* نأمل الاطلاع وإجراء الفرز بموجبه مع أخذ مصادقة المالك علما بأن
                          باقى المعلومات صحيحة. */}
                          </p>
                        )}
                    </Description>
                    <div>
                      <p style={{ margin: 0 }}>
                        {/* لذا نأمل من فضيلتكم إجراء التهميش اللازم بما يفيد ذلك على الصكوك
                        المذكورة و السجلات لديكم مع أخذ مصادقة المالك على ذلك */}
                        <EditPrint
                          printObj={printObj}
                          id={printId}
                          path="contract_upadate.title18"
                          oldText={title18 || old18}
                        />
                      </p>
                      <p style={{ fontWeight: "bold", margin: 0 }}>
                        والسلام عليكـم ورحمة الله وبركـاته ،،،{" "}
                      </p>
                      {municipality_name != "10506" &&
                        // municipality_name != "10513" &&
                        committee_report_no != null && (
                          <div>
                            <img src="images/malharby_sign.png" width="80px" />
                          </div>
                        )}
                    </div>
                  </Notes>
                </div>
              )}
            <div
              className={
                nonFullBoundryParcel && nonFullBoundryParcel.length == 3
                  ? "l_3"
                  : "l_4"
              }
            ></div>

            {nonFullBoundryParcel &&
              nonFullBoundryParcel.length > 4 &&
              sak_type == "1" && (
                <Notes>
                  <p className="wrap-p-2">
                    {/* وبعد ان تم تطبيق الصك على المخطط المعتمد وتبين أن صحة والمساحة
                الإجمالية لكامل الأراضي هي */}
                    <span>
                      <span>
                        <EditPrint
                          printObj={printObj}
                          id={printId}
                          path="contract_upadate.title19"
                          oldText={title19 || old19}
                        />
                      </span>
                      <span style={{ display: "inline-block" }}>
                        {fullBoundryParcel &&
                          `${localizeNumber(
                            `${(+fullBoundryParcel?.area)?.toFixed(2)} م٢`
                          )}`}
                      </span>
                      <span>
                        <EditPrint
                          printObj={printObj}
                          id={printId}
                          path="contract_upadate.title21"
                          oldText={title21 || fullBoundryParcel?.area_text}
                        />
                      </span>
                      {/* <span
                    style={{
                      // display: "flex",
                      // width: "100vw",
                      margin: "auto",
                      textAlign: "justify",
                      lineHeight: "3.5",

                      alignItems: "center",
                      gridGap: "20px",
                    }}
                  > */}
                      {/* <span> */}
                      {nonFullBoundryParcel.map((parcel, index) => {
                        return (
                          <>
                            {((!isEmpty(parcel?.electric_room_area) ||
                              !isEmpty(parcel?.electric_room_place) ||
                              Object.values(parcel?.survayParcelCutter[0] || {})
                                ?.filter(
                                  (shatfa) => shatfa != "" && shatfa != "الشطفة"
                                )
                                ?.reduce(function (a, b) {
                                  return +a + +b;
                                }, 0) > 0) &&
                              ` و ${
                                (index == 0 && "ذلك") || "كذلك"
                              } بعد خصم `) ||
                              ""}
                            {parcel?.electric_room_area &&
                              `غرفة الكهرباء الواقعة بالركن (${
                                parcel?.electric_room_place
                              }) من القطعة رقم (${convertToArabic(
                                parcel?.parcel_name
                              )}) بمقدار (${localizeNumber(
                                parcel?.electric_room_area
                              )} م٢)`}
                            {(Object.values(parcel?.survayParcelCutter[0] || {})
                              ?.filter(
                                (shatfa) => shatfa != "" && shatfa != "الشطفة"
                              )
                              ?.reduce(function (a, b) {
                                return +a + +b;
                              }, 0) > 0 &&
                              `${
                                (parcel?.electric_room_area && ",", "")
                              } الشطفة الواقعة بالركن (${Object.keys(
                                parcel?.survayParcelCutter[0] || {}
                              )
                                ?.filter(
                                  (shatfa) =>
                                    parcel?.survayParcelCutter[0][shatfa] !=
                                      "" &&
                                    parcel?.survayParcelCutter[0][shatfa] !=
                                      "الشطفة"
                                )
                                ?.map((shatfa) => t(`labels:${shatfa}`))
                                ?.join(", ")}) من القطعة رقم (${convertToArabic(
                                parcel?.parcel_name
                              )}) بمقدار (${localizeNumber(
                                parseFloat(
                                  Object.values(
                                    parcel?.survayParcelCutter[0] || {}
                                  )
                                    ?.filter(
                                      (shatfa) =>
                                        shatfa != "" && shatfa != "الشطفة"
                                    )
                                    ?.reduce(function (a, b) {
                                      return +a + +b;
                                    }, 0)
                                    ?.toFixed(2)
                                )
                              )} م٢)`) ||
                              ""}{" "}
                          </>
                        );
                      })}
                    </span>
                    <span>
                      <EditPrint
                        printObj={printObj}
                        id={printId}
                        path="contract_upadate.title22"
                        oldText={title22 || old22}
                      />
                    </span>
                  </p>
                  <div>
                    <p style={{ margin: 0 }}>
                      {/* لذا نأمل من فضيلتكم إجراء التهميش اللازم بما يفيد ذلك على الصكوك
                        المذكورة و السجلات لديكم مع أخذ مصادقة المالك على ذلك */}
                      <EditPrint
                        printObj={printObj}
                        id={printId}
                        path="contract_upadate.title18"
                        oldText={title18 || old18}
                      />
                    </p>
                    <p style={{ fontWeight: "bold", margin: 0 }}>
                      والسلام عليكـم ورحمة الله وبركـاته ،،،{" "}
                    </p>
                    {municipality_name != "10506" &&
                      // municipality_name != "10513" &&
                      committee_report_no != null &&
                      province_id && (
                        <div>
                          <img src="images/malharby_sign.png" width="80px" />
                        </div>
                      )}
                  </div>
                </Notes>
              )}
          </ZoomSlider>
        </div>
        <Signature>
          <p style={{ margin: 0 }}>
            {committeeactor_signature?.position ||
              committeeactor_signature?.position_name}
          </p>
          {(committeeactor_signature?.user?.name ||
            committeeactor_signature?.users?.name) && (
            <p
              style={{
                marginRight: "-100px",
                display: "flex",
                align: "center",
                gridGap: "20px",
              }}
            >
              {" "}
              المهندس /
              {/* {((municipality_name != "10506" &&
                municipality_name != "10513") ||
                (municipality_name == "10513" &&
                  create_date_Gregorian < thresholdDate)) && ( */}
              {municipality_name != "10506" && (
                <span style={{ paddingRight: "60px" }}>
                  {province_id && (
                    <SignPics
                      committee_report_no={committee_report_no}
                      province_id={province_id}
                      userId={contract_sign_lagnh}
                      contract={true}
                    />
                  )}
                </span>
              )}
            </p>
          )}

          <p style={{ margin: "auto" }}>
            {committeeactor_signature?.user?.name ||
              committeeactor_signature?.users?.name}
          </p>

          {/* <p>
            <img
              src={`${filesHost}/users/${committeeactor_signature?.user.id}/sign.png`}
              width="250px"
            />
          </p> */}
        </Signature>
      </PrintContainer>
      {sak_type == "1" && (
        <div>
          <PrintContainer
            className={
              nonFullBoundryParcel && nonFullBoundryParcel.length > 4
                ? ""
                : "avoid_page"
            }
          >
            <Introduction>
              <div className="intro_div">
                <div></div>
                {/* <p style={{ fontWeight: "bold", display: "grid" }}>
                  {municipality_name != "10506" && (
                    <span>المملكة العربية السعودية</span>
                  )}
                  {municipality_name != "10506" && (
                    <span>وزارة الشئون البلدية والقروية</span>
                  )}
                  {municipality_name != "10506" && (
                    <span>أمانة المنطقة الشرقية</span>
                  )}
                  {municipality_name != "10506" &&
                    municipality_name != "10513" && (
                      <span>الإدارة العامة للتخطيط العمراني</span>
                    )}
                  {municipality_name == "10513" && <span>بلدية الظهران</span>}
                  {municipality_name != "10506" &&
                    municipality_name != "10513" && (
                      <span> وكالة التعمير والمشاريع</span>
                    )}
                  {municipality_name == "10506" ||
                    (municipality_name == "10513" && (
                      <span>إدارة الأراضي والمساحة</span>
                    ))}
                  {municipality_name != "10506" &&
                    municipality_name != "10513" && <span>إدارة المساحة</span>}
                </p> */}
                <div style={{ marginRight: "30px" }}>
                  <img src="images/logo2.png" width="130px" />
                </div>
                <div style={{ marginRight: "65px", marginTop: "50px" }}>
                  <img src="images/north.png" width="80px" />
                </div>
              </div>
            </Introduction>
            <p
              style={{
                textAlign: "center",
                marginTop: "30px",
                marginBottom: "60px",
              }}
            >
              كروكي فرز
            </p>
            <div className="upperImg">
              <LogoImg style={{ marginLeft: "35px" }}></LogoImg>
              <img src={remove_duplicate(cadImage)} style={{}} />
            </div>
            <Description>
              <p>
                كروكى يبين حدود وأبعاد ومساحة الأراضي أرقام ({" "}
                {localizeNumber(parcel_no)} ){" "}
                {block_no &&
                  `من البلك رقم ( 
              ${localizeNumber(block_no)} )`}{" "}
                بالمخطط المعتمد رقم ( {localizeNumber(plan_no)} ) والمملوكة
                للمواطن ({" "}
                {owners
                  ?.map((owner) => {
                    return owner.owner_name;
                  })
                  .join(", ")}{" "}
                ) بموجب{" "}
                {(["2", "4"].indexOf(sak_type) != -1 &&
                  skok.length > 1 &&
                  "أرقام الصكوك") ||
                  "الصك رقم"}{" "}
                ({" "}
                {(["2", "4"].indexOf(sak_type) != -1 &&
                  skok
                    ?.map((sak) => {
                      return localizeNumber(sak.number_waseka);
                    })
                    .join(" - ")) ||
                  localizeNumber(skok[0].number_waseka)}{" "}
                ) وتاريخ ({" "}
                {(["2", "4"].indexOf(sak_type) != -1 &&
                  skok
                    ?.map((sak) => {
                      return convertToArabic(sak.date_waseka);
                    })
                    .join(" - ")) ||
                  convertToArabic(skok[0].date_waseka)}{" "}
                ) هجري
                {/* هجري وبيان مساحتها كالتالى : */}
              </p>
            </Description>
            <div className="efek" style={{}}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  // height: "60vh",
                  // alignItems: "flex-end",
                  marginTop: "30px",
                }}
              >
                {" "}
                {municipality_name != "10506" && (
                  <div style={{ display: "grid", gridGap: "17px" }}>
                    <p style={{ marginBottom: "60px", marginRight: "50px" }}>
                      المساح
                    </p>
                    <p>
                      {province_id && (
                        <SignPics
                          committee_report_no={committee_report_no}
                          province_id={province_id}
                          userId={userIdsurv}
                          contract={true}
                        />
                      )}
                    </p>
                    <p>
                      {/* المهندس /  */}
                      {surveyName || ""}
                    </p>
                  </div>
                )}
                {municipality_name != "10506" && (
                  <div
                    style={{
                      textAlign: "center",
                      display: "grid",
                      gridGap: "40px",
                    }}
                  >
                    <p style={{ marginBottom: "60px" }}>مدير إدارة المساحة</p>
                    {municipality_name != "10506" && (
                      // municipality_name != "10513" && (
                      <div>
                        <p>
                          {province_id && (
                            <SignPics
                              committee_report_no={committee_report_no}
                              province_id={province_id}
                              userId={userIdsurvmanager}
                              contract={true}
                            />
                          )}
                        </p>
                        <p>
                          {/* المهندس /{" "} */}
                          {surveyManagerName || "مساعد بن مفضي الحربي"}
                        </p>
                      </div>
                    )}
                    {/* {municipality_name == "10513" &&
                      municipality_name != "10506" && (
                        <p>
                          المهندس / {surveyManagerName || "مطلق عوض الزهراني"}
                        </p>
                      )} */}
                  </div>
                )}
                {/* <div>
                <p style={{ marginBottom: "60px", marginRight: "50px" }}>
                  {committeeactor_signature?.position}
                </p>
                <p>المهندس / {committeeactor_signature?.user?.name || ""}</p>
              </div> */}
                {municipality_name != "10506" && (
                  <div>
                    <p style={{ marginLeft: "50px" }}>الختم الرسمي</p>
                  </div>
                )}
              </div>
            </div>
          </PrintContainer>

          {sak_type == "1" &&
            nonFullBoundryParcel.length &&
            nonFullBoundryParcel.length > 4 && (
              <PrintContainerLast>
                <Introduction>
                  <div className="intro_div">
                    <div></div>
                    {/* <p style={{ fontWeight: "bold", display: "grid" }}>
                      {municipality_name != "10506" && (
                        <span>المملكة العربية السعودية</span>
                      )}
                      {municipality_name != "10506" && (
                        <span>وزارة الشئون البلدية والقروية</span>
                      )}
                      {municipality_name != "10506" && (
                        <span>أمانة المنطقة الشرقية</span>
                      )}
                      {municipality_name != "10506" &&
                        municipality_name != "10513" && (
                          <span>الإدارة العامة للتخطيط العمراني</span>
                        )}
                      {municipality_name == "10513" && (
                        <span>بلدية الظهران</span>
                      )}
                      {municipality_name != "10506" &&
                        municipality_name != "10513" && (
                          <span> وكالة التعمير والمشاريع</span>
                        )}
                      {municipality_name == "10506" ||
                        (municipality_name == "10513" && (
                          <span>إدارة الأراضي والمساحة</span>
                        ))}
                      {municipality_name != "10506" &&
                        municipality_name != "10513" && (
                          <span>إدارة المساحة</span>
                        )}
                    </p> */}
                    <div style={{ marginRight: "30px" }}>
                      <img src="images/logo2.png" width="130px" />
                    </div>
                    {/* <div style={{ marginRight: "65px" }}>
                <img src="images/north.png" width="80px" />
              </div> */}
                  </div>
                </Introduction>

                {nonFullBoundryParcel && nonFullBoundryParcel.length > 4 && (
                  <>
                    <Notes>
                      <p
                        style={{
                          textAlign: "center",
                          textDecoration: "underline",
                          fontWeight: "bold",
                          paddingBottom: "30px",
                        }}
                      >
                        كروكي مساحي لكل قطعة على حدي
                      </p>
                    </Notes>
                    <TableContainer className="table-boun">
                      <thead>
                        <th>رقم القطعة</th>
                        <th>الحدود من جهة الشمال</th>
                        <th>الحدود من جهة الجنوب</th>
                        <th>الحدود من جهة الشرق</th>
                        <th>الحدود من جهة الغرب</th>
                        <th>المساحة (م٢)</th>
                      </thead>
                      <tbody>
                        {nonFullBoundryParcel &&
                          nonFullBoundryParcel?.map((parcel) => {
                            return (
                              <tr>
                                <td>{convertToArabic(parcel?.parcel_name)}</td>
                                {getParcelLengthsForContractPrint(parcel)}
                                <td>
                                  {localizeNumber((+parcel?.area)?.toFixed(2))}{" "}
                                  م٢
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </TableContainer>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          // height: "40vh",
                          // alignItems: "flex-end",
                          marginTop: "30px",
                        }}
                      >
                        {" "}
                        {municipality_name != "10506" && (
                          <div style={{ display: "grid", gridGap: "40px" }}>
                            <p
                              style={{
                                marginBottom: "60px",
                                marginRight: "50px",
                              }}
                            >
                              المساح
                            </p>
                            <p>
                              {province_id && (
                                <SignPics
                                  committee_report_no={committee_report_no}
                                  province_id={province_id}
                                  userId={userIdsurv}
                                  contract={true}
                                />
                              )}
                            </p>
                            <p>
                              {/* المهندس / */}
                              {surveyName || ""}
                            </p>
                          </div>
                        )}
                        {municipality_name != "10506" && (
                          <div
                            style={{
                              textAlign: "center",
                              display: "grid",
                              gridGap: "40px",
                            }}
                          >
                            <p style={{ marginBottom: "60px" }}>
                              مدير إدارة المساحة
                            </p>

                            {municipality_name != "10506" && (
                              // municipality_name != "10513" && (
                              <div>
                                <p>
                                  {province_id && (
                                    <SignPics
                                      committee_report_no={committee_report_no}
                                      province_id={province_id}
                                      userId={userIdsurvmanager}
                                      contract={true}
                                    />
                                  )}
                                </p>
                                <p style={{ marginTop: "50px" }}>
                                  {/* المهندس /{" "} */}
                                  {surveyManagerName || "مساعد بن مفضي الحربي"}
                                </p>
                              </div>
                            )}
                            {/* {municipality_name == "10513" &&
                              municipality_name != "10506" && (
                                <p>
                                  المهندس /{" "}
                                  {surveyManagerName || "مطلق عوض الزهراني"}
                                </p>
                              )} */}
                          </div>
                        )}
                        <div style={{ display: "grid", gridGap: "40px" }}>
                          <p
                            style={{
                              marginBottom: "60px",
                              marginRight: "50px",
                            }}
                          >
                            {committeeactor_signature?.position ||
                              committeeactor_signature?.position_name}
                          </p>
                          <p style={{ marginRight: "150px" }}>
                            {province_id && (
                              <SignPics
                                committee_report_no={committee_report_no}
                                province_id={province_id}
                                userId={contract_sign_lagnh}
                                contract={true}
                              />
                            )}
                          </p>
                          <p
                            style={{
                              display: "grid",
                              gridGap: "40px",
                              marginRight: "60px",
                            }}
                          >
                            المهندس /{" "}
                            {committeeactor_signature?.user?.name ||
                              committeeactor_signature?.users?.name ||
                              ""}
                            {/* فواز بن فهد العتيبي */}
                          </p>
                        </div>
                      </div>
                      {municipality_name != "10506" && (
                        <div style={{ textAlign: "center", marginTop: "50px" }}>
                          <p style={{ marginLeft: "50px" }}>الختم الرسمي</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </PrintContainerLast>
            )}
        </div>
      )}
    </div>
  );
};

export default ContractPrint;
