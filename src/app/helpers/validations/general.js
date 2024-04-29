import {
  get,
  uniqBy,
  isEqual,
  filter,
  every,
  includes,
  map,
  isEmpty,
  find,
} from "lodash";
import moment from "moment-hijri";
import store from "app/reducers";
moment.locale("en");

export const required = (isRequired) => (value) => {
  return !get(value, "length", value) && isRequired
    ? "Required {{label}}"
    : undefined;
};
export const requiredCheck = (isRequired) => (value) => {
  return !get(value, "length", value) && isRequired
    ? "RequiredCheck {{label}}"
    : undefined;
};
export const requiredSak = (isRequired) => (value) => {
  return !get(value, "length", value) && isRequired && !window.isAkarApp
    ? "RequiredCheck {{label}}"
    : undefined;
};
export const required_state = (path) => (value) => {
  const state = store.getState();
  const isRequired = get(state, path, undefined);
  return !get(value, "length", value) && isRequired
    ? "Required {{label}}"
    : undefined;
};

export const requiredCustom = (list) => (value) => {
  return filter(value, (v) => every(list, (attr) => get(v, attr))).length !=
    value.length
    ? "تأكد من ادخال التعديلات"
    : undefined;
};
export const postiveNumber = (req) => (value) => {
  return value && value < 0 ? "لا يمكن إدخال رقم سالب" : undefined;
};

export const conditionalNotRequired = (list) => (value, values) =>
  !list.some((d) => {
    const fieldValue = get(values, d);
    return get(fieldValue, "length", fieldValue);
  }) && !get(value, "length", value)
    ? "Required"
    : undefined;

export const maxLength = (max, field) => (value) => {
  if (get(field, "isFixed", false)) {
    return undefined;
  }
  return value && value.length > max
    ? `يجب ان يكون ${max} خانة او اقل`
    : undefined;
};

const n_types = {
  1990: 2,
  1890: 1,
};
export const nationalNum = (validate, field) => (value, values) => {
  const firstNum = get(value, "0");
  const nationalType = get(values, validate.key, "");
  const n_type = get(n_types, nationalType);
  // console.log()
  return includes([1, 2], n_type) && firstNum != n_type
    ? `يجب أن تبدأ الهوية برقم  ${n_type}`
    : undefined;
};

export const minLength = (min) => (value) =>
  value && value.length <= min ? `يجب ان يكون اكبر من ${min} خانات` : undefined;

export const isFixed =
  (isFixed, { maxLength }) =>
  (value) =>
    value && isFixed && !(value.length == maxLength)
      ? `يجب ان يكون ${maxLength} خانات`
      : undefined;

export const checkUnique = (params, field) => (v, values) => {
  const value = get(values, params.list, []);
  if (value && value.length) {
    const uniqList = uniqBy(value, params.key);
    return uniqList.length == value.length ? undefined : `لا يمكن التكرار`;
  }
  return undefined;
};
export const checkCount = () => (v, values) => {
  const value = values.cads;
  const ground = filter(value, { floortypeid: 30 });
  const Mezzanine = filter(value, { floortypeid: 40 });
  const GroundExtension = filter(value, { floortypeid: 10 });
  const Roof = filter(value, { floortypeid: 60 });

  if (Mezzanine.length > 1) {
    return "لا يمكن ادخال اكثر من ميزانين";
  }
  if (GroundExtension.length > 1) {
    return "لا يمكن ادخال اكثر من ملحق ارضي";
  }
  if (Roof.length > 1) {
    return "لا يمكن ادخال اكثر من علوي";
  }
  if (ground.length > 1) {
    return "لا يمكن ادخال اكثر من ارضي";
  }
  if (ground.length < 1) {
    return "لابد من ادخال الطابق الارضي";
  }
};
export const checkGround = () => (v, values) => {
  const value = values.cads;
  const ground = filter(value, { floortypeid: 30 });
  if (ground.length < 1) {
    return "لابد من ادخال ارضي";
  }
};

