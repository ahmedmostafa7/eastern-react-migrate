import React, { Component } from 'react';
import {map} from 'lodash';
import Head from './head';
import Row from './row';

export default class index extends Component {
    renderHeads = ()=>{
        const {field} = this.props
        return <thead>
            {map(field.fields, (d, key)=>(<Head head={d.head} key={key}></Head>))}
        </thead>
    }
    renderRow = (d, key)=>{
        const {field, ShowField} = this.props;
        return <tr>
            {map(field.fields, (f, k)=><Row key={''+key+k} ShowField={ShowField} data={d} select={f.name || k} mainValues={d} field={f} />)}
        </tr>
    }
    renderBody = ()=>{
        const {val} = this.props
        return map(val, this.renderRow)
    }
    render() {
        
        return (
            <table className="table table-bordered">
                {this.renderHeads()}
                <tbody>
                    {this.renderBody()}
                </tbody>
            </table>
        )
    }
}
