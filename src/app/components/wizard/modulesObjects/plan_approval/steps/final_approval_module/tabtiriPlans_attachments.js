import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { map, get, assign } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import applyFilters from "main_helpers/functions/filters";
import { basicMapOperations } from "main_helpers/variables/mapOperations";
import { withTranslation } from "react-i18next";
import {
  uploadGISFile,
  getInfo,
  queryTask,
  objectPropFreqsInArray,
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
  getFileName,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
export default {
  label: "مرفقات المخطط التبتيري",
  sections: {
    tabtiriPlans_attachments: {
      label: "مرفقات المخطط التبتيري",
      className: "radio_det",
      fields: {
        office_signature: {
          label: "صورة مختومة من المكتب للمخطط منزل عليه الجدول التبتيري",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
          preRequest: (props) => {},
          postRequest: (uploadedUrl, props) => {},
        },
        // cad_file: {
        //   label: "ملف الكاد من الفكرة التخطيطية للمخططات المجاورة",
        //   field: "simpleUploader",
        //   uploadUrl: `${host}/uploadMultifiles`,
        //   fileType: ".DWG",
        //   multiple: false,
        //   required: true,
        //   preRequest: (props) => {},
        //   postRequest: (uploadedUrl, props) => {},
        // },
      },
    },
  },
};
