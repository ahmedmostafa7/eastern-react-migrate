import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Collapsing from "./collapse";
import { get, toArray, isEqual } from "lodash";
import axios from "axios";

class owner extends Component {
  state = {
    keys: [],
  };
  sakProps = {
    title: "Saks",
    pTitle: "Sak",
  };

  componentDidMount() {
    const { mainObject } = this.props;
    const { sakData } = this.props.mainObject.sakData;

    //data.image[0] = window.filesHost + `${data.image[0]}`;
    var ownerData =
      mainObject.ownerData &&
      mainObject.ownerData.ownerData.owners[
        Object.keys(mainObject.ownerData.ownerData.owners)[0]
      ];

    Object.values(sakData.saks).forEach((sak, index) => {
      if (
        sak.sakValid == undefined ||
        sak.sakValid == null ||
        sak.sakValid == ""
      ) {
        axios
          .get(window.host + "/api/contracts/IsVarifiedContract", {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.token}`,
            },
            params: {
              id:
                ownerData.ssn ||
                ownerData.commercial_registeration ||
                ownerData.code_regesteration,
              contractDate: sak.date.split("/").join("-"),
              contractNo: sak.number,
            },
          })
          .then(
            (res) => {
              sak.sakValid = res.data;
              this.setState({});
            },
            (res) => {
              sak.sakValid = "لم يتم التأكد من سريان الصك";
              this.setState({});
            }
          );
      }
    });
  }

  render() {
    const { sakData } = this.props.mainObject.sakData;
    console.log("sakData", sakData);

    return (
      <>
        {get(sakData, "saks", false) ? (
          <Collapsing
            sakData={sakData}
            saks={toArray(sakData.saks)}
            {...this.sakProps}
          />
        ) : (
          "لا يوجد صكوك"
        )}
      </>
    );
  }
}
export default withTranslation("labels")(owner);
