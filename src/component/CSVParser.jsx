import { useMemo, useState } from "react";
import Papa from "papaparse";
import { Box, Button, Card, Grid, Input, Paper } from "@mui/material";
import FilterDialog from "./FilterDialog";
import ExportXLS from "./ExportXLS";
import * as XLSX from "xlsx";

import { styled } from "@mui/material/styles";
import FilterTable from "./FilterTable";
import TabsWithTable from "./TabsWIthTable";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function CsvParser() {
  const [csvData, setCsvData] = useState([]);
  const [uniqueValues2, setUniqueValues2] = useState({});
  const [uniqueValues1, setUniqueValues1] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState([]);

  const groupByData = useMemo(() => {
    const data = {};
    if (csvData.length > 0 && filters.length > 0) {
      csvData.forEach((row) => {
        filters.forEach((filter) => {
          const { description1, description2, columnName, value, name } =
            filter;
          if (
            (!description1 || row["Description 1"] === description1) &&
            (!description2 / length > 0 ||
              description2.includes(row["Description 2"])) &&
            (!(columnName && value) || row[columnName] === value)
          ) {
            const amount = parseFloat(row["CAD$"]);
            if (!data[name]) {
              data[name] = { rowData: [row], sum: amount };
            } else {
              data[name] = {
                rowData: [...data[name].rowData, row],
                sum: data[name].sum + amount,
              };
            }
          }
        });
      });
    }

    return data;
  }, [csvData, filters]);

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

  const handleImportFilters = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const csvData = XLSX.utils.sheet_to_csv(worksheet);
      const newFilters = csvData
        .split("\n")
        .filter((row) => row.trim() !== "")
        .map((row) => {
          const [name, description1, description2, columnName, value] =
            row.split(",");
          return {
            name,
            description1,
            description2: description2.split(":::"),
            columnName,
            value,
          };
        });
      setFilters(newFilters.slice(1));
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Box gridColumn="span 12">
          <Card>
            <Item>
              <Input
                sx={{ mt: 1 }}
                type="file"
                placeholder="Upload CSV File"
                onChange={handleFileUpload}
              />
            </Item>
          </Card>
        </Box>
        <Box gridColumn="span 12">
          <Card>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3} sx={{ m: 2 }}>
                <Card>
                  <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    onClick={() => setFilterDialogOpen(true)}
                  >
                    Add Filters
                  </Button>
                  <Input
                    sx={{ mt: 2, p: 2 }}
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={handleImportFilters}
                  >
                    Import Filters
                  </Input>
                </Card>
              </Grid>
              <Grid item xs={12} sm={8} sx={{ m: 2 }}>
                <FilterTable columns={columns} filters={filters} />
              </Grid>
            </Grid>
          </Card>
        </Box>

        <Box gridColumn="span 12">
         <Card>
          <Item>
            <TabsWithTable groupByData={groupByData} columns={columns}/>
            </Item>
          </Card>
        </Box>
      
        <Box gridColumn="span 12">
          <Item>
          <ExportXLS csvData={csvData} filters={filters} fileName="export" />
          </Item>
        </Box>
      </Box>
      <FilterDialog
        description1={uniqueValues1}
        columns={columns}
        description2={uniqueValues2}
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onSubmit={setFilters}
        setFilters={setFilters}
        filters={filters}
      />
    </div>
  );
}

export default CsvParser;
