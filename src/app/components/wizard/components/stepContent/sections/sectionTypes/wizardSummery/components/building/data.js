import React, { Component } from "react";
// import {FloorFields} from 'app/helpers/modules/fields'
import { collapseField } from "app/helpers/modules/imp_project/building";
import { get, map, omit, flatMap, range } from "lodash";
import { withTranslation } from "react-i18next";
import ShowField from "app/helpers/components/show";
import Floor from "./floor";
import { convertToArabic } from "../../../../../../../../inputs/fields/identify/Component/common/common_func";
class showData extends Component {
  constructor(props) {
    super(props);
    this.fields = omit(collapseField, ["floors", "add_floor"]);
    this.floors = flatMap(props.data.floors, (d) =>
      range(0, d.repeat).map((v) => ({
        ...d,
        main_id: `${d.main_id}.${v}`,
        type: props.t(d.type) + (d.repeat > 1 ? ` ${v + 1}` : ""),
      }))
    );
  }
  renderInfo = (field, key) => {
    const { data } = this.props;
    return (
      <ShowField
        field={field}
        val={convertToArabic(get(data, key))}
        key={key}
      />
    );
  };
  renderFloor = () => {
    return (
      <Floor
        r_build={this.props.r_build}
        data={this.floors}
        repeat={Number(this.props.data.repeat || 1)}
      />
    );
  };
  render() {
    return (
      <>
        {map(this.fields, this.renderInfo)}
        {this.renderFloor()}
      </>
    );
  }
}

export default withTranslation("labels")(showData);