export const match = (field) => (value, values) =>
  value && !isEqual(get(values, field), value)
    ? "Fields do not match"
    : undefined;

export const regexValid = (reg) => (value) =>
  value && !new RegExp(reg, "i").test(String(value))
    ? "Invalid data"
    : undefined;

export const emailValid = (isEmail) => (value) =>
  value &&
  isEmail &&
  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(String(value))
    ? "مدخل غير صحيح"
    : undefined;

//function to format an array of strings to date and the array looks like ['dd','mm','yyy']
function formatDate(dateArray) {
  const dateArrayInt = map(dateArray, (value) => parseInt(value));
  return new Date(dateArrayInt[0], dateArrayInt[1], dateArrayInt[2]);
}

export const checkDate = (value) => {
  if (value && value.toString().match(/\//g)?.length > 1) {
    let date = moment(value, "iD/iM/iYYYY").format("YYYY/MM/DD");
    if (date && date == "Invalid Date") {
      date = moment(value, "iYYYY/iM/iD").format("YYYY/MM/DD");
    }
    let hijriDate = moment(date, "YYYY/MM/DD").format("iD/iMM/iYYYY");
    return hijriDate.indexOf('NaN') == -1;
  }
  return false;
};

export const lessThanToday = (isLess) => (value) => {
  const today = moment().format("YYYY/MM/DD");
  const selected = moment(value, "iYYYY/iM/iD").format("YYYY/MM/DD");
  return value && formatDate(selected.split("/")) > formatDate(today.split("/"))
    ? "يجب أن يكون التاريخ قبل تاريخ اليوم"
    : undefined;
};
export const equalToday = (isLess) => (value) => {
  const today = moment().format("YYYY/MM/DD");
  const selected = moment(value, "iYYYY/iM/iD").format("YYYY/MM/DD");
  return value && today !== selected
    ? // formatDate(selected.split("/")) == formatDate(today.split("/"))
      "يجب أن يكون التاريخ  تاريخ اليوم"
    : undefined;
};

export const lessThanDate =
  (field) =>
  (value = "", values) => {
    return values &&
      value &&
      formatDate(value.split("/")) >
        formatDate(get(values, field.key, "").split("/"))
      ? `يجب أن يكون التاريخ أقل من  "${field.label}"`
      : undefined;
  };

export const moreThanDate = (field) => (value, values) => {
  return values &&
    value &&
    formatDate(value.split("/")) <
      formatDate(get(values, field.key, "").split("/"))
    ? `يجب أن يكون التاريخ أكبر من  "${field.label}"`
    : undefined;
};

export const lessThanYear = (isLess) => (value) => {
  const thisYear = moment().format("iYYYY/iM/iD").split("/");
  return value && parseInt(value) > parseInt(thisYear[0])
    ? `يجب أن تكون السنة قبل  "${thisYear[0]}"`
    : undefined;
};
export const equalLength = (number) => (value) => {
  return value && value.length !== number
    ? `يجب ان يكون ${number} خانة `
    : undefined;
};
export const isNumber = (isNum) => (value) => {
  //
  !/^[0-9]|^[\u0660-\u0669]{10}$/.test(String(value))
    ? "الرقم غير صحيح"
    : undefined;
};
export const iskk = (isNum) => (value) => {
  !/^[0-9]|[966]|^[\u0660-\u0669]{10}$/.test(String(value))
    ? "الرقم غير صحيح"
    : undefined;
};
export const building = () => (value) => {
  console.log(value);
  const rejectType = ["Service", "Mezaneen"];
  const flats = filter(value, (d) =>
    find(
      filter(d.floors, (d) => !rejectType.includes(d.type)),
      (v) => isEmpty(v.flats || {})
    )
  );
  if (flats.length) {
    return { error: "Please Sure You Enter All Flats" };
  }
  const ground = filter(value, (d) => !find(d.floors, { type: "Ground" }));
  if (ground.length) {
    return { error: "Please Sure You Enter All Grounds" };
  }

  return undefined;
};
