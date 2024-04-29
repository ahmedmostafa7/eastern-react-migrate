import {setMap} from 'main_helpers/functions/filters/state'
let mainMap = undefined;
export const mapStateToProps = state => {
    return {
        map:state.map,
        mapObj: mainMap,
        selectedLands:state.selectedLands,
        selectedLandsT:state.selectedLandsT
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
        restSelect:()=>dispatch({type:"restSelect"})
  };}
