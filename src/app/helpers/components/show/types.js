import { lazy } from "react";
export const fileUploader = lazy(() => import("./fileUploader"));
export const simpleUploader = lazy(() => import("./fileUploader/simple"));
// export const hijriDatePicker = lazy(()=>import('./hijriDatePicker'));
export const radio = lazy(() => import("./radio"));
export const singleSwitch = lazy(() => import("./switch"));
// export const timePicker = lazy(()=>import('./timepicker'));
// export const datePicker = lazy(()=>import('./datePicker'));
// export const slider = lazy(()=>import('./slider'));
// export const mentions = lazy(()=>import('./mention'));
export const label = lazy(() => import("./label"));
// export const autoValue = lazy(()=>import('./autoValue'));
// export const address = lazy(()=>import('./address'));
// export const tableList = lazy(()=>import('./list/tableList'));
export const list = lazy(() => import("./list/table"));
export const simpleModal = lazy(() => import("./simpleModal"));
export const primaryPricing = lazy(() => import("../../../../app/components/inputs/fields/property_removal_primarypricing"));
export const propertyRemovalIdentify = lazy(() => import ('../../../../app/components/inputs/fields/identify/Component/propertyRemovalIdentifyComponnent'));
// export const Collapse = lazy(()=>import('./list/collapse'));
// export const cardList = lazy(()=>import('./list/cardList'));
// export const multiTableList = lazy(()=>import('./list/multiTableList'));
// export const gistTable = lazy(()=>import('./list/tableAdd/gisTableAdd'));
// export const gistTable2 = lazy(()=>import('./list/hob'));
// export const textArea = lazy(()=>import('./textArea'));
// export const table = lazy(()=>import('./table'));
 export const button = lazy(()=>import('../../../../app/components/inputs/fields/button'));
// export const AdvancedTable = lazy(()=>import('./advanced_table'))
// export const identifyWizard = lazy(()=>import('./identifyWizard'))
// export * from './identify';
// export * from './identify'
export * from "./select";
export * from "./checkbox";
// export * from './calculator'
