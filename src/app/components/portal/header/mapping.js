import { get } from "lodash";
import { bindActionCreators } from "redux";
import { change } from "redux-form";

export const mapStateToProps = ({
  user: { user },
  mainApp,
  mainApp: { apps, currentApp },
  admin: { apiModules: admin },
}) => ({
  user,
  apps,
  admin,
  currentApp: get(apps, currentApp),
  color: get(currentApp, "color"),
  countTabsCount: get(mainApp, `countTabs`),
});

export const mapDispatchToProps = (dispatch) => ({
  removeUser() {
    dispatch({
      type: "removeUser",
    });
  },
  setCountTab: (data) => {
    dispatch({
      type: "setMainApp",
      path: "countTabs",
      data,
    });
  },
  ...bindActionCreators({ change }, dispatch),
});
