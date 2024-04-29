import { Descriptions } from "antd";
import React, { useState, useEffect, useContext } from "react";
import styled, { css } from "styled-components";
import { Modal } from "antd";
import { PrintContext } from "../../../../editPrint/Print_data_Provider";
import {
  convertToArabic,
  localizeNumber,
  checkImage,
} from "app/components/inputs/fields/identify/Component/common/common_func";
import ZoomSlider from "app/components/editPrint/zoomEdit";
export default function HTML(props) {
  let {
    request_number,
    create_date,
    workflow_id,
    workflows_id,
    is_approved,
    kroky_subject,
    committee_report_no,
    // owner,
    // owner_name,
    // identity,
    print_state,
    owners,
    skok,
    //kind,
    coordinates,
    city,
    district_name,
    street_name,
    plan_no,
    subdivision_description,
    block_no,
    parcel_no,
    parcel_type,
    office_remark,
    approved_Image,
    previous_Image,
    have_electric_room,
    electric_room_area,
    hasParcelCutter,
    survayParcelCutter,
    parcelData,
    sak_totalArea,
    nature_totalArea,
    suggestedParcels,
    user,
    committeeactors,
    nonFullBoundryParcel,
    fullBoundryParcel,
    total_deduction
  } = useContext(PrintContext) ?? props.mo3aynaObject[0];
  console.log("dataPrint", useContext(PrintContext), props.mo3aynaObject);

  const PrintContainer = styled.div`
    @media print {
      height: 99vh;
      overflow: visible;
    }
    display: grid;
    grid-gap: 5px;
    margin: 5px;
    text-align: right !important;
    font-size: 1rem !important;
    height: 90vh;
    border: 1px solid;
    overflow: auto;
  `;
  const RightPartDown = styled.section``;
  const UpperSection = styled.section`
    @media print {
    }
    display: grid;
    border-bottom: 1px solid #000;
    height: auto;
    padding: 5px;
    grid-template-columns: 1fr 2fr;
  `;
  const DownSection = styled.section`
    margin: 10px;
    display: grid;

    grid-template-columns: 1fr 2fr;
  `;

  const Description = styled.section.attrs({
    className: "global-border-1px",
  })``;
  `padding:5px`;
  const Notes = styled.section.attrs({
    className: "global-border-1px",
  })``;
  `padding:5px`;

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
  const RightPart = styled.div`
    border-bottom: 1px solid #000;
  `;
  const LeftPart = styled.div`
    display: grid;
    border-right: 1px solid #000;
    margin: 5px;
  `;

  const CustomizedText = styled.p``;
  const CustomizedTd = styled.td`
    width: 10%;
    writing-mode: vertical-rl;
    text-align: center !important;
    white-space: nowrap;
  `;
  const LogoImg = styled.div`
    position: absolute;
    left: 1%;
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
    margin: 5px;
    height: 10vh;
  `;
  const BtnPrint = styled.button.attrs({
    className: "btn add-btnT printBtn",
  })`
    justify-self: flex-end;
    height: 5vh;
    margin-left: 10px;
  `;

  return (
    <div
      // className="table-report-container"
      // className={ (workflow_id == 2029 || workflows_id == 2029) && !committee_report_no ? "watermark " : "no-watermark "}
      className={
        (workflow_id == 2029 || workflows_id == 2029) && !is_approved
          ? "watermark "
          : "no-watermark "
      }
      // style={{ zoom: ".79" }}
    >
      <PrintContainer className={print_state == "A0" ? "A0" : "A3"}>
        <BtnPrint
          onClick={() => {
            window.print();
          }}
        >
          طباعة
        </BtnPrint>

        <UpperSection>
          <RightPart
            style={{
              zoom:
                (owners && !owners.length > 5) || print_state == "A3"
                  ? "max(.57,0.65)"
                  : "1",
            }}
          >
            <TableContainer>
              <tbody>
                <tr>
                  <CustomizedTd>
                    <CustomizedText>بيانات المعاملة</CustomizedText>
                  </CustomizedTd>
                  <td>
                    <tr>
                      <td>رقم المعاملة :</td>
                      <td>{convertToArabic(request_number)}</td>
                    </tr>
                    <tr>
                      <td>تاريخ اعتماد الكروكي :</td>
                      <td>{convertToArabic(create_date)} هـ</td>
                    </tr>
                    {kroky_subject && (<tr>
                      <td>موضوع الكروكي :</td>
                      <td>{kroky_subject}</td>
                    </tr>)}
                  </td>
                </tr>
              </tbody>
            </TableContainer>
            <TableContainer>
              <tbody>
                <tr>
                  <CustomizedTd>
                    <CustomizedText>بيانات المالكين</CustomizedText>
                  </CustomizedTd>
                  <td>
                    <tr>
                      <td>الاسم</td>
                      <td>سجل مدني / سجل تجاري / ترخيص رقم</td>
                    </tr>
                    {owners?.map((owner) => {
                      return (
                        <tr>
                          <td>{owner.owner_name}</td>
                          <td>{convertToArabic(owner.identity)}</td>
                        </tr>
                      );
                    })}
                  </td>
                </tr>
              </tbody>
            </TableContainer>
            <TableContainer>
              <tbody>
                <tr>
                  <CustomizedTd>
                    <CustomizedText>بيانات الصكوك</CustomizedText>
                  </CustomizedTd>
                  <td>
                    <tr>
                      <td>رقم الصك</td>
                      <td>التاريخ </td>
                      <td>المصدر </td>
                    </tr>
                    {skok?.map((sak, k) => {
                      return (
                        <tr key={k}>
                          <td>{convertToArabic(sak.number_waseka)}</td>
                          <td>{convertToArabic(sak.date_waseka)} هـ</td>
                          <td>{sak.waseka_search}</td>
                        </tr>
                      );
                    })}
                  </td>
                </tr>
              </tbody>
            </TableContainer>
            <TableContainer>
              <tbody>
                <tr>
                  <CustomizedTd>
                    <CustomizedText>بيانات الكروكي</CustomizedText>
                  </CustomizedTd>
                  <td>
                    <tr>
                      <td>المدينة :</td>
                      <td>{city}</td>
                    </tr>
                    {district_name && (
                      <tr>
                        <td>الحي : </td>
                        <td>{district_name}</td>
                      </tr>
                    )}
                    {plan_no && (
                      <tr>
                        <td>رقم المخطط : </td>
                        <td>{convertToArabic(plan_no)}</td>
                      </tr>
                    )}
                    {subdivision_description && (
                      <tr>
                        <td>وصف التقسيم : </td>
                        <td>{convertToArabic(subdivision_description)}</td>
                      </tr>
                    )}
                    {block_no && (
                      <tr>
                        <td>رقم البلك : </td>
                        <td>{convertToArabic(block_no)}</td>
                      </tr>
                    )}
                    {street_name && (
                      <tr>
                        <td>اسم الشارع : </td>
                        <td>{street_name}</td>
                      </tr>
                    )}
                    <tr>
                      <td>رقم القطعة : </td>
                      <td>{convertToArabic(parcel_no)}</td>
                    </tr>
                  </td>
                </tr>
              </tbody>
            </TableContainer>
            {parcel_type && (
              <Description>
                <p>وصف الأرض</p>
                <p>عبارة عن : {parcel_type}</p>
              </Description>
            )}
            {office_remark && (
              <Description>
                <p>ملاحظات :</p>
                <p>{convertToArabic(office_remark)}</p>
              </Description>
            )}
            <Notes>
              <p>تلغي هذه الاستمارة بعد مرور ستة أشهر من تاريخ اصدارها .</p>
              <p>
                يتحمل صاحب االأرض الموضحة أوصافها أعلاه بأنه عند أستلام حدودها
                واركانها علي الطبيعة، ويكون مسئولا علي المحافظة علي هذه الأركان
                وعدم تحريكها ويتعهد بمراجعة{" "}
                {user?.engcompany_id ? " مكتب " : " بلدية "} للكشف بعد الحفر،
                ويتحمل مسئولية أي أخطاء في حال عدم مراجعة{" "}
                {user?.engcompany_id ? " مكتب " : " البلدية "}
              </p>
              <p style={{ textAlign: "center" }}>
                تم الاعتماد من قبل{" "}
                {user?.engcompany_id
                  ? " مكتب "
                  : " بلدية " + user?.municipalities?.name}
                {user?.engineering_companies?.name} بناء علي زيارة ميدانية
                للوقوف علي الطبيعة
              </p>
              {!committee_report_no &&
                [undefined, null].indexOf(request_number) == -1 && (
                  <Signature>
                    <ContainerFlex>
                      {user?.engcompany_id && (
                        <>
                          <Text>مسئول المكتب</Text>
                          <Text>ختم المكتب</Text>
                        </>
                      )}
                      {!user?.engcompany_id && (
                        <>
                          <Text>مسئول البلدية</Text>
                          <Text>ختم البلدية</Text>
                        </>
                      )}
                    </ContainerFlex>
                    <ContainerFlex>
                      {user?.engcompany_id && (
                        <>
                          <Text style={{ fontWeight: "bold" }}>
                            {user?.engineering_companies?.responsible_name ||
                              user.engineering_companies.name}
                          </Text>
                          <Text></Text>
                        </>
                      )}
                      {!user?.engcompany_id && (
                        <>
                          <Text style={{ fontWeight: "bold" }}>
                            {user?.name}
                          </Text>
                          <Text></Text>
                        </>
                      )}
                    </ContainerFlex>
                  </Signature>
                )}
              {committee_report_no && (
                <Signature>
                  <ContainerFlex>
                    {committeeactors
                      .filter((actor) => actor.position)
                      .map((actor) => {
                        return <Text>{actor?.position}</Text>;
                      })}
                  </ContainerFlex>
                  <ContainerFlex>
                    {committeeactors
                      .filter((actor) => actor.position)
                      .map((actor) => {
                        return <Text>المهندس / {actor.user.name}</Text>;
                      })}
                  </ContainerFlex>
                </Signature>
              )}
            </Notes>
          </RightPart>
          <LeftPart>
            <LogoImg style={{ width: "80px", height: "80px" }}>
              <img src="images/north.png" />
            </LogoImg>
            <ImgContainer1>
              {/* <img src="images/map.png" width="150px" /> */}
              {checkImage(props, previous_Image, { width: "" })}
              <p>الموقع العام</p>
            </ImgContainer1>
            <ImgContainer1>
              {checkImage(props, approved_Image, { width: "" })}
              <p> الكروكي المساحي</p>
            </ImgContainer1>
            {have_electric_room && (
              <>
                <Text style={{ textAlign: "left" }}>
                  إجمالى مساحة غرف الكهرباء :-{" "}
                  {convertToArabic(electric_room_area)} م{convertToArabic(2)}
                </Text>
              </>
            )}
            {hasParcelCutter && (
              <>
                <Text>الشطفات</Text>
                <TableContainer>
                  <tbody>
                    <tr>
                      <td>الإتجاه</td>
                      <td>شمال / شرق</td>
                      <td>شمال / غرب</td>
                      <td>جنوب / شرق</td>
                      <td>جنوب / غرب</td>
                    </tr>
                    {survayParcelCutter?.map((parcelCutter) => {
                      return (
                        <tr>
                          <td>{parcelCutter?.direction}</td>
                          <td>
                            {convertToArabic(
                              parcelCutter?.NORTH_EAST_DIRECTION
                            )}
                          </td>
                          <td>
                            {convertToArabic(
                              parcelCutter?.NORTH_WEST_DIRECTION
                            )}
                          </td>
                          <td>
                            {convertToArabic(
                              parcelCutter?.SOUTH_EAST_DIRECTION
                            )}
                          </td>
                          <td>
                            {convertToArabic(
                              parcelCutter?.SOUTH_WEST_DIRECTION
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </TableContainer>
              </>
            )}
          </LeftPart>
        </UpperSection>
        <ZoomSlider>
          <DownSection style={{ zoom: print_state == "A3" ? ".62" : "1" }}>
            <RightPartDown>
              <Text>
                احداثيات الموقع حسب نظام احداثيات خرائط الأمانة(84 WGS)
              </Text>
              <TableContainer>
                <thead>
                  <th>النقطة</th>
                  <th>شرقيات</th>
                  <th>شماليات</th>
                </thead>
                <tbody>
                  {coordinates?.map((point) => {
                    return (
                      <tr>
                        <td>{convertToArabic(point[2])}</td>
                        <td>
                          {convertToArabic((point.x || point[0]).toFixed(6))}
                        </td>
                        <td>
                          {convertToArabic((point.y || point[1]).toFixed(6))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </TableContainer>
            </RightPartDown>
            <LeftPart>
              <LayoutCustomize>
                <ContainerGrid>
                  {parcelData && (
                    <>
                      <Text>الحدود و الأبعاد بموجب الصك</Text>
                      <TableContainer>
                        <thead>
                          <th>الإتجاه</th>
                          <th>الأطوال</th>
                          <th>الحدود</th>
                        </thead>
                        <tbody>
                          <tr>
                            <td>شمال</td>
                            <td>
                              {convertToArabic(parcelData?.north_length)} م
                            </td>
                            <td>{convertToArabic(parcelData?.north_desc)}</td>
                          </tr>
                          <tr>
                            <td>شرق</td>
                            <td>
                              {convertToArabic(parcelData?.east_length)} م
                            </td>
                            <td>{convertToArabic(parcelData?.east_desc)}</td>
                          </tr>
                          <tr>
                            <td>جنوب</td>
                            <td>
                              {convertToArabic(parcelData?.south_length)} م
                            </td>
                            <td>{convertToArabic(parcelData?.south_desc)}</td>
                          </tr>
                          <tr>
                            <td>غرب</td>
                            <td>
                              {convertToArabic(parcelData?.west_length)} م
                            </td>
                            <td>{convertToArabic(parcelData?.west_desc)}</td>
                          </tr>
                          <tr>
                            <td>المساحة</td>
                            <td colSpan="2" style={{ textAlign: "center" }}>
                              {convertToArabic(sak_totalArea.toFixed(2))} م
                              {convertToArabic(2)}
                            </td>
                          </tr>
                        </tbody>
                      </TableContainer>
                    </>
                  )}
                </ContainerGrid>
                <ContainerGrid>
                  <Text>الحدود و الأبعاد بموجب الطبيعة</Text>
                  {(
                    (nonFullBoundryParcel?.length == 1 &&
                      nonFullBoundryParcel) ||
                    [fullBoundryParcel]
                  )?.map((parcel, k) => {
                    return (
                      <TableContainer key={k}>
                        <thead>
                          <th>الأطوال</th>
                          <th>الحدود</th>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {convertToArabic(
                                (parcel?.data &&
                                  +parcel?.data[0]?.totalLength.toFixed(2)) ||
                                  0
                              )}{" "}
                              م
                            </td>
                            <td>{convertToArabic(parcel?.north_Desc) || ""}</td>
                          </tr>
                          <tr>
                            <td>
                              {convertToArabic(
                                (parcel?.data &&
                                  +parcel?.data[1]?.totalLength.toFixed(2)) ||
                                  0
                              )}{" "}
                              م
                            </td>
                            <td>{convertToArabic(parcel?.east_Desc) || ""}</td>
                          </tr>
                          <tr>
                            <td>
                              {convertToArabic(
                                (parcel?.data &&
                                  +parcel?.data[4]?.totalLength.toFixed(2)) ||
                                  0
                              )}{" "}
                              م
                            </td>
                            <td>{convertToArabic(parcel?.south_Desc) || ""}</td>
                          </tr>
                          <tr>
                            <td>
                              {convertToArabic(
                                (parcel?.data &&
                                  +parcel?.data[3]?.totalLength.toFixed(2)) ||
                                  0
                              )}{" "}
                              م
                            </td>
                            <td>{convertToArabic(parcel?.west_Desc) || ""}</td>
                          </tr>
                          <tr>
                            {/* <td>المساحة</td> */}
                            <td colSpan="2" style={{ textAlign: "center" }}>
                              {convertToArabic(((parcel?.area || 0) - total_deduction)?.toFixed(2))} م
                              {convertToArabic(2)}
                            </td>
                          </tr>
                        </tbody>
                      </TableContainer>
                    );
                  })}
                </ContainerGrid>
              </LayoutCustomize>
            </LeftPart>
          </DownSection>
        </ZoomSlider>
      </PrintContainer>
    </div>
  );
}
