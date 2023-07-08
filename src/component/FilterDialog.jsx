import { useState } from "react";
import {
  Button,
  Dialog,
  InputLabel,
  Select,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Input,
} from "@mui/material";

import PropTypes from "prop-types";

import * as XLSX from 'xlsx';

const FilterDialog = ({
  open,
  onClose,
  onSubmit,
  columns,
  description1,
  description2,
}) => {
  const [filters, setFilters] = useState([]);

  const handleAddFilter = () => {
    setFilters([
      ...filters,
      {
        description1: "",
        description2: "",
        columnName: "",
        name: "",
        value: "",
      },
    ]);
  };

  const handleRemoveFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleFilterChange = (index, field, value) => {
    setFilters(
      filters.map((filter, i) =>
        i === index ? { ...filter, [field]: value } : filter
      )
    );
  };

  const handleSubmit = () => {
    onSubmit(filters);
    onClose();
  };

  const handleImportFilters = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const csvData = XLSX.utils.sheet_to_csv(worksheet);
      const newFilters = csvData
        .split('\n')
        .filter((row) => row.trim() !== '')
        .map((row) => {
          const [description1, description2, columnName, name, value] = row.split(',');
          return { description1, description2, columnName, name, value };
        });
      setFilters(newFilters.slice(1));
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Dialog open={open} onClose={onClose}>
        
      <DialogTitle>Add Filters</DialogTitle>
      <DialogContent>
        {filters.map((filter, index) => (
          <div key={index}>
            <TextField
              label="Filter Name"
              value={filter.name}
              onChange={(event) =>
                handleFilterChange(index, "name", event.target.value)
              }
            />

            <InputLabel>Select Descption 1</InputLabel>
            <Select
              value={filter.description1}
              onChange={(event) =>
                handleFilterChange(index, "description1", event.target.value)
              }
            >
              {description1.map((value, index) => (
                <MenuItem key={index} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            <InputLabel>Select a Description 2</InputLabel>
            {filter.description1 && (
              <Select
                value={filter.description2}
                onChange={(event) =>
                  handleFilterChange(index, "description2", event.target.value)
                }
              >
                {[...description2[filter.description1]].map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            )}
            <Select
              value={filter.columnName}
              onChange={(event) =>
                handleFilterChange(index, "columnName", event.target.value)
              }
            >
              {columns.map((value, index) => (
                <MenuItem key={index} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="value"
              value={filter.operator}
              onChange={(event) =>
                handleFilterChange(index, "operator", event.target.value)
              }
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleRemoveFilter(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button variant="outlined" onClick={handleAddFilter}>
          Add Filter
        </Button>
        <Input type="file" accept=".xls,.xlsx" onChange={handleImportFilters} >
            Import Filters
        </Input>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

FilterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  description1: PropTypes.array.isRequired,
  description2: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
};
export default FilterDialog;
