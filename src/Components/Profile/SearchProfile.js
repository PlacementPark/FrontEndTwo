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
import DeleteSweepTwoToneIcon from "@mui/icons-material/DeleteSweepTwoTone";
import AxiosInstance from "../Main/AxiosInstance";

export default function SearchProfile() {
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
         await AxiosInstance.delete("/candidate/" + id);
         setTableData(tableData.filter((d) => d._id !== id));
         handleClose();
      } catch (error) {}
   };

   const handleSearch = async () => {
      if (
         searchParams.name === "" &&
         searchParams.mobile === "" &&
         searchParams.email === ""
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
         const res = await AxiosInstance.post("/candidate/search", {
            ...searchParams,
            name: newName,
         });
         //log the array of candidates
         console.log("Candidate Data:", res.data);
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
   const formatUtcToIST = (utcIso) => {
      if (!utcIso) return "";
      const iso = utcIso.endsWith("Z") ? utcIso : `${utcIso}Z`;
      const d = new Date(iso);

      const parts = new Intl.DateTimeFormat("en-IN", {
         timeZone: "Asia/Kolkata",
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         // hour: "2-digit",
         // minute: "2-digit",
         // hour12: true,
      }).formatToParts(d);

      const get = (t) => parts.find((p) => p.type === t)?.value || "";
      // return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get("minute")} ${get("dayPeriod")}`;
      return `${get("day")}-${get("month")}-${get("year")}`;
   
   };
   
   const column = [
      { headerName: "Candidate Name", field: "fullName" },
      { headerName: "Candidate ID", field: "candidateId" },
      { headerName: "Candidate Number", field: "mobile", sortable: false },
      { headerName: "Created By", field: "createdByEmployee.name" },
      { headerName: "Assigned to", field: "assignedEmployee.name" },
      {
         headerName: "Created & Assigned Dates",
         valueGetter: (params) => {
            const created = formatUtcToIST(params.data?.createdOn); // backend field name
            const assigned = formatUtcToIST(params.data?.assignedOn); // backend field name

            if (created && assigned) return `${created} | ${assigned}`;
            return created || assigned || "-";
         },
      },
      { headerName: "L1 Status", field: "l1Assessment" },
      { headerName: "L2 Status", field: "l2Assessment" },
      { headerName: "Interview Status", field: "interviewStatus" },
      {
         headerName: "Actions",
         width: isAdmin ? "350px" : "250px",
         field: "assignedEmployee",

         comparator: (a, b) => {
            if (a === empId && b !== empId) return -1;
            else if (b === empId && a !== empId) return 1;
            else if (a === undefined || a === null) return 1;
            else if (b === undefined || b === null) return -1;
            else return 0;
         },
         cellRenderer: (props) => {
            return (
               <>
                  <Grid container columnSpacing={1}>
                     <Grid item xs={isAdmin ? 4 : 6}>
                        <IconButton
                           color="primary"
                           href={`/EditCandidate/${props.data._id}?edit=false`}
                        >
                           <VisibilityTwoToneIcon />
                        </IconButton>
                     </Grid>
                     <Grid item xs={isAdmin ? 4 : 6}>
                        <IconButton
                           size="small"
                           color="secondary"
                           href={`/EditCandidate/${props.data._id}?edit=true`}
                           disabled={
                              !rtAccess
                                 ? false
                                 : props.data.assignedEmployee._id === empId
                                   ? false
                                   : true
                           }
                        >
                           <BorderColorTwoToneIcon />
                        </IconButton>
                     </Grid>
                     {isAdmin && (
                        <Grid item xs={4}>
                           <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                 setDeleteData({
                                    name: props.data.fullName,
                                    id: props.data.candidateId,
                                    _id: props.data._id,
                                 });
                                 handleClickOpen();
                              }}
                           >
                              <DeleteSweepTwoToneIcon />
                           </IconButton>
                        </Grid>
                     )}
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
                  title="SEARCH PROFILE"
                  titleTypographyProps={{
                     sx: {
                        fontSize: "2.8vh",
                        letterSpacing: "5px",
                     },
                  }}
               />
               <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.7) }}>
                  <Grid container rowSpacing={2} columnSpacing={1}>
                     <Grid item xs={12} md={4}>
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
                     <Grid item xs={12} md={4}>
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
                     <Grid item xs={12} md={4}>
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
                        className="ag-theme-quartz-dark custom-grid"
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
