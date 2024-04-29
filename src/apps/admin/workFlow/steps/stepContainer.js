import React, { Component } from 'react'
import {connect} from 'react-redux'
import {mapStateToProps, mapDispatchToProps} from '../mapping'
import {assign} from 'lodash'
import { DragSource, DropTarget } from 'react-dnd';
import {Step} from './step'


const stepSource = {
    beginDrag(props ) {
      return {
        sourceName: props.step.name
      };
    }
};
  
function sourceCollect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        
    }
}

function targetCollect(connect, monitor){
    return{
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}

const stepTarget = {
    drop(props, monitor) {
      moveStep(props,monitor.getItem().sourceName);
    }
  };

  const moveStep = (props,sourceName) =>{
    const {allSteps, step:{index}, fillSteps} = props
    const steps = [...allSteps]
    const targetNo = index;

    const newSteps = steps.map(singleStep => {
        return (
            singleStep.index >= targetNo  && singleStep.name !== sourceName ?
            assign(singleStep, {index: singleStep.index+1}) :
            singleStep.name === sourceName ? 
            assign(singleStep, {index: targetNo}) :
            singleStep
        )
    } )
    
    fillSteps(newSteps)
    //if wanted to switch steps instead of just pushing them
        //changeStep(targetNo, `${sourceName}.number`)
        //changeStep(sourceNo, `${name}.number`)

  }
 

class stepContainer extends Component {

    render() {
        const { connectDragSource, connectDropTarget, isDragging, step } = this.props;

    return connectDragSource(connectDropTarget(
        <div style={{ height:'150px',  margin: '10px' }}>
            <Step style={{  opacity: isDragging ?' 0.5' : '1'}} step={{...step}}/>
        </div>
        
    ))
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)
const dragable = DragSource('step', stepSource, sourceCollect)(DropTarget('step', stepTarget, targetCollect)(stepContainer))

export const StepContainer = (connector)(dragable)
