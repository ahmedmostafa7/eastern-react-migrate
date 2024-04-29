import moment from "moment-hijri";
import { selectActors } from "../../../../inputs/fields/identify/Component/common";
// import { convertToArabic } from "../inputs/fields/identify/Component/common/common_func";
export function getValuesFromMainObj(
  props,
  mainObject,
  submissionData,
  printId,
  printName,
  printObj
) {
  const allData = [];
  //start bind
  let test = "test";
  let title1 =
    printObj?.printTextEdited &&
    (Object.values(printObj?.printTextEdited)[0]?.title1 || "");
  let title2 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title2;
  let title3 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title3;
  let title4 =
    printObj?.printTextEdited &&
    (Object.values(printObj?.printTextEdited)[0]?.title4 || "");
  let title5 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title5;
  let title6 =
    printObj?.printTextEdited &&
    Object.values(printObj?.printTextEdited)[0]?.title6;
  // let title7 =
  //   printObj?.printTextEdited &&
  //   Object.values(printObj?.printTextEdited)[0]?.title7;
  // let title8 =
  //   printObj?.printTextEdited &&
  //   Object.values(printObj?.printTextEdited)[0]?.title8;
  // let title9 =
  //   printObj?.printTextEdited &&
  //   Object.values(printObj?.printTextEdited)[0]?.title9;
  // let title10 =
  //   printObj?.printTextEdited &&
  //   Object.values(printObj?.printTextEdited)[0]?.title10;

  
  let project = mainObject?.project_attachments?.project_attachments;
  let band_data = mainObject?.band_data?.band_data;
  let primary_pricing = mainObject?.primary_pricing;
  let actors = selectActors(submissionData, mainObject, [2, 1, 0]);
  ////
  let committeeactors1 = actors?.find((r) => r.index == 0);
  let committeeactors2 = actors?.find((r) => r.index == 1);
  let committeeactors3 = actors?.find((r) => r.index == 2);

  let committeeactors1_id = actors?.find((r) => r.index == 0)?.id;
  let committeeactors2_id = actors?.find((r) => r.index == 1)?.id;
  let committeeactors3_id = actors?.find((r) => r.index == 2)?.id;
  let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
  let propertyRemovalUser = mainObject?.propertyRemovalUserNameToPrint?.propertyRemovalUser;
  let mun = mainObject?.landData?.landData?.lands?.parcels?.map(r => r?.attributes?.MUNICIPALITY_NAME) || '';
  mun = mun.reduce((a, b) => {
    if (a.indexOf(b) == -1) {
      a.push(b);
    }
    return a;
  }, []).join(' - ');
  mun = mun.split('-').length > 1 && mun.split('-')[0] || mun;
  
  allData.push({
    mainObject,
    printId,
    test,
    title1,
    title2,
    title3,
    title4,
    title5,
    title6,
    // title7,
    // title8,
    // title9,
    // title10,
    project,
    band_data,
    primary_pricing,
    committeeactors1,
    committeeactors2,
    committeeactors3,
    committeeactors1_id,
    committeeactors2_id,
    committeeactors3_id,
    t: props.t,
    province_id,
    propertyRemovalUser,
    mun
  });
  return allData;
  // console.log("gaga");
}
