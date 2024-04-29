import React, { Component } from "react";
import { get } from "lodash";
import * as Cells from "./types";
import { apply_field_permission } from "app/helpers/functions/apply_permissions";
import {
  checkImage,
  convertToArabic,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
export default class Row extends Component {
  render() {
    const { field, data, select, ...props } = this.props;
    const MainComponent = get(Cells, field.type, Cells.label);
    const d =
      (this.props.field?.init_data &&
        this.props.field?.init_data(get(data, select), this.props)) ||
      get(data, select);
    // console.log(field, data)
    const perm = apply_field_permission(data, field, this.props);
    // console.log(d, select)

    return (
      <td>
        {perm &&
          ((["image"].indexOf(field.type) != -1 &&
            checkImage(this.props, d, { width: "100px" })) || (
            <MainComponent
              d={convertToArabic(d)}
              row={data}
              field={{ ...field, name: select }}
              {...props}
            />
          ))}
      </td>
    );
  }
}
