import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Collapsing from "./collapse";
import { get, toArray } from "lodash";
import ownersData from "app/helpers/modules/owner";
import { getDropOptions } from "../../../../../../../../inputs/fields/identify/Component/common/common_func";
class owner extends Component {
  state = {
    keys: [],
  };
  ownerProps = {
    title: "Owners",
    pTitle: "Owner",
  };
  representProps = {
    title: "Representer Data",
    pTitle: "Representer",
  };
  representDataProps = {
    title: "Represent Data",
    pTitle: "Represent",
  };
  // constructor(props){
  //     super(props);

  //     const {ownerData, representerData={}, representData} = props.mainObject.ownerData;
  //     if (!this.nationialities) {
  //         getDropOptions(`${workFlowUrl}/api/Nationalities/`, {
  //             filter_key: "nationalty_type_id",
  //             operand: "=",
  //             q: ownerData.nationalidtype_id,
  //           }).then((response) => {
  //             this.nationialities = response;
  //           })
  //     }
  //     if (!this.nationialTypes) {
  //         getDropOptions(`${workFlowUrl}/api/NatinalIdTypes`).then((response) => {
  //             this.nationialTypes = response;
  //           })
  //     }
  //
  // }

  render() {
    const {
      ownerData,
      representerData = {},
      representData,
    } = this.props.mainObject.ownerData;
    console.log(this.props, representerData, representData, ownerData);
    //
    return (
      <>
        {get(ownerData, "owners", false) && (
          <Collapsing
            owner_type={ownerData.owner_type}
            owners={toArray(ownerData.owners)}
            {...this.ownerProps}
          />
        )}
        {get(representerData, "reps", false) && (
          <>
            <Collapsing
              owners={toArray(representerData.reps)}
              {...this.representProps}
            />
            <Collapsing
              owners={[representData]}
              {...this.representDataProps}
              fields={ownersData.sections.representData.fields}
            />
          </>
        )}
      </>
    );
  }
}
export default withTranslation("labels")(owner);
