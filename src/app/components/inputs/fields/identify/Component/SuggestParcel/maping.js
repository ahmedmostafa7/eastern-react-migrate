export const mapStateToProps = (state) => {
  return {
    map: state.map,
    selectedLands: state.selectedLands,
    selectedLandsT: state.selectedLandsT,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    setLoading: (data) => {
      dispatch({
        type: "setMainApp",
        path: "loading",
        data,
      });
    },
    setmap: (e) => dispatch({ type: "setMap", value: e }),
    addLand: (e) => dispatch({ type: "AddLand", value: e }),
    setSParcel: (e) => dispatch({ type: "setSParcel", value: e }),
    restSelect: () => dispatch({ type: "restSelect" }),
  };
};
