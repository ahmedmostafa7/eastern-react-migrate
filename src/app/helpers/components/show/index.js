import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import applyFilters from "main_helpers/functions/filters";
import Show from "./show";
class ShowField extends Component {
  componentDidMount() {
    const { values } = this.props;
    // console.log(values["image"].includes("gisapi"))
    // values.filter()
  }
  render() {
    const { field, t, values, val } = this.props;
    let label = field.label;
    console.log("d", this.props);
    if (!val) {
      // values["image"]=values["image"].replace("gisapi","")
    }
    if (field.label_fun && !field.label) {
      label = field.label_fun(this.props);
    }

    // console.log(this.props.values["image"]);
    // console.log(FComponent, field.field, field);
    label = field.label_state
      ? applyFilters({
          path: field.label_state,
        })
      : label;

    // if (field.init_data) {
    //   field.init_data(this.props);
    // }

    return (
      <div className="uu">
        {(!field.hideLabel && (
          <div className="table-div">
            <div>
              <label style={{ whiteSpace: "nowrap" }}>{t(label)}</label>
            </div>

            <div>
              <Show {...this.props} />
            </div>
          </div>
        )) || (
          <div>
            <Show {...this.props} />
          </div>
        )}
      </div>
    );
  }
}

export default withTranslation("labels")(ShowField);
