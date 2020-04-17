// @flow

import ReactDataGrid from "react-data-grid";
import React from "react";

const defaultColumnProperties = {
    sortable: true,
    resizable: true,
};

type Props = {|
    handleSort: (string, string) => mixed,
    currentDataset: Array<any>,
    sortColumnKey: string,
    sortColumnDirection: string,
|};

function DatasetTable({handleSort, currentDataset, sortColumnKey, sortColumnDirection}: Props) {
    const oneRow = currentDataset[0] || [];
    const columns = Object.keys(oneRow).map((columnKey, index) => ({
        key: columnKey,
        name: columnKey,
        sortDescendingFirst: index === 0,
        ...defaultColumnProperties,
    }));

    return (
        <ReactDataGrid
            columns={columns}
            rows={currentDataset}
            rowGetter={i => currentDataset[i]}
            rowsCount={currentDataset.length}
            minHeight={150}
            onSort={handleSort}
            sortColumn={sortColumnKey}
            sortDirection={sortColumnDirection}
            minColumnWidth={200}
        />
    )
}

export default DatasetTable;