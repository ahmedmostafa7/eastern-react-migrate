import React from "react";
import ReactExport from "react-export-excel";
import moment from "moment-hijri";
import { useTranslation } from "react-i18next";
import {
  convertToArabic,
  convertToEnglish,
} from "../../../../../app/components/inputs/fields/identify/Component/common/common_func";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ExportCSV({ data, columns, pageNo, scope, myRef }) {
  
  return (
    <ExcelFile
      filename={`تخصيص الأراضي تقرير ربع سنوي`}
      element={
        <button
          ref={myRef}
          htmlType="submit"
          onClick={() => {
            scope.setState({ button: "" });
          }}
          className="btn btn-warning hidd"
        >
          استخراج ملف اكسيل
        </button>
      }
    >
      <ExcelSheet
        data={data
          .filter((r) => !_.isEmpty(r.json_props))
          .reduce((a, b) => {
            if (b.json_props["parcels"].length) {
              b.json_props["parcels"].forEach((parcel) => {
                a.push({
                  ...b,
                  json_props: { ...b.json_props, parcels: [parcel] },
                });
              });
            } else {
              a.push({ ...b, json_props: { ...b.json_props } });
            }

            
            return a;
          }, [])}
        name="تخصيص الأراضي تقرير ربع سنوي"
      >
        {Object.keys(columns).map(
          (headkey, index) =>
            (eval(columns[headkey].conditionToShow) && (
              <ExcelColumn
                key={index}
                label={columns[headkey].label}
                value={(col) => {
                  try {
                    let m = moment;
                    return convertToEnglish(eval(columns[headkey].action));
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            )) || <></>
        )}
      </ExcelSheet>
    </ExcelFile>
  );
}

export default ExportCSV;
