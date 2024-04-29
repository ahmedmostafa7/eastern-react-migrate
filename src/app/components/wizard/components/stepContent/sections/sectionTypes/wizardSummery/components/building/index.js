import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Collapsing from "./collapse";
import { get, toArray } from "lodash";
class owner extends Component {
  state = {
    keys: [],
  };
  BuildingProps = {
    title: "Buildings",
    pTitle: "Building",
  };

  render() {
    const { buildingData } = this.props.mainObject.building;
    // console.log(this.props)
    return (
      <>
        {get(buildingData, "buildings", false) && (
          <Collapsing
            buildings={toArray(buildingData.buildings)}
            {...this.BuildingProps}
            buildingData={buildingData}
          />
        )}
      </>
    );
  }
}
export default withTranslation("labels")(owner);
