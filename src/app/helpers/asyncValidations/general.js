import { set, get, isEqual } from "lodash";
import { workFlowUrl } from "configFiles/config";
import { fetchData } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";

export const unique = (
  value,
  currentFieldValue,
  values,
  asyncErrors,
  field,
  currentModule
) => {
  const url = String(value).includes("http")
    ? value
    : `${workFlowUrl}${get(currentModule, "apiUrl")}/CheckUnique`;
  const params = { key: field.name, q: currentFieldValue };
  return fetchData
    .get(url, { params })
    .then((res) => true)
    .catch((res) => {
      //handleErrorMessages(res);
      throw set(
        { ...asyncErrors },
        field.name,
        `${field.label} already exists`
      );
    });
};

export const uniqueIdentity = (
  value,
  currentFieldValue,
  values,
  asyncErrors,
  field,
  currentModule
) => {
  const url = String(value).includes("http")
    ? value
    : `${workFlowUrl}${get(currentModule, "apiUrl")}/CheckUnique`;

  const params = { ...field.params, q: currentFieldValue }; // key: field.name,
  return fetchData(url, { params })
    .then((res) => {
      if (res.length) {
        throw "Already exists";
        return true;
      }
    })
    .catch((res) => {
      //handleErrorMessages(res);

      if (res?.response?.status != 404) {
        throw set(
          { ...asyncErrors },
          field.name,
          `${field.label} already exists`
        );
      }
    });
};

//to check a certain field value is unique after sending an http req,
//how to write in permissions => uniqueWithUrl :{
//     url: *url of the req*,
//     name_key: *the key in the query string of the url of the field name*,
//     value_key: *the key in the query string of the value of the field*
// }
export const uniqueWithUrl = (
  value,
  currentFieldValue,
  values,
  asyncErrors,
  field,
  record,
  props
) => {
  const id = record ? `/${record}` : "";
  const url = value.url + id;
  let params = {};
  params[value.name_key] = field.name;
  params[value.value_key] = currentFieldValue;

  return fetchData(url, { params })
    .then(() => true)
    .catch(() => {
      throw set(
        { ...asyncErrors },
        field.name,
        `${field.label} already exists`
      );
    });
};

export const uniqueNameWithUrl = (
  validationParams,
  currentFieldValue,
  values,
  asyncErrors,
  field,
  record,
  props
) => {
  const prevValue = get(get(props, "initialValues", {}), field.name, "");
  const id = get(validationParams, "id")
    ? `/${get(props, validationParams.id)}`
    : "";
  const url = validationParams.url + id;
  let params = {};
  params[validationParams.value_key] = currentFieldValue;

  if (!isEqual(prevValue, currentFieldValue)) {
    return fetchData(url, { params })
      .then(() => true)
      .catch(() => {
        throw set(
          { ...asyncErrors },
          field.name,
          `${field.label} already exists`
        );
      });
  } else {
    return true;
  }
};
