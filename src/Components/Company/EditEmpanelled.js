import React from "react";
import {
   Button,
   Grid,
   DialogActions,
   DialogContent,
   DialogTitle,
   Dialog,
   Card,
   CardHeader,
   CardContent,
   IconButton,
   Typography,
   BottomNavigation,
   Container,
   TextField,
   MenuItem,
   alpha,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { useSelector } from "react-redux";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import BorderColorTwoToneIcon from "@mui/icons-material/BorderColorTwoTone";
import DeleteSweepTwoToneIcon from "@mui/icons-material/DeleteSweepTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import ExcelExport from "../../Components/Main/ExcelExport";
import AxiosInstance from "../Main/AxiosInstance";

export default function EditEmpanelled() {
   // STATES HANDLING AND VARIABLES
   const [open, setOpen] = React.useState(false);
   const { employeeType } = useSelector((state) => state.user);
   const [fileName, setFileName] = React.useState(String(new Date()));
   const [count, setCount] = React.useState(0);
   const { id } = useParams();
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const access = !["Recruiter", "Teamlead", "Intern"].includes(employeeType);
   const editable = searchParams.get("edit") === "true";
   const [deleteData, setDeleteData] = React.useState({});
   const [company, setCompany] = React.useState({
      companyName: "",
      companyType: "",
      HR: [
         {
            HRName: "",
            HRMobile: [""],
            HREmail: "",
            HRDesignation: "",
            HRLocation: "",
         },
      ],
      about: "",
      remarks: "",
      response: "Empanelled",
      empanelled: true,
      roles: [],
      paymentTerms: 0,
   });

   // API CALLS HANDLING
   React.useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await AxiosInstance.get("/company/company/" + id);
            setCompany(res.data.data);
         } catch (error) {}
      };
      fetchData();
   }, []);

   //DROP DOWN OPTIONS AND VALUES
   const Empanelled = [
      { value: true, label: "Active" },
      { value: false, label: "In-Active" },
   ];
   const source = [
      {
         value: "Empanelled",
         label: "Empanelled",
      },
      {
         value: "Need to Approach",
         label: "Need to Approach",
      },
      {
         value: "In Process",
         label: "In Process",
      },
      {
         value: "Future",
         label: "Future",
      },
      {
         value: "Not Intrested",
         label: "Not Intrested",
      },
      {
         value: "Rejected",
         label: "Rejected",
      },
      {
         value: "No Response",
         label: "No Response",
      },
   ];

   // GRID HEADER/COLOUMS HANDLING
   const column = [
      { headerName: "Role", field: "role", width: "150px" },
      { headerName: "Qualifications", field: "qualification", width: "150px" },
      { headerName: "Salary", field: "salary", width: "150px" },
      {
         headerName: "Experience",
         width: "100px",
         field: "experience",
      },
      {
         headerName: "Status",
         hide: !access,
         width: "100px",
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
         headerName: "In Process",
         width: "120px",
         cellRenderer: (props) => {
            return (
               <>
                  <Grid item xs={12}>
                     <Button
                        color="success"
                        size="small"
                        onClick={() =>
                           navigate(
                              "/CandidateGrid?type=CompanyInterviewScheduled&&roleId=" +
                                 props.data._id
                           )
                        }
                     >
                        {props.data.inProcess}
                     </Button>
                  </Grid>
               </>
            );
         },
      },
      {
         headerName: "Rejected",
         width: "120px",
         cellRenderer: (props) => {
            return (
               <>
                  <Grid item xs={12}>
                     <Button
                        color="success"
                        size="small"
                        onClick={() =>
                           navigate(
                              "/CandidateGrid?type=Rejects&&roleId=" +
                                 props.data._id
                           )
                        }
                     >
                        {props.data.rejected}
                     </Button>
                  </Grid>
               </>
            );
         },
      },
      {
         headerName: "Awaiting Joining",
         width: "120px",
         cellRenderer: (props) => {
            return (
               <>
                  <Grid item xs={12}>
                     <Button
                        color="success"
                        size="small"
                        onClick={() =>
                           navigate(
                              "/CandidateGrid?type=AwaitingJoining&&roleId=" +
                                 props.data._id
                           )
                        }
                     >
                        {props.data.awaiting}
                     </Button>
                  </Grid>
               </>
            );
         },
      },
      {
         headerName: "Offer Drop",
         width: "120px",
         cellRenderer: (props) => {
            return (
               <>
                  <Grid item xs={12}>
                     <Button
                        color="success"
                        size="small"
                        onClick={() =>
                           navigate(
                              "/CandidateGrid?type=OfferDrop&&roleId=" +
                                 props.data._id
                           )
                        }
                     >
                        {props.data.offerDrop}
                     </Button>
                  </Grid>
               </>
            );
         },
      },
      {
         headerName: "Joined",
         width: "120px",
         cellRenderer: (props) => {
            return (
               <>
                  <Grid item xs={12}>
                     <Button
                        color="success"
                        size="small"
                        onClick={() =>
                           navigate(
                              "/CandidateGrid?type=joined&&roleId=" +
                                 props.data._id
                           )
                        }
                     >
                        {props.data.joined}
                     </Button>
                  </Grid>
               </>
            );
         },
      },
      {
         headerName: "Actions",
         width: "250px",

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
                                 `/EditRole/${id}/${props.data._id}?edit=false`
                              )
                           }
                        >
                           <VisibilityTwoToneIcon />
                        </IconButton>
                     </Grid>
                     {access && (
                        <>
                           {editable && (
                              <>
                                 <Grid item xs={4}>
                                    <IconButton
                                       size="small"
                                       color="secondary"
                                       onClick={() =>
                                          navigate(
                                             `/EditRole/${id}/${props.data._id}?edit=true`
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
                                             name: props.data.role,
                                             id: props.data.roleId,
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
                        </>
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
   const handleClickOpen = () => {
      setOpen(true);
   };
   const handleClose = () => {
      setOpen(false);
   };
   function handleRemoveMobile(j, i) {
      var HRs = [...company.HR];
      HRs[j].HRMobile = [...company.HR[j].HRMobile].filter(
         (_, indexFilter) => !(indexFilter === i)
      );
      setCompany({ ...company, HR: HRs });
   }
   function handleAddMobile(j) {
      var HRs = [...company.HR];
      HRs[j].HRMobile = [...company.HR[j].HRMobile, ""];
      setCompany({ ...company, HR: HRs });
   }
   function handleMobileChange(e, j, i) {
      var HRs = [...company.HR];
      HRs[j].HRMobile[i] = e.target.value;
      setCompany({ ...company, HR: HRs });
   }
   function handleDeleteHR(j) {
      const newHR = [...company.HR].filter(
         (_, indexFilter) => !(indexFilter === j)
      );
      setCompany({ ...company, HR: newHR });
   }
   const handleSubmit = async () => {
      try {
         var flag = 0;
         if (company.companyName === "") {
            toast.error("Enter Company Name");
            flag = 1;
         }
         if (
            company.HR.map((hr) => hr.HRMobile)
               .flat(1)
               .includes("")
         ) {
            toast.error("Missing Mobile Number");
            flag = 1;
         }
         if (flag) return;
         delete company.__v;
         await AxiosInstance.patch("/company/company/" + id, {
            ...company,
            roles: company.roles.map((r) => r._id),
         });
         toast.success("Company Edited Successfully");
         navigate(`/CompanyDashBoard`);
      } catch (error) {
         console.log(error);
      }
   };
   const handleRoleDelete = async () => {
      try {
         await AxiosInstance.delete(
            "/company/" + id + "/role/" + deleteData._id
         );
         setCompany({
            ...company,
            roles: company.roles.filter((r) => r._id !== deleteData._id),
         });
         handleClose();
      } catch (error) {}
   };
   const checkNumber = async (num) => {
      try {
         const res = await AxiosInstance.get("/company/mobile/" + num);
         if (res.data.status === true) toast.error("Number already exists");
      } catch (error) {}
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
                  title={
                     editable ? "EDIT COMPANY DETAILS" : "VIEW COMPANY DETAILS"
                  }
                  titleTypographyProps={{
                     sx: {
                        fontSize: "2.8vh",
                        letterSpacing: "5px",
                     },
                  }}
               />
               <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.7) }}>
                  <Grid container rowSpacing={2} columnSpacing={1}>
                     <Grid item xs={12} md={6}>
                        <TextField
                           id="companyName"
                           label="Company Name"
                           variant="outlined"
                           fullWidth
                           value={company.companyName}
                           onChange={(e) =>
                              setCompany({
                                 ...company,
                                 companyName: e.target.value,
                              })
                           }
                           InputProps={{
                              readOnly: !editable,
                           }}
                        />
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField
                           id="companyType"
                           select
                           label="Company Type"
                           fullWidth
                           value={company.companyType}
                           onChange={(e) =>
                              setCompany({
                                 ...company,
                                 companyType: e.target.value,
                              })
                           }
                        >
                           {["Product", "Service", "Product & Service"].map(
                              (option) => (
                                 <MenuItem key={option} value={option}>
                                    {option}
                                 </MenuItem>
                              )
                           )}
                        </TextField>
                     </Grid>
                     {access && (
                        <>
                           {/* HR TABLE VIEW */}
                           <Grid item xs={12}>
                              <Card
                                 sx={{
                                    borderRadius: "15px",
                                    backgroundColor: "transparent",
                                    marginTop: "2vh",
                                    boxShadow: "none",
                                 }}
                              >
                                 <CardHeader
                                    title="HR Details"
                                    titleTypographyProps={{
                                       sx: {
                                          fontSize: "1.2rem",
                                          fontWeight: 600,
                                          color: "#333",
                                       },
                                    }}
                                    sx={{
                                       backgroundColor: "transparent",
                                       borderBottom: "2px solid #e0e0e0",
                                       paddingBottom: "1vh",
                                    }}
                                 />
                                 <CardContent>
                                    <TableContainer
                                       component={Paper}
                                       sx={{
                                          borderRadius: "10px",
                                          boxShadow: "none",
                                          backgroundColor: "transparent",
                                       }}
                                    >
                                       <Table
                                          sx={{
                                             "& .MuiTableCell-root": {
                                                backgroundColor: "transparent",
                                             },
                                          }}
                                       >
                                          <TableHead>
                                             <TableRow
                                                sx={{
                                                   backgroundColor: alpha(
                                                      "#0000FF",
                                                      0.1
                                                   ),
                                                   "& th": {
                                                      fontWeight: 700,
                                                      fontSize: "0.95rem",
                                                      color: "#333",
                                                      borderBottom:
                                                         "2px solid #0000FF",
                                                      padding: "12px",
                                                   },
                                                }}
                                             >
                                                <TableCell
                                                   align="center"
                                                   width="5%"
                                                >
                                                   Sr. No
                                                </TableCell>
                                                <TableCell width="15%">
                                                   HR Name
                                                </TableCell>
                                                <TableCell width="20%">
                                                   Email
                                                </TableCell>
                                                <TableCell width="15%">
                                                   Designation
                                                </TableCell>
                                                <TableCell width="15%">
                                                   Location
                                                </TableCell>
                                                <TableCell width="20%">
                                                   Mobile Numbers
                                                </TableCell>
                                                {editable && (
                                                   <TableCell
                                                      align="center"
                                                      width="10%"
                                                   >
                                                      Actions
                                                   </TableCell>
                                                )}
                                             </TableRow>
                                          </TableHead>
                                          <TableBody>
                                             {company.HR.map((y, j) => (
                                                <TableRow
                                                   key={j}
                                                   sx={{
                                                      backgroundColor:
                                                         j % 2 === 0
                                                            ? "transparent"
                                                            : alpha(
                                                                 "#000",
                                                                 0.01
                                                              ),
                                                      "&:hover": {
                                                         backgroundColor: alpha(
                                                            "#0000FF",
                                                            0.02
                                                         ),
                                                      },
                                                      borderBottom:
                                                         "1px solid #e0e0e0",
                                                      "& td": {
                                                         padding: "12px",
                                                      },
                                                   }}
                                                >
                                                   <TableCell align="center">
                                                      {j + 1}
                                                   </TableCell>
                                                   <TableCell>
                                                      <TextField
                                                         size="small"
                                                         variant="standard"
                                                         fullWidth
                                                         value={y.HRName}
                                                         onChange={(e) => {
                                                            var HRs = [
                                                               ...company.HR,
                                                            ];
                                                            HRs[j].HRName =
                                                               e.target.value;
                                                            setCompany({
                                                               ...company,
                                                               HR: HRs,
                                                            });
                                                         }}
                                                         InputProps={{
                                                            readOnly: !editable,
                                                         }}
                                                         sx={{
                                                            "& .MuiInput-underline:before":
                                                               {
                                                                  borderBottomColor:
                                                                     !editable
                                                                        ? "transparent"
                                                                        : undefined,
                                                               },
                                                         }}
                                                      />
                                                   </TableCell>
                                                   <TableCell>
                                                      <TextField
                                                         size="small"
                                                         variant="standard"
                                                         fullWidth
                                                         value={y.HREmail}
                                                         onChange={(e) => {
                                                            var HRs = [
                                                               ...company.HR,
                                                            ];
                                                            HRs[j].HREmail =
                                                               e.target.value;
                                                            setCompany({
                                                               ...company,
                                                               HR: HRs,
                                                            });
                                                         }}
                                                         InputProps={{
                                                            readOnly: !editable,
                                                         }}
                                                         sx={{
                                                            "& .MuiInput-underline:before":
                                                               {
                                                                  borderBottomColor:
                                                                     !editable
                                                                        ? "transparent"
                                                                        : undefined,
                                                               },
                                                         }}
                                                      />
                                                   </TableCell>
                                                   <TableCell>
                                                      <TextField
                                                         size="small"
                                                         variant="standard"
                                                         fullWidth
                                                         value={y.HRDesignation}
                                                         onChange={(e) => {
                                                            var HRs = [
                                                               ...company.HR,
                                                            ];
                                                            HRs[
                                                               j
                                                            ].HRDesignation =
                                                               e.target.value;
                                                            setCompany({
                                                               ...company,
                                                               HR: HRs,
                                                            });
                                                         }}
                                                         InputProps={{
                                                            readOnly: !editable,
                                                         }}
                                                         sx={{
                                                            "& .MuiInput-underline:before":
                                                               {
                                                                  borderBottomColor:
                                                                     !editable
                                                                        ? "transparent"
                                                                        : undefined,
                                                               },
                                                         }}
                                                      />
                                                   </TableCell>
                                                   <TableCell>
                                                      <TextField
                                                         size="small"
                                                         variant="standard"
                                                         fullWidth
                                                         value={y.HRLocation}
                                                         onChange={(e) => {
                                                            var HRs = [
                                                               ...company.HR,
                                                            ];
                                                            HRs[j].HRLocation =
                                                               e.target.value;
                                                            setCompany({
                                                               ...company,
                                                               HR: HRs,
                                                            });
                                                         }}
                                                         InputProps={{
                                                            readOnly: !editable,
                                                         }}
                                                         sx={{
                                                            "& .MuiInput-underline:before":
                                                               {
                                                                  borderBottomColor:
                                                                     !editable
                                                                        ? "transparent"
                                                                        : undefined,
                                                               },
                                                         }}
                                                      />
                                                   </TableCell>
                                                   <TableCell>
                                                      <Grid
                                                         container
                                                         spacing={1}
                                                         alignItems="center"
                                                      >
                                                         {y.HRMobile.map(
                                                            (x, i) => (
                                                               <Grid
                                                                  item
                                                                  xs={
                                                                     editable
                                                                        ? 8
                                                                        : 12
                                                                  }
                                                                  key={i}
                                                               >
                                                                  <TextField
                                                                     size="small"
                                                                     type="number"
                                                                     variant="standard"
                                                                     fullWidth
                                                                     value={x}
                                                                     onChange={(
                                                                        e
                                                                     ) => {
                                                                        if (
                                                                           !/^\d*$/.test(
                                                                              e
                                                                                 .target
                                                                                 .value
                                                                           )
                                                                        )
                                                                           toast.warning(
                                                                              "Only numbers allowed"
                                                                           );
                                                                        handleMobileChange(
                                                                           e,
                                                                           j,
                                                                           i
                                                                        );
                                                                     }}
                                                                     onBlur={(
                                                                        e
                                                                     ) => {
                                                                        if (
                                                                           !/^\d{10}$/.test(
                                                                              e
                                                                                 .target
                                                                                 .value
                                                                           )
                                                                        ) {
                                                                           if (
                                                                              e
                                                                                 .target
                                                                                 .value
                                                                                 .length ===
                                                                              0
                                                                           )
                                                                              return;
                                                                           toast.warning(
                                                                              "Mobile number should be 10 digits"
                                                                           );
                                                                           return;
                                                                        }
                                                                        checkNumber(
                                                                           e
                                                                              .target
                                                                              .value
                                                                        );
                                                                     }}
                                                                     InputProps={{
                                                                        readOnly:
                                                                           !editable,
                                                                     }}
                                                                     sx={{
                                                                        "& .MuiInput-underline:before":
                                                                           {
                                                                              borderBottomColor:
                                                                                 !editable
                                                                                    ? "transparent"
                                                                                    : undefined,
                                                                           },
                                                                     }}
                                                                  />
                                                               </Grid>
                                                            )
                                                         )}
                                                         {editable &&
                                                            y.HRMobile.length >
                                                               0 && (
                                                               <>
                                                                  <Grid
                                                                     item
                                                                     xs={
                                                                        editable
                                                                           ? 2
                                                                           : 0
                                                                     }
                                                                  >
                                                                     <IconButton
                                                                        size="small"
                                                                        color="primary"
                                                                        onClick={() =>
                                                                           handleAddMobile(
                                                                              j
                                                                           )
                                                                        }
                                                                     >
                                                                        <ControlPointIcon />
                                                                     </IconButton>
                                                                  </Grid>
                                                                  {y.HRMobile
                                                                     .length >
                                                                     1 && (
                                                                     <Grid
                                                                        item
                                                                        xs={2}
                                                                     >
                                                                        <IconButton
                                                                           size="small"
                                                                           color="error"
                                                                           onClick={() =>
                                                                              handleRemoveMobile(
                                                                                 j,
                                                                                 y
                                                                                    .HRMobile
                                                                                    .length -
                                                                                    1
                                                                              )
                                                                           }
                                                                        >
                                                                           <RemoveCircleOutlineIcon />
                                                                        </IconButton>
                                                                     </Grid>
                                                                  )}
                                                               </>
                                                            )}
                                                      </Grid>
                                                   </TableCell>
                                                   {editable && (
                                                      <TableCell align="center">
                                                         <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => {
                                                               if (
                                                                  company.HR
                                                                     .length ===
                                                                  1
                                                               ) {
                                                                  toast.warning(
                                                                     "At least one HR is required"
                                                                  );
                                                                  return;
                                                               }
                                                               const newHR =
                                                                  company.HR.filter(
                                                                     (_, i) =>
                                                                        i !== j
                                                                  );
                                                               setCompany({
                                                                  ...company,
                                                                  HR: newHR,
                                                               });
                                                            }}
                                                         >
                                                            <DeleteSweepTwoToneIcon />
                                                         </IconButton>
                                                      </TableCell>
                                                   )}
                                                </TableRow>
                                             ))}
                                          </TableBody>
                                       </Table>
                                    </TableContainer>
                                    {editable && (
                                       <Button
                                          fullWidth
                                          variant="contained"
                                          startIcon={<ControlPointIcon />}
                                          onClick={() => {
                                             const newHR = [
                                                ...company.HR,
                                                {
                                                   HRName: "",
                                                   HRMobile: [""],
                                                   HREmail: "",
                                                   HRDesignation: "",
                                                   HRLocation: "",
                                                },
                                             ];
                                             setCompany({
                                                ...company,
                                                HR: newHR,
                                             });
                                          }}
                                          sx={{
                                             marginTop: "2vh",
                                             backgroundColor: alpha(
                                                "#0000FF",
                                                0.6
                                             ),
                                             padding: "10px 20px",
                                             fontWeight: 600,
                                          }}
                                       >
                                          Add New HR
                                       </Button>
                                    )}
                                 </CardContent>
                              </Card>
                           </Grid>
                           <Grid item xs={4}>
                              <TextField
                                 id="empanelled"
                                 select
                                 label="Empanelled Status"
                                 fullWidth
                                 value={company.empanelled}
                                 onChange={(e) =>
                                    setCompany({
                                       ...company,
                                       empanelled: e.target.value,
                                    })
                                 }
                                 InputProps={{
                                    readOnly: !editable,
                                 }}
                              >
                                 {Empanelled.map((option) => (
                                    <MenuItem
                                       key={option.value}
                                       value={option.value}
                                    >
                                       {option.label}
                                    </MenuItem>
                                 ))}
                              </TextField>
                           </Grid>
                           <Grid item xs={4}>
                              <TextField
                                 id="paymentTerms"
                                 label="Payment Terms"
                                 variant="outlined"
                                 fullWidth
                                 value={company.paymentTerms}
                                 onChange={(e) => {
                                    setCompany({
                                       ...company,
                                       paymentTerms: e.target.value,
                                    });
                                 }}
                              />
                           </Grid>
                           <Grid item xs={4}>
                              <TextField
                                 id="response"
                                 select
                                 label="Response"
                                 fullWidth
                                 value={company.response}
                                 onChange={(e) =>
                                    setCompany({
                                       ...company,
                                       response: e.target.value,
                                    })
                                 }
                                 InputProps={{
                                    readOnly: !editable,
                                 }}
                              >
                                 {source.map((option) => (
                                    <MenuItem
                                       key={option.value}
                                       value={option.value}
                                    >
                                       {option.label}
                                    </MenuItem>
                                 ))}
                              </TextField>
                           </Grid>
                        </>
                     )}
                     <Grid item xs={12}>
                        <TextField
                           id="about"
                           label="About Company"
                           multiline
                           fullWidth
                           value={company.about}
                           onChange={(e) =>
                              setCompany({ ...company, about: e.target.value })
                           }
                           InputProps={{
                              readOnly: !editable,
                           }}
                        />
                     </Grid>
                     {access && (
                        <>
                           <Grid item xs={12}>
                              <TextField
                                 id="remarks"
                                 label="Remarks"
                                 multiline
                                 fullWidth
                                 value={company.remarks}
                                 onChange={(e) =>
                                    setCompany({
                                       ...company,
                                       remarks: e.target.value,
                                    })
                                 }
                                 InputProps={{
                                    readOnly: !editable,
                                 }}
                              />
                           </Grid>
                        </>
                     )}

                     {access && (
                        <>
                           <Grid item xs={6} />
                           <Grid item xs={3}>
                              <Button
                                 fullWidth
                                 variant="contained"
                                 size="large"
                                 sx={{
                                    height: "100%",
                                    backgroundColor: alpha("#0000FF", 0.5),
                                 }}
                                 onClick={handleSubmit}
                              >
                                 SUBMIT
                              </Button>
                           </Grid>
                           <Grid item xs={3}>
                              <Button
                                 fullWidth
                                 variant="contained"
                                 size="large"
                                 color="success"
                                 sx={{
                                    height: "100%",
                                    backgroundColor: alpha("#008000", 0.5),
                                 }}
                                 onClick={() =>
                                    navigate("/AddRole/" + company._id)
                                 }
                              >
                                 Add Role
                              </Button>
                           </Grid>
                        </>
                     )}
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
                  title="COMPANY ROLES"
                  titleTypographyProps={{
                     sx: {
                        fontSize: "2.8vh",
                        letterSpacing: "5px",
                     },
                  }}
               />
               <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.2) }}>
                  <Grid
                     container
                     spacing={1}
                     sx={{ marginLeft: "0.5%", width: "98%" }}
                  >
                     <Grid item xs={2} md={1}>
                        <TextField
                           fullWidth
                           size="small"
                           type="number"
                           label="No.of Rows"
                           value={count}
                           className="tw"
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
                           onClick={() => {}}
                        >
                           Select
                        </Button>
                     </Grid>
                     <Grid item md={3} display={{ xs: "none", md: "block" }} />
                     <Grid item xs={4}>
                        <TextField
                           size="small"
                           label="File Name"
                           value={fileName}
                           fullWidth
                           className="tw"
                           onChange={(e) => setFileName(e.target.value)}
                        />
                     </Grid>
                     <Grid item xs={4} md={2}>
                        <ExcelExport
                           height="100%"
                           excelData={{}}
                           fileName={fileName}
                        />
                     </Grid>
                  </Grid>
                  <Grid container xs={12}>
                     <div
                        className="ag-theme-quartz-dark"
                        style={{
                           height: "100%",
                           width: "98%",
                           position: "inherit",
                           marginLeft: "1%",
                           marginTop: "2vh",
                        }}
                     >
                        <AgGridReact
                           domLayout="autoHeight"
                           rowData={
                              access
                                 ? company.roles
                                 : company.roles.filter(
                                      (v) => v.status === true
                                   )
                           }
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
                     handleRoleDelete(deleteData._id);
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
