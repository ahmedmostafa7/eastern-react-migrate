import React from "react";
import ReactExport from "react-export-excel";
import { useTranslation } from "react-i18next";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ExportCSV({ dataSet, columns, labels, layerName }) {

  return (
    <ExcelFile
      filename={layerName + "CSV"}
      element={
        <label>
          {/* <Tooltip placement="topLeft" title={` استخراج ملف CSV `}> */}

          CSV استخراج ملف
          {/* </Tooltip> */}
        </label>
      }
    >
      <ExcelSheet data={dataSet} name="AttributeTable">
        {labels.map((head, index) => (
          <ExcelColumn
            label={head}
            value={(col) => {
              return col.attributes[head] ? col.attributes[head] + '' : null;
            }}
          />
        ))}
      </ExcelSheet>
    </ExcelFile>
  );
}

export default ExportCSV;
