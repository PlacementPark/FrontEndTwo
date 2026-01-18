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
   Divider,
   Chip,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInstance from "../Main/AxiosInstance";

export default function AddInstitiue() {
   //DROP DOWN OPTIONS AND VALUES
   const postGraduations = [
      {
         value: "Not Selected",
         label: "Not Selected",
      },
      {
         value: "M.Tech",
         label: "M.Tech",
      },
      {
         value: "MBA",
         label: "MBA",
      },
      {
         value: "MPharm",
         label: "MPharm",
      },
      {
         value: "B.Ed, D.El.Ed",
         label: "B.Ed, D.El.Ed",
      },
      {
         value: "NA",
         label: "NA",
      },
   ];

   const instituteType = [
      {
         value: "Not Selected",
         label: "Not Selected",
      },
      {
         value: "Degree College",
         label: "Degree College",
      },
      {
         value: "Engineering College",
         label: "Engineering College",
      },
      {
         value: "NGO",
         label: "NGO",
      },
      {
         value: "Skill Institutes",
         label: "Skill Institutes",
      },
      {
         value: "Skill Development Institutes",
         label: "Skill Development Institutes",
      },
      {
         value: "Medical College",
         label: "Medical College",
      },
      {
         value: "Pharma College",
         label: "Pharma College",
      },
      {
         value: "Law College",
         label: "Law College",
      },
      {
         value: "Polytechnic College",
         label: "Polytechnic College",
      },
      {
         value: "Diploma College",
         label: "Diploma College",
      },
      {
         value: "Architecture & Design College",
         label: "Architecture & Design College",
      },
      {
         value: "Agriculture & Veterinary College",
         label: "Agriculture & Veterinary College",
      },
      {
         value: "Hotel Management & Tourism College",
         label: "Hotel Management & Tourism College",
      },
   ];

   // STATES HANDLING AND VARIABLES
   const navigate = useNavigate();
   const [company, setCompany] = React.useState({
      companyName: "",
      HRName: "",
      HR: [{ HRName: "", HRMobile: [""], HREmail: "" }],
      about: "",
      remarks: "",
      response: "Empanelled",
      empanelled: true,
      companyType: "",
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
               title="ADD INSTITUTE INFORMATION"
               titleTypographyProps={{
                  sx: {
                     fontSize: "2.8vh",
                     letterSpacing: "5px",
                  },
               }}
            />
            <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.7) }}>
               <Grid container rowSpacing={2} columnSpacing={1}>
                  <Grid item xs={12}>
                     <TextField
                        id="instituteName"
                        label="Institute Name"
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
                  {company.HR.map((y, j) => {
                     return (
                        <>
                           <Grid item xs={6}>
                              <TextField
                                 id="SOPName"
                                 label="SOP Name"
                                 variant="outlined"
                                 fullWidth
                                 value={y.HRName}
                                 onChange={(e) => {
                                    var HRs = [...company.HR];
                                    HRs[j].HRName = e.target.value;
                                    setCompany({ ...company, HR: HRs });
                                 }}
                              />
                           </Grid>
                           <Grid item xs={6}>
                              <TextField
                                 id="SOPDesignation"
                                 label="SOP Designation"
                                 variant="outlined"
                                 fullWidth
                                 value={y.HREmail}
                                 onChange={(e) => {
                                    var HRs = [...company.HR];
                                    HRs[j].HREmail = e.target.value;
                                    setCompany({ ...company, HR: HRs });
                                 }}
                              />
                           </Grid>
                           {y.HRMobile.map((x, i) => (
                              <>
                                 <Grid item xs={9}>
                                    <TextField
                                       className="SOPEmail"
                                       type="text"
                                       label="SOP Email ID"
                                       variant="outlined"
                                       value={x}
                                       onChange={(e) => {
                                          handleMobileChange(e, j, i);
                                       }}
                                       onBlur={(e) => {
                                          checkNumber(e.target.value);
                                       }}
                                       fullWidth
                                    />
                                 </Grid>
                                 {i === 0 && (
                                    <Grid item xs={3}>
                                       <Button
                                          fullWidth
                                          margin="normal"
                                          variant="outlined"
                                          size="large"
                                          color="success"
                                          style={{ height: "100%" }}
                                          endIcon={<ControlPointIcon />}
                                          onClick={() => handleAddMobile(j)}
                                       >
                                          Add
                                       </Button>
                                    </Grid>
                                 )}
                                 {i !== 0 && (
                                    <Grid item xs={3}>
                                       <Button
                                          fullWidth
                                          margin="normal"
                                          variant="outlined"
                                          color="error"
                                          size="large"
                                          endIcon={<RemoveCircleOutlineIcon />}
                                          sx={{ height: "100%" }}
                                          onClick={() => {
                                             handleRemoveMobile(j, i);
                                          }}
                                       >
                                          Remove
                                       </Button>
                                    </Grid>
                                 )}
                              </>
                           ))}
                           {y.HRMobile.map((x, i) => (
                              <>
                                 <Grid item xs={9}>
                                    <TextField
                                       className="SOPMobile"
                                       type="number"
                                       label="SOP Mobile Number"
                                       variant="outlined"
                                       value={x}
                                       onChange={(e) => {
                                          if (!/^\d*$/.test(e.target.value))
                                             toast.warning(
                                                "Only Number allowed in Mobile"
                                             );
                                          handleMobileChange(e, j, i);
                                       }}
                                       onBlur={(e) => {
                                          if (
                                             !/^\d{10}$/.test(e.target.value)
                                          ) {
                                             if (e.target.value.length === 0)
                                                return;
                                             toast.warning(
                                                "Mobile number should be 10 digits"
                                             );
                                             return;
                                          }
                                          checkNumber(e.target.value);
                                       }}
                                       fullWidth
                                    />
                                 </Grid>
                                 {i === 0 && (
                                    <Grid item xs={3}>
                                       <Button
                                          fullWidth
                                          margin="normal"
                                          variant="outlined"
                                          size="large"
                                          color="success"
                                          style={{ height: "100%" }}
                                          endIcon={<ControlPointIcon />}
                                          onClick={() => handleAddMobile(j)}
                                       >
                                          Add
                                       </Button>
                                    </Grid>
                                 )}
                                 {i !== 0 && (
                                    <Grid item xs={3}>
                                       <Button
                                          fullWidth
                                          margin="normal"
                                          variant="outlined"
                                          color="error"
                                          size="large"
                                          endIcon={<RemoveCircleOutlineIcon />}
                                          sx={{ height: "100%" }}
                                          onClick={() => {
                                             handleRemoveMobile(j, i);
                                          }}
                                       >
                                          Remove
                                       </Button>
                                    </Grid>
                                 )}
                              </>
                           ))}
                           {j === 0 && (
                              <Grid item xs={12}>
                                 <Button
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    color="success"
                                    size="large"
                                    style={{ height: "100%" }}
                                    endIcon={<ControlPointIcon />}
                                    onClick={() => {
                                       const newHR = [
                                          ...company.HR,
                                          {
                                             HRName: "",
                                             HRMobile: [""],
                                             HREmail: "",
                                          },
                                       ];
                                       setCompany({ ...company, HR: newHR });
                                    }}
                                 >
                                    Add Institute SOP 
                                 </Button>
                              </Grid>
                           )}
                           {j !== 0 && (
                              <Grid item xs={12}>
                                 <Button
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    color="error"
                                    size="large"
                                    endIcon={<RemoveCircleOutlineIcon />}
                                    sx={{ height: "100%" }}
                                    onClick={() => {
                                       handleDeleteHR(j);
                                    }}
                                 >
                                    Remove Institute SOP
                                 </Button>
                              </Grid>
                           )}
                        </>
                     );
                  })}
                  <Grid item xs={12} md={4}>
                     <TextField
                        id="instituteState"
                        label="Institute State"
                        fullWidth
                        value={company.about}
                        onChange={(e) =>
                           setCompany({ ...company, about: e.target.value })
                        }
                     />
                  </Grid>
                  <Grid item xs={12} md={4}>
                     <TextField
                        id="instituteCity"
                        label="Institute City"
                        fullWidth
                        value={company.remarks}
                        onChange={(e) =>
                           setCompany({ ...company, remarks: e.target.value })
                        }
                     />
                  </Grid>
                  <Grid item xs={12} md={4}>
                     <TextField
                        id="instituteArea"
                        label="Institute Area"
                        fullWidth
                        value={company.remarks}
                        onChange={(e) =>
                           setCompany({ ...company, remarks: e.target.value })
                        }
                     />
                  </Grid>
                  <Grid item xs={12} md={4}>
                     <TextField
                        id="instituteType"
                        select
                        label="Institute Type"
                        fullWidth
                        value={company.response}
                        onChange={(e) =>
                           setCompany({ ...company, response: e.target.value })
                        }
                     >
                        {instituteType.map((option) => (
                           <MenuItem key={option.value} value={option.value}>
                              {option.label}
                           </MenuItem>
                        ))}
                     </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                     <TextField
                        id="postGraduations"
                        select
                        label="Post Graduations"
                        fullWidth
                        value={company.empanelled}
                        onChange={(e) =>
                           setCompany({
                              ...company,
                              empanelled: e.target.value,
                           })
                        }
                     >
                        {postGraduations.map((option) => (
                           <MenuItem key={option.value} value={option.value}>
                              {option.label}
                           </MenuItem>
                        ))}
                     </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                  <TextField
                        id="instituteFullAddress"
                        label="Institute Full Address"
                        variant="outlined"
                        fullWidth
                        multiline
                        value={company.companyName}
                        onChange={(e) =>
                           setCompany({
                              ...company,
                              companyName: e.target.value,
                           })
                        }
                     />
                  </Grid>
                  <Grid item xs={12} md={4}>
                     <TextField
                        id="internshipStatus"
                        select
                        label="Internship Status"
                        fullWidth
                        value={company.companyType}
                        onChange={(e) =>
                           setCompany({
                              ...company,
                              companyType: e.target.value,
                           })
                        }
                     >
                        {["Not Selected", "In Internship", "N2A", "NI", "In Process", "NA"].map(
                           (option) => (
                              <MenuItem key={option} value={option}>
                                 {option}
                              </MenuItem>
                           )
                        )}
                     </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                     <TextField
                        id="campusDrive"
                        select
                        label="Campus Drive"
                        fullWidth
                        value={company.companyType}
                        onChange={(e) =>
                           setCompany({
                              ...company,
                              companyType: e.target.value,
                           })
                        }
                     >
                        {["Not Selected", "Done", "N2A", "NI", "In Process"].map(
                           (option) => (
                              <MenuItem key={option} value={option}>
                                 {option}
                              </MenuItem>
                           )
                        )}
                     </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                     <TextField
                        id="training"
                        select
                        label="Training"
                        fullWidth
                        value={company.companyType}
                        onChange={(e) =>
                           setCompany({
                              ...company,
                              companyType: e.target.value,
                           })
                        }
                     >
                        {["Not Selected", "In Training", "N2A", "NI", "In Process", "NA"].map(
                           (option) => (
                              <MenuItem key={option} value={option}>
                                 {option}
                              </MenuItem>
                           )
                        )}
                     </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                  <TextField
                        id="internshipRemarks"
                        label="Internship Remarks"
                        variant="outlined"
                        fullWidth
                        multiline
                        value={company.companyName}
                        onChange={(e) =>
                           setCompany({
                              ...company,
                              companyName: e.target.value,
                           })
                        }
                     />
                  </Grid>
                  <Grid item xs={12} md={4}>
                  <TextField
                        id="campusRemarks"
                        label="Campus Remarks"
                        variant="outlined"
                        fullWidth
                        multiline
                        value={company.companyName}
                        onChange={(e) =>
                           setCompany({
                              ...company,
                              companyName: e.target.value,
                           })
                        }
                     />
                  </Grid>
                  <Grid item xs={12} md={4}>
                  <TextField
                        id="trainingStatusRemarks"
                        label="Training Status Remarks"
                        variant="outlined"
                        fullWidth
                        multiline
                        value={company.companyName}
                        onChange={(e) =>
                           setCompany({
                              ...company,
                              companyName: e.target.value,
                           })
                        }
                     />
                  </Grid>
                  </Grid>
                  <Grid container rowSpacing={2} columnSpacing={1}>
                  <Grid>
                     <Divider sx={{ marginTop: "4%" }} />
                        <Divider item xs={12}>
                           <Chip
                              sx={{
                                 backgroundColor: alpha("#0B0B0B", 0.5),
                                 color: "white",
                              }}
                              label="ASSESSMENT INFORMATION"
                              light
                              size="large"
                           />
                        </Divider>
                  </Grid>
                  <Divider sx={{ marginBottom: "2%" }} />
                  {company.HR.map((y, j) => {
                     return (
                        <>
                           <Grid item xs={4}>
                              <TextField
                                 id="internshipYear"
                                 label="Internship Year"
                                 variant="outlined"
                                 fullWidth
                                 value={y.HRName}
                                 onChange={(e) => {
                                    var HRs = [...company.HR];
                                    HRs[j].HRName = e.target.value;
                                    setCompany({ ...company, HR: HRs });
                                 }}
                              />
                           </Grid>
                           <Grid item xs={4}>
                              <TextField
                                 id="internshipOffered"
                                 label="Internship Offered"
                                 variant="outlined"
                                 fullWidth
                                 value={y.HREmail}
                                 onChange={(e) => {
                                    var HRs = [...company.HR];
                                    HRs[j].HREmail = e.target.value;
                                    setCompany({ ...company, HR: HRs });
                                 }}
                              />
                           </Grid>
                           <Grid item xs={4}>
                              <TextField
                                 id="internshipCertified"
                                 label="Internship Certified"
                                 variant="outlined"
                                 fullWidth
                                 value={y.HREmail}
                                 onChange={(e) => {
                                    var HRs = [...company.HR];
                                    HRs[j].HREmail = e.target.value;
                                    setCompany({ ...company, HR: HRs });
                                 }}
                              />
                           </Grid>
                           {j === 0 && (
                              <Grid item xs={12}>
                                 <Button
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    color="success"
                                    size="large"
                                    style={{ height: "100%" }}
                                    endIcon={<ControlPointIcon />}
                                    onClick={() => {
                                       const newHR = [
                                          ...company.HR,
                                          {
                                             HRName: "",
                                             HRMobile: [""],
                                             HREmail: "",
                                          },
                                       ];
                                       setCompany({ ...company, HR: newHR });
                                    }}
                                 >
                                    Add Institute SOP 
                                 </Button>
                              </Grid>
                           )}
                           {j !== 0 && (
                              <Grid item xs={12}>
                                 <Button
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    color="error"
                                    size="large"
                                    endIcon={<RemoveCircleOutlineIcon />}
                                    sx={{ height: "100%" }}
                                    onClick={() => {
                                       handleDeleteHR(j);
                                    }}
                                 >
                                    Remove Institute SOP
                                 </Button>
                              </Grid>
                           )}
                        </>
                     );
                  })}
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