import axios from "axios";
import { host } from "imports/config";

export const CalculateFees = (props) => {
  return new Promise((resolve, reject) => {
    const { mainObject } = props;
    ////
    //if (!mainObject["fees"]) {
    //return resolve(1000);
    let totalOfExcludedAreas =
      mainObject?.plans?.plansData?.planDetails?.statisticsParcels
        ?.filter(function (x) {
          return x.is_notfees == 1;
        })
        ?.reduce((a, b) => {
          return a + +b.area;
        }, 0) || 0;

    var totalArea =
      (mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels[0].area *
        (100 -
          +mainObject.plans.plansData.planDetails.statisticsParcels
            .find(function (x) {
              return x.name == "النسب التخطيطية";
            })
            .areaPercentage.toFixed(2))) /
      100;

    axios
      .get(`${host}/submission/CalculateFees`, {
        params: {
          municipality_id: mainObject.landData.landData.municipality.code,
          totalarea: totalArea - totalOfExcludedAreas,
        },
      })
      .then(function (res) {
        return resolve(res.data);
      });
  });
};

export const CalculateTotalFees = (
  values,
  isIncreasePercentageIncluded = true
) => {
  if (values?.feesValue) {
    let total =
      values?.feesList?.reduce((a, b) => {
        a = a + b.fees;
        return a;
      }, 0) || 0;

    //if (values.increasePercentage) {

    total =
      total +
      (!values?.feesList?.length
        ? +values?.feesValue?.toString().match(/(\d+)/)?.[0]
        : 0) +
      ((isIncreasePercentageIncluded && CalculateIncreasePercentage(values)) ||
        0);
    //}

    return total; // - values?.feesValue;
  } else {
    return 0;
  }
};

export const CalculateIncreasePercentage = (values) => {
  if (values?.feesValue) {
    let total =
      +values.feesValue?.toString().match(/(\d+)/)?.[0] *
      ((+values.increasePercentage || 0) / 100);
    return total;
  } else {
    return 0;
  }
};

export const retrieveFeesInfo = (data, record) => {
  if (
    !data.fees &&
    ((record?.invoice_number && !record?.submission_invoices?.length) ||
      record?.submission_invoices?.length)
  ) {
    data.fees = {
      feesInfo: {},
    };
  }
  if (record?.invoice_number && !record?.submission_invoices?.length) {
    if (record.is_paid) {
      data.fees.feesInfo.feesValue = record?.fees;
      data.fees.feesInfo.invoice_date = record?.invoice_date;
      data.fees.feesInfo.invoice_number = record?.invoice_number;
      data.fees.feesInfo.is_paid = 1;
    } else {
      data.fees.feesInfo.feesValue = record?.fees;
      data.fees.feesInfo.is_paid = 0;
    }
  } else if (record?.submission_invoices?.length) {
    data.fees.feesInfo.feesValue =
      data.fees?.feesInfo?.feesValue || record?.fees;
    data.fees.feesInfo.invoice_date =
      data.fees?.feesInfo?.invoice_date || record?.invoice_date;
    data.fees.feesInfo.feesList = record?.submission_invoices?.map(
      (invoice) => ({
        ...invoice,
      })
    );
    data.fees.feesInfo.is_paid =
      (record?.submission_invoices?.filter(
        (invoice) => invoice?.is_paid == true
      )?.length == record?.submission_invoices?.length &&
        1) ||
      0;
  }
};
