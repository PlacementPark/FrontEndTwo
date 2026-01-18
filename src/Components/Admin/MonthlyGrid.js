import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  alpha,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import BorderColorTwoToneIcon from "@mui/icons-material/BorderColorTwoTone";
import DeleteSweepTwoToneIcon from "@mui/icons-material/DeleteSweepTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import ExcelExport from "../Main/ExcelExport";
import AxiosInstance from "../Main/AxiosInstance";

export default function MonthlyGrid() {
  // STATES HANDLING AND VARIABLES
  const [open, setOpen] = React.useState(false);
  const [deleteData, setDeleteData] = React.useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const gridapi = React.useRef();
  const [fileName, setFileName] = useState(String(new Date()));
  const [count, setCount] = useState(0);
  const theme = createTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  // FUNCTIONS HANDLING AND SEARCH API CALLS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AxiosInstance.get(
          "/employee/employeeType/" + searchParams.get("employeeType")
        );
        setEmployeeList(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [setEmployeeList, searchParams]);

  // GRID HEADER/COLOUMS HANDLING
  const column = [
    // {
    //   headerName: "Actions",
    //   width: 100,
    //   pinned: "left",
    //   cellRenderer: (props) => {
    //     return (
    //       <>
    //         <Grid container columnSpacing={1}>
    //           <Grid item xs={4}>
    //             <IconButton
    //               color="primary"
    //               size="small"
    //               onClick={() =>
    //                 navigate(`/EditEmployee/${props.data._id}?edit=false`)
    //               }
    //             >
    //               <VisibilityTwoToneIcon />
    //             </IconButton>
    //           </Grid>
    //           <Grid item xs={4}>
    //             <IconButton
    //               size="small"
    //               color="warning"
    //               onClick={() =>
    //                 navigate(`/EditEmployee/${props.data._id}?edit=true`)
    //               }
    //             >
    //               <BorderColorTwoToneIcon />
    //             </IconButton>
    //           </Grid>
    //           <Grid item xs={4}>
    //             <IconButton
    //               size="small"
    //               color="error"
    //               onClick={() => {
    //                 setDeleteData({
    //                   name: props.data.name,
    //                   id: props.data.employeeId,
    //                   _id: props.data._id,
    //                 });
    //                 handleClickOpen();
    //               }}
    //             >
    //               <DeleteSweepTwoToneIcon />
    //             </IconButton>
    //           </Grid>
    //         </Grid>
    //       </>
    //     );
    //   },
    // },
    {
      headerName: "Employee Name",
      field: "name",
      pinned: "left",
      width: 200,
    },
    { headerName: "Employee ID", field: "employeeId", width: 120 },
    {
      headerName: "Awaiting Joining",
      field: "",
      width: 150,
    },
    {
      headerName: "Awaiting Joining Amount",
      field: "",
      width: 150,
    },
    {
      headerName: "Joined",
      field: "",
      width: 150,
    },
    {
      headerName: "Joined Amount",
      field: "",
      width: 150,
    },
    {
      headerName: "Offer Drop",
      field: "",
      width: 150,
    },
    {
      headerName: "Offer Drop Amount",
      field: "",
      width: 150,
    },
    {
      headerName: "NT/RD",
      field: "",
      width: 150,
    },
    {
      headerName: "NT/RD Amount",
      field: "",
      width: 150,
    },
    {
      headerName: "Billed",
      field: "",
      width: 150,
    },
    {
      headerName: "Billed Amount",
      field: "",
      width: 150,
    },
    {
      headerName: "Total Business",
      field: "",
      width: 150,
    },
    {
      headerName: "Target",
      field: "",
      width: 150,
    },
    {
      headerName: "Ach %",
      field: "",
      width: 150,
    },
    {
      headerName: "Good",
      field: "",
      width: 150,
    },
    {
      headerName: "TAC",
      field: "",
      width: 150,
    },
    {
      headerName: "Future Lead",
      field: "",
      width: 150,
    },
    {
      headerName: "Rescheduled",
      field: "",
      width: 150,
    },
    {
      headerName: "No Show - W",
      field: "",
      width: 150,
    },
    {
      headerName: "No Show - IM",
      field: "",
      width: 150,
    },
    {
      headerName: "WD",
      field: "",
      width: 150,
    },{
      headerName: "Client In Process",
      field: "",
      width: 150,
    },
    {
      headerName: "Client Rejects",
      field: "",
      width: 150,
    },
    {
      headerName: "Selection %",
      field: "",
      width: 150,
    },
  ];

  const defaultColDef = {
    sortable: true,
    editable: false,
    cellEditor: false,
    filter: true,
    rowSelection: "multiple",
  };

  const selection = React.useMemo(() => {
    return {
      mode: "multiRow",
      groupSelects: "descendants",
    };
  }, []);
  const paginationPageSizeSelector = React.useMemo(() => {
    return [200, 500, 1000];
  }, []);

  // FUNCTIONS HANDLING
  const handleDelete = async (id) => {
    try {
      await AxiosInstance.delete("/employee/" + id);
      setEmployeeList(employeeList.filter((d) => d._id !== id));
      handleClose();
    } catch (error) {}
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleExcelExport = async () => {
    const selectedRows = gridapi.current.api.getSelectedRows();

    if (!selectedRows || selectedRows.length === 0) {
      toast.error("No Rows selected");
      return;
    }

    const selectedIds = selectedRows.map((row) => row._id).filter(Boolean);

    if (selectedIds.length === 0) {
      toast.error("Selected rows have no valid IDs");
      return;
    }

    const toastId = toast.loading("Exporting Excel...");
    try {
      const response = await AxiosInstance.post(
        "/employee/excelExport",
        { ids: selectedIds, name: fileName },
        { responseType: "blob" }
      );

      // download Excel
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName || "employees"}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.update(toastId, {
        render: "Excel exported successfully!",
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to export Excel",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  return (
    <>
      <div style={{ height: "100vh", width: "100vw", paddingTop: "6.5vh" }}>
        <div
          className="ag-theme-quartz-dark custom-grid"
          style={{
            marginTop: "1vh",
            marginLeft: isSmall ? "1%" : "0.2%",
            height: "92vh",
            width: isSmall ? "98%" : "99.6%",
          }}
        >
          <AgGridReact
            ref={gridapi}
            rowData={employeeList}
            columnDefs={column}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={100}
            selection={selection}
            paginationPageSizeSelector={paginationPageSizeSelector}
            rowSelection={"multiple"}
            rowHeight={28}      // <-- set row height here
            headerHeight={35}   // <-- set header height here
          />
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            backgroundColor: "transparent",
            "& .MuiDialog-paper": {
              backgroundColor: "transparent",
              backdropFilter: "blur(100px)",
              boxShadow: "none",
              color: "white",
            },
          }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              textTransform: "uppercase",
              letterSpacing: 6,
            }}
            id="customized-dialog-title"
          >
            Confirm Delete
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers className="dw">
            <Typography
              gutterBottom
              sx={{
                wordBreak: "break-word",
                textTransform: "capitalize",
                fontWeight: "bold",
              }}
            >
              Are you Sure that you want to Delete ?
            </Typography>
            <Typography sx={{ fontWeight: "bold", display: "inline" }}>
              Candidate ID :
            </Typography>
            <Typography sx={{ display: "inline" }}> {deleteData.id}</Typography>
            <Typography></Typography>
            <Typography sx={{ fontWeight: "bold", display: "inline" }}>
              Candidate Name :
            </Typography>
            <Typography sx={{ display: "inline" }}>
              {" "}
              {deleteData.name}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              size="large"
              color="error"
              sx={{ backgroundColor: alpha("#FF0000", 0.4) }}
              onClick={() => {
                handleDelete(deleteData._id);
              }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{ backgroundColor: alpha("#0000FF", 0.5) }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
