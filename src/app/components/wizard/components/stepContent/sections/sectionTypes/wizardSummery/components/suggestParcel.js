import React, { Component } from "react";
import { backEndUrlforMap, filesHost } from "imports/config";
import {
  remove_duplicate,
  convertToArabic,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
export default class identify extends Component {
  // remove_duplicate(url) {
  //   return (
  //     filesHost +
  //     url
  //       .split("/")
  //       .filter((d) => d.toLowerCase() != "GISAPI".toLowerCase())
  //       .join("/")
  //       .toString()
  //       .substring(url.toLowerCase().indexOf("subattachments"), url.length)
  //   );
  // }
  render() {
    const { polygons } =
      this.props.mainObject.suggestParcel.suggestParcel.suggestParcels;

    var parcel = polygons.filter((polygon) => {
      return (
        polygon.polygon &&
        // polygon.polygon.layer?.toLowerCase() == "boundry"?.toLowerCase()
        polygon.layerName?.toLowerCase() != "plus"?.toLowerCase() &&
        polygon.layerName?.toLowerCase() != "notPlus"?.toLowerCase()
      );
    })[0];

    return (
      <div>
        <img
          src={remove_duplicate(
            this.props?.mainObject?.suggestParcel?.suggestParcel
              ?.submission_data?.suggestionUrl ||
              this.props?.mainObject?.suggestParcel?.submission_data
                ?.suggestionUrl
          )}
          style={{ width: "100%" }}
        />

        {polygons.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            {polygons
              .filter((polygon) => {
                return (
                  polygon.polygon &&
                  polygon.polygon.layer?.toLowerCase() ==
                    "boundry"?.toLowerCase()
                );
              })
              .map((polygon, key) => {
                return (
                  <table className="table table-bordered" key={key}>
                    <tbody>
                      <tr>
                        {" "}
                        <td> أسم الأرض </td>{" "}
                        <td>{convertToArabic(polygon.parcel_name)}</td>
                      </tr>
                      <tr>
                        <td> مساحة الأرض </td>
                        <td>{convertToArabic(polygon.area.toFixed(2))} م٢</td>
                      </tr>
                      <tr>
                        <td> مساحة الأرض بالحروف</td>
                        <td>{convertToArabic(polygon.parcel_area_desc)}</td>
                      </tr>
                      <tr>
                        <td>وصف الحد الشمالي</td>
                        <td>{convertToArabic(polygon.north_Desc)}</td>
                      </tr>
                      <tr>
                        <td> طول الضلع الشمالي </td>
                        <td>
                          {convertToArabic(polygon.data[0].totalLength)} م
                        </td>
                      </tr>
                      <tr>
                        <td> وصف الحد الشرقي</td>
                        <td>{convertToArabic(polygon.east_Desc)}</td>
                      </tr>
                      <tr>
                        <td>طول الضلع الشرقي</td>
                        <td>
                          {convertToArabic(polygon.data[1].totalLength)} م
                        </td>
                      </tr>
                      <tr>
                        <td>وصف الحد الجنوبي</td>
                        <td>{convertToArabic(polygon.south_Desc)}</td>
                      </tr>
                      <tr>
                        <td> طول الضلع الجنوبي</td>
                        <td>
                          {convertToArabic(polygon.data[4].totalLength)} م
                        </td>
                      </tr>
                      <tr>
                        <td>وصف الحد الغربي</td>
                        <td>{convertToArabic(polygon.weast_Desc)}</td>
                      </tr>
                      <tr>
                        <td> طول الضلع الغربي</td>
                        <td>
                          {convertToArabic(polygon.data[3].totalLength)} م
                        </td>
                      </tr>
                    </tbody>
                  </table>
                );
              })}

            {polygons
              .filter((polygon) => {
                return (
                  polygon.polygon &&
                  polygon.polygon.layer?.toLowerCase() ==
                    "full_boundry"?.toLowerCase()
                );
              })
              .map((polygon, key) => {
                return (
                  <table className="table table-bordered" key={key}>
                    <tbody>
                      <tr>
                        {" "}
                        <td> أسم الأرض </td>{" "}
                        <td>{convertToArabic(polygon.parcel_name)}</td>
                      </tr>
                      <tr>
                        <td> مساحة الأرض </td>
                        <td>{convertToArabic(polygon.area.toFixed(2))} م٢</td>
                      </tr>
                      <tr>
                        <td> مساحة الأرض بالحروف</td>
                        <td>{convertToArabic(polygon.parcel_area_desc)}</td>
                      </tr>
                      <tr>
                        <td>وصف الحد الشمالي</td>
                        <td>{convertToArabic(polygon.north_Desc)}</td>
                      </tr>
                      <tr>
                        <td> طول الضلع الشمالي </td>
                        <td>
                          {convertToArabic(polygon.data[0].totalLength)} م
                        </td>
                      </tr>
                      <tr>
                        <td> وصف الحد الشرقي</td>
                        <td>{convertToArabic(polygon.east_Desc)}</td>
                      </tr>
                      <tr>
                        <td>طول الضلع الشرقي</td>
                        <td>
                          {convertToArabic(polygon.data[1].totalLength)} م
                        </td>
                      </tr>
                      <tr>
                        <td>وصف الحد الجنوبي</td>
                        <td>{convertToArabic(polygon.south_Desc)}</td>
                      </tr>
                      <tr>
                        <td> طول الضلع الجنوبي</td>
                        <td>
                          {convertToArabic(polygon.data[4].totalLength)} م
                        </td>
                      </tr>
                      <tr>
                        <td>وصف الحد الغربي</td>
                        <td>{convertToArabic(polygon.weast_Desc)}</td>
                      </tr>
                      <tr>
                        <td> طول الضلع الغربي</td>
                        <td>
                          {convertToArabic(polygon.data[3].totalLength)} م
                        </td>
                      </tr>
                    </tbody>
                  </table>
                );
              })}

            <div style={{ marginTop: "30px" }}>الزوائد </div>
            {polygons
              .filter((polygon) => {
                return (
                  (polygon.polygon &&
                    polygon.polygon.layer?.toLowerCase() ==
                      "plus"?.toLowerCase()) ||
                  polygon.layerName?.toLowerCase() == "notPlus"?.toLowerCase()
                );
              })
              .map((polygon, key) => {
                return (
                  <table
                    className="table table-bordered"
                    key={key}
                    style={{ marginTop: "10px" }}
                  >
                    <tbody>
                      <tr>
                        <td> أسم الأرض </td>
                        <td>{convertToArabic(polygon.parcel_name)}</td>
                      </tr>
                      <tr>
                        {" "}
                        <td> مساحة الزائدة </td>
                        <td>
                          {convertToArabic((+polygon.area).toFixed(2))} م٢
                        </td>
                      </tr>
                      <tr>
                        {" "}
                        <td> مساحة الزائدة بالحروف</td>{" "}
                        <td>{convertToArabic(polygon.parcel_area_desc)}</td>
                      </tr>
                      {polygon.north_Desc && (
                        <tr>
                          {" "}
                          <td>وصف الحد الشمالي</td>{" "}
                          <td>{convertToArabic(polygon.north_Desc)}</td>
                        </tr>
                      )}
                      {polygon.data && (
                        <tr>
                          {" "}
                          <td> طول الحد الشمالي </td>
                          <td>
                            {convertToArabic(polygon.data[0].totalLength)} م
                          </td>
                        </tr>
                      )}

                      {polygon.east_Desc && (
                        <tr>
                          {" "}
                          <td>وصف الحد الشرقي</td>{" "}
                          <td>{convertToArabic(polygon.east_Desc)}</td>
                        </tr>
                      )}
                      {polygon.data && (
                        <tr>
                          <td>طول الحد الشرقي</td>

                          <td>
                            {convertToArabic(polygon.data[1].totalLength)} م
                          </td>
                        </tr>
                      )}
                      {polygon.south_Desc && (
                        <tr>
                          {" "}
                          <td>وصف الحد الجنوبي</td>{" "}
                          <td>{convertToArabic(polygon.south_Desc)}</td>
                        </tr>
                      )}
                      {polygon.data && (
                        <tr>
                          {" "}
                          <td>طول الحد الجنوبي</td>
                          <td>
                            {convertToArabic(polygon.data[4].totalLength)} م
                          </td>
                        </tr>
                      )}
                      {polygon.weast_Desc && (
                        <tr>
                          {" "}
                          <td>وصف الحد الغربي</td>
                          <td>{convertToArabic(polygon.weast_Desc)}</td>
                        </tr>
                      )}
                      {polygon.data && (
                        <tr>
                          <td> طول الحد الغربي</td>

                          <td>
                            {convertToArabic(polygon.data[3].totalLength)} م
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                );
              })}
          </div>
        )}

        <div style={{ marginTop: "30px" }}>الشطفات</div>
        {polygons
          .filter((polygon) => {
            return (
              polygon.polygon &&
              // polygon.polygon.layer?.toLowerCase() == "boundry"?.toLowerCase()
              polygon.layerName?.toLowerCase() != "plus"?.toLowerCase() &&
              polygon.layerName?.toLowerCase() != "notPlus"?.toLowerCase() &&
              (polygon.shtfa_northeast ||
                polygon.shtfa_northweast ||
                polygon.shtfa_southeast ||
                polygon.shtfa_southweast ||
                polygon.electricArea)
            );
          })
          .map((parcel) => (
            <table
              className="table table-bordered"
              style={{ marginTop: "10px" }}
            >
              <tbody>
                <>
                  <tr>
                    <td>قطعة الأرض رقم</td>
                    <td>{convertToArabic(parcel.parcel_name)}</td>
                  </tr>
                  {
                    <tr>
                      <td>
                        مساحة قطعة الأرض بعد بخصم{" "}
                        {(parcel.shtfa_northeast ||
                          parcel.shtfa_northweast ||
                          parcel.shtfa_southeast ||
                          parcel.shtfa_southweast) &&
                          "مساحة الشطفة"}{" "}
                        {((parcel.shtfa_northeast ||
                          parcel.shtfa_northweast ||
                          parcel.shtfa_southeast ||
                          parcel.shtfa_southweast) &&
                          parcel.electricArea &&
                          "و غرفة الكهرباء") ||
                          (!(
                            parcel.shtfa_northeast ||
                            parcel.shtfa_northweast ||
                            parcel.shtfa_southeast ||
                            parcel.shtfa_southweast
                          ) &&
                            parcel.electricArea &&
                            "غرفة الكهرباء")}
                      </td>
                      <td>
                        {convertToArabic(
                          +parcel?.area?.toFixed(2) -
                            ((+parcel.shtfa_southweast || 0) +
                              (+parcel.shtfa_southeast || 0) +
                              (+parcel.shtfa_northweast || 0) +
                              (+parcel.shtfa_northeast || 0)) -
                            (+parcel.electricArea || 0)
                        )}
                        م٢
                      </td>
                    </tr>
                  }
                  {parcel.electricArea && (
                    <tr>
                      <td> مساحة غرفة الكهرباء : </td>
                      <td> {convertToArabic(parcel.electricArea)} م٢ </td>
                    </tr>
                  )}

                  {parcel.electricPosition && (
                    <tr>
                      <td>موقع غرفة الكهرباء : </td>
                      <td>{convertToArabic(parcel.electricPosition)}</td>
                    </tr>
                  )}

                  {parcel && parcel.shtfa_northeast && (
                    <tr>
                      <td>مساحة الشطفة : </td>
                      <td>
                        {convertToArabic(parcel.shtfa_northeast)}
                        {" م٢ "}
                      </td>
                    </tr>
                  )}

                  {parcel && parcel.shtfa_northeast && (
                    <tr>
                      <td> موقع الشطفة</td>
                      <td>شمال شرق</td>
                    </tr>
                  )}

                  {parcel && parcel.shtfa_northweast && (
                    <tr>
                      <td>مساحة الشطفة : </td>
                      <td>
                        {convertToArabic(parcel.shtfa_northweast)}
                        {" م٢ "}
                      </td>
                    </tr>
                  )}

                  {parcel && parcel.shtfa_northweast && (
                    <tr>
                      <td> موقع الشطفة</td>
                      <td>شمال غرب</td>
                    </tr>
                  )}

                  {parcel && parcel.shtfa_southeast && (
                    <tr>
                      <td>مساحة الشطفة : </td>
                      <td>
                        {convertToArabic(parcel.shtfa_southeast)}
                        {" م٢ "}
                      </td>
                    </tr>
                  )}

                  {parcel && parcel.shtfa_southeast && (
                    <tr>
                      <td> موقع الشطفة</td>
                      <td>جنوب شرق</td>
                    </tr>
                  )}

                  {parcel && parcel.shtfa_southweast && (
                    <tr>
                      <td>مساحة الشطفة : </td>
                      <td>
                        {convertToArabic(parcel.shtfa_southweast)}
                        {" م٢ "}
                      </td>
                    </tr>
                  )}

                  {parcel && parcel.shtfa_southweast && (
                    <tr>
                      <td> موقع الشطفة</td>
                      <td>جنوب غرب</td>
                    </tr>
                  )}
                </>
              </tbody>
            </table>
          ))}

        {/* {+[
          ...(polygons.find((p) => {
            return (
              (p.polygon && p.polygon.layer == "full_boundry") ||
              (p.layerName && p.layerName == "full_boundry")
            );
          }) ||
            polygons.filter((p) => {
              return (
                // (p.polygon && p.polygon.layer == "boundry") ||
                // (p.layerName && p.layerName == "boundry")
                p.layerName?.toLowerCase() != "plus"?.toLowerCase() &&
                p.layerName?.toLowerCase() != "notPlus"?.toLowerCase()
              );
            })),
        ]
          ?.reduce((a, b) => {
            return (
              a +
              (+b?.area?.toFixed(2) -
                ((+b.shtfa_southweast || 0) +
                  (+b.shtfa_southeast || 0) +
                  (+b.shtfa_northweast || 0) +
                  (+b.shtfa_northeast || 0)) -
                (+b.electricArea || 0))
            );
          }, 0)
          ?.toFixed(2) >= 0 && (
          <table className="table table-bordered">
            {[
              ...(polygons.find((p) => {
                return (
                  (p.polygon && p.polygon.layer == "full_boundry") ||
                  (p.layerName && p.layerName == "full_boundry")
                );
              }) ||
                polygons.filter((p) => {
                  return (
                    // (p.polygon && p.polygon.layer == "boundry") ||
                    // (p.layerName && p.layerName == "boundry")
                    p.layerName?.toLowerCase() != "plus"?.toLowerCase() &&
                    p.layerName?.toLowerCase() != "notPlus"?.toLowerCase()
                  );
                })),
            ].map(
              (parcel) =>
                (parcel.shtfa_northeast ||
                  parcel.shtfa_northweast ||
                  parcel.shtfa_southeast ||
                  parcel.shtfa_southweast ||
                  parcel.electricArea) && (
                  <tr>
                    <td>
                      مساحة قطعة الأرض رقم {parcel.parcel_name} بعد بخصم{" "}
                      {(parcel.shtfa_northeast ||
                        parcel.shtfa_northweast ||
                        parcel.shtfa_southeast ||
                        parcel.shtfa_southweast) &&
                        "مساحة الشطفة"}{" "}
                      {((parcel.shtfa_northeast ||
                        parcel.shtfa_northweast ||
                        parcel.shtfa_southeast ||
                        parcel.shtfa_southweast) &&
                        parcel.electricArea &&
                        "و غرفة الكهرباء") ||
                        (!(
                          parcel.shtfa_northeast ||
                          parcel.shtfa_northweast ||
                          parcel.shtfa_southeast ||
                          parcel.shtfa_southweast
                        ) &&
                          parcel.electricArea &&
                          "غرفة الكهرباء")}
                    </td>
                    <td>
                      {convertToArabic(
                        // +[
                        //   ...(polygons.find((p) => {
                        //     return (
                        //       (p.polygon &&
                        //         p.polygon.layer == "full_boundry") ||
                        //       (p.layerName && p.layerName == "full_boundry")
                        //     );
                        //   }) ||
                        //     polygons.filter((p) => {
                        //       return (
                        //         // (p.polygon && p.polygon.layer == "boundry") ||
                        //         // (p.layerName && p.layerName == "boundry")
                        //         p.layerName?.toLowerCase() !=
                        //           "plus"?.toLowerCase() &&
                        //         p.layerName?.toLowerCase() !=
                        //           "notPlus"?.toLowerCase()
                        //       );
                        //     })),
                        // ]
                        //   ?.reduce((a, b) => {
                        //     return (
                        //       a +
                        //       (+b?.area?.toFixed(2) -
                        //         ((+b.shtfa_southweast || 0) +
                        //           (+b.shtfa_southeast || 0) +
                        //           (+b.shtfa_northweast || 0) +
                        //           (+b.shtfa_northeast || 0)) -
                        //         (+b.electricArea || 0))
                        //     );
                        //   }, 0)
                        //   .toFixed(2)
                        +parcel?.area?.toFixed(2) -
                          ((+parcel.shtfa_southweast || 0) +
                            (+parcel.shtfa_southeast || 0) +
                            (+parcel.shtfa_northweast || 0) +
                            (+parcel.shtfa_northeast || 0)) -
                          (+parcel.electricArea || 0)
                      )}
                      م٢
                    </td>
                  </tr>
                )
            )}
          </table>
        )} */}

        {this.props.mainObject.suggestParcel.suggestParcel.check ? (
          <div style={{ marginTop: "20px" }}>المخطط ملكية خاصة</div>
        ) : (
          <div></div>
        )}

        {this.props.mainObject.suggestParcel.suggestParcel
          .ownerApproveImage && (
          <div>
            {this.props.mainObject.suggestParcel.suggestParcel.ownerApproveImage.map(
              (image, key) => {
                return (
                  <img
                    key={key}
                    src={backEndUrlforMap + "/gisapi/" + image}
                    style={{ width: "50%", height: "20%" }}
                  />
                );
              }
            )}
          </div>
        )}
      </div>
    );
  }
}
