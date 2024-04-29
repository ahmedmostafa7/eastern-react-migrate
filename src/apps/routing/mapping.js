import { getUserApps } from "app/helpers/functions";
import { omit, get } from "lodash";
import store from "app/reducers";
export const mapStateToProps = ({ user: { user }, mainApp: { apps } }) => ({
  user,
  apps,
});

export const mapDispatchToProps = (dispatch) => ({
  addUser(user) {
    const apps = getUserApps(user);
    // console.log('APPS',apps);
    const adminModules = get(apps, "ADMIN.modules");
    // console.log(apps)
    let dis = [
      {
        type: "setUser",
        path: "user",
        data: user,
      },
      {
        type: "setMainApp",
        path: "apps",
        data: omit(apps, "ADMIN"),
      },
      {
        type: "setAdmin",
        path: "apiModules",
        data: adminModules,
      },
    ];
    store.dispatch(dis);
  },
});
