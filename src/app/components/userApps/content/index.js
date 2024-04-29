import React, { Component } from 'react';
import {Layout} from 'antd';
import TabsContent from 'apps/modules/tabs';
const {Content} = Layout;

class ContentComp extends Component {
    render() {
        return (
            <div className="main-layout" style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, minHeight: 360 }}>
                <TabsContent/>
                
            </div>
        </div>
        );
    }
}

export default ContentComp;