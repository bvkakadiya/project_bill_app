/* eslint-disable react/prop-types */
import { Card } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function FilterTable({ columns: cols, filters }) {
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "description1",
      headerName: "Description 1",
      width: 110,
    },
    {
      field: "description2",
      headerName: "Description 2",
      width: 180,
      editable: false,
    },
    {
      field: "columnName",
      headerName: "Column Name",
      width: 120,
      editable: true,
      valueOptions: cols,
    },
    {
      field: "value",
      headerName: "Value",
      width: 150,
      editable: true,
    },
  ];

  return (
    <Card>
      <DataGrid
        rows={filters.map((filter, index) => ({ ...filter, id: index }))}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            toolbarButtonAlignment: "left",
            exportButton: false,
          },
        }}
      />
    </Card>
  );
}
