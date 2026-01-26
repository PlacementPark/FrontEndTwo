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

export default function SearchCompany() {
   // STATES HANDLING AND VARIABLES
   const { employeeType, userid } = useSelector((state) => state.user);
   const empId = userid;
   const access = !["Recruiter", "Teamlead", "Intern"].includes(employeeType);
   const isAdmin = employeeType === "Admin";
   const navigate = useNavigate();
   const [searchParams, setSearchParams] = React.useState({
      companyName: "",
      HRMobile: "",
      HREmail: "",
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
      const toastId = toast.loading("Deleting company...");
      try {
         await AxiosInstance.delete("/company/" + id);
         setTableData(tableData.filter((d) => d._id !== id));
         handleClose();
         toast.update(toastId, {
            render: "Company deleted successfully",
            type: "success",
            isLoading: false,
            autoClose: 4000,
         });
      } catch (error) {
         toast.update(toastId, {
            render: "Failed to delete company",
            type: "error",
            isLoading: false,
            autoClose: 4000,
         });
      }
   };

   const handleSearch = async () => {
      if (
         searchParams.companyName === "" &&
         searchParams.HRMobile === "" &&
         searchParams.HREmail === ""
      ) {
         toast.warning("Please enter at least one search parameter");
         return;
      }

      const toastId = toast.loading("Searching companies...");
      try {
         const nameLen = searchParams.companyName.length;
         let newName = "";
         for (let i = 0; i < nameLen; i++) {
            if (
               searchParams.companyName[i] === "(" ||
               searchParams.companyName[i] === "("
            )
               newName += "\\";
            newName += searchParams.companyName[i];
         }
         const res = await AxiosInstance.post("/company/search", {
            companyName: newName,
            HRMobile: searchParams.HRMobile,
            HREmail: searchParams.HREmail,
         });
         console.log("Company Data:", res.data);
         setTableData(res.data);
         toast.update(toastId, {
            render: `Found ${res.data.length} companies`,
            type: "success",
            isLoading: false,
            autoClose: 4000,
         });
      } catch (error) {
         toast.update(toastId, {
            render: "Search failed",
            type: "error",
            isLoading: false,
            autoClose: 4000,
         });
      }
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
         headerName: "Actions",
         width: access ? 200 : 100,
         cellRenderer: (props) => {
            if (!props.data) return null;
            return (
               <Grid container columnSpacing={1}>
                  <Grid item xs={access ? 4 : 12}>
                     <IconButton
                        color="primary"
                        size="small"
                        href={`/EditEmpanelled/${props.data._id}?edit=false`}
                     >
                        <VisibilityTwoToneIcon />
                     </IconButton>
                  </Grid>
                  {access && (
                     <>
                        <Grid item xs={4}>
                           <IconButton
                              size="small"
                              color="warning"
                              href={`/EditEmpanelled/${props.data._id}?edit=true`}
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
                                    name: props.data.companyName,
                                    id: props.data.companyId,
                                    _id: props.data._id,
                                 });
                                 handleClickOpen();
                              }}
                           >
                              <DeleteSweepTwoToneIcon />
                           </IconButton>
                        </Grid>
                     </>
                  )}
               </Grid>
            );
         },
      },
      {
         headerName: "Company Name",
         field: "companyName",
         headerCheckboxSelection: true,
         checkboxSelection: true,
         headerCheckboxSelectionFilteredOnly: true,
      },
      {
         headerName: "Company ID",
         field: "companyId",
      },
      {
         headerName: "HR Name",
         field: "HR.HRName",
         hide: !access,
         valueGetter: (params) =>
            params.data?.HR?.map((hr) => hr.HRName).join(", "),
      },
      {
         headerName: "HR Mobile",
         field: "HR.HRMobile",
         hide: !access,
         valueGetter: (params) =>
            params.data?.HR?.map((hr) => hr.HRMobile?.join(", ")).join("; "),
      },
      {
         headerName: "HR Email",
         field: "HR.HREmail",
         hide: !access,
         valueGetter: (params) =>
            params.data?.HR?.map((hr) => hr.HREmail).join(", "),
      },
      {
         headerName: "Company Type",
         field: "companyType",
      },
      {
         headerName: "About",
         field: "about",
      },
      {
         headerName: "Remarks",
         field: "remarks",
      },
      {
         headerName: "Response",
         field: "response",
      },
      {
         headerName: "Empanelled",
         field: "empanelled",
         valueGetter: (params) => (params.data?.empanelled ? "Yes" : "No"),
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
                  title="SEARCH COMPANIES"
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
                           label="Company Name"
                           variant="outlined"
                           fullWidth
                           value={searchParams.companyName}
                           onChange={(e) =>
                              setSearchParams({
                                 ...searchParams,
                                 companyName: e.target.value,
                              })
                           }
                        />
                     </Grid>
                     <Grid item xs={12} md={4}>
                        <TextField
                           type="number"
                           label="HR Mobile Number"
                           variant="outlined"
                           fullWidth
                           value={searchParams.HRMobile}
                           onChange={(e) =>
                              setSearchParams({
                                 ...searchParams,
                                 HRMobile: e.target.value,
                              })
                           }
                        />
                     </Grid>
                     <Grid item xs={12} md={4}>
                        <TextField
                           label="HR Email ID"
                           variant="outlined"
                           fullWidth
                           value={searchParams.HREmail}
                           onChange={(e) =>
                              setSearchParams({
                                 ...searchParams,
                                 HREmail: e.target.value,
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
