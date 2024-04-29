import {
  toArray,
  sumBy,
  get,
  groupBy,
  map,
  flatten,
  ceil,
  sum,
  filter,
  reject,
  round,
} from "lodash";

import store from "app/reducers";
export const totals = (params = {}, { values }, props) => {
  const floors = get(values, `${params.path}.${props.index}.${params.data}`);
  return sumBy(
    toArray(floors),
    (d) => Number(get(d, params.col)) * Number(get(d, params.repeat))
  );
};
export const building_radio = (
  params = {},
  { values },
  props,
  state = store.getState()
) => {
  const floors = get(values, `${params.path}.${props.index}.${params.data}`);
  const tot_area = Number(get(filter(floors, { type: "Ground" }), `0.area`));
  const lands = get(state, params.lands, {});
  const lands_area = sumBy(lands, (d) => d.attributes["PARCEL_AREA"]);
  return round((lands_area && tot_area ? tot_area / lands_area : 1) * 100, 2);
};

export const total_parking = (params = {}, { values }, props) => {
  const types = {
    House: (list) => sumBy(list, (d) => Number(get(d, `floor.repeat`))),
    Trade: (list) =>
      sumBy(list, (d) => Number(get(d, `floor.repeat`) * Number(d.flat_area))) /
      30,
    Manage: (list) =>
      sumBy(list, (d) => Number(get(d, `floor.repeat`) * Number(d.flat_area))) /
        50 +
      sumBy(list, (d) => Number(get(d, `floor.repeat`))),
  };
  const floors = get(values, `${params.path}.${props.index}.${params.data}`);
  const mezanein =
    sumBy(filter(floors, { type: "Mezaneen" }), (d) => d.area * d.repeat) / 75;
  const flats = groupBy(
    flatten(
      map(reject(floors, { type: "Mezaneen" }), (d) =>
        toArray(d.flats).map((v) => ({ ...v, floor: d }))
      )
    ),
    "flat_use"
  );
  return ceil(
    sum([mezanein, ...map(flats, (d, k) => get(types, k, () => 0)(d))])
  );
};

export const supplyArea = (params = {}, { values }, props) => {
  const floors = get(values, `${params.path}.${props.index}.${params.data}`);
  // const mezanein = sumBy(filter(floors, {type: "Mezaneen"}), d=>(d.area * d.repeat))
  const floors_area = sumBy(toArray(floors), (d) => d.area * d.repeat);
  const flats = sumBy(
    flatten(
      map(floors, (d) => toArray(d.flats).map((v) => ({ ...v, floor: d })))
    ),
    (d) => Number(get(d, `floor.repeat`) * Number(d.flat_area))
  );
  return round(sum([floors_area, -flats]), 2);
};

