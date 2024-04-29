import React, { Component } from "react";
import { Layout, Button } from "antd";
import { Steps } from "./steps";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { createStep, arrangeSteps } from "./functions";
// import { DragDropContext } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { withTranslation } from "react-i18next";

const { Content } = Layout;

const workFlowTitleUrl = "/WorkFlow";

class workFlowComponent extends Component {
  // componentDidMount(){
  //   const {fillSteps, allSteps=[],history} = this.props
  //   let workFlowId = last(get(history, "location.pathname" , "").split('/'))

  //   if(isEmpty(allSteps)){
  //     fetchData(`${workFlowTitleUrl}/${workFlowId}`)
  //     .then(resp => console.log(resp))

  //   }
  // }

  render() {
    const { t, allSteps } = this.props;

    return (
      <Layout>
        <div>
          <Button
            style={{ margin: "16px", padding: "5px", width: "200px" }}
            onClick={createStep.bind(this)}
            type="primary"
            icon="plus"
          >
            {t("workFlow:Add new step")}
          </Button>
          <Button
            disabled={allSteps ? false : true}
            style={{
              margin: "16px",
              padding: "5px",
              width: "200px",
              background: "#95C9EA",
            }}
            onClick={arrangeSteps.bind(this)}
            type="dashed"
            icon="sync"
          >
            {t("workFlow:Arrange steps")}
          </Button>
        </div>
        <Content>
          <Steps />
        </Content>
      </Layout>
    );
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
const draging = DragDropContext(HTML5Backend)(
  withTranslation("workFlow", "messages")(workFlowComponent)
);

export default connector(draging);
