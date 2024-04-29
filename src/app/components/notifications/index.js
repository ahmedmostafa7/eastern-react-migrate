import React, {Component} from 'react';
import {message} from 'antd';


export default class Notification extends Component {

    constructor(props){
        super(props);
        window.notifySystem = this.notifySystem.bind(this);
    }

    notifySystem(status, msg, time){
        const duration = time ? time : 2
        ;
        message.config({
            rtl: true
          });
        message[status](msg, duration);
    }

    render() {
        return (
            <div>
            </div>
        );
    }

}