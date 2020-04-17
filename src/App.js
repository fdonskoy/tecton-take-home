// @flow

import React, {useEffect, useState} from 'react';
import axios from "axios";
import 'react-data-grid/dist/react-data-grid.css';
import {StyleSheet, css} from "aphrodite";
import DatasetsList from "./components/DatasetList";
import DatasetTable from "./components/DatasetTable";
import DatasetTableColumnSummary from "./components/DatasetTableColumnSummary";

export type Dataset = {|
  name: string,
  url: string,
  row_count: number,
|}

function App() {
  const [loadingDatasetList, setDatasetListLoading] = useState(true);
  const [dataSets, setDataSets] = useState([]);

  const [loadingCurrentDataset, setCurrentDatasetLoading] = useState(false);
  const [currentDataset, setCurrentDataset] = useState([]);
  const [columnSummary, setColumnSummary] = useState({});

  const [sortColumnKey, setSortColumnKey] = useState("");
  const [sortColumnDirection, setSortColumnDirection] = useState("ASC");

  useEffect(() => {
    axios.get('/api/datasets').then(res => {
      setDataSets(res.data);
      setDatasetListLoading(false);
    }).catch(err => {
      console.error(err);
      setDatasetListLoading(false);
    });

  }, []);

  const handleSort = (sortColumn: string, sortDirection: string) => {
    const comparer = (a, b): number => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      } else {
        return 0;
      }
    };

    setSortColumnKey(sortColumn);
    setSortColumnDirection(sortDirection);
    setCurrentDataset(sortDirection === "NONE" ? currentDataset : [...currentDataset].sort(comparer));
  };

  const handleRowClick = async (index, row?: Dataset) => {
    if (!row) return;
    setCurrentDatasetLoading(true);
    const currentDataset = await axios.post('/api/dataset', {url: row.url});
    setCurrentDataset(currentDataset.data.rows);
    setColumnSummary(currentDataset.data.columnSummary);
    setCurrentDatasetLoading(false);
  }

  return (
    <div className={css(styles.padding)}>
      <div className={css(styles.marginBottom)}>
        {loadingDatasetList ? "Loading..." : <DatasetsList handleRowClick={handleRowClick} rows={dataSets}/>}
      </div>
      {currentDataset.length === 0 && (
        <div className={css(styles.marginBottom)}>
          Click on a row above to render a data set!
        </div>
      )}
      <div>
        {loadingCurrentDataset ? null : <DatasetTableColumnSummary columnSummary={columnSummary}/>}
      </div>
      <div className={css(styles.marginBottom)}>
        {loadingCurrentDataset ? "Loading table..." : (
            <DatasetTable currentDataset={currentDataset} handleSort={handleSort} sortColumnDirection={sortColumnDirection} sortColumnKey={sortColumnKey}/>
        )}
      </div>
    </div>
  );
}

export default App;

const styles = StyleSheet.create({
  padding: {
    padding: 50,
  },
  marginBottom: {
    marginBottom: 20,
  }
})
