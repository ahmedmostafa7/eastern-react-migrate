import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { get, mapValues, groupBy, sumBy } from "lodash";
import ShowField from "app/helpers/components/show";

const floorFields = {
  field: "list",
  fields: {
    type: {
      head: "Floor Type",
    },
    area: {
      head: "Area",
    },
    trade_num: {
      head: "Trade Number",
    },
    trade_area: {
      head: "Trade Area",
    },
    house_num: {
      head: "House Number",
    },
    house_area: {
      head: "House Area",
    },
    mange_num: {
      head: "Manage Number",
    },
    mange_area: {
      head: "Manage Area",
    },
  },
};
class floor extends Component {
  constructor(props) {
    super(props);
    this.data = props.data
      .map((floor) => {
        const r_build = Number(props.r_build || floor.r_build);
        const grouping = mapValues(
          groupBy(
            mapValues(floor.flats, (d) => ({
              ...d,
              flat_area: Number(d.flat_area),
            })),
            "flat_use"
          ),
          (d) => ({
            area: r_build * sumBy(d, "flat_area"),
            number: d.length,
          })
        );
        console.log("here", props.r_build, floor.r_build);
        return {
          type: floor.type,
          area: floor.area,
          id: floor.main_id,
          trade_num: r_build * get(grouping, "Trade.number", 0) || null,
          trade_area: get(grouping, "Trade.area", 0) || null,
          house_num: r_build * get(grouping, "House.number", 0) || null,
          house_area: get(grouping, "House.area", 0) || null,
          mange_num: r_build * get(grouping, "Manage.number", 0) || null,
          mange_area: get(grouping, "Manage.area", 0) || null,
        };
      })
      .reduce((o, d) => ({ ...o, [d.id]: d }), {});
  }
  render() {
    console.log(this.data);
    return <ShowField field={floorFields} val={this.data} />;
  }
}

export default withTranslation("labels")(floor);
