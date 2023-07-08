import {
  Button,
  Dialog,
  Select,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Card,
  Paper,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import PropTypes from "prop-types";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  textAlign: "left",
  minWidth: "3rem",
  color: theme.palette.text.secondary,
}));

const FilterDialog = ({
  open,
  onClose,
  filters,
  setFilters,
  onSubmit,
  columns,
  description1,
  description2,
}) => {
  const handleAddFilter = () => {
    setFilters([
      ...filters,
      {
        id: 0,
        description1: "",
        description2: [],
        columnName: "",
        name: "",
        value: "",
        startdate: "",
        enddate: "",
      },
    ]);
  };

  const handleRemoveFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleFilterChange = (index, field, value) => {
    setFilters(
      filters.map((filter, i) =>
        i === index ? { ...filter, [field]: value, id: index } : filter
      )
    );
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
          <Card key={index}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={12}>
                  <Item>
                    <TextField
                      sx={{ p: 0 }}
                      label="Filter Name"
                      value={filter.name}
                      onChange={(event) =>
                        handleFilterChange(index, "name", event.target.value)
                      }
                    />
                  </Item>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Item>
                    <Select
                      sx={{ p: 0 }}
                      value={filter.description1}
                      label="Description 1"
                      onChange={(event) =>
                        handleFilterChange(
                          index,
                          "description1",
                          event.target.value
                        )
                      }
                    >
                      {description1.map((value, index) => (
                        <MenuItem key={index} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </Item>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Item>
                    {filter.description1 && (
                      <Select
                        sx={{ p: 0 }}
                        multiple
                        value={filter.description2}
                        label="Description 2"
                        onChange={(event) =>
                          handleFilterChange(
                            index,
                            "description2",
                            event.target.value
                          )
                        }
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {description2[filter.description1] &&
                          [...description2[filter?.description1]].map(
                            (value, index) => (
                              <MenuItem key={index} value={value}>
                                {value}
                              </MenuItem>
                            )
                          )}
                      </Select>
                    )}
                  </Item>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Item>
                    <Select
                      sx={{ p: 0 }}
                      value={filter.columnName}
                      onChange={(event) =>
                        handleFilterChange(
                          index,
                          "columnName",
                          event.target.value
                        )
                      }
                    >
                      {columns.map((value, index) => (
                        <MenuItem key={index} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </Item>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Item>
                    <TextField
                      sx={{
                        p: 0,
                        minWidth: "3rem",
                      }}
                      label="Value"
                      value={filter.value}
                      onChange={(event) =>
                        handleFilterChange(index, "value", event.target.value)
                      }
                    />
                  </Item>
                </Grid>
                <Grid
                  item
                  xs={6}
                  md={12}
                  sx={{
                    mb: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveFilter(index)}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
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
  description1: PropTypes.array.isRequired,
  description2: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  filters: PropTypes.array,
  setFilters: PropTypes.func,
};
export default FilterDialog;
