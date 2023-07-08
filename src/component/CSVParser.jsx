import { useMemo, useState } from "react";
import Papa from "papaparse";
import {
  Button,
  Input,
  TextField,
} from "@mui/material";
import FilterDialog from "./FilterDialog";
import ExportXLS from "./ExportXLS";

function CsvParser() {
  const [csvData, setCsvData] = useState([]);
  const [uniqueValues2, setUniqueValues2] = useState({});
  const [uniqueValues1, setUniqueValues1] = useState([]);
  const [columns, setColumns] = useState([]);
  const [groupByField, setGroupByField] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState([]);

  const handleGroupByFieldChange = (event) => {
    setGroupByField(event.target.value);
  };
  const groupByData = useMemo(() => {
  const data = {};
if(csvData.length > 0 && filters.length > 0) {
    csvData.forEach((row) => {
      filters.forEach((filter) => {
       const { description1, description2, columnName, value, name } = filter;
       //   if (!description1 || !description2 || !field || !operator || !value) {
       //     return true;
       //   }
       if (
         row["Description 1"] === description1 &&
         row["Description 2"] === description2 &&
         ((row[columnName] && value && row[columnName] === value) || true)
       ) {
        const amount = parseFloat(row["CAD$"]);
         if (!data[name]) {
           data[name] ={rowData: [row], sum: amount};
         } else {
           data[name] = {rowData: [...data[name].rowData, row], sum: data[name].sum + amount};
         }
       }
     });

   });}

  return data;
}, [csvData, filters]);

console.log(groupByData);

  // const groupedData = filteredData.reduce((groups, row) => {
  //   const key = row[groupByField];
  //   if (!groups[key]) {
  //     groups[key] = [];
  //   }
  //   groups[key].push(row);
  //   return groups;
  // }, {});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: function (results) {
        setUniqueValues1([
          ...new Set(results.data.map((row) => row["Description 1"])),
        ]);
        const uniqueValues2BasedOn1 = {};
        results.data.forEach((row) => {
          if (!uniqueValues2BasedOn1[row["Description 1"]]) {
            uniqueValues2BasedOn1[row["Description 1"]] = new Set();
          }
          uniqueValues2BasedOn1[row["Description 1"]].add(row["Description 2"]);
        });
        setColumns(results.meta.fields);
        setUniqueValues2(uniqueValues2BasedOn1);
        setCsvData(results.data);
      },
    });
  };

  return (
    <div>
      <Input type="file" onChange={handleFileUpload} />
      {/* <Button variant="contained" onClick={handleFileUpload}>
      Parse CSV
    </Button> */}
      <Button variant="contained" onClick={() => setFilterDialogOpen(true)}>
        Add Filters
      </Button>
      <TextField
        label="Group By Field"
        value={groupByField}
        onChange={handleGroupByFieldChange}
      />
      <FilterDialog
        description1={uniqueValues1}
        columns={columns}
        description2={uniqueValues2}
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onSubmit={setFilters}
      />
      {Object.entries(groupByData).map(([key, rows]) => (
        <div key={key}>
          <h2>{key}</h2>
          <ul>
            {rows.sum}
          </ul>
        </div>
      ))}
      <ExportXLS csvData={csvData} filters={filters} fileName="export" />
    </div>
  );
}

export default CsvParser;
