/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { Tabs, Tab, Box, Card, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

function TabsWithTable({ groupByData, columns: cols }) {
  const [value, setValue] = useState(0);

  // Group the data by the "group" property
  //   data.forEach((item) => {
  //     if (!groups[item.group]) {
  //       groups[item.group] = [];
  //     }
  //     groups[item.group].push(item);
  //   });

  // Convert the groups object to an array of { group, data } objects
  const groupData = useMemo(() => {
    return Object.keys(groupByData).map((group) => ({
      group,
      data: { ...groupByData[group] },
    }));
  }, [groupByData]);

  console.log(groupData);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      hidden: true,
    },
    ...cols.map((col) => ({
      field: col,
      headerName: col,
      width: 150,
    })),
  ];
  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={value} onChange={(event, newValue) => setValue(newValue)}>
        {groupData.map((group, index) => (
          <Tab key={index} label={group.group} />
        ))}
      </Tabs>
      {groupData.map((group, index) => (
        <Box key={index} hidden={value !== index}>
          <Typography sx={{ p: 2, m: 2 }}>
            Total Sum is : {group.data?.sum}
          </Typography>
          <Card>
            <DataGrid
              rows={
                group.data?.rowData?.map((row, index) => ({
                  ...row,
                  id: index,
                })) ?? []
              }
              columns={columns}
              pageSize={5}
              rowHeight={25}
              checkboxSelection
              slots={{ toolbar: GridToolbar }}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </Card>
        </Box>
      ))}
    </Box>
  );
}

export default TabsWithTable;
