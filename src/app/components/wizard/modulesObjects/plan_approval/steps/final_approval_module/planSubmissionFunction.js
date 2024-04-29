import Axios from 'axios';
import {
    queryTask_updated,
    deleteFromLandContract,
    getFeatureDomainCode,
    queryTask,
    applyEditsMultiple,
} from '../../../../../../components/inputs/fields/identify/Component/common/common_func'
import { mapUrl } from '../../../../../inputs/fields/identify/Component/mapviewer/config';
const _ = require('lodash');



export const planSubmission = function (map, values) {

    //delete corners
    return new Promise((resolve, reject) => {

        
        let editingTempSurvay = map.getLayer("Proposed_Landbase_Parcel");
        let cornerLayer = map.getLayer("Parcel_Corner");
        let boundryLayer = map.getLayer("Parcel_Boundary");
        let survayLayer = map.getLayer("Landbase_Parcel");
        let survayHistoryLayer = map.getLayer("Landbase_Parcel_H");
        let excludeAttributes = ["ARCHIVE_TIME","LANDUSE_SURVEY" ];
        let domainFields = ["DISTRICT_NAME","CITY_NAME","UNITS_NUMBER"]
        let transactionList = [];

        function deletesPrepare(layer, data) {

            let findLayerObject = transactionList.find(x => x.id == layer.layerId);
            if (findLayerObject) {
                findLayerObject.deletes = findLayerObject.deletes || [];
                findLayerObject.deletes = findLayerObject.deletes.concat(data)
            }
            else {
                transactionList.push(
                    {
                        id: layer.layerId,
                        deletes: data
                    });
            }
        }

        function omit(keys, obj) {
            keys.forEach((key) => {
                delete obj[key];
            });
            return obj;
        }

        function addsPrepare(layer, data) {

            data.map(x => x.attributes = omit(excludeAttributes, x.attributes));
            data.filter(x => x.attributes["PARCEL_LAT_COORD"])
                .map(
                    x => x.attributes["PARCEL_LAT_COORD"] = x.attributes["PARCEL_LAT_COORD"].replace('\\"', '\"'),
                    x => x.attributes["PARCEL_LONG_COORD"] = x.attributes["PARCEL_LONG_COORD"].replace('\\"', '\"')
                );

            let findLayerObject = transactionList.find(x => x.id == layer.layerId);
            if (findLayerObject) {
                findLayerObject.adds = findLayerObject.adds || [];
                findLayerObject.adds = findLayerObject.adds.concat(data.map(x => { return { attributes: x.attributes, geometry: x.geometry } }))
            }
            else {
                transactionList.push(
                    {
                        id: layer.layerId,
                        adds: data.map(x => { return { attributes: x.attributes, geometry: x.geometry } })
                    });
            }
        }
        function prepareTransactionObject() {
            getFeatureDomainCode(values.identifyParcelsToDelete.Parcels,
                survayHistoryLayer.layerId).then((oldParcelsAddedToHistoryLayer) => {

                    if (oldParcelsAddedToHistoryLayer.length > 0) {	
                        //add to Survey_Parcel_H	
                        transactionList.push(	
                            {	
                                id: survayHistoryLayer.layerId,	
                                adds: oldParcelsAddedToHistoryLayer.map(x => {	

                                    //set domains code
                                    for(var i=0 ; i < domainFields.length ;i++ )
                                    {
                                        if (isNaN(x.attributes[domainFields[i]]) || !x.attributes[domainFields[i]])	
                                            x.attributes[domainFields[i]] = values.layerParcels[0].attributes[domainFields[i]];
                                    }                            	
                                    return {	
                                        attributes: omit(excludeAttributes, x.attributes), geometry: x.geometry	
                                    }	
                                })	
                            });	
                    }

                    let parcelsCheckAddedBeforeRequests = [];
                    values.layerParcels.forEach((polygon) => {
                        parcelsCheckAddedBeforeRequests.push(
                            queryTask({
                                url: survayLayer.url,
                                where: "PARCEL_SPATIAL_ID = " + polygon.attributes.PARCEL_SPATIAL_ID +
                                    " and  PARCEL_PLAN_NO = '" + polygon.attributes.PARCEL_PLAN_NO + "'" +
                                    " and PARCEL_AREA = '" + polygon.attributes.PARCEL_AREA + "'",
                                outFields: ["OBJECTID"],
                                returnExecuteObject: true
                            })
                        );
                    });
                    let parcelPromises = window.promiseAll(parcelsCheckAddedBeforeRequests);
                    parcelPromises.then((resultsData) => {

                        //loop on polygons and add polygon that not add before
                        resultsData.forEach((result, index) => {


                            //add parcel that not added before
                            if (result.features.length == 0) {
                                //values.layerParcels[index] represent polygon 
                                
                                //add boundry
                                addsPrepare(boundryLayer, values.layerParcels[index].lines);

                                //add survay
                                addsPrepare(survayLayer, [values.layerParcels[index]]);

                                //delete from temp
                                deletesPrepare(editingTempSurvay, [values.layerParcels[index].attributes.OBJECTID]);

                            }
                        });

                        //post transaction object

                        // applyEditsMultiple(mapUrl, JSON.stringify(transactionList)).then((data) => {

                        //     deleteFromLandContract(values).then((response) => {
                        //         return response ? resolve(response) : reject(false);
                        //     });
                        // }, () => {

                        //     window.notifySystem("error", "حدث خطأ أثناء تحديث خارطة الأساس");
                        // });

                    });

                });
        }

        if (values.layerParcels.length > 0) {

            //get all parcels spatial id's and check and check if inserted before
            var whereParcels = _.map(values.layerParcels, (d) => {
                return "( PARCEL_SPATIAL_ID =" + d.attributes.PARCEL_SPATIAL_ID + " and PARCEL_PLAN_NO = '" + d.attributes.PARCEL_PLAN_NO + "'  and PARCEL_AREA = '" + d.attributes.PARCEL_AREA + "')"
            });

            //remove any rings point more than x,y like [x,y,-1,-1]
            values.layerParcels.forEach((parcel)=>{

                parcel.geometry.rings = parcel.geometry.rings.map((ring)=> ring.map((point)=>[point[0],point[1]]));
                
                delete parcel.geometry.hasM;
                delete parcel.geometry.hasZ;

                parcel.lines.forEach((line)=>{

                    line.geometry.paths = line.geometry.paths.map((path)=> path.map((point)=>[point[0],point[1]]));

                });
            });

            if (whereParcels.length > 0) {

                queryTask({
                    url: survayLayer.url, where: whereParcels.join(" or "), outFields: ["OBJECTID"],
                    callbackResult: (results) => {

                        //check if all spatial id's inserted before
                        if (results.features.length >= whereParcels.length) {
                            deleteFromLandContract(values).then((response) => {
                                return response ? resolve(response) : reject(false);
                            });
                        }
                        else {

                            //if any parcel found with spatial relation then delete all relations befor add another
                            //in split parcel to remove old parcel
                            if (values.whereContidionToDeleteCornarsBoundires.length > 0) {

                                //corners query
                                var cornersQuery = queryTask({
                                    url: cornerLayer.url,
                                    where: values.whereContidionToDeleteCornarsBoundires.join(" or "),
                                    outFields: ["OBJECTID"],
                                    returnExecuteObject: true
                                });

                                //boundry query
                                var boundryQuery = queryTask({
                                    url: boundryLayer.url,
                                    where: values.whereContidionToDeleteCornarsBoundires.join(" or "),
                                    outFields: ["OBJECTID"],
                                    returnExecuteObject: true
                                });
                                //survay query
                                var survayQuery = queryTask({
                                    url: survayLayer.url,
                                    where: values.whereContidionToDeleteCornarsBoundires.join(" or "),
                                    outFields: ["OBJECTID"],
                                    returnExecuteObject: true
                                });

                                let promises = window.promiseAll([cornersQuery, boundryQuery, survayQuery]);
                                promises.then((result) => {

                                    //add deletes to transactionList
                                    if (result[0].features.length > 0) {
                                        transactionList.push(
                                            {
                                                id: cornerLayer.layerId,
                                                deletes: result[0].features.map(x => x.attributes.OBJECTID)
                                            });
                                    }
                                    if (result[1].features.length > 0) {
                                        transactionList.push(
                                            {
                                                id: boundryLayer.layerId,
                                                deletes: result[1].features.map(x => x.attributes.OBJECTID)
                                            });
                                    }
                                    if (result[2].features.length > 0) {
                                        transactionList.push(
                                            {
                                                id: survayLayer.layerId,
                                                deletes: result[2].features.map(x => x.attributes.OBJECTID)
                                            });
                                    }

                                    prepareTransactionObject();
                                });
                            }
                            else {
                                prepareTransactionObject();

                            }
                        }
                    }
                });
            }
        }

    });

};