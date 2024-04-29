import { cloneDeep, filter, get, toArray } from "lodash";
import {
  computePointDirection,
  projectWithPromise,
} from "../../../../../inputs/fields/identify/Component/common/common_func";
const requestTypes = [
  {
    code: 1,
    message: "قرار مساحي",
  },
  {
    code: 2,
    message: "فرز",
  },
  {
    code: 3,
    message: "دمج",
  },
];
const isBuilding = [
  { code: 1, message: "مبني" },
  { code: 2, message: "غير مبني" },
];

const Usage = [
  { code: "RSD", message: "سكني" },
  { code: "COM", message: "تجاري" },
  { code: "RSC", message: "سكني تجاري" },
  { code: "RSC", message: "متعدد الاستخدام" },
  { code: "AGR", message: "الزراعة" },
  { code: "IND", message: "التصنيع" },
  { code: "UTL", message: "مرفق" },
];

const BorderType = [
  { code: "PLT", message: "قطعة" },
  { code: "PLT", message: "القطعة" },
  { code: "PLT", message: "قطعه" },
  { code: "PLT", message: "القطعه" },
  { code: "PLT", message: "جزء من القطعة" },
  { code: "PLT", message: "جزء من قطعة" },
  { code: "PLT", message: "جزء من القطعه" },
  { code: "PLT", message: "جزء من قطعه" },
  { code: "PLT", message: "قطع" },
  { code: "PLT", message: "القطع" },
  { code: "PLT", message: "دكان" },
  { code: "PLT", message: "دكاكين" },
  { code: "PLT", message: "أرض مملوكة غير مخططة" },
  { code: "PLT", message: "أرض مملوكه غير مخططة" },
  { code: "PLT", message: "أرض مملوكة غير مخططه" },
  { code: "PLT", message: "أرض مملوكه غير مخططه" },
  { code: "PLT", message: "ارض مملوكة غير مخططة" },
  { code: "PLT", message: "ارض مملوكه غير مخططة" },
  { code: "PLT", message: "ارض مملوكة غير مخططه" },
  { code: "PLT", message: "ارض مملوكه غير مخططه" },
  { code: "STR", message: "شارع" },
  { code: "CRB", message: "رصيف" },
  { code: "LNE", message: "نافذ" },
  { code: "LNE", message: "ممر" },
  { code: "LNE", message: "ممر خدمة" },
  { code: "LNE", message: "طريق" },
  { code: "LNE", message: "طرق" },
  { code: "LNE", message: "ساحة" },
  { code: "LNE", message: "ساحه" },
  { code: "LNE", message: "ساحة مسفلتة" },
  { code: "LNE", message: "ساحه مسفلته" },
  { code: "LNE", message: "ساحة مسفلته" },
  { code: "LNE", message: "ساحه مسفلتة" },
  { code: "LNE", message: "فسحة" },
  { code: "LNE", message: "فسحه" },
  { code: "UTL", message: "مرفق" },
  { code: "UTL", message: "موقف" },
  { code: "UTL", message: "مواقف" },
  { code: "UTL", message: "حديق" },
  { code: "UTL", message: "حدائق" },
  { code: "UTL", message: "حديقة" },
  { code: "REI", message: "هوية عقارية" },
];

const BorderName = [
  { code: "1", message: "شمال" },
  { code: "2", message: "شرق" },
  { code: "3", message: "جنوب" },
  { code: "4", message: "غرب" },
];

const DimensionsType = [
  { code: "Single", message: "Single" },
  { code: "Multi", message: "Multi" },
];

export const checkBorderType = (desc) => {
  let type = "";
  type = BorderType.find((r) => desc?.indexOf(r.message) != -1)?.code;

  return type;
};

