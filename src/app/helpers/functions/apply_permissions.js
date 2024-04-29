import { get, every, some, omit } from "lodash";
import * as perm_funcs from "app/helpers/permissions";

export const apply_permissions = (values, permissions = [], key, props) => {
  const permissionSettings = get(permissions, key, { show: true });
  const operation =
    get(permissionSettings, "operation", "every") === "some" ? some : every;
  // if(permissionSettings.operation){
  // 	const out = operation(omit(permissionSettings, 'operation'), (params, key) => {
  // 		const d = (get(perm_funcs, params.function || key, () => (true))(values, params, props))
  // 		console.log(key, d)
  // 		return d
  // 	})
  // 	console.log(permissionSettings, out)
  // }
  return operation(omit(permissionSettings, "operation"), (params, key) => {
    return get(perm_funcs, params.function || key, () => true)(
      values,
      params,
      props
    );
  });
};

export const apply_field_permission = (values, field, props) => {
  const permissionSettings = get(field, "permission", { show: true });
  const operation =
    get(permissionSettings, "operation", "every") === "some" ? some : every;
  // console.log(operation)
  return operation(omit(permissionSettings, "operation"), (params, key) =>
    get(perm_funcs, key, () => true)(values, params, props)
  );
};
