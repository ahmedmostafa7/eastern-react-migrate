import React, { Component } from 'react';
import { Layout } from 'antd';
import Content from './content';
import Sidebar from './sidebar';

class UserApps extends Component {

    render() {
        return (
              
            <Layout>
         
                <Sidebar />
                <Layout>
                    <Content />
                </Layout>
            </Layout>
        )
    }
}

export default UserApps;