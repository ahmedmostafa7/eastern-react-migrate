import {setMap} from 'main_helpers/functions/filters/state'
let mainMap = undefined;
export const mapStateToProps = state => {
    //
    return {
        map:state.map,
        mapObj: mainMap,
        selectedLands:state.selectedLands,
        selectedLandsT:state.selectedLandsT,
        selectMapLayer: state.mainApp.selectMapLayer,
        selectedFeaturesOnMap: state.mainApp.selectedFeaturesOnMap
  };}


  export const mapDispatchToProps = dispatch => {
    return {
        setLoading:(data) => {
            dispatch({
                type:'setMainApp',
                path:'loading',
                data
            })
        },
        setCurrentMap: (data) => {
            mainMap = data;
            setMap(data);
          },
        setMap: (e) => dispatch({type:'setMap',value:e}),
        addLand:(e)=>dispatch({type:"AddLand",value:e}),
        setSParcel:(e)=>dispatch({type:"setSParcel",value:e}),
        restSelect:()=>dispatch({type:"restSelect"}),
        setSelectMapLayer: (e) => {
            dispatch({
                type: 'setMainApp',
                path: 'selectMapLayer',
                data: e
            })
        },
       
        setSelectedFeaturesOnMap: (e) => {
            dispatch({
                type: 'setMainApp',
                path: 'selectedFeaturesOnMap',
                data: e
            })
        }
  };}