const checkSubdivisionTypeValue = (attributes) => {
  if (
    attributes.SUBDIVISION_TYPE.indexOf("مجاورة") != -1 ||
    attributes.SUBDIVISION_TYPE.indexOf("مجاوره") != -1 ||
    attributes.SUBDIVISION_TYPE.indexOf("حي") != -1 ||
    attributes.SUBDIVISION_TYPE.indexOf("حى") != -1
  ) {
    return attributes.SUBDIVISION_DESCRIPTION;
  } else if (
    attributes.SUBDIVISION_TYPE.indexOf("فئة") != -1 ||
    attributes.SUBDIVISION_TYPE.indexOf("فئه") != -1 ||
    attributes.SUBDIVISION_TYPE.indexOf("منطقة") != -1 ||
    attributes.SUBDIVISION_TYPE.indexOf("منطقه") != -1
  ) {
    return (
      attributes.SUBDIVISION_TYPE +
        " " +
        attributes.SUBDIVISION_DESCRIPTION?.replaceAll("فئة", "")
          ?.replaceAll("فئه", "")
          ?.replaceAll("منطقة", "")
          ?.replaceAll("منطقه", "") || ""
    );
  }
};
const checkBlockNoAndSubdivisionType = (attributes) => {
  let str = "";
  if (attributes.PARCEL_BLOCK_NO && !attributes.SUBDIVISION_TYPE) {
    str = attributes.PARCEL_BLOCK_NO;
  } else if (!attributes.PARCEL_BLOCK_NO && attributes.SUBDIVISION_TYPE) {
    str = checkSubdivisionTypeValue(attributes);
  } else if (attributes.PARCEL_BLOCK_NO && attributes.SUBDIVISION_TYPE) {
    str =
      attributes.PARCEL_BLOCK_NO +
      " / " +
      checkSubdivisionTypeValue(attributes);
  } else {
    str = null;
  }

  return str;
};

export const checkPolygonDimensions = (geometry, border) => {
  var min = 0;
  var max = 0;
  let length = 0;
  let lengths = [];
  for (var j = 0, n = geometry.rings[0].length - 1; j < n; j++) {
    var point1 = new esri.geometry.Point(
      geometry.rings[0][j][0],
      geometry.rings[0][j][1]
    );
    var point2 = new esri.geometry.Point(
      geometry.rings[0][j + 1][0],
      geometry.rings[0][j + 1][1]
    );

    if (point1.x > max) {
      max = point1.x;
      geometry.maxPoint = point1;
    }

    if (!min || point1.x < min) {
      min = point1.x;
      geometry.minPoint = point1;
    }

    if (point2.x > max) {
      max = point2.x;
      geometry.maxPoint = point2;
    }

    if (!min || point2.x < min) {
      min = point2.x;
      geometry.minPoint = point2;
    }
    let info = computePointDirection(
      geometry,
      geometry.rings[0][j],
      geometry.rings[0][j + 1],
      geometry
    );

    if (info.direction == border) {
      length = (length || 0) + info.length;
      lengths.push(info.length);
    }
  }

  return { length: length?.toString(), lengths: lengths };
};

export const checkPlanNo = (value, attrs) => {
  return (
    ((attrs.MUNICIPALITY_NAME == 10501 ||
      attrs.MUNICIPALITY_NAME_Code == 10501) &&
      value == "9999" &&
      "بدون") ||
    (value == "9999" && "الارشادي") ||
    value
  );
};

