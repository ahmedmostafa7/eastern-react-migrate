import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './mapping';
import Sidebar from './components/sidebar';
import Content from './components/content';
import * as modules from './modules';
import * as actionFuncs from './modules/actionFuncs';
import * as commonActions from './modules/commonActions';
import { map, get, pickBy, set } from 'lodash';
const { Content: ContentAntd } = Layout;

class Admin extends Component {
    constructor(props) {
        super(props);
        const { setModules, apiModules } = props;
        const _apiModules = pickBy(apiModules, (value, key) => get(modules, key))
        let MODULES = {};
        map(_apiModules, (value, key) => {
            set(MODULES, key, { ...value, ...get(modules, key) });
            set(MODULES, `${key}.actionFuncs`, { ...commonActions, ...get(actionFuncs, key) });
        });
        setModules(MODULES);
    }

    render() {
        return (
            <Layout>
                <Sidebar />
                <Layout >
                    <ContentAntd>
                        <Content />
                    </ContentAntd>
                </Layout>
         
            </Layout>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);