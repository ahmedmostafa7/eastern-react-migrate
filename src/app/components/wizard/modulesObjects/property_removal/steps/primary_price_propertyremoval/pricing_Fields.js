import applyFilters from "main_helpers/functions/filters";
export const pricingFields = {
  parcel_plan_no: {
    field: "multiSelect",
    moduleName: "parcel_plan_no",
    label: "رقم القطعة",
    placeholder: "من فضلك اختر رقم القطعة",
    label_key: "PARCEL_PLAN_NO",
    value_key: "PARCEL_PLAN_NO",
    init: (props) => {
      const formValues = applyFilters({
        key: "FormValues",
        form: "stepForm",
      });
      
      let parcels =
        props.mainObject?.landData?.landData?.lands?.parcels?.filter(
          (r) =>
            !formValues?.primary_pricing?.pricing_table?.filter(
              (e) => e.parcel_no == r.attributes.PARCEL_PLAN_NO
            )?.length
        );
      props.setSelector(
        "parcel_plan_no.data",
        parcels.map((r) => r.attributes)
      );
    },
    required: true,
    //     selectChange: (val, rec, props) => {
    //       // props.change("primary_pricing.PARCEL_AREA", rec.PARCEL_AREA);
    //         const formValues = applyFilters({
    //           key: "FormValues",
    //           form: "Create",
    //         });
    //       //   
    //       //   let parcel_prices =
    //       //     formValues?.primary_pricing?.parcels_prices?.find(
    //       //       (r) =>
    //       //         r.parcel_plan_no ==
    //       //         formValues?.primary_pricing?.parcel_plan_no
    //       //     );
    //       //   if (parcel_prices) {
    //       //     
    //       //     props.change(
    //       //       "primary_pricing.parcel_area",
    //       //       parcel_prices.parcel_area
    //       //     );
    //       //     props.change(
    //       //       "primary_pricing.parcel_meter_price",
    //       //       parcel_prices.parcel_meter_price
    //       //     );
    //       //     props.change(
    //       //       "primary_pricing.total_parcel_price",
    //       //       parcel_prices.parcel_area * parcel_prices.parcel_meter_price
    //       //     );

    //       //     props.change(
    //       //       "primary_pricing.parcel_cut_area",
    //       //       parcel_prices.parcel_cut_area
    //       //     );
    //       //     // props.change(
    //       //     //   "primary_pricing.parcel_cut_meter_price",
    //       //     //   parcel_prices.parcel_cut_meter_price
    //       //     // );
    //       //     props.change(
    //       //       "primary_pricing.total_parcel_cut_price",
    //       //       parcel_prices.parcel_cut_area * parcel_prices.parcel_meter_price
    //       //     );
    //       //   } else {
    //     //   props.change("parcel_area", rec.PARCEL_AREA);
    //     //   props.change("total_parcel_price", 0);
    //     //   props.change("parcel_cut_area", rec.PARCEL_CUT_AREA);
    //     //   props.change("total_parcel_cut_price", 0);
    //     //   props.change("parcel_meter_price", "");
    //       //props.change("primary_pricing.parcel_cut_meter_price", "");

    //       //     formValues.primary_pricing.parcels_prices = [
    //       //       ...(formValues?.primary_pricing?.parcels_prices || []),
    //       //       {
    //       //         parcel_plan_no: val,
    //       //         parcel_area: rec.PARCEL_AREA,
    //       //         parcel_cut_area: rec.PARCEL_CUT_AREA,
    //       //         parcel_meter_price: "",
    //       //         // parcel_cut_meter_price: "",
    //       //         total_parcel_price: 0,
    //       //         total_parcel_cut_price: 0,
    //       //       },
    //       //     ];
    //       //     props.change(
    //       //       "primary_pricing.parcels_prices",
    //       //       formValues?.primary_pricing?.parcels_prices
    //       //     );
    //       //   }

    //       //   props.change(
    //       //     "primary_pricing.total_of_totals_of_cut_areas",
    //       //     formValues?.primary_pricing?.parcels_prices.reduce(
    //       //       (a, b) => a + +b.parcel_cut_area,
    //       //       0
    //       //     )
    //       //   );
    //       //   props.change(
    //       //     "primary_pricing.total_of_totals_of_cut_prices",
    //       //     formValues?.primary_pricing?.parcels_prices.reduce(
    //       //       (a, b) => a + +b.total_parcel_cut_price,
    //       //       0
    //       //     )
    //       //   );
    //     },
  },
  //   parcel_area: {
  //     moduleName: "parcel_area",
  //     label: "مساحة القطعة",
  //     required: true,
  //     field: "text",
  //     disabled: true,
  //   },
  parcel_meter_price: {
    moduleName: "parcel_meter_price",
    label: "سعر المتر بالقطعة",
    required: true,
    field: "inputNumber",
    // onClick: (props, val) => {
    //   

    // },
  },
  parcel_meter_price_in_letters: {
    moduleName: "parcel_meter_price_in_letters",
    label: "سعر المتر بالحروف",
    required: true,
    field: "text",
  },
  //   total_parcel_price: {
  //     moduleName: "total_parcel_price",
  //     label: "سعر الإجمالي للمساحة الاجمالية للقطعة",
  //     required: true,
  //     field: "text",
  //     disabled: true,
  //   },
  //   parcel_cut_area: {
  //     moduleName: "parcel_cut_area",
  //     label: "مساحة الجزء المنزوع لكل قطعة",
  //     required: true,
  //     field: "text",
  //     disabled: true,
  //   },
  // parcel_cut_meter_price: {
  //   moduleName: "parcel_cut_meter_price",
  //   label: "سعر الجزء المنزوع لكل قطعة",
  //   required: true,
  //   field: "inputNumber",
  //   onClick: (props, val) => {
  //     
  //     onInputChange(
  //       "parcel_cut_meter_price",
  //       "parcel_cut_area",
  //       "total_parcel_cut_price",
  //       val,
  //       props
  //     );
  //   },
  // },
  //   total_parcel_cut_price: {
  //     moduleName: "total_parcel_cut_price",
  //     label: "السعر الإجمالي للمساحة الاجمالية المنزوعة للقطعة",
  //     required: true,
  //     field: "text",
  //     disabled: true,
  //   },
  //   total_of_totals_of_cut_areas: {
  //     moduleName: "total_of_totals_of_cut_areas",
  //     label: "المساحة الإجمالية المنزوعة لكامل الأراضي",
  //     required: true,
  //     field: "text",
  //     disabled: true,
  //   },
  //   total_of_totals_of_cut_prices: {
  //     moduleName: "total_of_totals_of_cut_prices",
  //     label: "السعر الإجمالي لكامل الجزء المنزوع من كامل الأراضي",
  //     required: true,
  //     field: "text",
  //     disabled: true,
  //   },
};
