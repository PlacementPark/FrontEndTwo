import React from "react";
import {
   Card,
   CardHeader,
   CardContent,
   Grid,
   BottomNavigation,
   Container,
   TextField,
   MenuItem,
   FormControlLabel,
   FormLabel,
   Radio,
   RadioGroup,
   Autocomplete,
   Button,
   Chip,
   alpha,
} from "@mui/material";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

import AxiosInstance from "../Main/AxiosInstance";
export default function AddRole() {
   //DROP DOWN OPTIONS AND VALUES
   const status = [
      { value: true, label: "Active" },
      { value: false, label: "InActive" },
   ];
   const processType = [
      { value: "International", label: "International" },
      { value: "Domestic", label: "Domestic" },
   ];
   const period = [
      { value: "Permanent", label: "Permanent" },
      { value: "Contract", label: "Contract" },
      { value: "Notice Period", label: "Notice Period" },
      { value: "Buyout", label: "Buyout" },
   ];
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
         value: "Not Interested",
         label: "Not Interested",
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
   const { id } = useParams();
   const [company, setCompany] = React.useState({
      companyName: "",
      companyType: "",
      HR: [{ HRName: "", HRMobile: [""], HREmail: "" }],
      about: "",
      remarks: "",
      response: "Empanelled",
      empanelled: true,
   });
   const [skillsList, setSkillsList] = React.useState([]);
   const [locationList, setLocationList] = React.useState([]);
   const [qualificationList, setQualificationList] = React.useState([]);
   const [role, setRole] = React.useState({
      status: true,
      role: "",
      designation: "",
      processType: "Domestic",
      happens: "",
      experience: "",
      optionalSkills: [],
      mandatorySkills: [],
      qualification: [],
      shift: "",
      salary: "",
      cabFacility: true,
      location: [],
      area: "",
      bond: 0,
      ageCriteria: "",
      period: "Permanent",
      otherDocs: "",
      originalJD: "",
      processWorkType: "",
      faqs: "",
      rejectionReasons: [],
      billingTerm: 0,
      endTrackingDate: 0,
      industry: "",
      aboutCompany: "",
   });

   // FUNCTIONS HANDLING AND SEARCH API CALLS
   React.useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await AxiosInstance.get("/company/company/" + id);
            const extraRes = await AxiosInstance.get("/extra/all");
            setCompany(res.data.data);
            extraRes.data.forEach(({ _id, data }) => {
               if (_id === "Skills") setSkillsList(data);
               else if (_id === "Locations") setLocationList(data);
               else if (_id === "Qualifications") setQualificationList(data);
            });
         } catch (error) {}
      };
      fetchData();
   }, [id]);

   const handleAddRole = async () => {
      try {
         const newRole = await AxiosInstance.patch("/company/" + id, {
            roles: [role],
         });
         await AxiosInstance.patch("/extra/skills", {
            data: [
               ...new Set([
                  ...role.mandatorySkills,
                  ...role.optionalSkills,

                  ...skillsList,
               ]),
            ],
         });
         toast.success("Role Added Successfully");
         navigate(`/EditEmpanelled/${id}?edit=true`);
         console.log(newRole);
      } catch (error) {
         console.log(error);
      }
   };

   //JSX
   return (
      <>
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
                  title="COMPANY INFORMATION"
                  titleTypographyProps={{
                     sx: {
                        fontSize: "2.8vh",
                        letterSpacing: "5px",
                     },
                  }}
               />
               <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.7) }}>
                  <Grid container rowSpacing={2} columnSpacing={1}>
                     <Grid item xs={6} md={4}>
                        <TextField
                           id="companyName"
                           label="Company Name"
                           variant="outlined"
                           fullWidth
                           value={company.companyName}
                           disabled
                        />
                     </Grid>
                     <Grid item xs={6}>
                        <TextField
                           id="companyType"
                           select
                           label="Company Type"
                           fullWidth
                           value={company.companyType}
                           disabled
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
                     {company.HR.map((y, j) => {
                        return (
                           <>
                              <Grid item xs={6}>
                                 <TextField
                                    id="HRName"
                                    label="HR Name"
                                    variant="outlined"
                                    fullWidth
                                    value={y.HRName}
                                    disabled
                                 />
                              </Grid>
                              <Grid item xs={6}>
                                 <TextField
                                    id="HREmail"
                                    label="HR Email ID"
                                    variant="outlined"
                                    fullWidth
                                    value={y.HREmail}
                                    disabled
                                 />
                              </Grid>
                              {y.HRMobile.map((x, i) => (
                                 <>
                                    <Grid item xs={12}>
                                       <TextField
                                          className="HRMobile"
                                          type="number"
                                          label="HR Mobile Number"
                                          variant="outlined"
                                          value={x}
                                          fullWidth
                                          disabled
                                       />
                                    </Grid>
                                 </>
                              ))}
                           </>
                        );
                     })}
                     <Grid item xs={6} md={4}>
                        <TextField
                           id="empanelled"
                           select
                           label="Empanelled Status"
                           fullWidth
                           value={company.empanelled}
                           disabled
                        >
                           {Empanelled.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                 {option.label}
                              </MenuItem>
                           ))}
                        </TextField>
                     </Grid>
                     <Grid item xs={6} md={4}>
                        <TextField
                           id="response"
                           select
                           label="Response"
                           fullWidth
                           value={company.response}
                           disabled
                        >
                           {source.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                 {option.label}
                              </MenuItem>
                           ))}
                        </TextField>
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           id="about"
                           label="About Company"
                           multiline
                           fullWidth
                           value={company.about}
                           disabled
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           id="remarks"
                           label="Remarks"
                           multiline
                           fullWidth
                           value={company.remarks}
                           disabled
                        />
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
            sx={{ width: { sm: "90%", md: "70%" }, paddingBottom: "2vh" }}
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
                  title="ADD COMPANY ROLE INFO"
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
                           id="roleCompany"
                           label="Company Name"
                           variant="outlined"
                           value={company.companyName}
                           fullWidth
                           disabled
                        />
                     </Grid>
                     {/* <Grid item xs={6}>
                        <TextField
                           id="roleStatus"
                           select
                           label="Status"
                           fullWidth
                           value={role.status}
                           onChange={(e) =>
                              setRole({ ...role, status: e.target.value })
                           }
                        >
                           {status.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                 {option.label}
                              </MenuItem>
                           ))}
                        </TextField>
                     </Grid> */}
                     <Grid item xs={12} md={6}>
                        <TextField
                           id="rolePeriod"
                           select
                           label="Job Type"
                           fullWidth
                           value={role.period}
                           onChange={(e) =>
                              setRole({ ...role, period: e.target.value })
                           }
                        >
                           {period.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                 {option.label}
                              </MenuItem>
                           ))}
                        </TextField>
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField
                           fullWidth
                           id="roleIndustry"
                           label="Industry"
                           variant="outlined"
                           value={role.industry}
                           onChange={(e) =>
                              setRole({ ...role, industry: e.target.value })
                           }
                        />
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField
                           id="processWorkType"
                           label="Notice Period/ Buyout"
                           variant="outlined"
                           fullWidth
                           value={role.processWorkType}
                           onChange={(e) =>
                              setRole({
                                 ...role,
                                 processWorkType: e.target.value,
                              })
                           }
                        ></TextField>
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField
                           id="roleRole"
                           label="Role Name"
                           variant="outlined"
                           value={role.role}
                           onChange={(e) =>
                              setRole({ ...role, role: e.target.value })
                           }
                           fullWidth
                        />
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField
                           id="roleAge"
                           label="Age Criteria"
                           variant="outlined"
                           value={role.ageCriteria}
                           onChange={(e) =>
                              setRole({ ...role, ageCriteria: e.target.value })
                           }
                           fullWidth
                        />
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField
                           fullWidth
                           id="roleDesignation"
                           label="Designation"
                           variant="outlined"
                           value={role.designation}
                           onChange={(e) =>
                              setRole({ ...role, designation: e.target.value })
                           }
                        />
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField
                           id="roleBond"
                           label="Bond"
                           variant="outlined"
                           value={role.bond}
                           onChange={(e) =>
                              setRole({ ...role, bond: e.target.value })
                           }
                           fullWidth
                        />
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField
                           id="roleProcessType"
                           select
                           label="Process Type"
                           fullWidth
                           value={role.processType}
                           onChange={(e) =>
                              setRole({ ...role, processType: e.target.value })
                           }
                        >
                           {processType.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                 {option.label}
                              </MenuItem>
                           ))}
                        </TextField>
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField
                           id="roleCab"
                           select
                           label="Cab Facility"
                           fullWidth
                           value={role.cabFacility}
                           onChange={(e) =>
                              setRole({
                                 ...role,
                                 cabFacility: e.target.value,
                              })
                           }
                        >
                           {["No", "1 Way", "2 Way"].map((option) => (
                              <MenuItem key={option} value={option}>
                                 {option}
                              </MenuItem>
                           ))}
                        </TextField>
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           fullWidth
                           id="roleHappens"
                           label="What Happens in the Role (Roles & Responsibilities)"
                           variant="outlined"
                           value={role.happens}
                           onChange={(e) =>
                              setRole({ ...role, happens: e.target.value })
                           }
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           fullWidth
                           id="roleExperience"
                           label="Experience / Fresher"
                           variant="outlined"
                           value={role.experience}
                           onChange={(e) =>
                              setRole({ ...role, experience: e.target.value })
                           }
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           id="roleSalary"
                           label="Salary + Incentive + Bonus"
                           value={role.salary}
                           onChange={(e) =>
                              setRole({ ...role, salary: e.target.value })
                           }
                           fullWidth
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <Autocomplete
                           multiple
                           freeSolo
                           id="roleLocation"
                           options={locationList.map((location) => location)}
                           filterSelectedOptions
                           value={role.location}
                           onChange={(e, v) =>
                              setRole({
                                 ...role,
                                 location: v,
                              })
                           }
                           renderTags={(value, getTagProps) =>
                              value.map((option, index) => {
                                 const { key, ...tagProps } = getTagProps({
                                    index,
                                 });
                                 return (
                                    <Chip
                                       variant="outlined"
                                       label={option}
                                       key={key}
                                       {...tagProps}
                                    />
                                 );
                              })
                           }
                           renderInput={(params) => (
                              <TextField {...params} label="Company Location" />
                           )}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           id="roleComapnyArea"
                           label="Company Area"
                           variant="outlined"
                           value={role.area}
                           onChange={(e) =>
                              setRole({ ...role, area: e.target.value })
                           }
                           fullWidth
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <Autocomplete
                           multiple
                           freeSolo
                           id="rolequalifications"
                           options={qualificationList.map(
                              (qualification) => qualification
                           )}
                           value={role.qualification}
                           onChange={(e, v) =>
                              setRole({
                                 ...role,
                                 qualification: v,
                              })
                           }
                           filterSelectedOptions
                           renderTags={(value, getTagProps) =>
                              value.map((option, index) => {
                                 const { key, ...tagProps } = getTagProps({
                                    index,
                                 });
                                 return (
                                    <Chip
                                       variant="outlined"
                                       label={option}
                                       key={key}
                                       {...tagProps}
                                    />
                                 );
                              })
                           }
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label="Qualification Requirement"
                              />
                           )}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           id="roleOtherDocs"
                           label="Other and Documentation Requirement"
                           variant="outlined"
                           value={role.otherDocs}
                           onChange={(e) =>
                              setRole({ ...role, otherDocs: e.target.value })
                           }
                           fullWidth
                           multiline
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           id="aboutCompany"
                           label="About Company"
                           variant="outlined"
                           value={role.aboutCompany}
                           onChange={(e) =>
                              setRole({ ...role, aboutCompany: e.target.value })
                           }
                           fullWidth
                           multiline
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           id="roleOriginalJD"
                           label="Original JD"
                           variant="outlined"
                           fullWidth
                           multiline
                           value={role.originalJD}
                           onChange={(e) =>
                              setRole({ ...role, originalJD: e.target.value })
                           }
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           id="roleFAQs"
                           label="FAQs"
                           variant="outlined"
                           fullWidth
                           multiline
                           value={role.faqs}
                           onChange={(e) =>
                              setRole({ ...role, faqs: e.target.value })
                           }
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           id="roleRejectionReasons"
                           label="Rejection Reasons"
                           variant="outlined"
                           fullWidth
                           multiline
                           value={role.rejectionReasons}
                           onChange={(e) =>
                              setRole({
                                 ...role,
                                 rejectionReasons: e.target.value,
                              })
                           }
                        />
                     </Grid>
                     <Grid item xs={12} >
                        <Autocomplete
                           multiple
                           freeSolo
                           id="roleSkills"
                           options={skillsList.map((skill) => skill)}
                           filterSelectedOptions
                           value={role.mandatorySkills}
                           onChange={(e, v) =>
                              setRole({ ...role, mandatorySkills: v })
                           }
                           renderTags={(value, getTagProps) =>
                              value.map((option, index) => {
                                 const { key, ...tagProps } = getTagProps({
                                    index,
                                 });
                                 return (
                                    <Chip
                                       variant="outlined"
                                       label={option}
                                       key={key}
                                       {...tagProps}
                                    />
                                 );
                              })
                           }
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label="Mandatory Skill Requirement"
                              />
                           )}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <Autocomplete
                           multiple
                           freeSolo
                           id="roleSkills"
                           options={skillsList.map((skill) => skill)}
                           filterSelectedOptions
                           value={role.optionalSkills}
                           onChange={(e, v) =>
                              setRole({ ...role, optionalSkills: v })
                           }
                           renderTags={(value, getTagProps) =>
                              value.map((option, index) => {
                                 const { key, ...tagProps } = getTagProps({
                                    index,
                                 });
                                 return (
                                    <Chip
                                       variant="outlined"
                                       label={option}
                                       key={key}
                                       {...tagProps}
                                    />
                                 );
                              })
                           }
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label="Optional Skill Requirement"
                              />
                           )}
                        />
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField
                           type="number"
                           label="Billing Term"
                           id="billingTerm"
                           variant="outlined"
                           fullWidth
                           value={role.billingTerm}
                           onChange={(e) =>
                              setRole({
                                 ...role,
                                 billingTerm: e.target.value,
                              })
                           }
                        />
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField
                           type="number"
                           id= "endTrackingDate"
                           label="End Tracking Date"
                           variant="outlined"
                           fullWidth
                           value={role.endTrackingDate}
                           onChange={(e) =>
                              setRole({
                                 ...role,
                                 endTrackingDate: e.target.value,
                              })
                           }
                        />
                     </Grid>
                     <Grid item xs={12} md={6}>
                        <TextField
                           id="roleShift"
                           label="Shift & Week-Off"
                           value={role.shift}
                           onChange={(e) =>
                              setRole({ ...role, shift: e.target.value })
                           }
                           fullWidth
                        />
                     </Grid>

                     <Grid item xs={9} />
                     <Grid item xs={3}>
                        <Button
                           fullWidth
                           variant="contained"
                           sx={{
                              height: "100%",
                              backgroundColor: alpha("#0000FF", 0.4),
                           }}
                           onClick={handleAddRole}
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
      </>
   );
}
