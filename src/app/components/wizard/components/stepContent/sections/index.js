import React, { Component } from 'react';
import * as SectionsComponent from './sectionTypes';
import { get } from 'lodash';

class renderSection extends Component {
    constructor(props) {
        super(props)
        this.SectionComponent = get(SectionsComponent, props.type, SectionsComponent.inputs);
    }

    render() {
        const { SectionComponent } = this;
        
        return (
            <SectionComponent {...this.props} />
        )
    }
}



export default renderSection;
