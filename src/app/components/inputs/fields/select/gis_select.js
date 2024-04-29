import React, { Component } from "react";
import { serverFieldMapper } from "app/helpers/functions";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { esriRequest } from "../identify/Component/common/esri_request";
import {
  queryTask,
  getFeatureDomainName,
  getInfo,
} from "../identify/Component/common/common_func";
import { mapUrl } from "../identify/Component/mapviewer/config/map";
import { Select, Button, Checkbox, Form } from "antd";
import "antd/dist/reset.css";
import { querySetting } from "../identify/Component/ThirdIdentifier/Helpers";
import { loadModules } from "esri-loader";
// import SelectGis from './select';
// import SelectGis2 from './select2';
// import SelectGis3 from './select3';
import ThirdIdentifier from "../identify/Component/ThirdIdentifier";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
const { Option } = Select;
// import {aaa}from './gis_fields'
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

const CheckboxGroup = Checkbox.Group;
class IdentifyWizerd extends Component {
  constructor() {
    super();
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
      TableEle: [],
      munval: undefined,
      planeval: undefined,
      subTypeval: undefined,
      subNameval: undefined,
      subDivNames: [],
      muns: false,
      MunicipalityNames: [],
      PlanNum: [],
    };
  }
  Del = (index) => {
    let a = this.state.TableEle.filter((e, i) => i !== index);
    this.setState({ TableEle: a });
  };
  AddRequest = () => {
    let a = this.state.TableEle.concat({
      munic: this.MUNICIPALITY_NAME,
      municCode: this.MUNICIPALITY_code,
      sub: this.SUB_MUNICIPALITY_NAME,
      subCode: this.SUB_MUNICIPALITY_code,
      distrect: this.distrectname,
      distrectCode: this.distrectcode,
      Layers: this.LayersName.join("-"),
      LayersId: this.layersid,
    });
    this.setState({ TableEle: a });
    console.log(this.TableEle);
  };
  componentDidMount() {
    //  const {setData}=this.props
    getInfo().then((res) => {
      this.LayerID = res;
      esriRequest(mapUrl + "/" + this.LayerID.Municipality_Boundary).then(
        (response) => {
          console.log(response);
          this.setState({
            MunicipalityNames:
              response.types[0].domains.MUNICIPALITY_NAME.codedValues,
            muns: true,
          });
          // setData(this.state.MunicipalityNames)
        }
      );
    });
  }

  onMunChange = (e) => {
    this.setState({
      munval: e,

      planeval: undefined,
      subNameval: undefined,
      PlanNum: [],
      planId: null,
      subDivNames: [],
    });
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
        this.setState({ PlanNum: subtypes, secondry_muns: true });
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
          (result) => {
            this.setState({ subDivNames: result, districts: true });
          }
        );
      },
    });
  };
  LayerBox = (e) => {
    this.LayersName = e;
    this.layersid = e.map((h) => this.LayerID[layerAlias[h]]);

    console.log(e);
  };

  onPlaneChange = (f) => {
    this.setState({
      planeval: f,
      subTypeval: undefined,
      subNameval: undefined,
      subDivNames: [],
    });

    this.distrectname = null;
    this.distrectcode = null;
    this.SUB_MUNICIPALITY_NAME = this.state.PlanNum.find(
      (m) => m.code == f
    ).name;
    this.SUB_MUNICIPALITY_code = f;
    queryTask({
      returnDistinctValues: true,
      ...querySetting(
        this.LayerID.Landbase_Parcel,
        `SUB_MUNICIPALITY_NAME="${f}"`,
        false,
        ["DISTRICT_NAME"]
      ),
      callbackResult: (res) => {
        getFeatureDomainName(res.features, this.LayerID.Landbase_Parcel).then(
          (result) => {
            this.setState({ subDivNames: result });
          }
        );
      },
    });
  };
  DataTypeChange = (e) => {
    this.datatype = e;
  };
  onSubNameChange = (e) => {
    this.setState({ subNameval: e });
    this.distrectcode = e;
    this.distrectname = this.state.subDivNames.find(
      (m) => m.attributes.DISTRICT_NAME_Code == e
    ).attributes.DISTRICT_NAME;
  };
  ssss(values) {
    console.log("ddu", values);
  }
  handleChange(value, options) {
    const {
      input: { onChange },
      resetFields,
      change,
    } = this.props;
    resetFields && resetFields.map((f) => change(f, ""));
    let newVal = value ? value : "";
    onChange(newVal);
  }
  render() {
    const {
      input: { value, ...input },
      handleSubmit,
      showArrow,
      selectors,
      showSearch = false,
      label,
      placeholder,
      data = [],
      label_key = "label",
      value_key = "value",
      t,
      disabled,
      ux_pattern,
    } = this.props;
    console.log(this.props);
    let districts =
      this.state.subDivNames &&
      this.state.subDivNames.filter((e) => e.attributes.DISTRICT_NAME);
    const { muns, MunicipalityNames, PlanNum, secondry_muns, district } =
      this.state;
    return (
      <div>
        <Form style={{ direction: "rtl" }}>
          <div className="wizard_identify">
            <label>البلدية</label>
            <Field
              value={this.state.munval}
              name="muns"
              component={SelectGis}
              data={muns ? MunicipalityNames : []}
              chang={this.onMunChange}
            />
            <label>البلدية الفرعية</label>
            <Field
              name="secondry_muns"
              value={this.state.planeval}
              component={SelectGis2}
              data={secondry_muns ? PlanNum : []}
              chang={this.onPlaneChange}
            />
            {/* <label>الحى</label> 
                        <Field value={this.state.subNameval} name="district" component={SelectGis3} data={district ? districts : []} chang={this.onSubNameChange} />  */}
          </div>
          {/* <Select                   getPopupContainer={trigger => trigger.parentNode}

           autoFocus
           onChange={this.onMunChange}
           showSearch
           value={this.state.munval}
           style={{ width: 200 }}
           placeholder="اختر اسم البلديه"
           disabled={!this.state.MunicipalityNames?.length}
           optionFilterProp="children"
           filterOption={(input, option) =>{
             
             if(option.props.children){
               return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }else{
                return false
              }
            }
          }
          >
           {this.state.MunicipalityNames?.map(e=><Option  key={e.code} value={e.code}>{e.name}</Option>)}
           </Select> */}
          {/* <div className="wizard_identify">
          <label>البلدية الفرعيه</label>
             <Select                   getPopupContainer={trigger => trigger.parentNode}

                onChange={this.onPlaneChange}
                showSearch
                autoFocus
                disabled={!this.state.PlanNum.length}
                optionFilterProp="children"
                filterOption={(input, option) =>{
                  if(option.props.children){
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }else{
                    return false
                  }
                }
              }
              
              style={{ width: 200 }}
              value={this.state.planeval}
              placeholder="البلدية الفرعية "
              notFoundContent="not found"
              >
                 {this.state.PlanNum.map((d,i)=>{
                   return( <Option key={i}  value={d.code}>{d.name}</Option>)
                  })}
             </Select>
             </div>

        <div className="wizard_identify">
          <label>الحى</label>
             <Select                   getPopupContainer={trigger => trigger.parentNode}

                onChange={this.onSubNameChange}
                showSearch
                disabled={!this.state.subDivNames.length}
                style={{ width: 200 }}
                placeholder="اسم الحى"
                value={this.state.subNameval}
                optionFilterProp="children"
                filterOption={(input, option)=>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                >
                 {this.state.subDivNames.filter(e=>e.attributes.DISTRICT_NAME).map((e,i)=><Option key={i} value={e.attributes.DISTRICT_NAME_Code}>{e.attributes.DISTRICT_NAME}</Option>)}
             </Select>               
               </div> */}

          {/* <CheckboxGroup
          options={plainOptions}
          onChange={this.LayerBox}
          />

        < Button type="primary" onClick={this.AddRequest} disabled={!this.MUNICIPALITY_NAME&&!this.LayersName.length>0}>أضافة الارض</Button>

        {this.state.TableEle.length>0&&<table className="table table-bordered" style={{width:'40vw'}}>
        <thead>
            <tr>
                <th>الرقم</th>
                <th> البلديه</th>
                <th>البلديه الفرعيه </th>
                <th>الحى </th>
                <th>الطبقات </th>
            </tr>
        </thead>
        <tbody>

            {this.state.TableEle.map((e,i)=>{
              console.log(this.state.selectedParcels)
              return(
                <tr key={i}>
               <th>{i+1}</th>
               <td>{e.munic}</td>
               <td>{e.sub}</td>
               <td>{e.distrect}</td>
               <td>{e.Layers}</td>
               <td><Button  type="danger" onClick={()=>{this.Del(i)}}>مسح</Button></td>
            </tr>

)})}
        </tbody>
    </table>}
    <div>

  <label>نوع البيانات</label>
    <div>
    
             <Select                   getPopupContainer={trigger => trigger.parentNode}

                onChange={this.DataTypeChange}
                style={{ width: 200 }}
                placeholder="نوع البيانات"
                optionFilterProp="children"
                filterOption={(input, option)=>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                >
                 <Option value={0}>Shape File</Option>
                 <Option value={1}>CAD File</Option>
                 <Option value={2}>KML File</Option>
             </Select>               
               </div>
                </div> */}
          {/* <Button className="login-button" onClick={handleSubmit(this.ssss.bind(this))}  type='primary'>{t("Sign in")}</Button> */}
        </Form>
      </div>
    );
  }
}
export default reduxForm({
  form: "identify", // a unique identifier for this form
})(IdentifyWizerd);
