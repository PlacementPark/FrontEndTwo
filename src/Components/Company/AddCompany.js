import React from "react";
import {
   Card,
   CardHeader,
   CardContent,
   BottomNavigation,
   MenuItem,
   TextField,
   Container,
   Button,
   Grid,
   alpha,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   IconButton,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteSweepTwoToneIcon from "@mui/icons-material/DeleteSweepTwoTone";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInstance from "../Main/AxiosInstance";

export default function AddCompany() {
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
         value: "Not to Approach",
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

   // STATES HANDLING AND VARIABLES
   const navigate = useNavigate();
   const [company, setCompany] = React.useState({
      companyName: "",
      HRName: "",
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
      companyType: "",
      paymentTerms: 0,
   });

   // FUNCTIONS HANDLING AND SEARCH API CALLS
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
            toast.error("Missing  Mobile Number");
            flag = 1;
         }
         if (flag) return;

         const res = await AxiosInstance.post("/company", { ...company });
         toast.success("Company Added Successfully");
         navigate(`/EditEmpanelled/${res.data._id}?edit=true`);
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
      <Container
         maxWidth={false}
         sx={{
            paddingTop: "9.5vh",
            width: { sm: "90%", md: "70%" },
            paddingBottom: "2vh",
         }}
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
               title="ADD COMPANY INFORMATION"
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
                                             borderBottom: "2px solid #0000FF",
                                             padding: "12px",
                                          },
                                       }}
                                    >
                                       <TableCell align="center" width="5%">
                                          Sr. No
                                       </TableCell>
                                       <TableCell width="15%">
                                          HR Name
                                       </TableCell>
                                       <TableCell width="20%">Email</TableCell>
                                       <TableCell width="15%">
                                          Designation
                                       </TableCell>
                                       <TableCell width="15%">
                                          Location
                                       </TableCell>
                                       <TableCell width="20%">
                                          Mobile Numbers
                                       </TableCell>
                                       <TableCell align="center" width="10%">
                                          Actions
                                       </TableCell>
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
                                                   : alpha("#000", 0.01),
                                             "&:hover": {
                                                backgroundColor: alpha(
                                                   "#0000FF",
                                                   0.02
                                                ),
                                             },
                                             borderBottom: "1px solid #e0e0e0",
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
                                                   var HRs = [...company.HR];
                                                   HRs[j].HRName =
                                                      e.target.value;
                                                   setCompany({
                                                      ...company,
                                                      HR: HRs,
                                                   });
                                                }}
                                                sx={{
                                                   "& .MuiInput-underline:before":
                                                      {
                                                         borderBottomColor:
                                                            "undefined",
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
                                                   var HRs = [...company.HR];
                                                   HRs[j].HREmail =
                                                      e.target.value;
                                                   setCompany({
                                                      ...company,
                                                      HR: HRs,
                                                   });
                                                }}
                                                sx={{
                                                   "& .MuiInput-underline:before":
                                                      {
                                                         borderBottomColor:
                                                            "undefined",
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
                                                   var HRs = [...company.HR];
                                                   HRs[j].HRDesignation =
                                                      e.target.value;
                                                   setCompany({
                                                      ...company,
                                                      HR: HRs,
                                                   });
                                                }}
                                                sx={{
                                                   "& .MuiInput-underline:before":
                                                      {
                                                         borderBottomColor:
                                                            "undefined",
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
                                                   var HRs = [...company.HR];
                                                   HRs[j].HRLocation =
                                                      e.target.value;
                                                   setCompany({
                                                      ...company,
                                                      HR: HRs,
                                                   });
                                                }}
                                                sx={{
                                                   "& .MuiInput-underline:before":
                                                      {
                                                         borderBottomColor:
                                                            "undefined",
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
                                                {y.HRMobile.map((x, i) => (
                                                   <Grid item xs={8} key={i}>
                                                      <TextField
                                                         size="small"
                                                         type="number"
                                                         variant="standard"
                                                         fullWidth
                                                         value={x}
                                                         onChange={(e) => {
                                                            if (
                                                               !/^\d*$/.test(
                                                                  e.target.value
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
                                                         onBlur={(e) => {
                                                            if (
                                                               !/^\d{10}$/.test(
                                                                  e.target.value
                                                               )
                                                            ) {
                                                               if (
                                                                  e.target.value
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
                                                               e.target.value
                                                            );
                                                         }}
                                                         sx={{
                                                            "& .MuiInput-underline:before":
                                                               {
                                                                  borderBottomColor:
                                                                     "undefined",
                                                               },
                                                         }}
                                                      />
                                                   </Grid>
                                                ))}
                                                <Grid item xs={2}>
                                                   <IconButton
                                                      size="small"
                                                      color="primary"
                                                      onClick={() =>
                                                         handleAddMobile(j)
                                                      }
                                                   >
                                                      <ControlPointIcon />
                                                   </IconButton>
                                                </Grid>
                                                {y.HRMobile.length > 1 && (
                                                   <Grid item xs={2}>
                                                      <IconButton
                                                         size="small"
                                                         color="error"
                                                         onClick={() =>
                                                            handleRemoveMobile(
                                                               j,
                                                               y.HRMobile
                                                                  .length - 1
                                                            )
                                                         }
                                                      >
                                                         <RemoveCircleOutlineIcon />
                                                      </IconButton>
                                                   </Grid>
                                                )}
                                             </Grid>
                                          </TableCell>
                                          <TableCell align="center">
                                             <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                   if (
                                                      company.HR.length === 1
                                                   ) {
                                                      toast.warning(
                                                         "At least one HR is required"
                                                      );
                                                      return;
                                                   }
                                                   const newHR =
                                                      company.HR.filter(
                                                         (_, i) => i !== j
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
                                       </TableRow>
                                    ))}
                                 </TableBody>
                              </Table>
                           </TableContainer>
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
                                 backgroundColor: alpha("#0000FF", 0.6),
                                 padding: "10px 20px",
                                 fontWeight: 600,
                              }}
                           >
                              Add New HR
                           </Button>
                        </CardContent>
                     </Card>
                  </Grid>
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
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        id="remarks"
                        label="Remarks"
                        multiline
                        fullWidth
                        value={company.remarks}
                        onChange={(e) =>
                           setCompany({ ...company, remarks: e.target.value })
                        }
                     />
                  </Grid>
                  <Grid item xs={12} md={4}>
                     <TextField
                        id="response"
                        select
                        label="Response"
                        fullWidth
                        value={company.response}
                        onChange={(e) =>
                           setCompany({ ...company, response: e.target.value })
                        }
                     >
                        {source.map((option) => (
                           <MenuItem key={option.value} value={option.value}>
                              {option.label}
                           </MenuItem>
                        ))}
                     </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={4}>
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
                     >
                        {Empanelled.map((option) => (
                           <MenuItem key={option.value} value={option.value}>
                              {option.label}
                           </MenuItem>
                        ))}
                     </TextField>
                  </Grid>
                  <Grid item xs={7.5} md={9} />
                  <Grid item xs={4.5} md={3}>
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
   );
}
