import React from "react";
import {
  Row,
  Col,
  Form,
  Select,
  Input,
  Radio,
  message,
  Modal,
  Button,
} from "antd";
function StepDetails({ item, setIsModalVisible, isModalVisible, steps }) {
  const translate_step_actions = {
    "global.SENDAMANA": "ارسال الى الامانة",
    "global.ASSIGN": "توجيه",
    "global.VERIFY": "تأكيد",
    "global.RETURNFROMSTART": "اعادة توجيه مع اعادة المسار ",
    "global.TRANSFER": "تحويل",
    "global.ASSIGNMULTI": " توجيه لمتعدد",
    "global.REJECT": "اعتذار",
    "global.SUBMIT": "ارسال",
    "global.RETURN": "اعادة توجيه",
    "global.GOTO": "مخاطبة",
    "global.APPROVE": "موافقه و توجيه الى",
    انهاء: "انهاء",
    "global.FINISH": "انهاء",
    "global.STOP": "ايقاف",
    "global.BACK": "السابق",
    // "global.TRANSFER": "ايقاف",
  };

  const english_action_name = item?.steps_actions?.map((d) => [d.actions.name]);
  const arabic_actions_name = english_action_name
    ?.map((d) => translate_step_actions[d])
    .join("-");
  // const validate_data = JSON.parse(item?.validate_data);
  const filterSaveData = (d) => {
    if (d) {
      return JSON.parse(d)
        .map((x) =>
          x == "submitSuggestionsParcels" ? "بيانات الصكوك" : "بيانات المالك"
        )
        .join("-");
    } else return;
  };
  const filterValidateData = (d) => {
    let data = d.split("'").filter((x) => x.length > 3);
    if (data) {
      return data?.map((x) => (x == "export_no" ? "رقم صادر" : ""));
    } else return;
  };
  const related_step_actor = (d) => {
    if (d) {
      return steps.filter((x) => x.id == d)[0].name;
    }
  };
  const content = item?.modules?.name;
  return (
    <div>
      <Modal
        title=""
        visible={isModalVisible}
        className="closeModal"
        closable={false}
        footer={[
          <Button
            className="btn "
            // style={{ float: "left" }}
            key="back"
            onClick={() => {
              setIsModalVisible(false);
            }}
          >
            اغلاق
          </Button>,
        ]}
      >
        <table className="table table-bordered">
          <tr>
            <td>اسم الخطوة</td>
            <td>{item.name}</td>
          </tr>
          <tr>
            <td>الاجراءات</td>
            <td>{arabic_actions_name}</td>
          </tr>
          {item?.assign_to_creator == 1 && (
            <tr>
              <td>توجيه الى المنشىء</td>
              <td>
                {item?.assign_to_creator == 1 ? (
                  <i className="fa fa-check"></i>
                ) : (
                  ""
                )}
              </td>
            </tr>
          )}
          {item?.next_step?.name && (
            <tr>
              <td>الخطوة التالية</td>
              <td>{item?.next_step?.name}</td>
            </tr>
          )}
          {content && (
            <tr>
              <td>المحتوى</td>
              <td>{content}</td>
            </tr>
          )}
          {item?.assign_to_position_id && (
            <tr>
              <td>ممثل الخطوة</td>
              <td>{item?.positions.name}</td>
            </tr>
          )}
          {item?.assign_to_group_id && (
            <tr>
              <td>ممثل المجموعة</td>
              <td>{item?.groups?.name}</td>
            </tr>
          )}
          {item?.related_step_actor && (
            <tr>
              <td>ممثل الخطوة المختارة</td>
              <td>{related_step_actor(item?.related_step_actor)}</td>
            </tr>
          )}
          {item?.assign_to_owner == 1 && (
            <tr>
              <td>توجيه الى المالك</td>
              <td>
                {item?.assign_to_owner == 1 ? (
                  <i className="fa fa-check"></i>
                ) : (
                  ""
                )}
              </td>
            </tr>
          )}
          {item?.is_create == 1 && (
            <tr>
              <td>خطوة انشاء</td>
              <td>
                {item?.is_create == 1 ? <i className="fa fa-check"></i> : ""}
              </td>
            </tr>
          )}
          {item?.setCreator == 1 && (
            <tr>
              <td>ضبط المنشىء</td>
              <td>
                {item?.setCreator == 1 ? <i className="fa fa-check"></i> : ""}
              </td>
            </tr>
          )}
          {item?.is_edit == 1 && (
            <tr>
              <td>امكانيه التعليق</td>
              <td>
                {item?.is_edit == 1 ? <i className="fa fa-check"></i> : ""}
              </td>
            </tr>
          )}
          {item?.is_optional == 1 && (
            <tr>
              <td>خطوة اختياريه</td>
              <td>
                {item?.is_optional == 1 ? <i className="fa fa-check"></i> : ""}
              </td>
            </tr>
          )}
          {item?.can_warn == 1 && (
            <tr>
              <td>امكانيه التحذير</td>
              <td>
                {item?.can_warn == 1 ? <i className="fa fa-check"></i> : ""}
              </td>
            </tr>
          )}
          {item?.is_deactivated == 1 && (
            <tr>
              <td>خطوة غير مفعلة</td>
              <td>
                {item?.is_deactivated == 1 ? (
                  <i className="fa fa-check"></i>
                ) : (
                  ""
                )}
              </td>
            </tr>
          )}
          {item?.is_fees == 1 && (
            <tr>
              <td>الزامية دفع الرسوم</td>
              <td>
                {item?.is_fees == 1 ? <i className="fa fa-check"></i> : ""}
              </td>
            </tr>
          )}
          {item?.is_municipality == 1 && (
            <tr>
              <td>خطوة تابعه للبلديات</td>
              <td>
                {item?.is_municipality == 1 ? (
                  <i className="fa fa-check"></i>
                ) : (
                  ""
                )}
              </td>
            </tr>
          )}
          {item?.is_end == 1 && (
            <tr>
              <td>خطوة نهاية المسار</td>
              <td>
                {item?.is_end == 1 ? <i className="fa fa-check"></i> : ""}
              </td>
            </tr>
          )}
          {item?.is_eng_office == 1 && (
            <tr>
              <td>خطوة مكتب هندسى</td>
              <td>
                {item?.is_eng_office == 1 ? (
                  <i className="fa fa-check"></i>
                ) : (
                  ""
                )}
              </td>
            </tr>
          )}
          {item?.generate_fees == 1 && (
            <tr>
              <td>خطوة حساب الرسوم</td>
              <td>
                {item?.generate_fees == 1 ? (
                  <i className="fa fa-check"></i>
                ) : (
                  ""
                )}
              </td>
            </tr>
          )}
          {item?.generate_export_no == 1 && (
            <tr>
              <td>اصدار رقم صادر</td>
              <td>
                {item?.generate_export_no == 1 ? (
                  <i className="fa fa-check"></i>
                ) : (
                  ""
                )}
              </td>
            </tr>
          )}
          {item?.show_step_in_list == 1 && (
            <tr>
              <td>اظهار الخطوة فى القوائم</td>
              <td>
                {item?.show_step_in_list == 1 ? (
                  <i className="fa fa-check"></i>
                ) : (
                  ""
                )}
              </td>
            </tr>
          )}
          {item?.scalation == 1 && (
            <div>
              {" "}
              <tr>
                <td>لها مده زمنيه</td>
                <td>
                  {item?.scalation == 1 ? <i className="fa fa-check"></i> : ""}
                </td>
              </tr>
              <tr>
                <td>المدة الزمنية</td>
                <td>{item?.scalation_hours}</td>
              </tr>
              <tr>
                <td>المسمى الوظيفى لممثل الخطوة</td>
                <td>{item?.scalator_positon_id}</td>
              </tr>
              <tr>
                <td>ممثل الخطوة للمجموعة</td>
                <td>{item?.scalator_group_id}</td>
              </tr>
            </div>
          )}
          {item?.print_data && (
            <tr>
              <td>قوالب الطباعة</td>
              <td>{item?.print_data}</td>
            </tr>
          )}
          {item?.validate_data && (
            <tr>
              <td>تحقيق البيانات</td>
              <td>{filterValidateData(item?.validate_data)}</td>
            </tr>
          )}
          {item?.saved_data && (
            <tr>
              <td>حفظ البيانات</td>
              <td>{filterSaveData(item?.saved_data)}</td>
            </tr>
          )}
          {/* <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr> */}
        </table>
      </Modal>
    </div>
  );
}

export default StepDetails;
