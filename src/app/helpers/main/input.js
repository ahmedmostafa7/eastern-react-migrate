import React, { Component } from 'react';
import {isEqual} from 'lodash';

class mainInput extends Component {
    shouldComponentUpdate(nextProps) {
        return (!isEqual(nextProps.data, this.props.data)) || 
        (!isEqual(nextProps.input.value, this.props.input.value)) ||
        (!isEqual(nextProps.lang, this.props.lang));
    }
    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default mainInput;