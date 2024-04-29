import React from "react";
import { Icon, List, Table } from "antd";
import {
  get,
  split,
  findKey,
  isFunction,
  isEmpty,
  flattenDeep,
  omit,
  map,
} from "lodash";
import * as fieldValues from "./functions";
import * as autoValueFuncs from "./autoValueFuncs";
import plans_status from "app/components/wizard/plan_status";
import { host } from "imports/config";
import { convertToEnglish } from "../../../app/components/inputs/fields/identify/Component/common/common_func";

//to replace booleans in table insted of true or false to be an icon
export const boolean = (value, record, field) => {
  let icon = <Icon type="minus-circle" theme="outlined" />;
  icon = value ? (
    <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
  ) : get(field, "hideIfFalse", false) ? null : (
    <Icon type="close-circle" theme="twoTone" twoToneColor="red" />
  );
  return icon;
};

export const button = (value, record, field) => {
  return get(field, "hideValue", false) ? null : value;
};

export const status = (value, record, field, { t }) => {
  value = convertToEnglish(value);
  let val = t("running");
  if (!(value === null || value === undefined)) {
    val = value == 1 ? t("running") : t("terminated");
  }
  return val;
};

export const plan_status = (value, record, field, { t }) => {
  value = convertToEnglish(value);
  let val = findKey(plans_status, (v) => v == value);
  return val ? t(val) : t(value);
};

export const select = (
  value,
  record,
  field,
  selector = {},
  val,
  props = {}
) => {
  value = convertToEnglish(value);
  const { data = [], label_key = "label", value_key = "value", t } = selector;
  const fData = get(field, "data", data || []);

  let translate = t && isFunction(t) ? t : get(props, "props.t");
  let newVal = value;

  if (fData.length) {
    newVal = get(
      fData.find((d) => get(d, field.value_key || value_key) == value),
      field.label_key || label_key,
      value
    );
  } else if (field.valueType) {
    //to set a different value in the table other than the one recieved
    newVal = get(record, field.valueType, "");
  }

  return translate && isFunction(translate) ? withTranslation(newVal) : newVal;
};

export const textDate = (value, record, field, { t }) => {
  const arabicNumbers = ["۰", "۱", "۲", "۳", "٤", "۵", "٦", "۷", "۸", "۹"];
  let val = value?.includes("T") ? split(value, "T", 1)[0] : value;
  if (val) {
    const newVal = val?.replace(/[0-9]/g, (w) => arabicNumbers[+w]);
  }
  return val;
};

export const fileUploader = (value, record, field, t) => {
  return value ? (
    <List
      className="aaaaaa"
      itemLayout="horizontal"
      // grid={{ gutter: 10, column: 5 }}
      dataSource={value}
      locale={{ emptyText: t && isFunction(t) ? t("No Data") : "" }}
      renderItem={(item) => (
        <List.Item
          onClick={() => {
            window.open(window.filesHost + `${get(item, "url")}`);
          }}
        >
          <a>
            {get(item, "type").includes("image") ? (
              <img
                src={window.filesHost + `${get(item, "url")}`}
                style={{ width: "80px", height: "80px" }}
              />
            ) : (
              <Icon type="file-pdf" style={{ fontSize: "104px" }} />
            )}
          </a>
        </List.Item>
      )}
    />
  ) : null;
};

export const fixedUrl = (value, record, field, t) => {
  const { items, className } = field;

  return items ? (
    <List
      className={className}
      itemLayout="horizontal"
      dataSource={items}
      locale={{ emptyText: t && isFunction(t) ? t("No Data") : "" }}
      renderItem={(item) => (
        <List.Item
          onClick={() => {
            window.open(window.filesHost + `${get(item, "url")}`);
          }}
        >
          <a>
            {get(item, "type").includes("image") ? (
              <img
                src={window.filesHost + `${get(item, "url")}`}
                style={{ width: "80px", height: "80px" }}
              />
            ) : (
              <Icon type="file-pdf" style={{ fontSize: "104px" }} />
            )}
          </a>
        </List.Item>
      )}
    />
  ) : (
    <div> </div>
  );
};

export const tableList = (value, record, field, select, { t }) => {
  const colWidth = 100 / field.fields.length + 1 + "%";
  // const autoValueFields = field.fields.filter( f=> f.field == "autoValue");
  // const _value = value.map((v,i) => ({...v, }))
  const columns = field.fields.map((field) => ({
    title: t && isFunction(t) ? t(field.label) : field.label,
    dataIndex: field.name,
    key: field.name,
    // width: colWidth,
    render: (text, item, itemIndex) =>
      get(fieldValues, field.field, (text) => text)(text, record, field),
  }));
  return (
    <Table
      locale={{ emptyText: t && isFunction(t) ? t("No Data") : "" }}
      rowKey={field.value_key}
      dataSource={value}
      {...{ columns }}
      bordered
    />
  );
};

