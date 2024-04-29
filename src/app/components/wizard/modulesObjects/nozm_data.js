// import locationDataService from 'app/helpers/modules/nozm_data/location_services';
// import requestPerson from 'app/helpers/modules/nozm_data/request';
import ownerData from "app/helpers/modules/owner";
import Land from "app/helpers/modules/land";
export const IMP_PROJECT_CREATE = {
  name: "project_create_submission",
  module_id: 56,
  steps: {
    ownerData: { ...ownerData },
    identify_parcel: { ...Land },
    // locationDataService: { ...locationDataService },
    // requestPerson: { ...requestPerson },
  },
};