export const checkRealEstateObject = (
  mainObject,
  currentMainObject,
  submission
) => {
  let owners = get(
    currentMainObject,
    "ownerData.ownerData.owners",
    get(currentMainObject, "ownerData.ownerData", [])
  );
  return new Promise(async (resolve, reject) => {
    let rr = await projectWithPromise(
      currentMainObject?.tadkek_data_Msa7y?.tadkek_msa7yData?.cadDetails?.suggestionsParcels
        ?.filter((r) => !r.isFullBoundry)
        .map(
          (r) =>
            (r?.polygon?.geometry &&
              new esri.geometry.Polygon(r.polygon.geometry)) ||
            new esri.geometry.Polygon(r.polygon)
        ),
      4326,
      null,
      false
    );
    let rr1 = await projectWithPromise(
      currentMainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
        ?.filter((r) => !r.isFullBoundry)
        .map(
          (r) =>
            (r?.polygon?.geometry &&
              new esri.geometry.Polygon(r.polygon.geometry)) ||
            new esri.geometry.Polygon(r.polygon)
        ),
      4326,
      null,
      false
    );

    return resolve(
      {
        // submission?.CurrentStep.generate_rid &&
        request_no: submission?.request_no?.replace(/[^\w\s]/gi, "") || null,
        report_no: (submission?.export_no || "") + "6",
        request_type:
          requestTypes
            .find(
              (r) =>
                (submission?.app_id == 14 && r.code == 1) ||
                (submission?.app_id == 1 &&
                  currentMainObject?.tadkek_data_Msa7y?.tadkek_msa7yData
                    ?.requestType == 1 &&
                  r.code == 2) ||
                (submission?.app_id == 1 &&
                  currentMainObject?.tadkek_data_Msa7y?.tadkek_msa7yData
                    ?.requestType == 2 &&
                  r.code == 3)
            )
            ?.code?.toString() || null,
        request_source: "6",
        deedNo1:
          currentMainObject?.waseka?.waseka?.table_waseka?.[0]?.number_waseka?.split(
            "/"
          )?.[0] || null,
        deedNo2:
          currentMainObject?.waseka?.waseka?.table_waseka?.[0]?.number_waseka?.split(
            "/"
          )?.[1] || null,
        deedNo3:
          currentMainObject?.waseka?.waseka?.table_waseka?.[0]?.number_waseka?.split(
            "/"
          )?.[2] || null,
        deedDate:
          currentMainObject?.waseka?.waseka?.table_waseka?.[0]?.date_waseka
            ?.split("/")
            ?.reverse()
            ?.join("/")
            ?.replace(/[^\w\s]/gi, ""),
        deedOrigin:
          // currentMainObject?.waseka?.waseka?.table_waseka?.[0]?.issuer_id?.toString() ||
          currentMainObject?.waseka?.waseka?.table_waseka?.[0]?.waseka_search?.toString(),
        owners: Object.keys(owners).map((key) => {
          owners[key].type =
            (["2", "3"].indexOf(owners[key].type) != -1 && "5") ||
            owners[key].type;

          return {
            deedOwnerid:
              owners[key].ssn ||
              owners[key].commercial_registeration ||
              owners[key].code_regesteration,
            idType: owners[key].type,
            idTypeDescription:
              (owners[key].type == 1 && "مواطن") ||
              (owners[key].type == 5 && "منشأة") ||
              null,
          };
        }),
        ParcelsObject: (submission?.app_id == 1 && [
          ...currentMainObject?.tadkek_data_Msa7y?.tadkek_msa7yData?.cadDetails?.suggestionsParcels?.map(
            (parcel, index) => ({
              plot_no: parcel.attributes.PARCEL_PLAN_NO.replaceAll(" ", "") || null,
              plan_no: checkPlanNo(parcel.attributes.PLAN_NO, parcel.attributes) || null,
              block_no: checkBlockNoAndSubdivisionType(parcel.attributes),
              is_building:
                (submission?.app_id == 14 &&
                  isBuilding
                    .find(
                      (r) =>
                        ((
                          mainObject?.landData?.landData?.lands?.parcelData ||
                          mainObject?.landData?.landData?.lands?.parcels[0]
                            .parcelData
                        )?.parcel_type?.indexOf("أرض") != -1 &&
                          r.code == "2") ||
                        r.code == "1"
                    )
                    ?.code.toString()) ||
                (submission?.app_id == 1 &&
                  (([1928, 2048].indexOf(submission?.workflow_id) != -1 &&
                    "2") ||
                    (submission?.workflow_id == 1949 && "1"))),
              building_type: 0,
              // (submission?.app_id == 14 &&
              //   ((isBuilding
              //     .find(
              //       (r) =>
              //         ((
              //           mainObject?.landData?.landData?.lands?.parcelData ||
              //           mainObject?.landData?.landData?.lands?.parcels[0]
              //             .parcelData
              //         )?.parcel_type?.indexOf("أرض") != -1 &&
              //           r.code == "2") ||
              //         r.code == "1"
              //     )
              //     ?.code.toString() == "2" &&
              //     "0") ||
              //     "1")) ||
              // (submission?.app_id == 1 &&
              //   (([1928, 2048].indexOf(submission?.workflow_id) != -1 &&
              //     "0") ||
              //     (submission?.workflow_id == 1949 && "1"))),
              ImageURL: "",
              LandUse: Usage.find(
                (r) => parcel.attributes.PARCEL_MAIN_LUSE == r.message
              )?.code?.toString(),
              Area: +(+parcel.deducted_area || +parcel.area)?.toFixed(2),
              ParcelStatus: "1",
              borders: [
                {
                  name: BorderName.find((r) => r.message == "شمال")?.code,
                  border: [
                    {
                      type: checkBorderType(parcel?.north_Desc),
                      description: parcel?.north_Desc,
                    },
                  ],
                  dimensions: ((parcel, border) => {
                    return {
                      type:
                        (parcel.data[0].data?.length > 0 &&
                          DimensionsType.find(
                            (r) =>
                              (parcel.data[0].data?.length == 1 &&
                                r.code == "Single") ||
                              r.code == "Multi"
                          )?.message) ||
                        "",
                      description: +parcel?.data[0].totalLength,
                      details: [
                        ...parcel.data[0].data.map((r) => r.text.toFixed(2)),
                      ],
                    };
                  })(parcel, "north"),
                },
                {
                  name: BorderName.find((r) => r.message == "شرق")?.code,
                  border: [
                    {
                      type: checkBorderType(parcel?.east_Desc),
                      description: parcel?.east_Desc,
                    },
                  ],
                  dimensions: ((parcel, border) => {
                    return {
                      type:
                        (parcel.data[1].data?.length > 0 &&
                          DimensionsType.find(
                            (r) =>
                              (parcel.data[1].data?.length == 1 &&
                                r.code == "Single") ||
                              r.code == "Multi"
                          )?.message) ||
                        "",
                      description: +parcel?.data[1].totalLength,
                      details: [
                        ...parcel.data[1].data.map((r) => r.text.toFixed(2)),
                      ],
                    };
                  })(parcel, "east"),
                },
                {
                  name: BorderName.find((r) => r.message == "جنوب")?.code,
                  border: [
                    {
                      type: checkBorderType(parcel?.south_Desc),
                      description: parcel?.south_Desc,
                    },
                  ],
                  dimensions: ((parcel, border) => {
                    return {
                      type:
                        (parcel.data[4].data?.length > 0 &&
                          DimensionsType.find(
                            (r) =>
                              (parcel.data[4].data?.length == 1 &&
                                r.code == "Single") ||
                              r.code == "Multi"
                          )?.message) ||
                        "",
                      description: +parcel?.data[4].totalLength,
                      details: [
                        ...parcel.data[4].data.map((r) => r.text.toFixed(2)),
                      ],
                    };
                  })(parcel, "south"),
                },
                {
                  name: BorderName.find((r) => r.message == "غرب")?.code,
                  border: [
                    {
                      type: checkBorderType(parcel?.west_Desc),
                      description: parcel?.west_Desc,
                    },
                  ],
                  dimensions: ((parcel, border) => {
                    return {
                      type:
                        (parcel.data[3].data?.length > 0 &&
                          DimensionsType.find(
                            (r) =>
                              (parcel.data[3].data?.length == 1 &&
                                r.code == "Single") ||
                              r.code == "Multi"
                          )?.message) ||
                        "",
                      description: +parcel?.data[3].totalLength,
                      details: [
                        ...parcel.data[3].data.map((r) => r.text.toFixed(2)),
                      ],
                    };
                  })(parcel, "west"),
                },
              ],
              coordinates: [
                ...rr[index].rings[0].map((r, i) => {
                  return {
                    point_no: i + 1,
                    latitude: r[1] || "",
                    longitude: r[0] || "",
                  };
                }),
              ],
            })
          ),

          ...currentMainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
            ?.filter((r) => !r.isFullBoundry)
            .map((parcel, index) => ({
              plot_no: parcel.parcel_name.replaceAll(" ", "") || null,
              plan_no:
                checkPlanNo(
                  mainObject?.landData?.landData?.lands?.parcels[0].attributes
                    .PLAN_NO, mainObject?.landData?.landData?.lands?.parcels[0].attributes
                ) || null,
              block_no: checkBlockNoAndSubdivisionType(
                mainObject?.landData?.landData?.lands?.parcels[0].attributes
              ),
              is_building:
                (submission?.app_id == 14 &&
                  isBuilding
                    .find(
                      (r) =>
                        ((
                          mainObject?.landData?.landData?.lands?.parcelData ||
                          mainObject?.landData?.landData?.lands?.parcels[0]
                            .parcelData
                        )?.parcel_type?.indexOf("أرض") != -1 &&
                          r.code == "2") ||
                        r.code == "1"
                    )
                    ?.code.toString()) ||
                (submission?.app_id == 1 &&
                  (([1928, 2048].indexOf(submission?.workflow_id) != -1 &&
                    "2") ||
                    (submission?.workflow_id == 1949 && "1"))),
              building_type: 0,
              // (submission?.app_id == 14 &&
              //   ((isBuilding
              //     .find(
              //       (r) =>
              //         ((
              //           mainObject?.landData?.landData?.lands?.parcelData ||
              //           mainObject?.landData?.landData?.lands?.parcels[0]
              //             .parcelData
              //         )?.parcel_type?.indexOf("أرض") != -1 &&
              //           r.code == "2") ||
              //         r.code == "1"
              //     )
              //     ?.code.toString() == "2" &&
              //     "0") ||
              //     "1")) ||
              // (submission?.app_id == 1 &&
              //   (([1928, 2048].indexOf(submission?.workflow_id) != -1 &&
              //     "0") ||
              //     (submission?.workflow_id == 1949 && "1"))),
              ImageURL: "",
              LandUse: Usage.find(
                (r) =>
                  mainObject?.landData?.landData?.lands?.parcels?.find(
                    (e) =>
                      e?.attributes?.PARCEL_PLAN_NO == parcel?.parcelNameRight
                  )?.attributes?.PARCEL_MAIN_LUSE == r.message
              )?.code,
              Area: +(+parcel.deducted_area || +parcel.area)?.toFixed(2),
              ParcelStatus: (submission?.app_id == 14 && "1") || "2", // ودي بتختلف في الاراضي المقترحة على حسب الابلكيشن
              borders: [
                {
                  name: BorderName.find((r) => r.message == "شمال")?.code,
                  border: [
                    {
                      type: checkBorderType(parcel?.north_Desc),
                      description: parcel?.north_Desc,
                    },
                  ],
                  dimensions: {
                    type:
                      (parcel?.data[0].data.length > 0 &&
                        DimensionsType.find(
                          (r) =>
                            (parcel?.data[0].data.length == 1 &&
                              r.code == "Single") ||
                            r.code == "Multi"
                        )?.message) ||
                      "",
                    description: +parcel?.data[0].totalLength,
                    details: [
                      ...parcel.data[0].data.map((r) => r.text.toFixed(2)),
                    ],
                  },
                },
                {
                  name: BorderName.find((r) => r.message == "شرق")?.code,
                  border: [
                    {
                      type: checkBorderType(parcel?.east_Desc),
                      description: parcel?.east_Desc,
                    },
                  ],
                  dimensions: {
                    type:
                      (parcel?.data[1].data.length > 0 &&
                        DimensionsType.find(
                          (r) =>
                            (parcel?.data[1].data.length == 1 &&
                              r.code == "Single") ||
                            r.code == "Multi"
                        )?.message) ||
                      "",
                    description: +parcel?.data[1].totalLength,
                    details: [
                      ...parcel.data[1].data.map((r) => r.text.toFixed(2)),
                    ],
                  },
                },
                {
                  name: BorderName.find((r) => r.message == "جنوب")?.code,
                  border: [
                    {
                      type: checkBorderType(parcel?.south_Desc),
                      description: parcel?.south_Desc,
                    },
                  ],
                  dimensions: {
                    type:
                      (parcel?.data[4].data.length > 0 &&
                        DimensionsType.find(
                          (r) =>
                            (parcel?.data[4].data.length == 1 &&
                              r.code == "Single") ||
                            r.code == "Multi"
                        )?.message) ||
                      "",
                    description: +parcel?.data[4].totalLength,
                    details: [
                      ...parcel.data[4].data.map((r) => r.text.toFixed(2)),
                    ],
                  },
                },
                {
                  name: BorderName.find((r) => r.message == "غرب")?.code,
                  border: [
                    {
                      type: checkBorderType(parcel?.west_Desc),
                      description: parcel?.west_Desc,
                    },
                  ],
                  dimensions: {
                    type:
                      (parcel?.data[3].data.length > 0 &&
                        DimensionsType.find(
                          (r) =>
                            (parcel?.data[3].data.length == 1 &&
                              r.code == "Single") ||
                            r.code == "Multi"
                        )?.message) ||
                      "",
                    description: +parcel?.data[3].totalLength,
                    details: [
                      ...parcel.data[3].data.map((r) => r.text.toFixed(2)),
                    ],
                  },
                },
              ],
              coordinates: [
                ...rr1[index].rings[0].map((r, i) => {
                  return {
                    point_no: i + 1,
                    latitude: r[1] || "",
                    longitude: r[0] || "",
                  };
                }),
              ],
            })),
        ]) || [
          ...currentMainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
            ?.filter((r) => !r.isFullBoundry)
            .map((parcel, index) => ({
              plot_no: parcel.parcel_name.replaceAll(" ", "") || null,
              plan_no:
                checkPlanNo(
                  mainObject?.landData?.landData?.lands?.parcels[0].attributes
                    .PLAN_NO,
                    mainObject?.landData?.landData?.lands?.parcels[0].attributes
                ) || null,
              block_no: checkBlockNoAndSubdivisionType(
                mainObject?.landData?.landData?.lands?.parcels[0].attributes
              ),
              is_building:
                (submission?.app_id == 14 &&
                  isBuilding
                    .find(
                      (r) =>
                        ((
                          mainObject?.landData?.landData?.lands?.parcelData ||
                          mainObject?.landData?.landData?.lands?.parcels[0]
                            .parcelData
                        )?.parcel_type?.indexOf("أرض") != -1 &&
                          r.code == "2") ||
                        r.code == "1"
                    )
                    ?.code.toString()) ||
                (submission?.app_id == 1 &&
                  (([1928, 2048].indexOf(submission?.workflow_id) != -1 &&
                    "2") ||
                    (submission?.workflow_id == 1949 && "1"))),
              building_type: 0,
              // (submission?.app_id == 14 &&
              //   ((isBuilding
              //     .find(
              //       (r) =>
              //         ((
              //           mainObject?.landData?.landData?.lands?.parcelData ||
              //           mainObject?.landData?.landData?.lands?.parcels[0]
              //             .parcelData
              //         )?.parcel_type?.indexOf("أرض") != -1 &&
              //           r.code == "2") ||
              //         r.code == "1"
              //     )
              //     ?.code.toString() == "2" &&
              //     "0") ||
              //     "1")) ||
              // (submission?.app_id == 1 &&
              //   (([1928, 2048].indexOf(submission?.workflow_id) != -1 &&
              //     "0") ||
              //     (submission?.workflow_id == 1949 && "1"))),
              ImageURL: "",
              LandUse: Usage.find(
                (r) =>
                  mainObject?.landData?.landData?.lands?.parcels?.find(
                    (e) =>
                      e?.attributes?.PARCEL_PLAN_NO == parcel?.parcelNameRight
                  )?.attributes?.PARCEL_MAIN_LUSE == r.message
              )?.code,
              Area: +(+parcel.deducted_area || +parcel.area)?.toFixed(2),
              ParcelStatus: (submission?.app_id == 14 && "1") || "2", // ودي بتختلف في الاراضي المقترحة على حسب الابلكيشن
              borders: [
                {
                  name: BorderName.find((r) => r.message == "شمال")?.code,
                  border: [
                    {
                      type: checkBorderType(parcel?.north_Desc),
                      description: parcel?.north_Desc,
                    },
                  ],
                  dimensions: {
                    type:
                      (parcel?.data[0].data.length > 0 &&
                        DimensionsType.find(
                          (r) =>
                            (parcel?.data[0].data.length == 1 &&
                              r.code == "Single") ||
                            r.code == "Multi"
                        )?.message) ||
                      "",
                    description: +parcel?.data[0].totalLength,
                    details: [
                      ...parcel.data[0].data.map((r) => r.text.toFixed(2)),
                    ],
                  },
                },
                {
                  name: BorderName.find((r) => r.message == "شرق")?.code,
                  border: [
                    {
                      type: checkBorderType(parcel?.east_Desc),
                      description: parcel?.east_Desc,
                    },
                  ],
                  dimensions: {
                    type:
                      (parcel?.data[1].data.length > 0 &&
                        DimensionsType.find(
                          (r) =>
                            (parcel?.data[1].data.length == 1 &&
                              r.code == "Single") ||
                            r.code == "Multi"
                        )?.message) ||
                      "",
                    description: +parcel?.data[1].totalLength,
                    details: [
                      ...parcel.data[1].data.map((r) => r.text.toFixed(2)),
                    ],
                  },
                },
                {
                  name: BorderName.find((r) => r.message == "جنوب")?.code,
                  border: [
                    {
                      type: checkBorderType(parcel?.south_Desc),
                      description: parcel?.south_Desc,
                    },
                  ],
                  dimensions: {
                    type:
                      (parcel?.data[4].data.length > 0 &&
                        DimensionsType.find(
                          (r) =>
                            (parcel?.data[4].data.length == 1 &&
                              r.code == "Single") ||
                            r.code == "Multi"
                        )?.message) ||
                      "",
                    description: +parcel?.data[4].totalLength,
                    details: [
                      ...parcel.data[4].data.map((r) => r.text.toFixed(2)),
                    ],
                  },
                },
                {
                  name: BorderName.find((r) => r.message == "غرب")?.code,
                  border: [
                    {
                      type: checkBorderType(parcel?.west_Desc),
                      description: parcel?.west_Desc,
                    },
                  ],
                  dimensions: {
                    type:
                      (parcel?.data[3].data.length > 0 &&
                        DimensionsType.find(
                          (r) =>
                            (parcel?.data[3].data.length == 1 &&
                              r.code == "Single") ||
                            r.code == "Multi"
                        )?.message) ||
                      "",
                    description: +parcel?.data[3].totalLength,
                    details: [
                      ...parcel.data[3].data.map((r) => r.text.toFixed(2)),
                    ],
                  },
                },
              ],
              coordinates: [
                ...rr1[index].rings[0].map((r, i) => {
                  return {
                    point_no: i + 1,
                    latitude: r[1] || "",
                    longitude: r[0] || "",
                  };
                }),
              ],
            })),
        ],
      } || null
    );
  });
};
