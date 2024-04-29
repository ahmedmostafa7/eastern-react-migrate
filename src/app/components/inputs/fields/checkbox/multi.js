import React from "react";
import { Checkbox } from "antd";
import mainInput from "app/helpers/main/input";
const CheckboxGroup = Checkbox.Group;

const plainOptions = [
  "حدود البلديه",
  "حدود البلدية الفرعية",
  "حدود التقسيم",
  "حدود المخططات",
  "حدود االحياء",
  "حدود البلكات",
  "الراضي",
  "الشوارع",
];
const layerAlias = {
  "حدود البلديه": "Municipality_Boundary",
  "حدود البلدية الفرعية": "Sub_Municipality_Boundary",
  "حدود التقسيم": "Subdivision",
  "حدود المخططات": "Plan_Data",
  "حدود االحياء": "District_Boundary",
  "حدود البلكات": "Survey_Block",
  الراضي: "Landbase_Parcel",
  الشوارع: "Street_Naming",
};
export default class multiChecks extends mainInput {
  state = {
    checkedList: [],
    indeterminate: true,
    checkAll: false,
  };

  LayerBox = (e, options) => {
    const {
      LayerID,
      input: { onChange },
    } = this.props;
    //
    if (options) {
      this.LayersName = e;
      this.layersid = e.map((h) => LayerID[layerAlias[h]]);
      // apply on Change By Value
      onChange(e);
      localStorage.setItem("floors", e);
    } else {
      onChange(e);
    }
  };
  handleChange(value) {
    const {
      input: { onChange },
    } = this.props;
    onChange(value);
  }
  render() {
    const {
      input: { value, ...input },
      type,
      options,
      className,
      act,
    } = this.props;
    console.log(options);
    return (
      <div>
        {/* <Checkbox.Group {...input} type={type} value={value} onChange={this.handleChange.bind(this)} options={options} {...{className}}/> */}
        {/* <Checkbox.Group
        options={options}
        {...input}
        value={value}
       
      />  */}
        <CheckboxGroup
          options={options || plainOptions}
          onChange={options.length > 0 ? this.LayerBox(options) : this.LayerBox}
        />
      </div>
    );
  }
}
