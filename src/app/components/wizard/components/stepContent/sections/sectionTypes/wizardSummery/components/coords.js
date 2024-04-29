import React, { Component } from 'react'
import {backEndUrlforMap} from 'imports/config';
import { workFlowUrl } from '../../../../../../../../../imports/config';

export default class identify extends Component {
    
    render() {
        
        
        this.props.mainObject.landData = this.props.mainObject.LandWithCoordinate
        console.log(this.props.mainObject.landData);
        const{parcels,conditions}= this.props.mainObject.landData.landData.lands
        
        return (
            <div>
                {this.props.mainObject.landData.landData.parcelImage && <img src={ workFlowUrl +"/"+ this.props.mainObject.landData.landData.parcelImage[0]} style={{width:'30%'}}/>}
               
                <h1 className="titleSelectedParcel">الأراضي المختارة</h1>
                <table className="table table-bordered" style={{ marginTop: '1%' }}>
                    <thead>
                      <tr>
                        <th>أسم البلدية</th>
                        {!parcels[0].attributes.PARCEL_SPATIAL_ID &&<th>وصف قطعة الأرض</th> }
                        {parcels[0].attributes.PARCEL_SPATIAL_ID&& <th>رقم قطعة الأرض</th>}
                        <th>المساحه م2</th>
                        {parcels[0].attributes.PARCEL_SPATIAL_ID &&<th>رقم البلك</th>}
                        {parcels[0].attributes.PARCEL_SPATIAL_ID &&<th>الحي</th>}
                        {parcels[0].attributes.PARCEL_SPATIAL_ID &&<th>نوع التقسيم</th>}
                        {parcels[0].attributes.PARCEL_SPATIAL_ID &&<th>اسم التقسيم</th>}
                        {parcels[0].attributes.PARCEL_SPATIAL_ID &&<th>رمز الاستخدام</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {parcels.map((e, i) => {
                        return (
                          <tr key={i}>
                            <td>{e.attributes.MUNICIPALITY_NAME}</td>
                            <td>{e.attributes.PARCEL_PLAN_NO}</td>
                            <td>{e.attributes.PARCEL_AREA}</td>
                            {parcels[0].attributes.PARCEL_SPATIAL_ID &&<td>{e.attributes.PARCEL_BLOCK_NO || 'غير متوفر'}</td>}
                            {parcels[0].attributes.PARCEL_SPATIAL_ID &&<td>{e.attributes.DISTRICT_NAME || 'غير متوفر'}</td>}
                            {parcels[0].attributes.PARCEL_SPATIAL_ID &&<td>{e.attributes.SUBDIVISION_TYPE || 'غير متوفر'}</td>}
                            {parcels[0].attributes.PARCEL_SPATIAL_ID &&<td>{e.attributes.SUBDIVISION_DESCRIPTION || 'غير متوفر'}</td>}
                            {parcels[0].attributes.PARCEL_SPATIAL_ID &&<td>{e.attributes.USING_SYMBOL || 'غير متوفر'}</td>}

                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {false && conditions &&<div> <h1 className="titleSelectedParcel">الاشتراطات</h1>

                  <table className="table table-bordered" style={{marginTop:'1%'}}>
                    <thead>
                      <tr>
                        <th>مساحة القسيمة (م2)</th>
                        <th>الحد الأدنى للواجهة (م)</th>
                        <th>نسبة البناء</th>
                        <th>إرتداد الواجهة (م)</th>
                        <th>ارتداد الجوانب (م)</th>
                        <th>ارتداد خلفي (م)</th>
                        <th>عدد الطوابق (م)</th>
                        <th>ارتفاع الطابق (م)</th>
                        <th>معامل كتلة البناء FAR</th>
                        <th>يمكن اضافة دور</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conditions.map((e, i) => {
                        return (
                          <tr key={i}>
                            <td>{e.attributes.SLIDE_AREA}</td>
                            <td>{e.attributes.MIN_FROT_OFFSET}</td>
                            <td>{e.attributes.BUILDING_RATIO}</td>
                            <td>{e.attributes.FRONT_OFFSET}</td>
                            <td>{e.attributes.SIDE_OFFSET}</td>
                            <td>{e.attributes.BACK_OFFSET}</td>
                            <td>{e.attributes.FLOORS}</td>
                            <td>{e.attributes.FLOOR_HEIGHT}</td>
                            <td>{e.attributes.FAR}</td>
                            <td>{e.attributes.ADD_FLOOR}</td>

                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  </div>
                  }
                  {this.props.mainObject.landData.submission_data && <div>
                   <h1 className="titleSelectedParcel">بيانات الموقع</h1>

                       <table className="table table-bordered" style={{marginTop:'1%'}}>
                        <tbody>
                            <tr>
                                <td>
                                    وصف الحد الشمالي
                                </td>
                                <td>
                                    {this.props.mainObject.landData.submission_data.north_desc}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    طول الحد الشمالي ( م )
                                </td>
                                <td>
                                    {this.props.mainObject.landData.submission_data.north_length}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    وصف الحد الجنوبي
                                </td>
                                <td>
                                    {this.props.mainObject.landData.submission_data.south_desc}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    طول الحد الجنوبي ( م )
                                </td>
                                <td>
                                    {this.props.mainObject.landData.submission_data.south_length}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    وصف الحد الشرقي
                                </td>
                                <td>
                                    {this.props.mainObject.landData.submission_data.east_desc}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    طول الحد الشرقي ( م )
                                </td>
                                <td>
                                    {this.props.mainObject.landData.submission_data.east_length}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    وصف الحد الغربي
                                </td>
                                <td>
                                    {this.props.mainObject.landData.submission_data.west_desc}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    طول الحد الغربي ( م )
                                </td>
                                <td>
                                    {this.props.mainObject.landData.submission_data.west_length}
                                </td>
                            </tr>
                        </tbody>
                      </table>
                  </div>}
            </div>
        )
    }
}
