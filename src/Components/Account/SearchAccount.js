import React from "react";
import {
   Container,
   TextField,
   Card,
   CardHeader,
   CardContent,
   Button,
   Grid,
   BottomNavigation,
   alpha,
   Typography,
   DialogActions,
   DialogContent,
   DialogTitle,
   Dialog,
   IconButton,
   Autocomplete,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import BorderColorTwoToneIcon from "@mui/icons-material/BorderColorTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import DeleteSweepTwoToneIcon from "@mui/icons-material/DeleteSweepTwoTone";
import AxiosInstance from "../Main/AxiosInstance";
import {
   EMPLOYEE_TYPE
} from "../Main/Constants";
export default function SearchAccount() {
   // STATES HANDLING AND VARIABLES
   const { employeeType, userid } = useSelector((state) => state.user);
   const empId = userid;
   const rtAccess = ["Recruiter", "Intern"].includes(employeeType);
   const isAdmin = employeeType === "Admin";
   const navigate = useNavigate();
   const [searchParams, setSearchParams] = React.useState({
      name: "",
      mobile: "",
      email: "",
      employeeType: [],
   });
   const [tableData, setTableData] = React.useState([]);
   const [deleteData, setDeleteData] = React.useState({});
   const [open, setOpen] = React.useState(false);

   // FUNCTIONS HANDLING AND SEARCH API CALLS
   const handleClickOpen = () => {
      setOpen(true);
   };
   const handleClose = () => {
      setOpen(false);
   };

   const handleDelete = async (id) => {
      try {
         await AxiosInstance.delete("/employee/" + id);
         setTableData(tableData.filter((d) => d._id !== id));
         handleClose();
      } catch (error) {}
   };

   const handleSearch = async () => {
      if (
         searchParams.name === "" &&
         searchParams.mobile === "" &&
         searchParams.email === "" &&
         searchParams.employeeType.length === 0
      ) {
         toast.warning("Handle");
         return;
      }

      try {
         var nameLen = searchParams.name.length;
         var newName = "";
         for (var i = 0; i < nameLen; i++) {
            if (searchParams.name[i] === "(" || searchParams.name[i] === "(")
               newName += "\\";
            newName += searchParams.name[i];
         }
         const res = await AxiosInstance.post("/employee/search", {
            ...searchParams,
            name: newName,
         });
         //log the array of candidates

         setTableData(res.data);
      } catch (error) {}
   };

   //console.log(assignedEmployee.name);

   // GRID HEADER/COLOUMS HANDLING
   const selection = React.useMemo(() => {
      return {
         mode: "multiRow",
         groupSelects: "descendants",
      };
   }, []);
   const paginationPageSizeSelector = React.useMemo(() => {
      return [200, 500, 1000];
   }, []);

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
         headerName: "Employee Type",
         field: "employeeType",
         width: "200px",
         
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
   };

   //JSX CODE
   return (
      <>
         <Container maxWidth={false} sx={{ paddingTop: "9vh", width: "96%" }}>
            <Card
               sx={{
                  borderRadius: "20px",
                  backgroundColor: "transparent",
               }}
            >
               <CardHeader
                  sx={{
                     backgroundColor: alpha("#0B0B0B", 0.5),
                     backdropFilter: "blur(5px)",
                     height: "7.5vh",
                     color: "white",
                  }}
                  title="SEARCH EMPLOYEE"
                  titleTypographyProps={{
                     sx: {
                        fontSize: "2.8vh",
                        letterSpacing: "5px",
                     },
                  }}
               />
               <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.7) }}>
                  <Grid container rowSpacing={2} columnSpacing={1}>
                     <Grid item xs={12} md={3}>
                        <TextField
                           label="Name"
                           variant="outlined"
                           fullWidth
                           value={searchParams.name}
                           onChange={(e) =>
                              setSearchParams({
                                 ...searchParams,
                                 name: e.target.value,
                              })
                           }
                        />
                     </Grid>
                     <Grid item xs={12} md={3}>
                        <TextField
                           type="number"
                           label="Mobile Number"
                           variant="outlined"
                           fullWidth
                           value={searchParams.mobile}
                           onChange={(e) =>
                              setSearchParams({
                                 ...searchParams,
                                 mobile: e.target.value,
                              })
                           }
                        />
                     </Grid>
                     <Grid item xs={12} md={3}>
                        <TextField
                           label="Email ID"
                           variant="outlined"
                           fullWidth
                           value={searchParams.email}
                           onChange={(e) =>
                              setSearchParams({
                                 ...searchParams,
                                 email: e.target.value,
                              })
                           }
                        />
                     </Grid>
                     <Grid item xs={12} md={3}>
                        <Autocomplete
                           multiple
                           id="employeeType"
                           options={EMPLOYEE_TYPE.map((a) => a)}
                           filterSelectedOptions
                           value={searchParams.employeeType}
                           onChange={(e, v) =>
                              setSearchParams({
                                 ...searchParams,
                                 employeeType: v,
                              })
                           }
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label="Designation"
                              />
                           )}
                        />
                     </Grid>
                     <Grid item xs={8} md={9} />
                     <Grid item xs={4} md={3}>
                        <Button
                           fullWidth
                           size="large"
                           sx={{
                              backgroundColor: alpha("#0000FF", 0.5),
                              height: "100%",
                           }}
                           variant="contained"
                           onClick={handleSearch}
                        >
                           Search
                        </Button>
                     </Grid>
                  </Grid>
               </CardContent>
               <BottomNavigation
                  sx={{
                     backgroundColor: alpha("#0B0B0B", 0.5),
                     backdropFilter: "blur(5px)",
                     height: "7vh",
                  }}
               />
            </Card>
         </Container>
         <Container
            maxWidth={false}
            sx={{ paddingTop: "2vh", width: "96%", paddingBottom: "2vh" }}
         >
            <Card
               sx={{
                  borderRadius: "20px",
                  backgroundColor: "transparent",
               }}
            >
               <CardHeader
                  sx={{
                     backgroundColor: alpha("#0B0B0B", 0.5),
                     backdropFilter: "blur(5px)",
                     height: "7.5vh",
                     color: "white",
                  }}
                  title="SEARCH RESULTS"
                  titleTypographyProps={{
                     sx: {
                        fontSize: "2.8vh",
                        letterSpacing: "5px",
                     },
                  }}
               />
               <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.2) }}>
                  <Grid container>
                     <div
                        className="ag-theme-quartz-dark"
                        style={{
                           height: "100%",
                           width: "100%",
                        }}
                     >
                        <AgGridReact
                           domLayout="autoHeight"
                           rowData={tableData}
                           columnDefs={column}
                           defaultColDef={defaultColDef}
                           pagination={true}
                           paginationPageSize={100}
                           selection={selection}
                           paginationPageSizeSelector={
                              paginationPageSizeSelector
                           }
                        />
                     </div>
                  </Grid>
               </CardContent>
               <BottomNavigation
                  sx={{
                     backgroundColor: alpha("#0B0B0B", 0.5),
                     backdropFilter: "blur(5px)",
                     height: "7vh",
                  }}
               />
            </Card>
         </Container>
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
               sx={{ m: 0, p: 2, textTransform: "uppercase", letterSpacing: 6 }}
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
      </>
   );
}
