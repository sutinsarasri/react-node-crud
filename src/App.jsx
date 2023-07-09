import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import DataGridDemo from "./components/DataComponent";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Field, Formik, useField } from "formik";
import * as yup from "yup";
import "./App.css";
import Swal from "sweetalert2";
import config from "../config/config";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
const urlBackend = import.meta.env.VITE_BASE_URL_API;
axios.defaults.baseURL = urlBackend;
const ticketStatus = config;

function App() {
  const [editData, setEditData] = useState(false);
  const [dataForm, setDataForm] = useState({
    title: "",
    description: "",
    contact: "",
    statusTicket: "",
  });

  const [titleModal, setTitleModal] = useState("Ticket");
  const [open, setOpen] = useState(false);
  const [reloadData, setReloadData] = useState(true);

  const validationSchema = yup.object().shape({
    title: yup
      .string()
      .max(500, "We need less than 500 character.")
      .required("Please fill data in blank input."),
    description: yup
      .string()
      .max(500, "We need less than 500 character.")
      .required("Please fill data in blank input."),
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setTitleModal("Create Ticket");
    setDataForm({
      title: "",
      description: "",
      contact: "",
      statusTicket: "",
    });
    setEditData(false);
    setOpen(true);
  };

  const createTicket = (inputValue = {}) => {
    if (editData) {
      axios
        .put("/update", {
          id: inputValue.id,
          title: inputValue.title,
          description: inputValue.description,
          contact: inputValue.contact,
          status: inputValue.statusTicket,
        })
        .then((res) => {
          setOpen(false);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          setReloadData(true);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: err.response.data.message,
            text: err.response.data.Error,
          });
        });
    } else {
      axios
        .post("/create", inputValue)
        .then((res) => {
          setOpen(false);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          setReloadData(true);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: err.response.data.message,
            text: err.response.data.Error,
          });
        });
    }
  };

  const reloadStatus = (data) => {
    if (data) {
      setReloadData(false);
    }
  };

  const getDataEdit = (data) => {
    if (data) {
      setOpen(true);
      setEditData(true);
      setTitleModal("Edit Ticket");
      setDataForm(data);
    }
  };

  return (
    <Container maxWidth={false}>
      <h1 className="text-center">React + nodejs</h1>
      <div>
        <Button
          sx={{ marginY: "5px" }}
          variant="outlined"
          onClick={handleClickOpen}
        >
          Add Ticket
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>{titleModal}</DialogTitle>

          <DialogContent sx={{ marginTop: "5px" }}>
            <div>
              <Formik
                initialValues={dataForm}
                validationSchema={validationSchema}
                onSubmit={(values) => createTicket(values)}
              >
                {(formDatas) => (
                  <form onSubmit={formDatas.handleSubmit}>
                    {Boolean(formDatas.errors.title) && (
                      <Typography
                        variant="caption"
                        gutterBottom
                        color={"error"}
                      >
                        {formDatas.errors.title}
                      </Typography>
                    )}

                    <TextField
                      error={Boolean(formDatas.errors.title)}
                      autoFocus
                      margin="dense"
                      name="title"
                      label="title"
                      type="text"
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={formDatas.values.title}
                      onChange={formDatas.handleChange}
                    />
                    {Boolean(formDatas.errors.description) && (
                      <Typography
                        variant="caption"
                        gutterBottom
                        color={"error"}
                      >
                        {formDatas.errors.description}
                      </Typography>
                    )}
                    <TextField
                      error={Boolean(formDatas.errors.description)}
                      margin="dense"
                      name="description"
                      label="Description"
                      type="text"
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      variant="outlined"
                      value={formDatas.values.description}
                      onChange={formDatas.handleChange}
                    />
                    <TextField
                      margin="dense"
                      name="contact"
                      label="Contact"
                      type="text"
                      multiline
                      fullWidth
                      rows={2}
                      size="small"
                      variant="outlined"
                      value={formDatas.values.contact}
                      onChange={formDatas.handleChange}
                    />
                    {editData && (
                      <FormControl fullWidth sx={{ marginY: "10px" }}>
                        <InputLabel id="status-label">Age</InputLabel>
                        <Select
                          labelId="status-label"
                          name="statusTicket"
                          label="Status"
                          fullWidth
                          onChange={formDatas.handleChange}
                          value={formDatas.values.statusTicket}
                        >
                          {ticketStatus.map((rowStatus, index) => (
                            <MenuItem key={index} value={rowStatus.key}>
                              {rowStatus.text}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    <Divider sx={{ marginY: "10px" }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 1,
                        m: 1,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                      }}
                    >
                      <Button type="submit" variant="contained">
                        Save
                      </Button>
                      <Button onClick={handleClose}>Cancel</Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <DataGridDemo
          reload={reloadData}
          reloadStatus={reloadStatus}
          editData={getDataEdit}
        />
      </div>
      <div></div>
    </Container>
  );
}

export default App;
