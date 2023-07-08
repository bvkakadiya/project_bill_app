import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const FilterDialog = ({ open, onClose, onSubmit }) => {

  const [filters, setFilters] = useState([]);

  const handleAddFilter = () => {
    setFilters([...filters, { field: '', operator: '', value: '' }]);
  };

  const handleRemoveFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleFilterChange = (index, field, value) => {
    setFilters(filters.map((filter, i) => i === index ? { ...filter, [field]: value } : filter));
  };

  const handleSubmit = () => {
    onSubmit(filters);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
    <DialogTitle>Add Filters</DialogTitle>
    <DialogContent>
      {filters.map((filter, index) => (
        <div key={index}>
          <TextField label="Field" value={filter.field} onChange={(event) => handleFilterChange(index, 'field', event.target.value)} />
          <TextField label="Operator" value={filter.operator} onChange={(event) => handleFilterChange(index, 'operator', event.target.value)} />
          <TextField label="Value" value={filter.value} onChange={(event) => handleFilterChange(index, 'value', event.target.value)} />
          <Button variant="outlined" color="secondary" onClick={() => handleRemoveFilter(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button variant="outlined" onClick={handleAddFilter}>
        Add Filter
      </Button>
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
    onSubmit: PropTypes.func.isRequired,
  };
export default FilterDialog;