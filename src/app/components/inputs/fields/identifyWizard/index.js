import React, { Component } from "react";
import { serverFieldMapper } from "app/helpers/functions";
import { Field } from "redux-form";
import { esriRequest } from "../identify/Component/common/esri_request";
import {
  queryTask,
  getFeatureDomainName,
  getInfo,
} from "../identify/Component/common/common_func";
import { mapUrl } from "../identify/Component/mapviewer/config/map";
import { Form } from "antd";
import "antd/dist/reset.css";
import { querySetting } from "../identify/Component/ThirdIdentifier/Helpers";
import { idtFields } from "./fields";
import RenderField from "app/components/inputs";

import { reduxForm } from "redux-form";
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
class IdentifyWizerd extends Component {
  constructor() {
    super();
    this.tableData = [];
    this.MUNS_SEC = [];
    this.districtsNames = [];
    this.floors = [];
    this.MUNICIPALITY_NAME = null;
    this.MUNICIPALITY_code = null;
    this.SUB_MUNICIPALITY_NAME = null;
    this.SUB_MUNICIPALITY_code = null;
    this.distrectname = null;
    this.distrectcode = null;
    this.LayersName = [];
    this.layersid = [];
    this.PlanNum = [];
    this.datatype = null;
    this.state = {
      fields: [],
      one: false,
      TableEle: [],
      munval: undefined,
      planeval: undefined,
      subTypeval: undefined,
      subNameval: undefined,
      subDivNames: [],
      MunicipalityNames: [],
      PlanNum: [],
    };

    this.fields = idtFields.map((f) => serverFieldMapper(f));
    getInfo().then((res) => {
      this.LayerID = res;
      esriRequest(mapUrl + "/" + this.LayerID.Municipality_Boundary).then(
        (response) => {
          console.log(response);
          this.fields[3].LayerID = this.LayerID;
          this.fields[0].data =
            response.types[0].domains.MUNICIPALITY_NAME.codedValues;
          this.fields[0].onChange = this.onMunChange;
          this.fields[2].onChange = this.onDisChange;
          this.fields[3].act = this.LayerBox;
          this.fields[4].addResultTotable = this.addResultTotable;

          // this.fields[4].qw=this.state.TableEle
          // this.fields[3].options = this.plainOptions
          this.setState({
            fields: this.fields,
            MunicipalityNames:
              response.types[0].domains.MUNICIPALITY_NAME.codedValues,
          });

          //this.setState({ MunicipalityNames: response.types[0].domains.MUNICIPALITY_NAME.codedValues })
        }
      );
    });
  }
  addResultTotable = () => {
    const floors = localStorage.getItem("floors");

    this.tableData = this.tableData || [];
    this.tableData.push({
      mun: this.MUNICIPALITY_NAME,
      sub_mun: this.subMun || "",
      district: this.distrectname || "",
      floors: floors,
    });

    this.fields[4].data2 = [...this.tableData];

    const { change } = this.props;
    change("identify.tableAdd", [...this.tableData]);
    console.log("this", change);
    this.setState({ fields: this.fields });
  };
  Del = (index) => {
    let b = this.state.TableEle.filter((e, i) => i !== index);
    this.setState({ TableEle: b });
    this.fields[4].del = b;
    this.setState({ fields: this.fields });
  };

  componentDidMount() {
    getInfo().then((res) => {
      this.LayerID = res;
      this.fields[3].LayerID = this.LayerID;
      // this.setState({ fields: this.fields })
      esriRequest(mapUrl + "/" + this.LayerID.Municipality_Boundary).then(
        (response) => {
          console.log(response);
          this.setState({
            MunicipalityNames:
              response.types[0].domains.MUNICIPALITY_NAME.codedValues,
          });
        }
      );
    });
    localStorage.clear();
  }

  onMunChange = (e) => {
    this.SUB_MUNICIPALITY_NAME = null;
    this.SUB_MUNICIPALITY_code = null;
    this.distrectname = null;
    this.distrectcode = null;
    this.MUNICIPALITY_code = e;
    this.MUNICIPALITY_NAME = this.state.MunicipalityNames?.find(
      (m) => m.code == e
    ).name;

    esriRequest(mapUrl + "/" + this.LayerID.Sub_Municipality_Boundary).then(
      (response) => {
        let subtypes = response.types.find((ele) => ele.id === e).domains
          .SUB_MUNICIPALITY_NAME.codedValues;
        this.fields[1].data = subtypes;
        this.fields[1].onChange = this.onSubNameChange;
        this.MUNS_SEC = subtypes;

        this.setState({ fields: this.fields });
      }
    );
    queryTask({
      returnDistinctValues: true,
      ...querySetting(
        this.LayerID.Landbase_Parcel,
        `MUNICIPALITY_NAME="${e}"`,
        false,
        ["DISTRICT_NAME"]
      ),
      callbackResult: (res) => {
        getFeatureDomainName(res.features, this.LayerID.Landbase_Parcel).then(
          () => {
            this.setState({ fields: this.fields });
          }
        );
      },
    });
  };

  LayerBox = (e) => {
    const { change } = this.props;
    change("checks", e);
    this.LayersName = e;
    this.floors = e;
    this.layersid = e.map((h) => this.LayerID[layerAlias[h]]);
  };

  DataTypeChange = (e) => {
    this.datatype = e;
  };
  onSubNameChange = (e) => {
    this.subMun = this.MUNS_SEC.find((d) => d.code == e).name;
    queryTask({
      returnDistinctValues: true,
      ...querySetting(
        this.LayerID.Landbase_Parcel,
        `SUB_MUNICIPALITY_NAME="${e}"`,
        false,
        ["DISTRICT_NAME"]
      ),
      callbackResult: (res) => {
        getFeatureDomainName(res.features, this.LayerID.Landbase_Parcel).then(
          (result) => {
            this.fields[2].data = result;
            this.districtsNames = result;
            this.fields[2].onChange = this.onDistrictChange;
            // this.distrectname=result

            this.setState({ fields: this.fields });
          }
        );
      },
    });
  };
  onDistrictChange = (e) => {
    this.distrectname = this.districtsNames.find(
      (d) => d.attributes.DISTRICT_NAME_Code == e
    ).attributes.DISTRICT_NAME;
    //  let dis = this.fields[2].data.find(m => m.code == e).name
    //  this.distrectname=names.DISTRICT_NAME
  };

  render() {
    const { fields } = this.state;
    console.log(fields);
    return (
      <Form>
        {fields &&
          fields.map((field) => {
            console.log("field", field);
            return (
              <Field
                key={field.name}
                name={field.name}
                component={RenderField}
                {...field}
              ></Field>
            );
          })}
      </Form>
    );
  }
}
export default IdentifyWizerd;
