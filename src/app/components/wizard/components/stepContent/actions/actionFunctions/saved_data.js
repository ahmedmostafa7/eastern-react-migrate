import {cloneDeep, filter, get, toArray} from 'lodash'
export const owner_data = (mainObject, submission)=>{
    if(get(mainObject, 'ownerData')){
        var temp = toArray(cloneDeep(mainObject.ownerData.ownerData.owners));
        //submission.representer = mainObject.ownerData.representer;
        if (mainObject.ownerData.ownerData.has_representer) {
            mainObject.ownerData.representerData.reps[0].IsRepresenter = true;
            mainObject.ownerData.representerData.reps[0].owner_representative = [{
                issue_date: mainObject.ownerData.representData.sak_date,
                issuer_Id: get(mainObject.ownerData, 'issuerData.id'),
                image: mainObject.ownerData.representData.image,
            }];
            temp.push(cloneDeep(mainObject.ownerData.representerData.reps[0]));
        }
        // add owner for special sector for corboration
        var get_owners = filter(mainObject.ownerData.ownerData.owners, {type: '3'});
    
        if (get_owners.length > 0) {
            var get_corp_owners = filter(get_owners, {'subtype':"2"});
            if (get_corp_owners.length > 0) {
                get_corp_owners.forEach(function(corp) {
                    if (corp.owners) {
                        if (corp.owners.length > 0) {
                            temp.push(corp.owners[0]);
                        }
                    }
                });
            }
        }
        submission.savedData = submission.savedData || {};
        submission.savedData.owner = temp;
    }
    return submission
}