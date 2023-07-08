import { useState } from 'react';
import Papa from 'papaparse';
import { Button, TextField, InputLabel, FormControl, Select, MenuItem } from '@mui/material';
import FilterDialog from './FilterDialog';

function CsvParser() {
  const [csvData, setCsvData] = useState([]);
  const [uniqueValues, setUniqueValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [groupByField, setGroupByField] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
const [filters, setFilters] = useState([]);
 
  const handleGroupByFieldChange = (event) => {
    setGroupByField(event.target.value);
  };

  const filteredData = csvData.filter((row) => {
    return filters.every((filter) => {
      const { field, operator, value } = filter;
      if (!field || !operator || !value) {
        return true;
      }
      switch (operator) {
        case 'equals':
          return row[field] === value;
        case 'contains':
          return row[field].includes(value);
        case 'starts_with':
          return row[field].startsWith(value);
        case 'ends_with':
          return row[field].endsWith(value);
        default:
          return true;
      }
    });
  });

  const groupedData = filteredData.reduce((groups, row) => {
    const key = row[groupByField];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(row);
    return groups;
  }, {});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: function(results) {
        setUniqueValues([...new Set(results.data.map(row => row['Description 1']))])
        setCsvData(results.data);
      }
    });
  };
  console.log(csvData);
  console.log(uniqueValues);

  return (
    <div>
    <TextField type="file" onChange={handleFileUpload} />
    <Button variant="contained" onClick={handleFileUpload}>
      Parse CSV
    </Button>
    <Button variant="contained" onClick={() => setFilterDialogOpen(true)}>
        Add Filters
      </Button>
    <FormControl>
      <InputLabel>Select a value</InputLabel>
      <Select value={selectedValue} onChange={(event) => setSelectedValue(event.target.value)}>
        {uniqueValues.map((value, index) => (
          <MenuItem key={index} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField label="Group By Field" value={groupByField} onChange={handleGroupByFieldChange} />
      <FilterDialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} onSubmit={setFilters} />
      {Object.entries(groupedData).map(([key, rows]) => (
        <div key={key}>
          <h2>{key}</h2>
          <ul>
            {rows.map((row, index) => (
              <li key={index}>{JSON.stringify(row)}</li>
            ))}
          </ul>
        </div>
      ))}
  </div>
  );
}

export default CsvParser;