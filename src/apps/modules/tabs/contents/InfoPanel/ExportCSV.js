import React from "react";
import ReactExport from "react-export-excel";
import { useTranslation } from "react-i18next";
import {
  convertToArabic,
  convertToEnglish,
} from "../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { getTimelineData } from "../../tableActionFunctions/tableActions";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ExportCSV({ data, columns, pageNo, scope, myRef }) {
  return (
    <ExcelFile
      filename={`طرح الفرص الاستثمارية`}
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
        data={data} // .filter((r) => !_.isEmpty(r.json_props))
        name="طرح الفرص الاستثمارية"
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
        {
          <ExcelColumn
            key={"109"}
            label={"الزمن المعياري لوكالة الإستثمارات وتنمية الإيرادات"}
            value={(col) => {
              try {
                
                let steps = getTimelineData(
                  col,
                  scope.props.user,
                  false,
                  scope.props,
                  [2210, 2211].indexOf(col.workflow_id) == -1 &&
                    !_.isNull(scope.props?.user?.engcompany_id) &&
                    !_.isUndefined(scope.props?.user?.engcompany_id),
                  [2210, 2211].indexOf(col.workflow_id) != -1
                );

                let totalDays = 0;
                totalDays += steps?.prevSteps?.reduce((a, b) => {
                  if (
                    [3014, 3127, 3128, 3129, 3131].indexOf(b?.prevStep?.id) != -1 &&
                    b?.diffDays != 0
                  ) {
                    a += +(b?.datePeriod?.match(/\d+/)?.[0] || 0);
                  }
                  return a;
                }, 0);

                totalDays +=
                  (steps?.currentSteps &&
                    [steps?.currentSteps]?.reduce((a, b) => {
                      if (
                        [3014, 3127, 3128, 3129, 3131].indexOf(b?.currentStep?.id) != -1 &&
                        b?.datePeriod?.trim() != "أقل من يوم"
                      ) {
                        a += +(b?.datePeriod?.match(/\d+/)?.[0] || 0);
                      }
                      return a;
                    }, 0)) ||
                  0;

                
                return `${totalDays || 0} يوم`;
              } catch (error) {
                console.error(error);
              }
            }}
          />
        }
        {
          <ExcelColumn
            key={"110"}
            label={"الزمن المعياري للأراضي والممتلكات"}
            value={(col) => {
              try {
                
                let steps = getTimelineData(
                  col,
                  scope.props.user,
                  false,
                  scope.props,
                  [2210, 2211].indexOf(col.workflow_id) == -1 &&
                    !_.isNull(scope.props?.user?.engcompany_id) &&
                    !_.isUndefined(scope.props?.user?.engcompany_id),
                  [2210, 2211].indexOf(col.workflow_id) != -1
                );

                let totalDays = 0;
                totalDays += steps?.prevSteps?.reduce((a, b) => {
                  if (
                    [3015, 3016].indexOf(b?.prevStep?.id) != -1 &&
                    b?.diffDays != 0
                  ) {
                    a += +(b?.datePeriod?.match(/\d+/)?.[0] || 0);
                  }
                  return a;
                }, 0);

                totalDays +=
                  (steps?.currentSteps &&
                    [steps?.currentSteps]?.reduce((a, b) => {
                      if (
                        [3015, 3016].indexOf(b?.currentStep?.id) != -1 &&
                        b?.datePeriod?.trim() != "أقل من يوم"
                      ) {
                        a += +(b?.datePeriod?.match(/\d+/)?.[0] || 0);
                      }
                      return a;
                    }, 0)) ||
                  0;

                
                return `${totalDays || 0} يوم`;
              } catch (error) {
                console.error(error);
              }
            }}
          />
        }
        {
          <ExcelColumn
            key={"111"}
            label={"الزمن المعياري للتخطيط العمراني"}
            value={(col) => {
              try {
                
                let steps = getTimelineData(
                  col,
                  scope.props.user,
                  false,
                  scope.props,
                  [2210, 2211].indexOf(col.workflow_id) == -1 &&
                    !_.isNull(scope.props?.user?.engcompany_id) &&
                    !_.isUndefined(scope.props?.user?.engcompany_id),
                  [2210, 2211].indexOf(col.workflow_id) != -1
                );

                let totalDays = 0;
                totalDays += steps?.prevSteps?.reduce((a, b) => {
                  if (
                    [3018, 3019].indexOf(b?.prevStep?.id) != -1 &&
                    b?.diffDays != 0
                  ) {
                    a += +(b?.datePeriod?.match(/\d+/)?.[0] || 0);
                  }
                  return a;
                }, 0);

                totalDays +=
                  (steps?.currentSteps &&
                    [steps?.currentSteps]?.reduce((a, b) => {
                      if (
                        [3018, 3019].indexOf(b?.currentStep?.id) != -1 &&
                        b?.datePeriod?.trim() != "أقل من يوم"
                      ) {
                        a += +(b?.datePeriod?.match(/\d+/)?.[0] || 0);
                      }
                      return a;
                    }, 0)) ||
                  0;

                
                return `${totalDays || 0} يوم`;
              } catch (error) {
                console.error(error);
              }
            }}
          />
        }
        {
          <ExcelColumn
            key={"112"}
            label={"الزمن المعياري للبلدية"}
            value={(col) => {
              try {
                
                let steps = getTimelineData(
                  col,
                  scope.props.user,
                  false,
                  scope.props,
                  [2210, 2211].indexOf(col.workflow_id) == -1 &&
                    !_.isNull(scope.props?.user?.engcompany_id) &&
                    !_.isUndefined(scope.props?.user?.engcompany_id),
                  [2210, 2211].indexOf(col.workflow_id) != -1
                );

                let totalDays = 0;
                totalDays += steps?.prevSteps?.reduce((a, b) => {
                  if (
                    [3020, 3021].indexOf(b?.prevStep?.id) != -1 &&
                    b?.diffDays != 0
                  ) {
                    a += +(b?.datePeriod?.match(/\d+/)?.[0] || 0);
                  }
                  return a;
                }, 0);

                totalDays +=
                  (steps?.currentSteps &&
                    [steps?.currentSteps]?.reduce((a, b) => {
                      if (
                        [3020, 3021].indexOf(b?.currentStep?.id) != -1 &&
                        b?.datePeriod?.trim() != "أقل من يوم"
                      ) {
                        a += +(b?.datePeriod?.match(/\d+/)?.[0] || 0);
                      }
                      return a;
                    }, 0)) ||
                  0;

                
                return `${totalDays || 0} يوم`;
              } catch (error) {
                console.error(error);
              }
            }}
          />
        }
      </ExcelSheet>
    </ExcelFile>
  );
}

export default ExportCSV;