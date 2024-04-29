export const mapStateToProps = state => {
    return {
        map:state.map,
        selectedLands:state.selectedLands,    
  };}


  export const mapDispatchToProps = dispatch => {
    return {
        setmap: (e) => dispatch({type:'setMap',value:e}),
        DEL:()=>dispatch({type:"DelLand"})
  };} 