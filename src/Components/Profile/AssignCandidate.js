import React from "react";
import {
   Container,
   TextField,
   Card,
   CardHeader,
   CardContent,
   BottomNavigation,
   Button,
   Grid,
   Chip,
   Autocomplete,
   alpha,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../Main/AxiosInstance";
import {
   L1_STATUS,
   L2_STATUS,
   SELECT_STATUS,
   INTERVIEW_STATUS,
   LANGUAGE_LEVEL,
} from "../Main/Constants";
export default function AssignCandidate() {
   // STATES HANDLING AND VARIABLES
   const navigate = useNavigate();
   const [companiesList, setCompaniesList] = React.useState([]);
   const [rolesList, setRolesList] = React.useState([]);
   const [skillsList, setSkillsList] = React.useState([]);
   const [locationList, setLocationList] = React.useState([]);
   const [qualificationList, setQualificationList] = React.useState([]);
   const [employeeList, setEmployeeList] = React.useState([]);
   const [languageList, setLanguageList] = React.useState([{ language: " " }]);
   const [candidate, setCandidate] = React.useState({
      fullName: null,
      mobile: null,
      email: null,
      homeTown: [],
      currentCity: [],
      qualification: [],
      minYOP: null,
      maxYOP: null,
      language: [],
      all: [],
      any: [],
      companyName: null,
      role: null,
      companyId: null,
      roleId: null,
      mininterviewDate: null,
      maxinterviewDate: null,
      remarks: null,
      interviewStatus: [],
      select: [],
      l1Assessment: [],
      l2Assessment: [],
      assignedEmployee: [],
      createdByEmployee: [],
      createdOn: null,
      lastUpdatedOn: null,
      assignedOn: null,
      l1StatDate: null,
      l2StatDate: null,
      interviewStatDate: null,
      tenureStatDate: null,
      selectDate: null,
      offerDropDate: null,
      nonTenureDate: null,
      invoiceCreditDate: null,
      endTrackingDate: null,
      source: null,
      tag: null,
   });

   // API CALLS HANDLING
   React.useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await AxiosInstance.get(
               "/company/candidateCompanyType?companyType=Empanelled"
            );
            const extraRes = await AxiosInstance.get("/extra/all");
            const empres = await AxiosInstance.get("/employee");
            setEmployeeList(empres.data.employees);

            setCompaniesList(res.data.data);
            extraRes.data.forEach(({ _id, data }) => {
               if (_id === "Skills") setSkillsList(data);
               else if (_id === "Locations") setLocationList(data);
               else if (_id === "Qualifications") setQualificationList(data);
               else if (_id === "Languages") setLanguageList(data);
            });
         } catch (error) {}
      };
      fetchData();
   }, []);

   // FUNCTIONS HANDLING
   // Helper function to convert dayjs object to date string (YYYY-MM-DD) without time
   const convertDateToISO = (dayjsDate) => {
      if (!dayjsDate) return null;
      if (dayjsDate?.$isDayjsObject) {
         // Convert to date only (YYYY-MM-DD) by setting time to start of day
         return dayjsDate.startOf("day").format("YYYY-MM-DD");
      }
      return dayjsDate;
   };

   const handleAssignCandidate = async () => {
      var query = [];
      if (candidate.fullName) {
         var nameLen = candidate.fullName.length;
         var newName = "";
         for (var i = 0; i < nameLen; i++) {
            if (candidate.fullName[i] === "(" || candidate.fullName[i] === "(")
               newName += "\\";
            newName += candidate.fullName[i];
         }
         query.push({
            fullName: {
               $regex: ".*" + newName + ".*",
               $options: "i",
            },
         });
      }
      if (candidate.mobile)
         query.push({
            mobile: {
               $regex: ".*" + candidate.mobile + ".*",
               $options: "i",
            },
         });
      if (candidate.remarks)
         query.push({
            remarks: {
               $regex: ".*" + candidate.remarks + ".*",
               $options: "i",
            },
         });
      if (candidate.email)
         query.push({
            email: {
               $regex: ".*" + candidate.email + ".*",
               $options: "i",
            },
         });
      if (candidate.homeTown.length > 0)
         query.push({
            homeTown: {
               $in: candidate.homeTown,
            },
         });
      if (candidate.interviewStatus.length > 0)
         query.push({
            interviewStatus: {
               $in: candidate.interviewStatus,
            },
         });
      if (candidate.language.length > 0)
         query.push({
            "languages.language": {
               $in: candidate.language,
            },
         });
      if (candidate.select.length > 0)
         query.push({
            select: {
               $in: candidate.select,
            },
         });
      if (candidate.l1Assessment.length > 0)
         query.push({
            l1Assessment: {
               $in: candidate.l1Assessment,
            },
         });
      if (candidate.l2Assessment.length > 0)
         query.push({
            l2Assessment: {
               $in: candidate.l2Assessment,
            },
         });
      if (candidate.currentCity.length > 0)
         query.push({
            currentCity: {
               $in: candidate.currentCity,
            },
         });
      if (candidate.any.length > 0)
         query.push({
            skills: {
               $in: candidate.any,
            },
         });
      if (candidate.createdByEmployee.length > 0) {
         query.push({
            createdByEmployee: {
               $in: candidate.createdByEmployee,
            },
         });
      }
      if (candidate.assignedEmployee.length > 0) {
         query.push({
            assignedEmployee: {
               $in: candidate.assignedEmployee,
            },
         });
      }
      if (candidate.qualification.length > 0)
         query.push({
            "qualifications.qualification": {
               $in: candidate.qualification,
            },
         });
      if (candidate.minYOP)
         query.push({ "qualifications.YOP": { $gt: candidate.minYOP } });
      if (candidate.maxYOP)
         query.push({ "qualifications.YOP": { $lt: candidate.maxYOP } });
      if (candidate.mininterviewDate) {
         const minDate = convertDateToISO(candidate.mininterviewDate);
         if (minDate) query.push({ interviewDate: { $gt: minDate } });
      }
      if (candidate.maxinterviewDate) {
         const maxDate = convertDateToISO(candidate.maxinterviewDate);
         if (maxDate) query.push({ interviewDate: { $lt: maxDate } });
      }

      if (candidate.companyName)
         query.push({
            "experience.companyName": {
               $regex: ".*" + candidate.companyName + ".*",
            },
         });
      if (candidate.role)
         query.push({
            "experience.role": {
               $regex: ".*" + candidate.role + ".*",
            },
         });
      if (candidate.companyId) query.push({ companyId: candidate.companyId });
      if (candidate.roleId)
         query.push({
            companyId: candidate.companyId,
            roleId: candidate.roleId,
         });

      // Date field queries - Convert dayjs objects to ISO strings
      if (candidate.createdOn) {
         const date = convertDateToISO(candidate.createdOn);
         if (date) query.push({ createdOn: { $gte: date } });
      }
      if (candidate.lastUpdatedOn) {
         const date = convertDateToISO(candidate.lastUpdatedOn);
         if (date) query.push({ lastUpdatedOn: { $gte: date } });
      }
      if (candidate.assignedOn) {
         const date = convertDateToISO(candidate.assignedOn);
         if (date) query.push({ assignedOn: { $gte: date } });
      }
      if (candidate.l1StatDate) {
         const date = convertDateToISO(candidate.l1StatDate);
         if (date) query.push({ l1StatDate: { $gte: date } });
      }
      if (candidate.l2StatDate) {
         const date = convertDateToISO(candidate.l2StatDate);
         if (date) query.push({ l2StatDate: { $gte: date } });
      }
      if (candidate.interviewStatDate) {
         const date = convertDateToISO(candidate.interviewStatDate);
         if (date) query.push({ interviewStatDate: { $gte: date } });
      }
      if (candidate.tenureStatDate) {
         const date = convertDateToISO(candidate.tenureStatDate);
         if (date) query.push({ tenureStatDate: { $gte: date } });
      }
      if (candidate.selectDate) {
         const date = convertDateToISO(candidate.selectDate);
         if (date) query.push({ selectDate: { $gte: date } });
      }
      if (candidate.offerDropDate) {
         const date = convertDateToISO(candidate.offerDropDate);
         if (date) query.push({ offerDropDate: { $gte: date } });
      }
      if (candidate.nonTenureDate) {
         const date = convertDateToISO(candidate.nonTenureDate);
         if (date) query.push({ nonTenureDate: { $gte: date } });
      }
      if (candidate.invoiceCreditDate) {
         const date = convertDateToISO(candidate.invoiceCreditDate);
         if (date) query.push({ invoiceCreditDate: { $gte: date } });
      }
      if (candidate.endTrackingDate) {
         const date = convertDateToISO(candidate.endTrackingDate);
         if (date) query.push({ endTrackingDate: { $gte: date } });
      }

      // String field queries
      if (candidate.source) query.push({ source: candidate.source });
      if (candidate.tag) query.push({ tag: candidate.tag });
      var finalq = {};
      if (query.length > 0)
         if (candidate.all.length > 0)
            finalq = { skills: { $all: [...candidate.all] }, $or: [...query] };
         else finalq = { $and: [...query] };
      else {
         if (candidate.all.length > 0)
            finalq = { skills: { $all: [...candidate.all] } };
      }

      navigate("/AssignCandidateGrid", {
         replace: true,
         state: {
            query: { ...finalq },
         },
      });
   };

   // JSX CODE
   return (
      <Container
         maxWidth={false}
         sx={{
            paddingTop: "9vh",
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
               title="ASSIGN CANDIDATE"
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
                        id="candiateName"
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        value={candidate.fullName}
                        onChange={(e) =>
                           setCandidate({
                              ...candidate,
                              fullName: e.target.value,
                           })
                        }
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        id="outlined-basic"
                        label="Mobile Number"
                        variant="outlined"
                        value={candidate.mobile}
                        onChange={(e) => {
                           setCandidate({
                              ...candidate,
                              mobile: e.target.value,
                           });
                        }}
                        fullWidth
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        id="outlined-basic"
                        label="Email ID"
                        variant="outlined"
                        value={candidate.email}
                        onChange={(e) => {
                           setCandidate({
                              ...candidate,
                              email: e.target.value,
                           });
                        }}
                        fullWidth
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <Autocomplete
                        multiple
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
                           <TextField {...params} label="Candidate Home Town" />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <Autocomplete
                        id="candidateCurrentCity"
                        multiple
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
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <Autocomplete
                        className="candidateLanguage"
                        options={languageList}
                        multiple
                        filterSelectedOptions
                        getOptionLabel={(option) => option}
                        value={candidate.language}
                        onChange={(e, v) => {
                           candidate.language = v;
                           setCandidate({
                              ...candidate,
                              language: v,
                           });
                        }}
                        renderInput={(params) => (
                           <TextField {...params} label="Language" />
                        )}
                     />
                  </Grid>

                  <Grid item xs={12} md={6}>
                     <Autocomplete
                        multiple
                        id="candidateQualification"
                        options={qualificationList.map((q) => q)}
                        filterSelectedOptions
                        value={candidate.qualification}
                        onChange={(e, v) =>
                           setCandidate({
                              ...candidate,
                              qualification: v,
                           })
                        }
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              label="Candidate Quaification"
                           />
                        )}
                     />
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Minimum Year of Passing"
                           views={["year"]}
                           sx={{ width: "100%" }}
                           fullWidth
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 minYOP: e,
                              });
                           }}
                           value={candidate.minYOP}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Maximum Year of Passing"
                           views={["year"]}
                           sx={{ width: "100%" }}
                           fullWidth
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 maxYOP: e,
                              });
                           }}
                           value={candidate.maxYOP}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                     <Autocomplete
                        multiple
                        freeSolo
                        id="candidateSkills"
                        options={skillsList.map((skill) => skill)}
                        filterSelectedOptions
                        value={candidate.all}
                        onChange={(e, v) =>
                           setCandidate({ ...candidate, all: v })
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
                           <TextField {...params} label="All" />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <Autocomplete
                        multiple
                        freeSolo
                        id="candidateSkills"
                        options={skillsList.map((skill) => skill)}
                        filterSelectedOptions
                        value={candidate.any}
                        onChange={(e, v) =>
                           setCandidate({ ...candidate, any: v })
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
                           <TextField {...params} label="Any" />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        id="candidateCompanyName"
                        label="Candidate Previous Company"
                        variant="outlined"
                        value={candidate.companyName}
                        onChange={(e) => {
                           setCandidate({
                              ...candidate,
                              companyName: e.target.value,
                           });
                        }}
                        fullWidth
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        id="candidateCompanyRole"
                        label="Candidate Previous Role"
                        variant="outlined"
                        value={candidate.role}
                        fullWidth
                        onChange={(e) => {
                           setCandidate({
                              ...candidate,
                              role: e.target.value,
                           });
                        }}
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <Autocomplete
                        multiple
                        id="candidateL1Assessment"
                        options={L1_STATUS.map((a) => a)}
                        filterSelectedOptions
                        value={candidate.l1Assessment}
                        onChange={(e, v) =>
                           setCandidate({
                              ...candidate,
                              l1Assessment: v,
                           })
                        }
                        renderInput={(params) => (
                           <TextField {...params} label="L1 Assessment" />
                        )}
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <Autocomplete
                        multiple
                        id="candidateL2Assessment"
                        options={L2_STATUS.filter((item) => item !== null)}
                        filterSelectedOptions
                        value={candidate.l2Assessment}
                        onChange={(e, v) =>
                           setCandidate({
                              ...candidate,
                              l2Assessment: v,
                           })
                        }
                        renderInput={(params) => (
                           <TextField {...params} label="L2 Assessment" />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <Autocomplete
                        id="Companies"
                        options={companiesList}
                        filterSelectedOptions
                        getOptionLabel={(option) => option.companyName}
                        renderOption={(props, item) => (
                           <li {...props} key={item.key}>
                              {item.companyName}
                           </li>
                        )}
                        onChange={(e, newValue) => {
                           setCandidate({
                              ...candidate,
                              companyId: newValue?._id
                                 ? newValue._id
                                 : newValue,
                           });
                           setRolesList(newValue.roles);
                        }}
                        renderInput={(params) => (
                           <TextField {...params} label="Company" />
                        )}
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <Autocomplete
                        id="Roles"
                        disableClearable
                        options={rolesList}
                        getOptionLabel={(option) => option.role}
                        onChange={(e, newValue) => {
                           setCandidate({ ...candidate, roleId: newValue._id });
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
                     />
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Minimum Interview Date"
                           className="candidateCompanyEndDate"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.mininterviewDate}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 mininterviewDate: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Maximum Interview Date"
                           className="candidateCompanyEndDate"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.maxinterviewDate}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 maxinterviewDate: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <Autocomplete
                        multiple
                        id="candidateInterviewStatus"
                        options={INTERVIEW_STATUS.map((i) => i)}
                        filterSelectedOptions
                        value={candidate.interviewStatus}
                        onChange={(e, v) =>
                           setCandidate({
                              ...candidate,
                              interviewStatus: v,
                           })
                        }
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              label="Candidate Interview Status"
                           />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <Autocomplete
                        multiple
                        id="candidateSelect"
                        options={SELECT_STATUS.map((s) => s)}
                        filterSelectedOptions
                        value={candidate.select}
                        onChange={(e, v) =>
                           setCandidate({
                              ...candidate,
                              select: v,
                           })
                        }
                        renderInput={(params) => (
                           <TextField
                              {...params}
                              label="Candidate Select Status"
                           />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <Autocomplete
                        multiple
                        id="Employees"
                        options={employeeList}
                        filterSelectedOptions
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, item) => (
                           <li {...props} key={item.key}>
                              {item.name}
                           </li>
                        )}
                        onChange={(e, v) =>
                           setCandidate({
                              ...candidate,
                              createdByEmployee: v?.map((a) =>
                                 a?._id ? a._id : a
                              ),
                           })
                        }
                        renderInput={(params) => (
                           <TextField {...params} label="Created By" />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <Autocomplete
                        multiple
                        id="Employees"
                        options={employeeList}
                        filterSelectedOptions
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, item) => (
                           <li {...props} key={item.key}>
                              {item.name}
                           </li>
                        )}
                        onChange={(e, v) =>
                           setCandidate({
                              ...candidate,
                              assignedEmployee: v?.map((a) =>
                                 a?._id ? a._id : a
                              ),
                           })
                        }
                        renderInput={(params) => (
                           <TextField {...params} label="Assigned To" />
                        )}
                     />
                  </Grid>

                  {/* Date Fields */}
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Created On"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.createdOn}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 createdOn: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Last Updated On"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.lastUpdatedOn}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 lastUpdatedOn: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Assigned On"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.assignedOn}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 assignedOn: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="L1 Set Date"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.l1StatDate}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 l1StatDate: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="L2 Set Date"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.l2StatDate}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 l2StatDate: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Interview Set Date"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.interviewStatDate}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 interviewStatDate: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Tenure Set Date"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.tenureStatDate}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 tenureStatDate: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Select Date"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.selectDate}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 selectDate: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Offer Drop Date"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.offerDropDate}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 offerDropDate: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Non Tenure Date"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.nonTenureDate}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 nonTenureDate: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="Invoice Credit Date"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.invoiceCreditDate}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 invoiceCreditDate: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                        <DatePicker
                           format="DD/MM/YYYY"
                           label="End Tracking Date"
                           sx={{ width: "100%" }}
                           fullWidth
                           value={candidate.endTrackingDate}
                           onChange={(e) => {
                              setCandidate({
                                 ...candidate,
                                 endTrackingDate: e,
                              });
                           }}
                        />
                     </LocalizationProvider>
                  </Grid>

                  {/* String Fields */}
                  <Grid item xs={6} md={3}>
                     <TextField
                        fullWidth
                        label="Source"
                        value={candidate.source || ""}
                        onChange={(e) => {
                           setCandidate({
                              ...candidate,
                              source: e.target.value,
                           });
                        }}
                     />
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <TextField
                        fullWidth
                        label="Tag"
                        value={candidate.tag || ""}
                        onChange={(e) => {
                           setCandidate({
                              ...candidate,
                              tag: e.target.value,
                           });
                        }}
                     />
                  </Grid>

                  <Grid item xs={7} md={9} />
                  <Grid item xs={5} md={3}>
                     <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        sx={{ backgroundColor: alpha("#0000FF", 0.5) }}
                        onClick={handleAssignCandidate}
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
