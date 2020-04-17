// @flow
import ReactDataGrid from "react-data-grid";
import React from "react";
import type {Dataset} from "../App";

type Props = {|
    handleRowClick: () => mixed,
    rows: Array<Dataset>,
|};

function DatasetsList({handleRowClick, rows}: Props) {
    const columns = [
        { key: 'name', name: 'Name' },
        { key: 'row_count', name: '# Rows' },
    ];

    return (
        <ReactDataGrid
            onRowClick={handleRowClick}
            columns={columns}
            rows={rows}
            rowGetter={i => rows[i]}
            rowsCount={rows.length}
        />
    );
}

export default DatasetsList;