export const multiTableList = (value, record, field = {}, select, { t }) => {
  const {
    fields = [],
    tablesField: {
      label,
      config: { sumFields },
    },
  } = field;

  let data = omit({ ...value }, "Sum");
  let calculatedSum = 0;
  map(
    get(value, "Sum", {}),
    (v) => (calculatedSum = parseFloat(calculatedSum) + parseFloat(v))
  );

  // const colWidth = (100 / fields.length + 1) + '%';

  const columns = fields.map((singleField) => ({
    title: t && isFunction(t) ? t(singleField.label) : singleField.label,
    dataIndex: singleField.name,
    key: singleField.name,
    // width: colWidth,
    render: (text, item, itemIndex) =>
      get(fieldValues, singleField.field, (text) => text)(
        text,
        record,
        singleField
      ),
  }));

  return (
    <div>
      {map(data, (singleData, tableType) => (
        <div>
          <label>
            {" "}
            {t(label)} : {t(tableType)}{" "}
          </label>
          <Table
            locale={{ emptyText: t && isFunction(t) ? t("No Data") : "" }}
            rowKey={field.value_key}
            dataSource={singleData}
            {...{ columns }}
            bordered
            footer={() => {
              let sums = {};
              if (!isEmpty(value)) {
                sumFields.map((sumField) => {
                  sums[`${sumField}Sum`] = 0;
                  singleData.map((val) => {
                    sums[`${sumField}Sum`] =
                      parseFloat(sums[`${sumField}Sum`]) +
                      parseFloat(val[sumField]);
                  });
                });
              }
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginLeft: 500,
                  }}
                >
                  <label> {t("Sum")} </label>
                  {sums ? (
                    map(sums, (value, key) => (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <label> {value ? `${value.toFixed(2)}` : ""}</label>
                      </div>
                    ))
                  ) : (
                    <div></div>
                  )}
                </div>
              );
            }}
          />
        </div>
      ))}
      <label> {`${t("Total")} : ${calculatedSum}`} </label>
    </div>
  );
};

export const autoValue = (value, record, field, f, index, props = {}) => {
  const { inputName, change } = props;

  let newVal = value
    ? value
    : get(autoValueFuncs, field.function, (value) => value)(index);
  if (inputName && change) {
    change(`${inputName}.${index}.${field.name}`, newVal);
  }
  return newVal;
};

export const custom = (value, record, field, ...extra) => {
  return field.fun(value, record, field, ...extra);
};

export const percentage = (value, record, field, f, index, props = {}) => {
  const { inputName, change } = props;
  const { selectValues = [], sum, selectors } = get(props, "props", {});

  const val = parseFloat(get(record, sum, 0));
  let newSum = 0;
  let data = selectValues
    .map((select) =>
      get(selectors, `${select}.data`, []).map((val) => get(val, sum))
    )
    .filter((v) => v);

  if (!isEmpty(data)) {
    flattenDeep(data).map((v) => {
      newSum = newSum + parseFloat(v);
    });
  }

  const percent = ((val / newSum) * 100).toFixed(2);

  if (inputName && change && percent) {
    change(`${inputName}.${index}.${field.name}`, percent);
  }

  return percent && percent != NaN && percent != "NaN" ? percent : "";
};

// export const text = (value, record, field, t) => {
//     var arabicNumbers= ['۰','۱','۲','۳','٤','۵','٦','۷','۸','۹'];
//     var newVal = value.replace(/[0-9]/g, w => arabicNumbers[+w] )
//     return newVal;
// }

// export const inputNumber = (value, record, field, t) => {
//     var arabicNumbers= ['۰','۱','۲','۳','٤','۵','٦','۷','۸','۹'];
//     var newVal = value.replace(/[0-9]/g, w => arabicNumbers[+w] )
//     //console.log(newVal)
//     return newVal;
// }

// export const gallery = (value, record, { absolute=true, serverUrl, image_key = 'path', thumbnailHeight = 200, thumbnail_key, thumbnailWidth = 200 }, props) => {
//     if (value && value.length) {
//         const images = value.map(img => {
//             const src = absolute? get(img, image_key, '') : `${serverUrl}/${get(img, image_key, '')}`;
//             const thumbnail = thumbnail_key?  absolute? get(img, image_key, '') : `${serverUrl}/${get(img, image_key, '')}` : src;
//             return {
//             src,
//             thumbnail,
//             thumbnailWidth,
//             thumbnailHeight
//         }})
//         return <Gallery {...{ images }} enableImageSelection={false} />
//     }
// }

var NbrAsText_GOutPut = "";
var AllOut = "";