export const total_price_zayda = (state, params, props, values) => {
  let area;
  let mainObject = props.mainObj;
  area = props.mainObj.polygons
    .filter(
      (d) =>
        (d.polygon && d.polygon["layer"].toLowerCase() == "plus") ||
        d.layerName?.toLowerCase() == "notplus"
    )
    .map((d) => d.area)[0];

  let newArea = Number(area).toFixed(2);
  // let shatfa_array = get(mainObject, "temp", "");
  // if (shatfa_array.cadData) {
  //   delete shatfa_array.cadData;
  // }
  // let shatfa_lengths =
  //   Object.values(shatfa_array)
  //     // .slice(1)
  //     .reduce((a, b) => Number(a) + Number(b), 0) || 0;
  // if (shatfa_lengths > newArea) {
  //   shatfa_lengths = 0;
  //}
  newArea = Number(newArea); // - shatfa_lengths;
  //console.log("شطافات", shatfa_lengths);
  let fixed = (Number(props.values && props.values.meter_price) || 0) * newArea;
  return (
    // state.wizard.mainObject.suggestParcel.suggestParcel.suggestParcels.polygons.filter(d => d.polygon["layer"].toLowerCase() == "plus")
    fixed.toFixed(2) + "  " + "ريال"
  );
};
export const total_price_zayda_area = (state, params, props, values) => {
  let area;
  let mainObject = props.mainObj;
  area = props.mainObj.polygons
    .filter(
      (d) =>
        (d.polygon && d.polygon["layer"].toLowerCase() == "plus") ||
        d.layerName?.toLowerCase() == "notplus"
    )
    .map((d) => d.area)[0];

  let newArea = Number(area).toFixed(2);
  let shatfa_array = get(mainObject, "temp", "");

  let shatfa_lengths =
    Object.values(shatfa_array)
      // .slice(1)
      .reduce((a, b) => Number(a) + Number(b), 0) || 0;
  // newArea = Number(newArea) - shatfa_lengths;
  console.log("شطافات", shatfa_lengths);
  // let fixed = (Number(props.values && props.values.meter_price) || 0) * newArea;
  return (
    // state.wizard.mainObject.suggestParcel.suggestParcel.suggestParcels.polygons.filter(d => d.polygon["layer"].toLowerCase() == "plus")
    newArea + "م2"
  );
};
export const shatfa_area = (state, params, props, values) => {
  let area;
  let mainObject = props.mainObj;
  area = props.mainObj.polygons
    .filter(
      (d) =>
        (d.polygon && d.polygon["layer"].toLowerCase() == "plus") ||
        d.layerName?.toLowerCase() == "notplus"
    )
    .map((d) => d.area)[0];

  let newArea = Number(area).toFixed(2);
  let shatfa_array = get(mainObject, "temp", "");
  if (shatfa_array.cadData) {
    delete shatfa_array.cadData;
  }
  let shatfa_lengths =
    Object.values(shatfa_array)
      // .slice(1)
      .reduce((a, b) => Number(a) + Number(b), 0) || 0;
  if (shatfa_lengths > 0) {
    shatfa_lengths = shatfa_lengths + "م2";
  } else {
    shatfa_lengths = "no";
  }
  // newArea = Number(newArea) - shatfa_lengths;
  console.log("شطافات", shatfa_lengths);
  // let fixed = (Number(props.values && props.values.meter_price) || 0) * newArea;
  return (
    // state.wizard.mainObject.suggestParcel.suggestParcel.suggestParcels.polygons.filter(d => d.polygon["layer"].toLowerCase() == "plus")
    shatfa_lengths
  );
};
export const after_shatfa = (state, params, props, values) => {
  let area;
  let mainObject = props.mainObj;
  area = props.mainObj.polygons
    .filter(
      (d) =>
        (d.polygon && d.polygon["layer"].toLowerCase() == "plus") ||
        d.layerName?.toLowerCase() == "notplus"
    )
    .map((d) => d.area)[0];

  let newArea = Number(area).toFixed(2);
  let shatfa_array = get(mainObject, "temp", "");
  if (shatfa_array.cadData) {
    delete shatfa_array.cadData;
  }
  let shatfa_lengths =
    Object.values(shatfa_array)
      // .slice(1)
      .reduce((a, b) => Number(a) + Number(b), 0) || 0;
  if (shatfa_lengths > newArea) {
    shatfa_lengths = 0;
  }
  if (shatfa_lengths > 0) {
    newArea = Number(newArea) - shatfa_lengths;
    newArea = newArea.toFixed(2) + "م2";
  } else {
    newArea = "no";
  }

  console.log("شطافات", shatfa_lengths);
  // let fixed = (Number(props.values && props.values.meter_price) || 0) * newArea;
  return (
    // state.wizard.mainObject.suggestParcel.suggestParcel.suggestParcels.polygons.filter(d => d.polygon["layer"].toLowerCase() == "plus")
    newArea
  );
};
export const elc_area = (state, params, props, values) => {
  let area = props.elec;
  if (area > 0) {
    area = area + "م2";
  } else {
    area = "no";
  }

  return (
    // state.wizard.mainObject.suggestParcel.suggestParcel.suggestParcels.polygons.filter(d => d.polygon["layer"].toLowerCase() == "plus")
    area
  );
};
export const get_date_ma7dar = (state, params, props, values) => {
  //
  // console.log(state, params, props, values);

  let ma7darData = props?.mainObject?.ma7dar?.ma7dar_mola5s;

  return (ma7darData && ma7darData["date"]) || "";
};
export const get_total_ma7dar = (state, params, props, values) => {
  //
  // console.log(state, params, props, values);
  let ma7darData = props?.mainObject?.ma7dar?.ma7dar_mola5s;

  return (ma7darData && ma7darData["declaration"]) || "";
};

export const get_total_letters_ma7dar = (state, params, props, values) => {
  let ma7darData = props?.mainObject?.ma7dar?.ma7dar_mola5s;

  return (ma7darData && ma7darData["text_declaration"]) || "";
};
export const get_total_parcels_area = (state, params, props, values) => {
  let total_area = [
    props?.mainObject?.suggestParcel?.suggestParcel?.suggestParcels?.polygons?.find(
      (p) => {
        return (
          (p.polygon && p.polygon.layer == "full_boundry") ||
          (p.layerName && p.layerName == "full_boundry")
        );
      }
    ) ||
      props?.mainObject?.suggestParcel?.suggestParcel?.suggestParcels?.polygons?.find(
        (p) => {
          return (
            (p.polygon && p.polygon.layer == "boundry") ||
            (p.layerName && p.layerName == "boundry")
          );
        }
      ),
  ]?.reduce((a, b) => a + +b.area, 0) || 0;

  return total_area.toFixed(2) || 0;
};
export const get_bounds = (state, params, props, values) => {
  //
  let filterKey = props["deps"];
  let data = [
    props["mainObject"]["suggestParcel"]["suggestParcel"]["suggestParcels"][
      "polygons"
    ].find((p) => {
      return (
        (p.polygon && p.polygon.layer == "full_boundry") ||
        (p.layerName && p.layerName == "full_boundry")
      );
    }) ||
      props["mainObject"]["suggestParcel"]["suggestParcel"]["suggestParcels"][
        "polygons"
      ].find((p) => {
        return (
          (p.polygon && p.polygon.layer == "boundry") ||
          (p.layerName && p.layerName == "boundry")
        );
      }),
  ]?.reduce(
    (a, b) => a + +b["data"].filter((d) => d.name == filterKey)[0].totalLength,
    0
  ) || 0;
  return data.toFixed(2);
};
export const get_meter_letters_ma7dar = (state, params, props, values) => {
  //
  // console.log(state, params, props, values);
  let ma7darData = props?.mainObject?.ma7dar?.ma7dar_mola5s;

  return (ma7darData && ma7darData["text_meter"]) || "";
};
export const get_meter_ma7dar = (state, params, props, values) => {
  //
  // console.log(state, params, props, values);
  let ma7darData = props?.mainObject?.ma7dar?.ma7dar_mola5s;

  return (ma7darData && ma7darData["meter_price"]) || "";
};
