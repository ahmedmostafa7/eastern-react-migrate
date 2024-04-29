import { getUserApps } from "app/helpers/functions";
import { get, omit } from "lodash";

export const mapStateToProps = ({ user: { user } }) => ({
  user,
});

export const mapDispatchToProps = (dispatch) => ({
  addUser(user) {
    const apps = getUserApps(user);
    console.log("APPS>>>>>>>>", apps);
    const adminModules = get(apps, "ADMIN.modules");
    dispatch({
      type: "setUser",
      path: "user",
      data: user,
    });
    dispatch({
      type: "setMainApp",
      path: "apps",
      data: omit(apps, "ADMIN"),
    });
    dispatch({
      type: "setAdmin",
      path: "apiModules",
      data: adminModules,
    });
  },
});
