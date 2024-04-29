export const mapStateToProps = state => {
    return {
        map:state.map  
  };}


  export const mapDispatchToProps = dispatch => {
    return {
        setmap: (e) => dispatch({type:'setMap',value:e}),
       
  };}