export const Tafqeet = (n) => {
  let numsArr = [];
  NbrAsText_GOutPut = "";
  AllOut = "";
  n.split(".").forEach((num) => {
    debugger;
    var arr = n.match(
      new RegExp(`\\d{1,${num.length}}(?=(\d{${num.length}})*$)`, "g")
    );
    //arr.reverse();
    for (var i = 0; i < arr.length; i++) {
      n = arr[i];
      if (n + 0 != 0) {
        NbrAsText_GOutPut = "";
        var s = NbrAsText_pro(n, i) + NbrAsText_GOutPut;
        var Units = "";
        AllOut += s;
      }

      if (arr.length == 1) {
      } else if (arr.length == 2) {
        if (i == 0 && n + 0 != 0) AllOut += " الف ";
      } else if (arr.length == 3) {
        if (i == 0 && n + 0 != 0) AllOut += " مليون ";
        if (i == 1 && n + 0 != 0) AllOut += " الف ";
      } else if (arr.length == 4) {
        if (i == 0 && n + 0 != 0) AllOut += " مليار ";
        if (i == 1 && n + 0 != 0) AllOut += " مليون ";
        if (i == 2 && n + 0 != 0) AllOut += " الف ";
      }
    }

    numsArr.splice(numsArr.length - 1, 0, AllOut);
  });

  return numsArr.join(" و ");
};
function NbrAsText_pro(n, ind) {
  if (n + 0 != 0) {
    //NbrAsText_GOutPut+=(and);
    NbrAsText_rec(n, "");
    //NbrAsText_GOutPut+="xx"+i+"xx";
    if (ind != 0) return " و ";
  }
  return "";
}

function NbrAsText_GetOne(n) {
  let v = "";
  if (n == 0) v += " صفر ";
  else if (n == 1) v += " واحد ";
  else if (n == 2) v += " اثنان ";
  else if (n == 3) v += " ثلاثة ";
  else if (n == 4) v += " أربعة ";
  else if (n == 5) v += " خمسة ";
  else if (n == 6) v += " ستة ";
  else if (n == 7) v += " سبعة ";
  else if (n == 8) v += " ثمانية ";
  else if (n == 9) v += " تسعة ";
  //AND=" و ";
  return v;
}

function NbrAsText_rec(n, and) {
  var output = "";

  //console.log('n[0]='+n[0]+'|n='+n+'|and='+and);

  if (n.length == 1) {
    NbrAsText_GOutPut += and + NbrAsText_GetOne(n);
  } else if (n.length == 2) {
    if (n[1] == 0) {
      if (n[0] != 0) {
        //output+=(and+NbrAsText_Dix(n[0]));
        NbrAsText_GOutPut += and + NbrAsText_Dix(n[0]);
      }
    } else {
      if (n[0] == "1") {
        if (n[1] == 1) NbrAsText_GOutPut += and + " احد عشرة";
        else if (n[1] == 1) NbrAsText_GOutPut += and + " اثنا عشرة";
        else
          NbrAsText_GOutPut +=
            and + NbrAsText_GetOne(n[1]) + " " + NbrAsText_Dix(n[0]);
      } else {
        if (n[0] != "0")
          NbrAsText_GOutPut +=
            and + NbrAsText_GetOne(n[1]) + " و " + NbrAsText_Dix(n[0]);
        else NbrAsText_GOutPut += and + NbrAsText_GetOne(n[1]);
      }
    }
  } else if (n.length == 3) {
    if (n[0] == "1") {
      NbrAsText_GOutPut += "مائة ";
      //console.log('n[0]='+n[0]+'|n='+n+'|n.substr(1,2)='+n.substr(1,2));
      NbrAsText_rec(n.substr(1, 2), " و ");
    } else if (n[0] == "2") {
      NbrAsText_GOutPut += "مائتان";
      //console.log('n[0]='+n[0]+'|n='+n+'|n.substr(1,2)='+n.substr(1,2));
      NbrAsText_rec(n.substr(1, 2), " و ");
    } else if (n[0] != "0") {
      NbrAsText_GOutPut += NbrAsText_GetOne(n[0]) + "مائة ";
      NbrAsText_rec(n.substr(1, 2), " و ");
    } else {
      NbrAsText_rec(n.substr(1, 2), " ");
    }

    if (n[1] == 0 && n[2] == 0) {
    }
  }
  return output;
}

//--------------------------
function NbrAsText_Dix(n) {
  let v = "";
  //echo "NbrAsText_Dix(n)\n";
  if (n == "1") v += "عشرة";
  if (n == "2") v += "عشرون";
  if (n == "3") v += "ثلاثون";
  if (n == "4") v += "أربعون";
  if (n == "5") v += "خمسون";
  if (n == "6") v += "ستون";
  if (n == "7") v += "سبعون";
  if (n == "8") v += "ثمانون";
  if (n == "9") v += "تسعون";
  return v;
}
