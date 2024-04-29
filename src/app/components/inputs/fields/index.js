import { lazy } from "react";
export const equation = lazy(() => import("./equation"));
export const fileUploader = lazy(() => import("./fileUploader"));
export const simpleUploader = lazy(() => import("./fileUploader/simple"));
export const inputNumber = lazy(() => import("./inputNumber"));
export const hijriDatePicker = lazy(() => import("./hijriDatePicker"));
export const text = lazy(() => import("./text"));
export const ctext = lazy(() => import("./customText/index"));
export const div = lazy(() => import("./div"));
export const radio = lazy(() => import("./radio"));
export const customRadio = lazy(() => import("./customRadio/radio"));
export const singleSwitch = lazy(() => import("./switch"));
export const timePicker = lazy(() => import("./timepicker"));
export const datePicker = lazy(() => import("./datePicker"));
export const slider = lazy(() => import("./slider"));
export const mentions = lazy(() => import("./mention"));
export const label = lazy(() => import("./label"));
export const autoValue = lazy(() => import("./autoValue"));
export const address = lazy(() => import("./address"));
export const tableList = lazy(() => import("./list/tableList"));
export const UserDetailsModal = lazy(() => import("./user_details_modal"));
export const list = lazy(() => import("./list/table"));
export const Collapse = lazy(() => import("./list/collapse"));
export const cardList = lazy(() => import("./list/cardList"));
export const multiTableList = lazy(() => import("./list/multiTableList"));
export const gistTable = lazy(() => import("./list/tableAdd/gisTableAdd"));
export const gistTable2 = lazy(() => import("./list/hob"));
export const textArea = lazy(() => import("./textArea"));
export const Design = lazy(() => import("./design_comp"));
export const table = lazy(() => import("./table"));
export const button = lazy(() => import("./button"));
export const AdvancedTable = lazy(() => import("./advanced_table"));
export const identifyWizard = lazy(() => import("./identifyWizard"));
export const primaryPricing = lazy(() => import("./property_removal_primarypricing"));
export const compensationShake = lazy(() => import("./property_removal_compensationShake"));

// export const waseka = lazy(() => import("./waseka"));
// export * from './identify';
export * from "./identify";
export * from "./selectedParcels";
export * from "./select";
export * from "./checkbox";
export * from "./calculator";
export * from "./commentTextArea";
// export * from "./waseka";
// export * from './leadingText';
export * from "./label/typeofData/list";
// export * from './fixedTable';
// export * from './button';
// export * from './fixedUrl';
