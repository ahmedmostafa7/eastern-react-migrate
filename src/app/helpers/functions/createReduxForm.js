import { reduxForm } from "redux-form";
import { composeAsyncValidations } from "app/helpers/functions";

export const createReduxForm = (
  component,
  params,
  fieldsPath,
  currentAppPath
) =>
  reduxForm({
    asyncValidate: composeAsyncValidations(fieldsPath, currentAppPath),
    ...params,
  })(component);
