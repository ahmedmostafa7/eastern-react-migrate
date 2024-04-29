import React, { Component } from 'react';
import Table from './components/table';
import ExtendedActions from './components/extendedActions';
import Dialog from './components/dialog';
import Search from './components/search';

class Content extends Component {
    render() {
        return (
            <div>
                <div className="admin_upper">
                <Search />
                <ExtendedActions />
                </div>
                <Table />
                <Dialog />
            </div>
        );
    }
}

export default Content;