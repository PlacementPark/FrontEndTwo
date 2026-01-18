import React from "react";
import {
   Grid,
   Button,
   BottomNavigation,
   Container,
   Card,
   CardHeader,
   CardContent,
   TextField,
   MenuItem,
   Autocomplete,
   Chip,
   Divider,
   Radio,
   FormControlLabel,
   RadioGroup,
   Collapse,
   alpha,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AxiosInstance from "../Main/AxiosInstance";
import {
   L1_STATUS,
   L2_STATUS,
   SELECT_STATUS,
   INTERVIEW_STATUS,
   LANGUAGE_LEVEL,
   SOURCE,
} from "../Main/Constants";
import { OpenInNew } from "@mui/icons-material";
export default function EditCandidate() {
   // STATES HANDLING AND VARIABLES
   const navigate = useNavigate();
   const { employeeType,userid } = useSelector((state) => state.user);
   const access = !["Recruiter", "Intern"].includes(employeeType);
   const TMAAccess = !["Recruiter", "Intern"].includes(employeeType);
   const [remarks,setRemarks] = React.useState("");
   const rtAccess = [
      "Recruiter",
      "Intern",
      "Teamlead",
      "Business Development",
   ].includes(employeeType);
   const [expandedCompany, setExpandedCompany] = React.useState(false);
   const { id } = useParams();
   const [searchParams] = useSearchParams();
   const editable = searchParams.get("edit") === "true";
   const url = "/candidate/" + id;
   const [companiesList, setCompaniesList] = React.useState([]);
   const [rolesList, setRolesList] = React.useState([]);
   const [skillsList, setSkillsList] = React.useState([]);
   const [locationList, setLocationList] = React.useState([]);
   const [qualificationList, setQualificationList] = React.useState([]);
   const [languageList, setLanguageList] = React.useState([{ language: " " }]);
   const [remarksList, setRemarksList] = React.useState([]);
   const [candidate, setCandidate] = React.useState({
      fullName: "",
      mobile: [""],
      email: [""],
      homeTown: "",
      currentCity: "",
      qualifications: [
         {
            qualification: "",
            YOP: null,
         },
      ],
      languages: [
         {
            language: null,
            level: "",
            remarks: "",
         },
      ],
      skills: [],
      experience: [
         {
            companyName: "",
            role: "",
            salary: 0,
            startDate: null,
            endDate: null,
            experience: 0,
         },
      ],
      companyId: null,
      roleId: null,
      interviewDate: null,
      remarks: "",
      interviewStatus: null,
      select: null,
      EMP_ID: "",
      rate: 0,
      onboardingDate: null,
      nextTrackingDate: null,
      l1Assessment: "",
      l2Assessment: "",
      billingDate: null,
      invoiceNumber: "",
      invoiceDate: null,
      lastUpdatedOn:null,
      createdOn: null,
      l1StatDate: null,
      l2StatDate: null,
      interviewStatDate: null,
      tenureStatDate: null,
      selectDate: null,
      offerDropDate: null,
      nonTenureDate: null,
      endTrackingDate: null,
      createdByEmployee: {
         name: "",
      },
      assignedEmployee: {
         name: "",
      },
      tag: "",
      source: "",
   });

   // API CALLS HANDLING
   React.useEffect(() => {
      const fetchData = async () => {
         try {
            const canres = await AxiosInstance.get(url);
            const res = await AxiosInstance.get(
               "/company/candidateCompanyType?companyType=Empanelled"
            );
            const extraRes = await AxiosInstance.get("/extra/all");
            const remarksRes = await AxiosInstance.get(
               "remarks/candidate/" + id
            );
            setCandidate({ ...candidate, ...canres.data });
            setCompaniesList(res.data.data);
            setRemarksList(remarksRes.data);
            console.log(extraRes.data);

            setExpandedCompany(canres.data.experience.length !== 0);
            extraRes.data.forEach(({ _id, data }) => {
               if (_id === "Skills") setSkillsList(data);
               else if (_id === "Locations") setLocationList(data);
               else if (_id === "Qualifications") setQualificationList(data);
               else if (_id === "Languages") setLanguageList(data);
            });
         } catch (error) {}
      };
      fetchData();
   }, [url]);

   // FUNCTIONS HANDLING AND API POST CALLS
   const handleExpandCompany = () => {
      setExpandedCompany(!expandedCompany);
   };
   const handleAddRemarks = async ()=>{
      const addedRemarks = await AxiosInstance.post("/remarks", {
         remarks: remarks,
         employeeId: userid,
         candidateId: id,
      });
      var rem = remarksList;
      rem.push(addedRemarks.data)
      rem.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
      setRemarksList(rem)
      setRemarks("")
   }

   const handleEditCandidate = async () => {
      var flag = 0;
      if (!candidate.fullName) {
         toast.error("Full Name is Required");
         flag = 1;
      }
      if (candidate.mobile.includes("")) {
         const ind = candidate.mobile.indexOf("");
         toast.error(
            "Missing " +
               (ind === 0
                  ? "1st"
                  : ind === 1
                  ? "2nd"
                  : ind === 2
                  ? "3rd"
                  : ind + 1 + "th") +
               " Mobile Number"
         );
         flag = 1;
      }

      if (
         ["TAC", "GOOD"].includes(candidate.l2Assessment) &&
         !candidate.interviewStatus
      ) {
         toast.error("Missing Interview Status");
         flag = 1;
      }

      if (flag) return;
      if (!["WD", "TAC", "GOOD"].includes(candidate.l1Assessment)) {
         var can = candidate;
         can.l2Assessment = null;
         can.l2StatDate = null;
         can.interviewStatDate = null;
         can.tenureStatDate = null;
         can.companyId = null;
         can.roleId = null;
         can.interviewDate = null;
         can.rate = 0;
         can.interviewStatus = null;
         can.select = null;
         can.EMP_ID = "";
         can.invoiceNumber = "";
         can.invoiceDate = null;
         can.billingDate = null;
         can.onboardingDate = null;
         can.nextTrackingDate = null;

         setCandidate({ ...can });
      }

      if (!["TAC", "GOOD"].includes(candidate.l2Assessment)) {
         var can = candidate;
         can.interviewStatus = null;

         can.interviewStatDate = null;
         can.tenureStatDate = null;
         can.rate = 0;
         can.select = null;
         can.EMP_ID = "";
         can.invoiceNumber = "";
         can.invoiceDate = null;
         can.billingDate = null;
         can.onboardingDate = null;
         can.nextTrackingDate = null;

         setCandidate({ ...can });
      }
      if (candidate.interviewStatus !== "Select") {
         var can = candidate;

         can.tenureStatDate = null;
         can.rate = 0;
         can.select = null;
         can.EMP_ID = "";
         can.invoiceNumber = "";
         can.invoiceDate = null;
         can.billingDate = null;
         can.onboardingDate = null;
         can.nextTrackingDate = null;

         setCandidate({
            ...can,
         });
      }

      try {
         await AxiosInstance.patch("/candidate/" + id, {
            ...candidate,
            companyId: candidate.companyId
               ? candidate.companyId._id
               : candidate.companyId,
            roleId: candidate.roleId ? candidate.roleId._id : candidate.roleId,
            lastUpdatedOn: new Date()
         });
         await AxiosInstance.patch("/extra/skills", {
            data: [...new Set([...candidate.skills, ...skillsList])],
         });
         toast.success("Candidate Edited Successfully");
         window.location.replace(document.referrer);
      } catch (error) {}
   };

   const checkNumber = async (num) => {
      try {
         const res = await AxiosInstance.get("/candidate/mobile/" + num);
         if (res.data.status === true) toast.error("Number already exists");
      } catch (error) {}
   };

   //JSX CODE
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
                  title={editable ? "EDIT CANDIDATE" : "VIEW CANDIDATE"}
                  titleTypographyProps={{
                     sx: {
                        fontSize: "2.8vh",
                        letterSpacing: "5px",
                     },
                  }}
               />
               <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.75) }}>
                  <Grid container rowSpacing={2} columnSpacing={1}>
                     <Grid item xs={12}>
                        <TextField
                           id="createdBy"
                           label="Created By"
                           variant="outlined"
                           fullWidth
                           value={candidate.createdByEmployee.name}
                           InputProps={{
                              readOnly: true,
                           }}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           id="assignedTo"
                           label="Assigned To"
                           variant="outlined"
                           fullWidth
                           value={candidate.assignedEmployee.name}
                           InputProps={{
                              readOnly: true,
                           }}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           id="tag"
                           label="Tags"
                           variant="outlined"
                           fullWidth
                           value={candidate.tag}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 tag: e.target.value,
                              });
                              if (!e.target.validity.valid) {
                                 toast.warning(
                                    "Only Alphabets and Space allowed in Name!"
                                 );
                              }
                           }}
                           InputProps={{
                              readOnly: !editable,
                              pattern: "[A-Za-z ]+",
                           }}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <Autocomplete
                           className="source"
                           options={SOURCE}
                           getOptionLabel={(option) => option}
                           value={candidate.source}
                           onChange={(e, v) => {
                              setCandidate({
                                 ...candidate,
                                 source: v,
                              });
                           }}
                           renderInput={(params) => (
                              <TextField {...params} label="Source" />
                           )}
                           readOnly={!editable}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextField
                           id="candiateName"
                           label="Full Name"
                           variant="outlined"
                           fullWidth
                           value={candidate.fullName}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 fullName: e.target.value,
                              });
                              if (!e.target.validity.valid) {
                                 toast.warning(
                                    "Only Alphabets and Space allowed in Name!"
                                 );
                              }
                           }}
                           InputProps={{
                              readOnly: !editable,
                              pattern: "[A-Za-z ]+",
                           }}
                        />
                     </Grid>
                     {candidate.mobile.map((x, i) => (
                        <>
                           <Grid item xs={editable ? 9 : 6}>
                              <TextField
                                 id="outlined-basic"
                                 label="Mobile Number"
                                 variant="outlined"
                                 value={x}
                                 onChange={(e) => {
                                    if (!/^\d*$/.test(e.target.value))
                                       toast.warning(
                                          "Only Number allowed in Mobile"
                                       );
                                    candidate.mobile[i] = e.target.value;
                                    setCandidate({
                                       ...candidate,
                                       mobile: candidate.mobile,
                                    });
                                 }}
                                 fullWidth
                                 InputProps={{
                                    readOnly: !editable,
                                 }}
                                 onBlur={(e) => {
                                    if (!editable) return;
                                    if (!/^\d{10}$/.test(e.target.value)) {
                                       if (e.target.value.length === 0) return;
                                       toast.warning(
                                          "Mobile number should be 10 digits"
                                       );
                                       return;
                                    }
                                    checkNumber(e.target.value);
                                 }}
                              />
                           </Grid>
                           {editable && i === 0 && (
                              <Grid item xs={3}>
                                 <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{
                                       backgroundColor: alpha("#0000FF", 0.5),
                                       height: "100%",
                                    }}
                                    endIcon={<ControlPointIcon />}
                                    onClick={() =>
                                       setCandidate({
                                          ...candidate,
                                          mobile: [...candidate.mobile, ""],
                                       })
                                    }
                                 >
                                    Add
                                 </Button>
                              </Grid>
                           )}
                           {editable && i !== 0 && (
                              <Grid item xs={3}>
                                 <Button
                                    fullWidth
                                    margin="normal"
                                    variant="contained"
                                    color="error"
                                    size="large"
                                    endIcon={<RemoveCircleOutlineIcon />}
                                    sx={{
                                       height: "100%",
                                       backgroundColor: alpha("#FF0000", 0.6),
                                    }}
                                    onClick={() => {
                                       setCandidate({
                                          ...candidate,
                                          mobile: [...candidate.mobile].filter(
                                             (_, indexFilter) =>
                                                !(indexFilter === i)
                                          ),
                                       });
                                    }}
                                 >
                                    Remove
                                 </Button>
                              </Grid>
                           )}
                        </>
                     ))}
                     {candidate.email.map((x, i) => (
                        <>
                           <Grid item xs={editable ? 9 : 6}>
                              <TextField
                                 id="outlined-basic"
                                 label="Email ID"
                                 variant="outlined"
                                 value={x}
                                 onChange={(e) => {
                                    candidate.email[i] = e.target.value;
                                    setCandidate({
                                       ...candidate,
                                       email: candidate.email,
                                    });
                                 }}
                                 fullWidth
                                 InputProps={{
                                    readOnly: !editable,
                                 }}
                                 onBlur={(e) => {
                                    if (!editable) return;
                                    if (
                                       !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(
                                          e.target.value
                                       )
                                    ) {
                                       if (e.target.value.length === 0) return;
                                       toast.warning("Not a valid Email");
                                       return;
                                    }
                                 }}
                              />
                           </Grid>
                           {editable && i === 0 && (
                              <Grid item xs={3}>
                                 <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{
                                       backgroundColor: alpha("#0000FF", 0.5),
                                       height: "100%",
                                    }}
                                    endIcon={<ControlPointIcon />}
                                    onClick={() =>
                                       setCandidate({
                                          ...candidate,
                                          email: [...candidate.email, ""],
                                       })
                                    }
                                 >
                                    Add
                                 </Button>
                              </Grid>
                           )}
                           {editable && i !== 0 && (
                              <Grid item xs={3}>
                                 <Button
                                    fullWidth
                                    margin="normal"
                                    variant="contained"
                                    color="error"
                                    size="large"
                                    endIcon={<RemoveCircleOutlineIcon />}
                                    sx={{
                                       height: "100%",
                                       backgroundColor: alpha("#FF0000", 0.6),
                                    }}
                                    onClick={() => {
                                       setCandidate({
                                          ...candidate,
                                          email: [...candidate.email].filter(
                                             (_, indexFilter) =>
                                                !(indexFilter === i)
                                          ),
                                       });
                                    }}
                                 >
                                    Remove
                                 </Button>
                              </Grid>
                           )}
                        </>
                     ))}
                     <Grid item xs={6}>
                        <Autocomplete
                           id="candidateHomeTown"
                           options={locationList.map((location) => location)}
                           filterSelectedOptions
                           value={candidate.homeTown}
                           onChange={(e, v) =>
                              setCandidate({
                                 ...candidate,
                                 homeTown: v,
                              })
                           }
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label="Candidate Home Town"
                              />
                           )}
                           readOnly={!editable}
                        />
                     </Grid>
                     <Grid item xs={6}>
                        <Autocomplete
                           id="candidateCurrentCity"
                           options={locationList.map((location) => location)}
                           filterSelectedOptions
                           value={candidate.currentCity}
                           onChange={(e, v) =>
                              setCandidate({
                                 ...candidate,
                                 currentCity: v,
                              })
                           }
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 label="Candidate Current City"
                              />
                           )}
                           readOnly={!editable}
                        />
                     </Grid>
                     {candidate.languages.map((x, i) => (
                        <>
                           <Grid item xs={6} md={editable ? 3 : 4}>
                              <Autocomplete
                                 className="candidateLanguage"
                                 options={languageList}
                                 getOptionLabel={(option) => option}
                                 value={x.language}
                                 onChange={(e, v) => {
                                    candidate.languages[i].language = v;
                                    setCandidate({
                                       ...candidate,
                                       languages: candidate.languages,
                                    });
                                 }}
                                 renderInput={(params) => (
                                    <TextField {...params} label="Language" />
                                 )}
                                 readOnly={!editable}
                              />
                           </Grid>
                           <Grid item xs={6} md={editable ? 3 : 4}>
                              <TextField
                                 className="candidatelevel"
                                 select
                                 label="Level"
                                 value={x.level}
                                 onChange={(e) => {
                                    candidate.languages[i].level =
                                       e.target.value;
                                    setCandidate({
                                       ...candidate,
                                       languages: candidate.languages,
                                    });
                                 }}
                                 fullWidth
                                 InputProps={{
                                    readOnly: !editable,
                                 }}
                              >
                                 {LANGUAGE_LEVEL.map((option) => (
                                    <MenuItem key={option} value={option}>
                                       {option}
                                    </MenuItem>
                                 ))}
                              </TextField>
                           </Grid>
                           <Grid
                              item
                              xs={editable ? 9 : 12}
                              md={editable ? 3 : 4}
                           >
                              <TextField
                                 id="candidateLanguageRemark"
                                 label="Remarks"
                                 variant="outlined"
                                 value={x.remarks}
                                 onChange={(e) => {
                                    candidate.languages[i].remarks =
                                       e.target.value;
                                    setCandidate({
                                       ...candidate,
                                       languages: candidate.languages,
                                    });
                                 }}
                                 fullWidth
                                 InputProps={{
                                    readOnly: !editable,
                                 }}
                              />
                           </Grid>
                           {editable && i === 0 && (
                              <Grid item xs={3}>
                                 <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{
                                       backgroundColor: alpha("#0000FF", 0.5),
                                       height: "100%",
                                    }}
                                    endIcon={<ControlPointIcon />}
                                    onClick={() => {
                                       setCandidate({
                                          ...candidate,
                                          languages: [
                                             ...candidate.languages,
                                             {
                                                language: "",
                                                level: "",
                                                remarks: "",
                                             },
                                          ],
                                       });
                                    }}
                                 >
                                    Add
                                 </Button>
                              </Grid>
                           )}
                           {editable && i !== 0 && (
                              <Grid item xs={3}>
                                 <Button
                                    fullWidth
                                    margin="normal"
                                    variant="contained"
                                    color="error"
                                    size="large"
                                    endIcon={<RemoveCircleOutlineIcon />}
                                    sx={{
                                       height: "100%",
                                       backgroundColor: alpha("#FF0000", 0.6),
                                    }}
                                    onClick={() => {
                                       setCandidate({
                                          ...candidate,
                                          languages: [
                                             ...candidate.languages,
                                          ].filter(
                                             (_, indexFilter) =>
                                                !(indexFilter === i)
                                          ),
                                       });
                                    }}
                                 >
                                    Remove
                                 </Button>
                              </Grid>
                           )}
                        </>
                     ))}
                  </Grid>
                  <Divider style={{ marginTop: "4%" }} />
                  <Divider>
                     <Chip
                        sx={{
                           backgroundColor: alpha("#0B0B0B", 0.5),
                           color: "white",
                        }}
                        label="EDUCATION INFORMATION"
                        size="large"
                     />
                  </Divider>
                  <Divider style={{ marginBottom: "2%" }} />
                  <Grid container rowSpacing={2} columnSpacing={1}>
                     {candidate.qualifications.map((x, i) => (
                        <>
                           <Grid item xs={6}>
                              <TextField
                                 className="canidateQualification"
                                 select
                                 label="Select Education"
                                 value={x.qualification}
                                 onChange={(e) => {
                                    candidate.qualifications[i].qualification =
                                       e.target.value;
                                    setCandidate({
                                       ...candidate,
                                       qualifications: candidate.qualifications,
                                    });
                                 }}
                                 InputProps={{
                                    readOnly: !editable,
                                 }}
                                 fullWidth
                              >
                                 {qualificationList.map((option) => (
                                    <MenuItem key={option} value={option}>
                                       {option}
                                    </MenuItem>
                                 ))}
                              </TextField>
                           </Grid>
                           <Grid item xs={editable ? 3 : 6}>
                              <LocalizationProvider
                                 dateAdapter={AdapterDayjs}
                                 fullWidth
                              >
                                 <DatePicker
                                    format="DD/MM/YYYY"
                                    label="Year of Passing"
                                    views={["year"]}
                                    sx={{ width: "100%" }}
                                    fullWidth
                                    onChange={(e) => {
                                       candidate.qualifications[i].YOP = e;
                                       setCandidate({
                                          ...candidate,
                                          qualifications:
                                             candidate.qualifications,
                                       });
                                    }}
                                    readOnly={!editable}
                                    value={dayjs(x.YOP)}
                                 />
                              </LocalizationProvider>
                           </Grid>
                           {editable && i === 0 && (
                              <Grid item xs={3}>
                                 <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{
                                       backgroundColor: alpha("#0000FF", 0.5),
                                       height: "100%",
                                    }}
                                    endIcon={<ControlPointIcon />}
                                    onClick={() => {
                                       setCandidate({
                                          ...candidate,
                                          qualifications: [
                                             ...candidate.qualifications,
                                             { qualification: "", YOP: null },
                                          ],
                                       });
                                    }}
                                 >
                                    Add
                                 </Button>
                              </Grid>
                           )}
                           {editable && i !== 0 && (
                              <Grid item xs={3}>
                                 <Button
                                    fullWidth
                                    margin="normal"
                                    variant="contained"
                                    color="error"
                                    size="large"
                                    endIcon={<RemoveCircleOutlineIcon />}
                                    sx={{
                                       height: "100%",
                                       backgroundColor: alpha("#FF0000", 0.6),
                                    }}
                                    onClick={() => {
                                       setCandidate({
                                          ...candidate,
                                          qualifications: [
                                             ...candidate.qualifications,
                                          ].filter(
                                             (_, indexFilter) =>
                                                !(indexFilter === i)
                                          ),
                                       });
                                    }}
                                 >
                                    Remove
                                 </Button>
                              </Grid>
                           )}
                        </>
                     ))}
                     <Grid item xs={12}>
                        <Autocomplete
                           multiple
                           freeSolo
                           readOnly={!editable}
                           id="candidateSkills"
                           options={skillsList.map((skill) => skill)}
                           filterSelectedOptions
                           value={candidate.skills}
                           onChange={(e, v) => {
                              const skillsToSplit = v.filter((v) =>
                                 v.includes(" ")
                              );
                              const remSkills = v.filter(
                                 (v) => !v.includes(" ")
                              );
                              const skillsToPush = [];
                              skillsToSplit.forEach((element) => {
                                 skillsToPush.push(...element.split(" "));
                              });
                              setCandidate({
                                 ...candidate,
                                 skills: [
                                    ...new Set([...remSkills, ...skillsToPush]),
                                 ],
                              });
                           }}
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
                              <TextField {...params} label="Skills" />
                           )}
                        />
                     </Grid>
                  </Grid>
                  <Divider style={{ marginTop: "4%" }} />
                  <Divider>
                     <Chip
                        sx={{
                           backgroundColor: alpha("#0B0B0B", 0.5),
                           color: "white",
                        }}
                        label="EXPERIENCE INFORMATION"
                        size="large"
                     />
                  </Divider>
                  <Divider style={{ marginBottom: "2%" }} />
                  <Grid container style={{ margin: "2%" }}>
                     <Grid item xs={12}>
                        <RadioGroup
                           row
                           readOnly={!editable}
                           aria-labelledby="demo-row-radio-buttons-group-label"
                           defaultValue="FRESHER"
                           name="row-radio-buttons-group"
                           onChange={handleExpandCompany}
                           value={expandedCompany ? "EXPERIENCE" : "FRESHER"}
                        >
                           <FormControlLabel
                              value="EXPERIENCE"
                              control={<Radio disabled={!editable} />}
                              label="EXPERIENCE"
                              aria-label="show more"
                           />
                           <FormControlLabel
                              value="FRESHER"
                              control={<Radio disabled={!editable} />}
                              label="FRESHER"
                              timeout="auto"
                           />
                        </RadioGroup>
                     </Grid>
                  </Grid>
                  <Collapse in={expandedCompany} timeout="auto" unmountOnExit>
                     <CardContent>
                        <Grid container rowSpacing={2} columnSpacing={1}>
                           {candidate.experience.map((x, i) => {
                              return (
                                 <>
                                    <Grid item xs={12} />
                                    <Grid
                                       container
                                       rowSpacing={2}
                                       columnSpacing={1}
                                    >
                                       <Grid item xs={12} md={6}>
                                          <TextField
                                             className="candidateCompanyName"
                                             label="Company Name"
                                             variant="outlined"
                                             value={x.companyName}
                                             onChange={(e) => {
                                                candidate.experience[
                                                   i
                                                ].companyName = e.target.value;
                                                setCandidate({
                                                   ...candidate,
                                                   experience:
                                                      candidate.experience,
                                                });
                                             }}
                                             InputProps={{
                                                readOnly: !editable,
                                             }}
                                             fullWidth
                                          />
                                       </Grid>
                                       <Grid item xs={12} md={6}>
                                          <TextField
                                             className="candidateCompanyRole"
                                             label="Role"
                                             variant="outlined"
                                             fullWidth
                                             value={x.role}
                                             onChange={(e) => {
                                                candidate.experience[i].role =
                                                   e.target.value;
                                                setCandidate({
                                                   ...candidate,
                                                   experience:
                                                      candidate.experience,
                                                });
                                             }}
                                             InputProps={{
                                                readOnly: !editable,
                                             }}
                                          />
                                       </Grid>
                                       <Grid item xs={6}>
                                          <LocalizationProvider
                                             dateAdapter={AdapterDayjs}
                                             fullWidth
                                          >
                                             <DatePicker
                                                format="DD/MM/YYYY"
                                                label="Start Year"
                                                className="candidateCompanyStartDate"
                                                sx={{ width: "100%" }}
                                                fullWidth
                                                value={dayjs(x.startDate)}
                                                onChange={(e) => {
                                                   candidate.experience[
                                                      i
                                                   ].startDate = e;
                                                   setCandidate({
                                                      ...candidate,
                                                      experience:
                                                         candidate.experience,
                                                   });
                                                }}
                                                readOnly={!editable}
                                             />
                                          </LocalizationProvider>
                                       </Grid>
                                       <Grid item xs={6}>
                                          <LocalizationProvider
                                             dateAdapter={AdapterDayjs}
                                             fullWidth
                                          >
                                             <DatePicker
                                                format="DD/MM/YYYY"
                                                label="End Year"
                                                className="candidateCompanyEndDate"
                                                sx={{ width: "100%" }}
                                                fullWidth
                                                value={dayjs(x.endDate)}
                                                onChange={(e) => {
                                                   candidate.experience[
                                                      i
                                                   ].endDate = e;
                                                   setCandidate({
                                                      ...candidate,
                                                      experience:
                                                         candidate.experience,
                                                   });
                                                }}
                                                readOnly={!editable}
                                             />
                                          </LocalizationProvider>
                                       </Grid>
                                       <Grid item xs={editable ? 9 : 12}>
                                          <TextField
                                             label="Salary"
                                             variant="outlined"
                                             className="candidateCompanySalary"
                                             fullWidth
                                             onChange={(e) => {
                                                candidate.experience[i].salary =
                                                   e.target.value;
                                                setCandidate({
                                                   ...candidate,
                                                   experience:
                                                      candidate.experience,
                                                });
                                             }}
                                             value={x.salary}
                                             InputProps={{
                                                readOnly: !editable,
                                             }}
                                          />
                                       </Grid>
                                       {editable && i === 0 && (
                                          <>
                                             <Grid item xs={3}>
                                                <Button
                                                   fullWidth
                                                   variant="contained"
                                                   size="large"
                                                   onClick={() => {
                                                      setCandidate({
                                                         ...candidate,
                                                         experience: [
                                                            ...candidate.experience,
                                                            {
                                                               companyName: "",
                                                               role: "",
                                                               salary: 0,
                                                               startDate: null,
                                                               endDate: null,
                                                               experience: 0,
                                                            },
                                                         ],
                                                      });
                                                   }}
                                                   sx={{
                                                      backgroundColor: alpha(
                                                         "#0000FF",
                                                         0.5
                                                      ),
                                                      height: "100%",
                                                   }}
                                                   endIcon={
                                                      <ControlPointIcon />
                                                   }
                                                >
                                                   Add
                                                </Button>
                                             </Grid>
                                          </>
                                       )}
                                    </Grid>
                                    {editable && i !== 0 && (
                                       <>
                                          <Grid item xs={9} />
                                          <Grid item xs={3}>
                                             <Button
                                                fullWidth
                                                variant="contained"
                                                size="large"
                                                color="error"
                                                onClick={() => {
                                                   setCandidate({
                                                      ...candidate,
                                                      experience: [
                                                         ...candidate.experience,
                                                      ].filter(
                                                         (_, indexFilter) =>
                                                            !(indexFilter === i)
                                                      ),
                                                   });
                                                }}
                                                sx={{
                                                   height: "100%",
                                                   backgroundColor: alpha(
                                                      "#FF0000",
                                                      0.6
                                                   ),
                                                }}
                                                endIcon={
                                                   <RemoveCircleOutlineIcon />
                                                }
                                             >
                                                Remove
                                             </Button>
                                          </Grid>
                                       </>
                                    )}
                                 </>
                              );
                           })}
                        </Grid>
                     </CardContent>
                  </Collapse>
                  <Divider style={{ marginTop: "2%" }} />
                  <Divider>
                     <Chip
                        sx={{
                           backgroundColor: alpha("#0B0B0B", 0.5),
                           color: "white",
                        }}
                        label="ASSESSMENT INFORMATION"
                        size="large"
                     />
                  </Divider>
                  <Divider style={{ marginBottom: "2%" }} />
                  <Grid container rowSpacing={2} columnSpacing={1}>
                     <Grid item xs={6}>
                        <TextField
                           id="candidateL1Assessment"
                           select
                           label="L1 Assessment"
                           value={candidate.l1Assessment}
                           onChange={(e) =>
                              setCandidate({
                                 ...candidate,
                                 l1Assessment: e.target.value,
                                 l1StatDate: new Date(),
                              })
                           }
                           fullWidth
                           InputProps={{
                              readOnly: !editable,
                           }}
                        >
                           {L1_STATUS.map((option) => (
                              <MenuItem key={option} value={option}>
                                 {option}
                              </MenuItem>
                           ))}
                        </TextField>
                     </Grid>
                     {(candidate.l2Assessment === "" ||
                     candidate.l2Assessment === null ||
                     candidate.l2Assessment === undefined
                        ? access
                        : true) && (
                        <>
                           <Grid item xs={6}>
                              <TextField
                                 id="candidateL2Assessment"
                                 select
                                 label="L2 Assessment"
                                 fullWidth
                                 value={candidate.l2Assessment}
                                 onChange={(e) =>
                                    setCandidate({
                                       ...candidate,
                                       l2Assessment: e.target.value,
                                       l2StatDate: new Date(),
                                    })
                                 }
                                 InputProps={{
                                    readOnly: !(TMAAccess && editable),
                                 }}
                              >
                                 {L2_STATUS.map((option) => (
                                    <MenuItem
                                       key={option || "Empty"}
                                       value={option}
                                    >
                                       {option || "--SELECT--"}
                                    </MenuItem>
                                 ))}
                              </TextField>
                           </Grid>
                        </>
                     )}
                     <Grid item xs={12}>
                        <TextField
                           id="candidateRemarks"
                           label="Remarks"
                           variant="outlined"
                           fullWidth
                           value={candidate.remarks}
                           onChange={(e) =>
                              setCandidate({
                                 ...candidate,
                                 remarks: e.target.value,
                              })
                           }
                           multiline
                           InputProps={{
                              readOnly: !editable,
                           }}
                        />
                     </Grid>
                     {["WD", "TAC", "GOOD"].includes(
                        candidate.l1Assessment
                     ) && (
                        <>
                           <Grid item xs={5}>
                              <Autocomplete
                                 id="Companies"
                                 disableClearable
                                 options={companiesList}
                                 value={candidate.companyId}
                                 isOptionEqualToValue={(option, value) =>
                                    option._id === value._id
                                 }
                                 getOptionLabel={(option) =>
                                    option.companyName ? option.companyName : ""
                                 }
                                 onChange={(e, newValue) => {
                                    setCandidate({
                                       ...candidate,
                                       companyId: newValue,
                                    });
                                    setRolesList(newValue.roles);
                                 }}
                                 renderInput={(params) => (
                                    <TextField
                                       {...params}
                                       label="Company"
                                       InputProps={{
                                          ...params.InputProps,
                                          type: "search",
                                       }}
                                    />
                                 )}
                                 readOnly={!editable}
                              />
                           </Grid>
                           <Grid item xs={5}>
                              <Autocomplete
                                 id="Roles"
                                 disableClearable
                                 options={rolesList}
                                 isOptionEqualToValue={(option, value) =>
                                    option._id === value._id
                                 }
                                 value={candidate.roleId}
                                 getOptionLabel={(option) => option.role}
                                 onChange={(e, newValue) => {
                                    setCandidate({
                                       ...candidate,
                                       roleId: newValue,
                                    });
                                 }}
                                 renderInput={(params) => (
                                    <TextField
                                       {...params}
                                       label="Role"
                                       InputProps={{
                                          ...params.InputProps,
                                          type: "search",
                                       }}
                                    />
                                 )}
                                 readOnly={!editable}
                              />
                           </Grid>
                           <Grid item xs={2}>
                              <a
                                 href={`/EditRole/${
                                    candidate.companyId?._id || ""
                                 }/${candidate.roleId?._id || ""}?edit=false`}
                                 target="_blank"
                              >
                                 <Button
                                    variant="contained"
                                    size="large"
                                    sx={{ height: "100%" }}
                                 >
                                    <OpenInNew />
                                 </Button>
                              </a>
                           </Grid>
                           <Grid item xs={4}>
                              <LocalizationProvider
                                 dateAdapter={AdapterDayjs}
                                 fullWidth
                              >
                                 <DatePicker
                                    format="DD/MM/YYYY"
                                    label="Interview Date"
                                    className="candidateCompanyEndDate"
                                    sx={{ width: "100%" }}
                                    fullWidth
                                    onChange={(e) => {
                                       setCandidate({
                                          ...candidate,
                                          interviewDate: e,
                                       });
                                    }}
                                    value={dayjs(candidate.interviewDate)}
                                    readOnly={!editable}
                                 />
                              </LocalizationProvider>
                           </Grid>
                        </>
                     )}
                     {["TAC", "GOOD"].includes(candidate.l2Assessment) && (
                        <>
                           <Grid item xs={4}>
                              <TextField
                                 id="candidateInterviewStatus"
                                 select
                                 label="Interview Status"
                                 value={candidate.interviewStatus}
                                 onChange={(e) =>
                                    setCandidate({
                                       ...candidate,
                                       interviewStatus: e.target.value,
                                       interviewStatDate: new Date(),
                                    })
                                 }
                                 fullWidth
                                 InputProps={{
                                    readOnly: !(TMAAccess && editable),
                                 }}
                              >
                                 {INTERVIEW_STATUS.map((option) => (
                                    <MenuItem key={option} value={option}>
                                       {option}
                                    </MenuItem>
                                 ))}
                              </TextField>
                           </Grid>
                           <Grid item xs={4}>
                              <TextField
                                 id="candidateEmpId"
                                 label="Employee ID"
                                 variant="outlined"
                                 fullWidth
                                 value={candidate.EMP_ID}
                                 onChange={(e) =>
                                    setCandidate({
                                       ...candidate,
                                       EMP_ID: e.target.value,
                                    })
                                 }
                                 InputProps={{
                                    readOnly: !(TMAAccess && editable),
                                 }}
                              />
                           </Grid>
                        </>
                     )}
                     {["TAC", "GOOD"].includes(candidate.l2Assessment) &&
                        candidate.interviewStatus === "Offer Drop" &&
                        !rtAccess && (
                           <Grid item xs={12}>
                              <LocalizationProvider
                                 dateAdapter={AdapterDayjs}
                                 fullWidth
                              >
                                 <DatePicker
                                    format="DD/MM/YYYY"
                                    label="Offer Drop Date"
                                    id="candidateOfferDropDate"
                                    sx={{ width: "100%" }}
                                    fullWidth
                                    onChange={(e) => {
                                       setCandidate({
                                          ...candidate,
                                          offerDropDate: e,
                                       });
                                    }}
                                    value={dayjs(candidate.offerDropDate)}
                                    readOnly={!(TMAAccess && editable)}
                                 />
                              </LocalizationProvider>
                           </Grid>
                        )}
                     {["TAC", "GOOD"].includes(candidate.l2Assessment) &&
                        candidate.interviewStatus === "Select" &&
                        !rtAccess && (
                           <>
                              <Grid item xs={6}>
                                 <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    fullWidth
                                 >
                                    <DatePicker
                                       format="DD/MM/YYYY"
                                       label="Selection Date"
                                       id="candidateSelectionDate"
                                       sx={{ width: "100%" }}
                                       fullWidth
                                       onChange={(e) => {
                                          setCandidate({
                                             ...candidate,
                                             selectDate: e,
                                          });
                                       }}
                                       value={dayjs(candidate.selectDate)}
                                       readOnly={!(TMAAccess && editable)}
                                    />
                                 </LocalizationProvider>
                              </Grid>

                              <Grid item xs={6}>
                                 <TextField
                                    id="candidateSelect"
                                    select
                                    label="Select"
                                    value={candidate.select}
                                    onChange={(e) =>
                                       setCandidate({
                                          ...candidate,
                                          select: e.target.value,
                                          tenureStatDate: new Date(),
                                       })
                                    }
                                    fullWidth
                                    InputProps={{
                                       readOnly: !(TMAAccess && editable),
                                    }}
                                 >
                                    {SELECT_STATUS.map((option) => (
                                       <MenuItem key={option} value={option}>
                                          {option}
                                       </MenuItem>
                                    ))}
                                 </TextField>
                              </Grid>
                           </>
                        )}
                     {["TAC", "GOOD"].includes(candidate.l2Assessment) &&
                        candidate.interviewStatus === "Select" &&
                        [
                           "Tracking",
                           "Billing",
                           "Need to Bill",
                           "Invoice Processed",
                           "Billed & Tracking",
                        ].includes(candidate.select) && (
                           <>
                              <Grid item xs={4}>
                                 <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    fullWidth
                                 >
                                    <DatePicker
                                       format="DD/MM/YYYY"
                                       label="Onboarding Date"
                                       className="candidateonboardingDate"
                                       sx={{ width: "100%" }}
                                       fullWidth
                                       value={dayjs(candidate.onboardingDate)}
                                       onChange={(e) =>
                                          setCandidate({
                                             ...candidate,
                                             onboardingDate: e,
                                          })
                                       }
                                       readOnly={!(TMAAccess && editable)}
                                    />
                                 </LocalizationProvider>
                              </Grid>
                              <Grid item xs={4}>
                                 <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    fullWidth
                                 >
                                    <DatePicker
                                       format="DD/MM/YYYY"
                                       label="Next Tracking Date"
                                       className="candidateNXD"
                                       sx={{ width: "100%" }}
                                       fullWidth
                                       value={dayjs(candidate.nextTrackingDate)}
                                       onChange={(e) => {
                                          setCandidate({
                                             ...candidate,
                                             nextTrackingDate: e,
                                          });
                                       }}
                                       readOnly={!(TMAAccess && editable)}
                                    />
                                 </LocalizationProvider>
                              </Grid>
                              <Grid item xs={4}>
                                 <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    fullWidth
                                 >
                                    <DatePicker
                                       format="DD/MM/YYYY"
                                       label="End Tracking Date"
                                       className="candidateEXD"
                                       sx={{ width: "100%" }}
                                       fullWidth
                                       value={dayjs(candidate.endTrackingDate)}
                                       onChange={(e) => {
                                          setCandidate({
                                             ...candidate,
                                             endTrackingDate: e,
                                          });
                                       }}
                                       readOnly={!(TMAAccess && editable)}
                                    />
                                 </LocalizationProvider>
                              </Grid>
                              <Grid item xs={4}>
                                 <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    fullWidth
                                 >
                                    <DatePicker
                                       format="DD/MM/YYYY"
                                       label="Billing Date"
                                       className="candidateBillingDate"
                                       sx={{ width: "100%" }}
                                       fullWidth
                                       onChange={(e) => {
                                          setCandidate({
                                             ...candidate,
                                             billingDate: e,
                                          });
                                       }}
                                       value={dayjs(candidate.billingDate)}
                                       readOnly={!(TMAAccess && editable)}
                                    />
                                 </LocalizationProvider>
                              </Grid>
                              <Grid item xs={4}>
                                 <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    fullWidth
                                 >
                                    <DatePicker
                                       format="DD/MM/YYYY"
                                       label="Invoice Date"
                                       className="candidateInvoiceDate"
                                       sx={{ width: "100%" }}
                                       fullWidth
                                       onChange={(e) => {
                                          setCandidate({
                                             ...candidate,
                                             invoiceDate: e,
                                          });
                                       }}
                                       value={dayjs(candidate.invoiceDate)}
                                       readOnly={!(TMAAccess && editable)}
                                    />
                                 </LocalizationProvider>
                              </Grid>
                              <Grid item xs={4}>
                                 <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    fullWidth
                                 >
                                    <DatePicker
                                       format="DD/MM/YYYY"
                                       label="Invoice Credited Date"
                                       className="candidateInvoiceCreditedDate"
                                       sx={{ width: "100%" }}
                                       fullWidth
                                       onChange={(e) => {
                                          setCandidate({
                                             ...candidate,
                                             invoiceCreditDate: e,
                                          });
                                       }}
                                       value={dayjs(
                                          candidate.invoiceCreditDate
                                       )}
                                       readOnly={!(TMAAccess && editable)}
                                    />
                                 </LocalizationProvider>
                              </Grid>
                              <Grid item xs={6}>
                                 <TextField
                                    id="candidateRate"
                                    type="Number"
                                    label="Rate"
                                    value={candidate.rate}
                                    onChange={(e) =>
                                       setCandidate({
                                          ...candidate,
                                          rate: e.target.value,
                                       })
                                    }
                                    fullWidth
                                    InputProps={{
                                       readOnly: !(TMAAccess && editable),
                                    }}
                                 />
                              </Grid>
                              <Grid item xs={6}>
                                 <TextField
                                    id="candidateInvoiceNumber"
                                    label="Invoice Number"
                                    value={candidate.invoiceNumber}
                                    onChange={(e) =>
                                       setCandidate({
                                          ...candidate,
                                          invoiceNumber: e.target.value,
                                       })
                                    }
                                    fullWidth
                                    InputProps={{
                                       readOnly: !(TMAAccess && editable),
                                    }}
                                 />
                              </Grid>
                           </>
                        )}
                     {["TAC", "GOOD"].includes(candidate.l2Assessment) &&
                        candidate.interviewStatus === "Select" &&
                        [
                           "Non Tenure",
                           "Process Rampdown",
                           "Client Rampdown",
                           "Tenure-Source Conflit",
                           "BGV Reject-Post",
                        ].includes(candidate.select) && (
                           <>
                              <Grid item xs={4}>
                                 <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    fullWidth
                                 >
                                    <DatePicker
                                       format="DD/MM/YYYY"
                                       label="Onboarding Date"
                                       className="candidateonboardingDate"
                                       sx={{ width: "100%" }}
                                       fullWidth
                                       value={dayjs(candidate.onboardingDate)}
                                       onChange={(e) =>
                                          setCandidate({
                                             ...candidate,
                                             onboardingDate: e,
                                          })
                                       }
                                       readOnly={!(TMAAccess && editable)}
                                    />
                                 </LocalizationProvider>
                              </Grid>
                              <Grid item xs={4}>
                                 <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    fullWidth
                                 >
                                    <DatePicker
                                       format="DD/MM/YYYY"
                                       label="Non Tenure Date"
                                       className="candidateNonTenureDate"
                                       sx={{ width: "100%" }}
                                       fullWidth
                                       value={dayjs(candidate.nonTenureDate)}
                                       onChange={(e) =>
                                          setCandidate({
                                             ...candidate,
                                             nonTenureDate: e,
                                          })
                                       }
                                       readOnly={!(TMAAccess && editable)}
                                    />
                                 </LocalizationProvider>
                              </Grid>
                              <Grid item xs={4}>
                                 <TextField
                                    id="candidateRate"
                                    type="Number"
                                    label="Rate"
                                    value={candidate.rate}
                                    onChange={(e) =>
                                       setCandidate({
                                          ...candidate,
                                          rate: e.target.value,
                                       })
                                    }
                                    fullWidth
                                    InputProps={{
                                       readOnly: !(TMAAccess && editable),
                                    }}
                                 />
                              </Grid>
                           </>
                        )}
                     <Grid item xs={9} />
                     <Grid item xs={3}>
                        <Button
                           fullWidth
                           variant="contained"
                           size="large"
                           onClick={handleEditCandidate}
                           disabled={!editable}
                           sx={{ backgroundColor: alpha("#0000FF", 0.5) }}
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
            <Card
               sx={{
                  borderRadius: "20px",
                  backgroundColor: "transparent",
                  marginTop: "20px",
               }}
            >
               <CardHeader
                  sx={{
                     backgroundColor: alpha("#0B0B0B", 0.5),
                     backdropFilter: "blur(5px)",
                     height: "7.5vh",
                     color: "white",
                  }}
                  title="REMARKS"
                  titleTypographyProps={{
                     sx: {
                        fontSize: "2.8vh",
                        letterSpacing: "5px",
                     },
                  }}
               />
               <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.75) }}>
                  <Grid container rowSpacing={2} columnSpacing={1}>
                     <Grid item xs={12}>
                        <TextField
                           id="candidateRemarks"
                           label="Remarks"
                           variant="outlined"
                           fullWidth
                           value={remarks}
                           onChange={(e) => setRemarks(e.target.value)}
                           multiline
                        />
                     </Grid>
                     <Grid item xs={10} />
                     <Grid item xs={2}>
                        <Button
                           fullWidth
                           variant="contained"
                           size="medium"
                           onClick={handleAddRemarks}
                           sx={{ backgroundColor: alpha("#0000FF", 0.5) }}
                        >
                           Post
                        </Button>
                     </Grid>
                     {remarksList.map((remark) => (
                        <Grid item xs={12}>
                           <Card
                              sx={{
                                 borderRadius: "20px",
                                 
                              }}
                           >
                              <CardHeader
                                 avatar={
                                    <Avatar
                                       sx={{ bgcolor: red[500] }}
                                       aria-label="recipe"
                                    >
                                       {remark.employeeId.name[0]}
                                    </Avatar>
                                 }
                                 title={remark.employeeId.name}
                                 subheader={
                                    remark.createdAt.split("T")[0] +
                                    " " +
                                    remark.createdAt
                                       .split("T")[1]
                                       .substring(0, 8)
                                 }
                              />
                              <CardContent>
                                 <Typography variant="body">
                                    {remark.remarks}
                                 </Typography>
                              </CardContent>
                           </Card>
                        </Grid>
                     ))}
                  </Grid>
               </CardContent>
            </Card>
         </Container>
      </>
   );
}
