import { Descriptions } from "antd";
import React, { Component } from "react";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
import styled, { css } from "styled-components";
import { Modal } from "antd";
import { get, isEmpty, map } from "lodash";
import moment from "moment-hijri";
// import { PrintContext } from "../../../../editPrint/Print_data_Provider";
import {
  convertToArabic,
  localizeNumber,
  checkImage,
  selectActors,
} from "app/components/inputs/fields/identify/Component/common/common_func";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import axios from "axios";
import EditPrint from "app/components/editPrint";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import { withTranslation } from "react-i18next";
class sakPropertycheck_letter extends Component {
  state = {
    data: [],
    printObj: {},
    title1: "",
    title2: "",
    title3: "",
    title4: "",
    title5: "",
    title6: "",
    title7: "",
    title8: "",
  };
  componentDidMount() {
    const { t } = this.props;
    console.log("match_id", this.props.match.params.id);
    initializeSubmissionData(this.props.match.params.id).then((response) => {
      var mainObject = response.mainObject;
      let ceator_user_name = response.ceator_user_name;
      let submission = response.submission;
      this.state["historydata"] = response.historyData;
      this.setState({ id: this.props.match.params.id });
      let printObj = response?.printObj;
      let title1 = response?.printObj?.printTextEdited?.propertyroll?.title1;
      let title2 = response?.printObj?.printTextEdited?.propertyroll?.title2;
      let title3 = response?.printObj?.printTextEdited?.propertyroll?.title3;
      let title4 = response?.printObj?.printTextEdited?.propertyroll?.title4;
      let title5 = response?.printObj?.printTextEdited?.propertyroll?.title5;
      let title6 = response?.printObj?.printTextEdited?.propertyroll?.title6;
      let title7 = response?.printObj?.printTextEdited?.propertyroll?.title7;
      let title8 = response?.printObj?.printTextEdited?.propertyroll?.title8;

      let actors = selectActors(submission, mainObject, [1, 0]);
      //

      let committeeactors1_id = actors?.find((r) => r?.index == 0)?.id;
      let committeeactors2_id = actors?.find((r) => r?.index == 1)?.id;

      let committeeactors_dynamica_id = actors?.filter(
        (d) =>
          d?.name ==
          (mainObject?.engSecratoryName ||
            actors?.find((r) => r?.index == 2)?.name)
      )?.[0]?.id;

      let committeeactors1 = actors?.find((r) => r?.index == 0);
      let committeeactors2 = actors?.find((r) => r?.index == 1);

      let request_no = get(submission, "request_no");
      let create_date = get(submission, "create_date");
      let export_no = get(submission, "export_no");
      let export_date = get(submission, "export_date");

      var ownerNames = "";
      var owners = Object.keys(mainObject?.ownerData?.ownerData?.owners)?.map(
        (ownerKey) => {
          return {
            owner_name: mainObject?.ownerData?.ownerData?.owners[ownerKey].name,
            identity: localizeNumber(
              mainObject?.ownerData?.ownerData?.owners[ownerKey].ssn ||
                mainObject?.ownerData?.ownerData?.owners[ownerKey]
                  .code_regesteration ||
                mainObject?.ownerData?.ownerData?.owners[ownerKey]
                  .commercial_registeration
            ),
            identity_label:
              (mainObject?.ownerData?.ownerData?.owners[ownerKey].ssn &&
                "هوية وطنية") ||
              (mainObject?.ownerData?.ownerData?.owners[ownerKey]
                .code_regesteration &&
                "كود الجهة") ||
              (mainObject?.ownerData?.ownerData?.owners[ownerKey]
                .commercial_registeration &&
                "سجل التجاري"),
          };
        }
      );

      let owners_name =
        owners?.map((r) => r?.owner_name)?.join(", ") ||
        get(mainObject, "destinationData.destinationData.entity.name", "");

      // var representerData = mainObject?.ownerData?.representerData.reps?.map(
      //   (representer) => {
      //
      //     return {
      //       representer_name: representer.name,
      //       identity: localizeNumber(
      //         representer.ssn ||
      //           representer.code_regesteration ||
      //           representer.commercial_registeration
      //       ),
      //       identity_label:
      //         (representer.ssn && "السجل المدنى") ||
      //         (representer.code_regesteration && "كود الجهة") ||
      //         (representer.commercial_registeration && "السجل التجاري"),
      //       representer_nationality: representer.nationalities.local_name,
      //     };
      //   }
      // );

      let has_representer =
        mainObject?.ownerData &&
        mainObject?.ownerData?.ownerData?.has_representer;
      let wakil_name =
        mainObject?.ownerData &&
        mainObject?.ownerData?.representerData?.reps?.[0]?.name;
      let wakil_nationality_name =
        mainObject?.ownerData &&
        mainObject?.ownerData?.representerData?.reps?.[0]?.nationalities
          ?.local_name;
      let wakil_nationality_type =
        mainObject?.ownerData &&
        mainObject?.ownerData?.representerData?.reps?.[0]?.nationalidtypes
          ?.name;
      let wakil_identity_no =
        mainObject?.ownerData &&
        mainObject?.ownerData?.representerData?.reps?.[0]?.ssn;

      // let representData = get(mainObject, "ownerData.representData", null);
      let wekala_sak_no =
        mainObject?.ownerData &&
        mainObject?.ownerData?.representData?.sak_number;
      let wekala_sak_date =
        mainObject?.ownerData && mainObject?.ownerData?.representData?.sak_date;
      let wekala_issuer =
        mainObject?.ownerData && mainObject?.ownerData?.representData?.issuer;

      // let skok = get(mainObject, "waseka.waseka.table_waseka", []);
      let sak_no =
        mainObject?.waseka &&
        mainObject?.waseka?.waseka?.table_waseka?.[0]?.number_waseka;
      let sak_date =
        mainObject?.waseka &&
        mainObject?.waseka?.waseka?.table_waseka?.[0]?.date_waseka;
      let sak_issuer =
        mainObject?.waseka &&
        mainObject?.waseka?.waseka?.table_waseka?.[0]?.waseka_search;

      let municipality_name =
        (mainObject?.landData &&
          mainObject?.landData?.landData?.municipality?.name) ||
        (mainObject?.landData &&
          mainObject?.landData?.landData?.municipality?.CITY_NAME);
      let district_name =
        mainObject?.landData &&
        mainObject?.landData?.landData?.lands?.parcels?.[0]?.selectedLands?.[0]
          ?.attributes?.DISTRICT_NAME;
      let parcel_description =
        (mainObject?.landData && mainObject?.landData?.landData?.parcel_desc) ||
        (mainObject?.landData &&
          mainObject?.landData?.landData?.lands?.parcels?.[0]?.attributes
            ?.PARCEL_PLAN_NO);

      // let parcels = get(
      //   mainObject,
      //   "landData.landData.lands.parcels",
      //   []
      // ).reduce((a, b) => {
      //   a = (a.length && [
      //     ...a,
      //     ...b.selectedLands?.map((e) => {
      //       return e.attributes;
      //     }),
      //   ]) || [
      //     ...b.selectedLands?.map((e) => {
      //       return e.attributes;
      //     }),
      //   ];
      //   return a;
      // }, []);

      this.setState({
        printObj,
        request_no,
        create_date,
        export_no,
        export_date,
        committeeactors1_id,
        committeeactors2_id,
        committeeactors1,
        committeeactors2,
        owners_name,
        owners,
        // skok,
        sak_no,
        sak_date,
        sak_issuer,
        // parcels,
        municipality_name,
        district_name,
        parcel_description,
        // representerData,
        has_representer,
        wakil_name,
        wakil_identity_no,
        wakil_nationality_name,
        wakil_nationality_type,
        // representData,
        wekala_sak_no,
        wekala_sak_date,
        wekala_issuer,
        title1,
        title2,
        title3,
        title4,
        title5,
        title6,
        title7,
        title8,
      });
    });
  }

