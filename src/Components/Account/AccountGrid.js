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
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import BorderColorTwoToneIcon from "@mui/icons-material/BorderColorTwoTone";
import DeleteSweepTwoToneIcon from "@mui/icons-material/DeleteSweepTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import ExcelExport from "../Main/ExcelExport";

export default function AccountGrid() {
   // STATES HANDLING AND VARIABLES
   const [open, setOpen] = React.useState(false);
   const [deleteData, setDeleteData] = React.useState({});
   const [employeeList, setEmployeeList] = useState([]);
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const gridapi = React.useRef();
   const [fileName, setFileName] = useState(String(new Date()));
   const [count, setCount] = useState(0);

   // FUNCTIONS HANDLING AND SEARCH API CALLS
   useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await axios.get(
               "https://tpp-backend-eura.onrender.com/api/v1/employee/employeeType/" +
                  searchParams.get("employeeType"),
               {
                  headers: {
                     authorization: JSON.parse(localStorage.getItem("user"))
                        .token,
                  },
               }
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
      {
         headerName: "Employee Name",
         field: "name",
         width: "280px",
         headerCheckboxSelection: true,
         checkboxSelection: true,
         headerCheckboxSelectionFilteredOnly: true,
      },
      { headerName: "Employee ID", field: "employeeId", width: "180px" },
      {
         headerName: "Employee Number",
         field: "mobile",
         width: "200px",
         sortable: false,
      },
      {
         headerName: "Employee Status",
         width: "180px",
         cellRenderer: (props) => {
            return (
               <>
                  {props.data.status ? (
                     <>
                        <IconButton color="success">
                           <CheckCircleTwoToneIcon />
                        </IconButton>
                     </>
                  ) : (
                     <>
                        <IconButton color="error">
                           <CancelTwoToneIcon />
                        </IconButton>
                     </>
                  )}
               </>
            );
         },
      },
      {
         headerName: "Actions",
         width: "200px",
         cellRenderer: (props) => {
            return (
               <>
                  <Grid container columnSpacing={1}>
                     <Grid item xs={4}>
                        <IconButton
                           color="primary"
                           size="small"
                           onClick={() =>
                              navigate(
                                 `/EditEmployee/${props.data._id}?edit=false`
                              )
                           }
                        >
                           <VisibilityTwoToneIcon />
                        </IconButton>
                     </Grid>
                     <Grid item xs={4}>
                        <IconButton
                           size="small"
                           color="secondary"
                           onClick={() =>
                              navigate(
                                 `/EditEmployee/${props.data._id}?edit=true`
                              )
                           }
                        >
                           <BorderColorTwoToneIcon />
                        </IconButton>
                     </Grid>
                     <Grid item xs={4}>
                        <IconButton
                           size="small"
                           color="error"
                           onClick={() => {
                              setDeleteData({
                                 name: props.data.name,
                                 id: props.data.employeeId,
                                 _id: props.data._id,
                              });
                              handleClickOpen();
                           }}
                        >
                           <DeleteSweepTwoToneIcon />
                        </IconButton>
                     </Grid>
                  </Grid>
               </>
            );
         },
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
         axios.delete(
            "https://tpp-backend-eura.onrender.com/api/v1/employee/" + id,
            {
               headers: {
                  authorization: JSON.parse(localStorage.getItem("user")).token,
               },
            }
         );
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

   return (
      <>
         <div style={{ height: "100vh", width: "100vw" }}>
            <Grid
               container
               spacing={2}
               sx={{ paddingTop: "9vh", marginLeft: "0.5%", width: "98%" }}
            >
               <Grid item xs={2} md={1}>
                  <TextField
                     fullWidth
                     size="small"
                     type="number"
                     label="No.of Rows"
                     className="tw"
                     value={count}
                     onChange={(e) => setCount(e.target.value)}
                  />
               </Grid>
               <Grid item xs={2}>
                  <Button
                     fullWidth
                     variant="contained"
                     sx={{
                        height: "100%",
                        backgroundColor: alpha("#0000FF", 0.4),
                     }}
                     onClick={() => {
                        if (employeeList.length === 0) {
                           toast.error("No Rows to select");
                           return;
                        }
                        for (
                           var i = 0;
                           i < Math.min(count, employeeList.length);
                           i++
                        ) {
                           var node = gridapi?.current.api.getRowNode(i);
                           node.setSelected(true);
                        }
                     }}
                  >
                     Select
                  </Button>
               </Grid>
               <Grid item xs={0.5} md={4} />
               <Grid item xs={4} md={3}>
                  <TextField
                     size="small"
                     label="File Name"
                     value={fileName}
                     fullWidth
                     className="tw"
                     onChange={(e) => setFileName(e.target.value)}
                  />
               </Grid>
               <Grid item xs={3.5} md={2}>
                  <ExcelExport
                     height="100%"
                     gridRef={gridapi}
                     fileName={fileName}
                  />
               </Grid>
            </Grid>
            <div
               className="ag-theme-quartz-dark"
               style={{
                  marginTop: "2vh",
                  marginLeft: "1vw",
                  height: "82vh",
                  width: "98vw",
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
                  <Typography sx={{ display: "inline" }}>
                     {" "}
                     {deleteData.id}
                  </Typography>
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
