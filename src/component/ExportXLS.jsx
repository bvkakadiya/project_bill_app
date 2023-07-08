import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { useMemo } from "react";
import { Button } from "@mui/base";

const ExportXLS = ({ filters, csvData }) => {
  const exportXLS = () => {
    const formatData = Object.entries(groupByData).map(([key, value]) => {
      return { name: key, amount: value.sum, };
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formatData);

    // Add formatting to the worksheet
    XLSX.utils.sheet_add_aoa(worksheet, [["Exported Data"]], { origin: -1 });
    XLSX.utils.sheet_add_aoa(worksheet, [[""]], { origin: -1 });

    XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");
    const xlsFile = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

    const blob = new Blob([s2ab(xlsFile)], {
      type: "application/octet-stream",
    });
    FileSaver.saveAs(blob, "exported_data.xlsx");
  };

  const exportFilters = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(filters);
    const headerStyle = { font: { bold: true } };

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["description1", "description2", "columnName", "name", "value"]],
      {
        styles: [
          headerStyle,
          headerStyle,
          headerStyle,
          headerStyle,
          headerStyle,
        ],
      }
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");
    const xlsFile = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

    const blob = new Blob([s2ab(xlsFile)], {
      type: "application/octet-stream",
    });
    FileSaver.saveAs(blob, "filters.xlsx");
  };

  const groupByData = useMemo(() => {
    const data = {};
    if (csvData.length > 0 && filters.length > 0) {
      csvData.forEach((row) => {
        filters.forEach((filter) => {
          const { description1, description2, columnName, value, name } =
            filter;
          //   if (!description1 || !description2 || !field || !operator || !value) {
          //     return true;
          //   }
          if (
            (!description1 || row["Description 1"] === description1) &&
            (!description2 || row["Description 2"] === description2) &&
            (!columnName || !value || row[columnName] === value)
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

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  return (
    <>
      <Button onClick={exportXLS}>Export XLS</Button>
      <Button onClick={exportFilters}>Export Filters</Button>
    </>
  );
};

ExportXLS.propTypes = {
  filters: PropTypes.array.isRequired,
  csvData: PropTypes.array.isRequired,
};

export default ExportXLS;
