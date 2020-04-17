// @flow

import ReactDataGrid from "react-data-grid";
import React from "react";

type ColumnSummary = {|
    [columnKey: string]: {
        min: number,
        max: number
    },
|};

type Props = {|
    columnSummary: ColumnSummary,
|};

function DatasetTableColumnSummary({columnSummary}: Props) {
    const columnKeys = Object.keys(columnSummary);
    const rows = columnKeys.map(columnKey => ({
        column: columnKey,
        min: columnSummary[columnKey].min,
        max: columnSummary[columnKey].max,
    }));
    const columns = [
        { key: 'column', name: 'Column' },
        { key: 'min', name: 'Min' },
        { key: 'max', name: 'Max'},
    ];

    return <ReactDataGrid columns={columns} rows={rows} />
}

export default DatasetTableColumnSummary;