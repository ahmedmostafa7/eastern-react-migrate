import React, { Component } from 'react';
import 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import Toolbar from './k';

export default class Gantt extends Component {
    componentDidMount() {
        gantt.init(this.ganttContainer);
        gantt.parse(this.props.tasks);
    }
    handleZoomChange(zoom) {
        this.setState({
            currentZoom: zoom
        });
    }

    render() {
        return (
            <div>
                <Toolbar
                    zoom={this.state.currentZoom}
                    onZoomChange={this.handleZoomChange}
                />
                <div className="gantt-container">
                    <Gantt
                        tasks={data}
                        zoom={this.state.currentZoom}
                    />
                </div>
            </div>
        );
    }
}