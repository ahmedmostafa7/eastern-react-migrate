import { Descriptions } from "antd";
import React, { useState, useEffect, useContext } from "react";
import styled, { css } from "styled-components";
import { Modal } from "antd";
import { PrintContext } from "../editPrint/Print_data_Provider";
import {
  convertToArabic,
  localizeNumber,
  checkImage,
} from "app/components/inputs/fields/identify/Component/common/common_func";
import ZoomSlider from "app/components/editPrint/zoomEdit";

const Invoice = () => {
  let {
    request_number,
    fees,
    approval_fees_exporter,
    fees_exporter,
    invoice_number,
    invoice_date,
    invoices,
    owners,
    owner_type,
    app_id,
  } = useContext(PrintContext);

  console.log("dataPrint", useContext(PrintContext));

  const PrintContainer = styled.div`
    @media print {
      height: 99vh;
      overflow: visible;
    }

    grid-gap: 5px;
    margin: 5px;
    text-align: right !important;
    font-size: 1rem !important;
    overflow: auto;
  `;
  const Introduction = styled.section`
    display: flex;
    justify-content: space-between;
    margin: 15px;
    padding: 10px;
    align-items: center;
  `;
  const BtnPrint = styled.button.attrs({
    className: "btn add-btnT printBtn",
  })`
    justify-self: flex-end;
    height: 5vh;
    margin-left: 10px;
  `;
  const Content = styled.section`
    border: 2px solid;
    zoom: 0.95;
  `;
  const Custdiv = styled.div`
    text-align: center;
    margin-top: -14px;
    z-index: 10;
    font-weight: bold;
    color: #fff;
    display: flex;
    justify-content: center;
  `;
  const CustP = styled.p`
    background: dimgray !important;
    padding: 5px 50px;
    border: 1px solid;
    z-index: 100;
    color: #fff !important;
    border-radius: 6px;
  `;
  const Footer = styled.section``;
  return (
    <PrintContainer>
      <BtnPrint
        style={{ float: "left" }}
        onClick={() => {
          window.print();
        }}
      >
        طباعة
      </BtnPrint>
      <Introduction>
        <div
          className="intro_div"
          style={{ gridTemplateColumns: "1fr 1fr 1fr", justifyItems: "center" }}
        >
          <p
            style={{ fontWeight: "bold", display: "grid", textAlign: "center" }}
          >
            <span>المملكة العربية السعودية</span>
            <span>وزارة الشئون البلدية والقروية</span>
            <span>أمانة المنطقة الشرقية</span>
          </p>
          <div>
            <img src="images/logo2.png" width="130px" />
          </div>
          <div>
            <img src="images/saudiVision.png" width="170px" />
            {/* <p>الرقم الضريبى :586545654454</p> */}
          </div>
        </div>
      </Introduction>
      <Content>
        <Custdiv>
          <CustP>فاتورة سداد الرسوم</CustP>
        </Custdiv>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            border: "1px solid",
            padding: "10px",
            margin: "15px",
            borderRadius: "16px",
          }}
        >
          {/* <p>
            <span>( رقم السداد ) : </span>
            <span>{convertToArabic(invoice_number)}</span>
          </p>
          <p>
            <span>( مبلغ الفاتورة ) : </span>
            <span>{convertToArabic(fees)}</span>
          </p>
          {!invoices?.length && invoice_date && (
            <p>
              <span>( تاريخ الفاتورة ) : </span>
              <span>{convertToArabic(invoice_date)}</span>
            </p>
          )} */}
          {invoices?.length && (
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>رقم الفاتورة</th>
                  <th>تاريخ الفاتورة</th>
                  <th>قيمة الفاتورة</th>
                  <th>حالة الدفع</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  return (
                    <tr>
                      <td>
                        <span>{convertToArabic(invoice.invoice_number)}</span>
                      </td>
                      <td>
                        <span>{convertToArabic(invoice.invoice_date)}</span>
                      </td>
                      <td>
                        <span>{convertToArabic(invoice.fees)} ريال</span>
                      </td>
                      <td>
                        <span>
                          {invoice.is_paid ? "تم الدفع" : "لم يتم الدفع"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div style={{}}>
          <div
            style={{
              display: "grid",
              gridGap: "20px",
              // justifyItems: "center",
              gridTemplateColumns: "2fr 1fr",
            }}
            // className="span_cust"
          >
            <div className="span_cust_4">
              <div className="borderH">
                {owner_type == "1" ? (
                  <span>اسم المستفيد :</span>
                ) : owner_type == "2" ? (
                  <span>اسم القطاع الحكومي :</span>
                ) : (
                  <span>اسم المؤسسة/الشركة :</span>
                )}
              </div>
              <div style={{ display: "grid" }}>
                {owners &&
                  owners.map((o, k) => {
                    return (
                      <span key={k}>
                        {o.owner_name}
                        {owners.length > 1 && <span>&nbsp;-&nbsp;</span>}
                      </span>
                    );
                  })}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="borderH">
                {owner_type == "1" ? (
                  <span>رقم الهوية :</span>
                ) : owner_type == "2" ? (
                  <span>كود الجهة</span>
                ) : (
                  <span>رقم السجل التجاري</span>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {owners &&
                  owners.map((o, k) => {
                    return (
                      <span key={k}>
                        {convertToArabic(o.identity)}
                        {owners.length > 1 && <span>&nbsp;-&nbsp;</span>}
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className="span_cust" style={{}}>
          <div>الوصف : </div>
          {app_id == 1 && (
            <span>
              لطلبكم بخصوص فرز الأراضي للمعاملة رقم ({" "}
              {convertToArabic(request_number)} )
            </span>
          )}
          {app_id == 16 && (
            <span>
              لطلبكم بخصوص اعتماد المخططات للمعاملة رقم ({" "}
              {convertToArabic(request_number)} )
            </span>
          )}
          {app_id == 22 && (
            <span>
              لطلبكم لدي الإدارة العامة للأراضي والممتلكات الخاص بشراء الزائدة
              التنظيمية للمعاملة رقم ( {convertToArabic(request_number)} )
            </span>
          )}
        </div>
        <div className="span_cust">
          <div>الإجمالي : </div>
          <span
            style={{
              float: "left",
              marginLeft: "14vh",
              border: "1px solid",
              padding: "7px 50px",
              borderRadius: "5px",
            }}
          >
            {convertToArabic(fees)}
          </span>
        </div>
        {app_id == 22 && (
          <div className="span_cust" style={{}}>
            <div>مصدر الفاتورة : </div>
            <span>{approval_fees_exporter}</span>
          </div>
        )}

        <div className="pre_footer">
          {/* <div>
            <div>مصدر الفاتورة</div>
            <span>عبد الله الثانى</span>
          </div> */}
          <div style={{ display: "grid", justifyContent: "center" }}>
            <img src="images/invoice_done.png" width="150px" />
          </div>
        </div>
        <Footer></Footer>
      </Content>
    </PrintContainer>
  );
};

export default Invoice;