  render() {
    console.log(this.state);
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    let {
      printObj,
      id,
      request_no,
      create_date,
      export_no,
      export_date,
      committeeactors1_id,
      committeeactors2_id,
      committeeactors1,
      committeeactors2,
      owners_name,
      owners,
      // skok,
      sak_no,
      sak_date,
      sak_issuer,
      // parcels,
      municipality_name,
      district_name,
      parcel_description,
      // representerData,
      has_representer,
      wakil_name,
      wakil_identity_no,
      wakil_nationality_name,
      wakil_nationality_type,
      // representData,
      wekala_sak_no,
      wekala_sak_date,
      wekala_issuer,
      title1,
      title2,
      title3,
      title4,
      title5,
      title6,
      title7,
      title8,
    } = this.state;

    return (
      <div
        style={{
          marginTop: "10vh",
          padding: "25px",
          textAlign: "justify",
          lineHeight: 2,
          height: "80vh",
          overflow: "auto",
        }}
        className="mohand_font_cust_22 ta5sesVis"
      >
        <div
          style={{
            textAlign: "left",
            position: "absolute",
            left: "2vh",
            top: "1vh",
          }}
        >
          <p style={{ marginLeft: "50px" }}>
            <span>{convertToArabic(export_no)}</span>
          </p>
          <p style={{ marginTop: "14px" }}>
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(export_date?.split("/")[0] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(export_date?.split("/")[1] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "5px" }}>
              {convertToArabic(export_date?.split("/")[2] || "")}
            </span>
            {"    "}
          </p>
        </div>
        <div className="printBtnDiv">
          {" "}
          <button
            className="btn add-btnT printBtn"
            onClick={() => {
              window.print();
            }}
          >
            طباعة
          </button>
        </div>
        <header
          style={{
            display: "flex",
            justifyContent: "right",
            position: "fixed",
            width: "100%",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
            }}
          >
            <div>
              <h5>الإدارة العامة للأراضي والممتلكات</h5>
              <h5 style={{ marginRight: "35px" }}>إدارة فحص الملكية</h5>
            </div>
            <div style={{ display: "grid", zoom: 0.9 }}>
              <div style={{ textAlign: "center" }}>
                <p>الموضوع: بشأن التأكد من سريان مفعول الصك العائد ملكيته</p>
                <h5>لـ / {owners_name}</h5>
              </div>
            </div>
          </div>
        </header>
        <div style={{ marginTop: "14vh" }}>
          <div>
            <h2>
              فضيلة / رئيس {convertToArabic(sak_issuer)}
              <span style={{ float: "left", fontWeight: "bold" }}>
                سلمه الله
              </span>
            </h2>
            <h3 style={{ fontWeight: "bold" }}>
              السلام عليكم ورحمة الله وبركاته ..
              <span>أسأل الله لكم السداد والتوفيق ،، وبعد</span>
            </h3>
          </div>

          <div style={{ marginTop: "5vh" }}>
            {/* first time  */}
            <div>
              <p>
                &nbsp;&nbsp;&nbsp; إشارة إلى طلب الإدارة العامة للتخطيط العمراني
                بالأمانة المتضمن طلب الكشف على الصك الموضح أدناه والإفادة عن صحة
                التملك بما يتفق مع الأوامر السانية والأنظمة والتعليمات وفقا
                لتوجيهات بهذا الأمر .. إلخ ، وبناء على التعميم الوزاري رقم{" "}
                {convertToArabic("255/ ص س ز")} بتاريخ{" "}
                {convertToArabic("13 / 8 / 1432")} هـ الإلحاقي للتعميم رقم{" "}
                {convertToArabic("150/ص س ز")} بتاريخ{" "}
                {convertToArabic("12 / 6 / 1422")} هـ ورقم{" "}
                {convertToArabic("116/ص س ز")} بتاريخ{" "}
                {convertToArabic("6 / 5 / 1422")}
                هـ والمشار فيه إلى التعميم رقم {convertToArabic(
                  "78500"
                )} في {convertToArabic("21 / 12 / 1428")} هـ المشار فيه إلى
                التعميم رقم {convertToArabic(63289)} في{" "}
                {convertToArabic("26/10/1426")} هـ المبلغ به الأمر السامي الكريم
                رقم
                {convertToArabic("10633/م")} وتاريخ{" "}
                {convertToArabic("5/9/1426")} هـ القاضي بالتأكيد على ما قضي به
                الأمرين الساميين رقم {convertToArabic("325/2")} وتاريخ{" "}
                {convertToArabic("5/6/1423")} هـ ورقم{" "}
                {convertToArabic("3235/م/ب")} وتاريخ{" "}
                {convertToArabic("4/12/1425")}
                هـ والرفع عما إذا ورد بعد تاريخهما ما يخالف ما قضيا به للتوجيه
                بما يجب إتخاذه حيال ذلك ، كما تضمن التعميم الوزاري رقم{" "}
                {convertToArabic("255/ص س ز")} بتاريخ{" "}
                {convertToArabic("13/8/1432")} هـ بالتأكيد من صحة وسلامة مستندات
                التملك والتي يتقدم أصحابها بها للأمانات والبلديات وأن يكون الصك
                وأساساته التي بني عليها مستكملة للإجراءات الشرعية النظامية ، وأن
                إصدارها قد تم وفقا للإجراءات الشرعية والنظامية وبما يتفق مع
                الأوامر السامية والأنظمة والتعليمات{" "}
                <span
                  style={{ textDecoration: "underline", fontWeight: "bold" }}
                >
                  وعدم الإكتفاء بصك الإفراغ الأخير ، أو الاعتماد على إجابات
                  ناقصة لا تفي المطلوب ، وأن يتولي دراسة ذلك موظفين مؤهلين شرعيا
                  وقانونيا في الإدارات المختصة بالأمانات والبلديات
                </span>{" "}
              </p>
              <div>
                <p>
                  &nbsp;&nbsp;&nbsp; لذا نأمل من فضيلتكم الإجابة وموافاتنا بكل
                  دقة وبالتفصيل دون الإختصار عن التالي :
                </p>
                <ol>
                  <li style={{ marginRight: "44px" }}>
                    {/* (١) إرفاق المستندات والوثائق التى بني عليها الصك وفقا لما
                    تضمنته التعاميم المشار إليها . */}
                    <h6>
                      <EditPrint
                        printObj={printObj || mainObject}
                        id={id}
                        path="propertyroll.title1"
                        oldText={
                          title1 ||
                          "1- إرفاق المستندات والوثائق التي بني عليها الصك وفقا لما تضمنته التعاميم المشار إليها"
                        }
                      />
                    </h6>
                  </li>
                  <li style={{ marginRight: "44px" }}>
                    {/* (٢) إرفاق صورة من الصك الأساسي الصادر للأرض ، وصورة من سجله
                    مع التصديق عليهما من الجهة التي أصدرتهما . */}
                    <h6>
                      <EditPrint
                        printObj={printObj || mainObject}
                        id={id}
                        path="propertyroll.title2"
                        oldText={
                          title2 ||
                          "2- إرفاق صورة من الصك الاساسي الصادر للارض ، وصورة من سجله مع التصديق عليهما من الجهة التي أصدرتهما"
                        }
                      />
                    </h6>
                  </li>
                  <li style={{ marginRight: "44px" }}>
                    {/* (٣) مدى صحة وسلامة الصك المرفق من حيث إصداره وسلامة إجرائها
                    وفق الأوامر السامية الكريمة والمذكورة بعاليه ووفق الأنظمة
                    والتعليمات المشرعة لإصداره من قبلكم . */}
                    <h6>
                      <EditPrint
                        printObj={printObj || mainObject}
                        id={id}
                        path="propertyroll.title3"
                        oldText={
                          title3 ||
                          "3- مدى صحة وسلامة الصك المرفق من حيث إصداره وسلامة إجرائها وفق الأوامر السامية الكريمة والمذكورة بعاليه وفق الأنظمة والتعليمات المشرعة لإصداره من قبلكم"
                        }
                      />
                    </h6>
                  </li>
                  <li style={{ marginRight: "44px" }}>
                    {/* (٤) الكشف عن سجله الأول الصادر بشأنه والأسس التي تم ضبطها
                    عليه ومعرفة سريان مفعوله حتى تاريخه وما صدر بشأنها من توجيه
                    أن وجد . */}
                    <h6>
                      <EditPrint
                        printObj={printObj || mainObject}
                        id={id}
                        path="propertyroll.title4"
                        oldText={
                          title4 ||
                          "4- الكشف عن سجله الأول اصادر بشأنه والأسسس التي تم ضبطها عليه ومعرفة سريان مفعوله حتى تاريخه وما صدر بشأنها من توجيه إن وجد"
                        }
                      />
                    </h6>
                  </li>
                  <li style={{ pageBreakAfter: "always", marginRight: "44px" }}>
                    {/* (٥) ما هي الأصول التي بني عليها الصك المذكور بعاليه تدريجيا
                    بدأ بالضبط الأول له و تدرج المبيع المظبوط بعدها وهل هذه
                    الأصول بنيت وفق الأنظمة والتعليمات ليصادر بعدها أصدر الصك
                    على الوجه الشرعي . */}
                    <h6>
                      <EditPrint
                        printObj={printObj || mainObject}
                        id={id}
                        path="propertyroll.title5"
                        oldText={
                          title5 ||
                          "5- ما هي الأصول التي بني عليها الصك المذكور بعاليه تدريجيا بدا بالضبط الأول له وتدرج المبيع المظبوط بعدها وهل هذه الأصول بنيت وفق الأنظمة والتعليمات ليصادر بعدها أصدر الصك على الوجه الشرعي"
                        }
                      />
                    </h6>
                  </li>
                  <li className="li_space" style={{ marginRight: "44px" }}>
                    {/* (٦) عن تاريخ أمر المنح الذي بني عليه إصدار الصك الأساسي
                    والذي على ضوئه أصدر الصك المذكور من قبلكم ، فهل هو من أوامر
                    المنح المباشرة أو التنازل ، مع الإفادة عما أتخذ بشأن هذا
                    الأمر الذي تم إنفاذه من إجراء وفقا للأوامر السامية الكريمة
                    الآنفة الذكر بعاليه . */}
                    <h6>
                      <EditPrint
                        printObj={printObj || mainObject}
                        id={id}
                        path="propertyroll.title6"
                        oldText={
                          title6 ||
                          "6- عن تاريخ أمر المنح الذي بني عليه إصدار الصك الأساسي والذى على ضوئه أصدر الصك المذكور من قبلكم ، فهل هو من أوامر المنح المباشرة أو التنازل ، مع الإفادةعما أتخذ بشأن هذا الأمر الذي تم إنفاذه من إجراء وفقا للأوامر السامية الكريمة الآنفة الذكر بعاليه "
                        }
                      />
                    </h6>
                  </li>
                  <li style={{ marginRight: "44px" }}>
                    {/* (٧) التأكد أن الصك الأساسي قد صدر مطابقا للأوامر السامية
                    أرقام {convertToArabic("325/2")} وتاريخ{" "}
                    {convertToArabic("5/6/1423")} هـ وكذلك{" "}
                    {convertToArabic("3235/م/ب")} وتاريخ
                    {convertToArabic("4/12/1425")} هـ وكذلك{" "}
                    {convertToArabic("10622/م")} وتاريخ{" "}
                    {convertToArabic("5/9/1416")} هـ وما صدر على ضوء تلك الأوامر
                    من تعاميم وأنظمة وتلعيمات بشأنها وذلك بالتفصيل كل على حده . */}
                    <h6>
                      <EditPrint
                        printObj={printObj || mainObject}
                        id={id}
                        path="propertyroll.title7"
                        oldText={
                          title7 ||
                          "7- التأكد أن الصك الأساسي قدر صدر مطابقا للأوامر السامية أرقام 325 / 2 وتاريخ 5/6/1423 هـ وكذلك 3235 / م / ب وبتاريخ 4/12/1425 هـ وكذلك 10622 / م وتاريخ 5/9/1416 هـ وما صدر على ضوء تلك الأوامر من تعاميم وأنظمة وتعليمات بشأنها وذلك بالتفصيل كل على حده"
                        }
                      />
                    </h6>
                  </li>
                </ol>
              </div>
              <p>
                &nbsp;&nbsp;&nbsp; نرفق لفضيلتكم صورة الصك رقم{" "}
                {convertToArabic(sak_no)} بتاريخ {convertToArabic(sak_date)} هـ
                قطعة {convertToArabic(parcel_description)} بمدينة{" "}
                {municipality_name} ، والعائد ملكيته لـ /{owners_name} بموجب{" "}
                {owners?.map((r) => r?.identity_label).join(" - ")} رقم (
                {owners?.map((r) => r?.identity).join(" - ")}){" "}
                {has_representer == 1 && (
                  <span>
                    والتي تقدم به إلى الأمانة / {wakil_name} -{" "}
                    {wakil_nationality_name} - الجنسية بموجب{" "}
                    {wakil_nationality_type} رقم ({" "}
                    {convertToArabic(wakil_identity_no)} ) بموجب وكالة رقم ({" "}
                    {convertToArabic(wekala_sak_no)} ) في{" "}
                    {convertToArabic(wekala_sak_date)} هـ الصادر من{" "}
                    {wekala_issuer} بالمنطقة الشرقية .
                  </span>
                )}
              </p>
              {/* <p>
            &nbsp;&nbsp;&nbsp; نرفق لفضيلتكم صورة الصك رقم{" "}
            {convertToArabic(skok?.map((r) => r?.number_waseka).join(" - "))}{" "}
            بتاريخ
            {convertToArabic(skok?.map((r) => r?.date_waseka).join(" - "))} هـ
            قطعة أرض رقم (
            {convertToArabic(
              parcels?.map((r) => r?.PARCEL_PLAN_NO).join(" - ")
            )}
            ){" "}
            {convertToArabic(
              parcels?.map((r) => r?.PARCEL_DESCRIPTION).join(" - ")
            )}{" "}
            مخطط المعتمد رقم {convertToArabic(parcels?.[0]?.PLAN_NO)}{" "}
            بمدينة {parcels?.[0]?.MUNICIPALITY_NAME} ، والعائد ملكيتهما
            لـ /{owners_name} بموجب{" "}
            {owners?.map((r) => r?.identity_label).join(" - ")} رقم (
            {owners?.map((r) => r?.identity).join(" - ")}) وتنتهي في 29/5/1443 هـ
            والتي تقدم به إلى الأمانة /{" "}
            {representerData?.map((r) => r?.representer_name).join(" - ")} -{" "}
            {representerData?.map((r) => r?.representer_nationality).join(" - ")}{" "}
            - الجنسية بموجب{" "}
            {representerData?.map((r) => r?.identity_label).join(" - ")} رقم (
            {representerData?.map((r) => r?.identity).join(" - ")}) بموجب وكالة
            رقم ({convertToArabic(wekala_sak_no)}) في{" "}
            {convertToArabic(wekala_sak_date)} هـ الصادر من {wekala_issuer}{" "}
            بالمنطقة الشرقية .
          </p> */}
              <p>
                &nbsp;&nbsp;&nbsp; أمل إطلاع فضيلتكم والإفادة مفصلا عن ما ذكر
                للإجراءات الشرعية والنظامية المتبعة وبما يتفق مع الأوامر السامية
                والأنظمة والتعليمات{" "}
                <span
                  style={{ textDecoration: "underline", fontWeight: "bold" }}
                >
                  مع المصادقة
                </span>{" "}
                بما يثبت سريان مفعول ومطابقة (صورتهما الصكين المرفقين) لسجلهما
                وفقا لتوجهات بهذا الأمر .
              </p>
            </div>
            {/* end of one time */}

            <div style={{ textAlign: "center" }}>
              <h5>والسلام عليكم ورحمه الله وبركاته ،،،</h5>
            </div>
            {committeeactors1?.is_approved &&
              // committee_report_no &&
              // is_paid == 1 &&
              province_id !== null && (
                <div>
                  <img
                    src={`${filesHost}/users/${committeeactors1_id}/sub_sign.png`}
                    width="80px"
                  />
                </div>
              )}
            <div
              className="printFooter"
              style={{
                textAlign: "center",
                display: "grid",
                gridGap: "40px",
                justifyContent: "end",
              }}
            >
              {/* <h5>مدير عام إدارة الأراضي والممتلكات</h5> */}
              <h5>{committeeactors1?.position}</h5>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <h5 style={{ marginLeft: "80px" }}>المهندس /</h5>
                <h5 style={{ marginLeft: "50px", marginTop: "10px" }}>
                  {committeeactors1?.is_approved && province_id && (
                    <img
                      src={`${filesHost}/users/${committeeactors1_id}/sign.png`}
                      width="150px"
                    />
                  )}
                </h5>
              </div>
              <h5>{committeeactors1?.name}</h5>
              {/* <h5>صالح بن عبدالرحمن الراجح</h5> */}
            </div>
            <div>
              {/* <h6>- 23-20-2-40</h6> */}
              <h6>
                <EditPrint
                  printObj={printObj || mainObject}
                  id={id}
                  path="propertyroll.title8"
                  oldText={title8 || "- 23-20-2-40"}
                />
              </h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation("labels")(sakPropertycheck_letter);
