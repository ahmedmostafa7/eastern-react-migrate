import React from "react";
import ReactExport from "react-export-excel";
import { useTranslation } from "react-i18next";
import {
  convertToArabic,
  convertToEnglish,
} from "../../../../../app/components/inputs/fields/identify/Component/common/common_func";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ExportCSV({ data, columns, pageNo, scope, myRef}) {
  return (
    <ExcelFile
      filename={`اعتماد المخططات تقرير ربع سنوي`}
      element={
        <button ref={myRef} htmlType="submit"
        onClick={() => {
          
          scope.setState({ button: "" });
        }} className="btn btn-warning hidd">استخراج ملف اكسيل</button>
      }
    >
      <ExcelSheet
        data={data.filter((r) => !_.isEmpty(r.json_props))}
        name="اعتماد المخططات تقرير ربع سنوي"
      >
        {Object.keys(columns).map(
          (headkey, index) =>
            (eval(columns[headkey].conditionToShow) && (
              <ExcelColumn
                key={index}
                label={columns[headkey].label}
                value={(col) => {
                  try {
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
