import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
const urlBackend = import.meta.env.VITE_BASE_URL_API;
import moment from "moment";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

axios.defaults.baseURL = urlBackend;

export default function DataGridDemo(props) {
  const columns = [
    { field: "No", headerName: "No.", width: 50 },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "contact",
      headerName: "Contact",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "statusTicket",
      headerName: "Status",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "createDate",
      headerName: "Create Date",
      minWidth: 150,
    },
    {
      field: "updateDate",
      headerName: "Last Update",
      minWidth: 150,
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => getDataTicket(params.row.id)}
              aria-label="edit"
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </>
        );
        // return <Button>Click</Button>;
      },
      // valueGetter: (params) =>
      //   `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ];
  const [dataAxios, setDataAxios] = useState([]);
  const getDataAxios = () => {
    axios
      .get(urlBackend)
      .then((res) => {
        const newData = res.data.result.map((data, index) => {
          return {
            No: index + 1,
            id: data.id,
            title: data.title,
            description: data.description,
            contact: data.contact,
            statusTicket: data.statusTicket,
            createDate: moment(data.createDate)
              .locale("th")
              .format("DD/MM/YYYY HH:mm"),
            updateDate: moment(data.updateDate)
              .locale("th")
              .format("DD/MM/YYYY HH:mm"),
          };
        });
        setDataAxios(newData);
        props.reloadStatus(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getDataTicket = (id = null) => {
    if (id) {
      const findData = dataAxios.find((data) => data.id === id);
      props.editData(findData);
    }
  };

  useEffect(() => {
    if (props.reload) {
      getDataAxios();
    }
  }, [props.reload]);

  return (
    <>
      <Box style={{ height: 371, width: "100%" }}>
        <DataGrid
          rows={dataAxios}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
}
