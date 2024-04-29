import { Table } from 'antd';
import React from 'react';
import { map, get } from 'lodash';
import * as fieldValues from './functions';

const { Column, ColumnGroup } = Table;


export const fixedTable = (value, record, field, a, props) => {
    const t = get(props, 't', text => (text.split(':')[0]))
    const columns = constructColumns(get(field, 'fields'), t);
    return <Table dataSource={value} pagination={false} bordered>
        {columns}
    </Table>
}

function constructColumns(fields, t) {
    return map(fields, (value, key) => {
        return getColumn(value, key, t, fields);
    })

}

function getColumn(field, key, t, fields) {
    const subFields = get(field, 'fields');
    if (subFields) {
        return <ColumnGroup title={t(`labels:${get(field, "label")}`)}>
            {map(subFields, (subField, subKey) =>
                getColumn(subField, `${key}.${subKey}`, t, fields)
            )}
        </ColumnGroup>
    }
    else {
        return <Column
            title={t(`labels:${get(field, "label")}`)}
            dataIndex={key}
            key={key}
            render={(value, row, index) => renderCell(value, row, index, field, key, t, fields)}
        />
    }
}

function renderCell(value, row, index, field, fieldKey, t, fields) {
    const { Fixed, data, sameRowSpan, field: fieldType } = field;
    const fieldValue = get(fieldValues, fieldType, (text) => text)(value, row, field, field, { t: t })
    if (Fixed) {
        return { children: fieldValue, props: { rowSpan: get(data, `[${index}].rowSpan`, 1) } }
    }
    if (sameRowSpan) {
        const rowSpan = get(fields, `${sameRowSpan}.data[${index}].rowSpan`, 1)
        return { children: fieldValue, props: { rowSpan } }
    }
    return fieldValue
}