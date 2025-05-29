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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export default function AddCandidate(props) {

  // STATES HANDLING AND VARIABLES
  const navigate = useNavigate();
  const { employeeType,userid } = useSelector((state) => state.user);
  const access = !["Recruiter", "Intern"].includes(employeeType);
  const [companiesList, setCompaniesList] = React.useState([]);
  const [rolesList, setRolesList] = React.useState([]);
  const [skillsList, setSkillsList] = React.useState([]);
  const [locationList, setLocationList] = React.useState([]);
  const [qualificationList, setQualificationList] = React.useState([]);
  const [languageList, setLanguageList] = React.useState([]);
  const [expandedCompany, setExpandedCompany] = React.useState(false);
  const [languageLevelList, setlanguageLevelList] = React.useState([]);
  const [assessment, setAssessment] = React.useState([]);
  const [interviewStatus, setInterviewStatus] = React.useState([]);
  const [select, setSelect] = React.useState([]);
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
    rate: 0,
    interviewStatus: null,
    select: null,
    EMP_ID: "",
    onboardingDate: null,
    nextTrackingDate: null,
    l1Assessment: "",
    l2Assessment: null,
    billingDate: null,
    invoiceNumber: "",
    invoiceDate: null,
  });



  // API CALLS HANDLING
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://tpp-backend-eura.onrender.com/api/v1/company/companyType?companyType=Empanelled",
          {
            headers: {
              authorization: JSON.parse(localStorage.getItem("user")).token,
            },
          }
        );
        const extraRes = await axios.get(
          "https://tpp-backend-eura.onrender.com/api/v1/extra/all",
          {
            headers: {
              authorization: JSON.parse(localStorage.getItem("user")).token,
            },
          }
        );

        setCompaniesList(res.data);
        extraRes.data.forEach(({ _id, data }) => {
          if (_id === "Skills") setSkillsList(data);
          else if (_id === "Locations") setLocationList(data);
          else if (_id === "Qualifications") setQualificationList(data);
          else if (_id === "Languages") setLanguageList(data);
          else if (_id === "Language Level") setlanguageLevelList(data);
          else if (_id === "L1&L2") setAssessment(data);
          else if (_id === "Interview Status") setInterviewStatus(data);
          else if (_id === "Select") setSelect(data);
        });
      } catch (error) {}
    };
    fetchData();
  }, []);

  

  // FUNCTIONS HANDLING AND API POST CALLS
  const handleExpandCompany = () => {
    setExpandedCompany(!expandedCompany);
  };

  const handleAddCandidate = async () => {
    try {
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
      if (
        ["TAC", "GOOD"].includes(candidate.l2Assessment) &&
        candidate.interviewStatus === "Select" &&
        !candidate.select
      ) {
        toast.error("Missing Select Status");
        flag = 1;
      }
      
      if (flag) return;
      await axios.post(
        "https://tpp-backend-eura.onrender.com/api/v1/candidate",
        {
          ...candidate,
          assignedEmployee: userid,
          createdByEmployee: userid,
        },
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      );
      await axios.patch(
        "https://tpp-backend-eura.onrender.com/api/v1/extra/skills",
        { data: [...new Set([...candidate.skills, ...skillsList])] },
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      );
      toast.success("Candidate Added Successfully");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const checkNumber = async (num) => {
    try {
      const res = await axios.get(
        "https://tpp-backend-eura.onrender.com/api/v1/candidate/mobile/" + num,

        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      );
      if (res.data.status === true) toast.error("Number already exists");
    } catch (error) {}
  };



  // JSX CODE
  return (
    <>
      <Container
        maxWidth={false}
        sx={{ paddingTop: "9.5vh", width: { sm: "90%", md: "70%" }, paddingBottom: "2vh" }}
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
            title="ADD PERSONAL INFORMATION"
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
                  id="candiateName"
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={candidate.fullName}
                  inputProps={{
                    pattern: "[A-Za-z ]+",
                  }}
                  onChange={(e) => {
                    setCandidate({ ...candidate, fullName: e.target.value });
                    if (!e.target.validity.valid) {
                      toast.warning(
                        "Only Alphabets and Space allowed in Name!"
                      );
                    }
                  }}
                />
              </Grid>

              {candidate.mobile.map((x, i) => (
                <>
                  <Grid item xs={7.5} md={9}>
                    <TextField
                      id="outlined-basic"
                      label="Mobile Number"
                      variant="outlined"
                      value={x}
                      required
                      onChange={(e) => {
                        if (!/^\d*$/.test(e.target.value))
                          toast.warning("Only Number allowed in Mobile");
                        candidate.mobile[i] = e.target.value;
                        setCandidate({
                          ...candidate,
                          mobile: candidate.mobile,
                        });
                      }}
                      onBlur={(e) => {
                        if (!/^\d{10}$/.test(e.target.value)) {
                          if (e.target.value.length === 0) return;
                          toast.warning("Mobile number should be 10 digits");
                          return;
                        }
                        checkNumber(e.target.value);
                      }}
                      fullWidth
                    />
                  </Grid>
                  {i === 0 && (
                    <Grid item xs={4.5} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                          height: "100%",
                          backgroundColor: alpha("#0000FF", 0.5),
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
                  {i !== 0 && (
                    <Grid item xs={4.5} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        size="large"
                        sx={{
                          height: "100%",
                          backgroundColor: alpha("#FF0000", 0.6),
                        }}
                        endIcon={<RemoveCircleOutlineIcon />}
                        onClick={() => {
                          setCandidate({
                            ...candidate,
                            mobile: [...candidate.mobile].filter(
                              (_, indexFilter) => !(indexFilter === i)
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
                  <Grid item xs={7.5} md={9}>
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
                      onBlur={(e) => {
                        if (
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                            e.target.value
                          )
                        ) {
                          if (e.target.value.length === 0) return;
                          toast.warning("Not a valid Email");
                          return;
                        }
                      }}
                      fullWidth
                    />
                  </Grid>
                  {i === 0 && (
                    <Grid item xs={4.5} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                          height: "100%",
                          backgroundColor: alpha("#0000FF", 0.5),
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
                  {i !== 0 && (
                    <Grid item xs={4.5} md={3}>
                      <Button
                        fullWidth
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
                              (_, indexFilter) => !(indexFilter === i)
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
              <Grid item xs={12} md={6}>
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
                    <TextField {...params} label="Candidate Home Town" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                    <TextField {...params} label="Candidate Current City" />
                  )}
                />
              </Grid>
              {candidate.languages.map((x, i) => (
                <>
                  <Grid item xs={6} md={3}>
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
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      className="candidatelevel"
                      select
                      label="Level"
                      value={x.level}
                      onChange={(e) => {
                        candidate.languages[i].level = e.target.value;
                        setCandidate({
                          ...candidate,
                          languages: candidate.languages,
                        });
                      }}
                      fullWidth
                    >
                      {languageLevelList.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      id="candidateLanguageRemarks"
                      label="Remarks"
                      variant="outlined"
                      value={x.remarks}
                      onChange={(e) => {
                        candidate.languages[i].remarks = e.target.value;
                        setCandidate({
                          ...candidate,
                          languages: candidate.languages,
                        });
                      }}
                      fullWidth
                    />
                  </Grid>
                  {i === 0 && (
                    <Grid item xs={6} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                          height: "100%",
                          backgroundColor: alpha("#0000FF", 0.5),
                        }}
                        endIcon={<ControlPointIcon />}
                        onClick={() => {
                          setCandidate({
                            ...candidate,
                            languages: [
                              ...candidate.languages,
                              { language: "", level: "", remarks: "" },
                            ],
                          });
                        }}
                      >
                        Add
                      </Button>
                    </Grid>
                  )}
                  {i !== 0 && (
                    <Grid item xs={6} md={3}>
                      <Button
                        fullWidth
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
                            languages: [...candidate.languages].filter(
                              (_, indexFilter) => !(indexFilter === i)
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
            <Divider sx={{ marginTop: "4%" }} />
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
            <Divider sx={{ marginBottom: "2%" }} />
            <Grid container rowSpacing={2} columnSpacing={1}>
              {candidate.qualifications.map((x, i) => (
                <>
                  <Grid item xs={12} md={7}>
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
                      fullWidth
                    >
                      {qualificationList.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                      <DatePicker
                        label="Year of Passing"
                        views={["year"]}
                        sx={{ width: "100%" }}
                        fullWidth
                        onChange={(e) => {
                          candidate.qualifications[i].YOP = e;
                          setCandidate({
                            ...candidate,
                            qualifications: candidate.qualifications,
                          });
                        }}
                        value={x.YOP}
                      />
                    </LocalizationProvider>
                  </Grid>
                  {i === 0 && (
                    <Grid item xs={6} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                          height: "100%",
                          backgroundColor: alpha("#0000FF", 0.5),
                        }}
                        endIcon={<ControlPointIcon />}
                        onClick={() => {
                          setCandidate({
                            ...candidate,
                            qualifications: [
                              ...candidate.qualifications,
                              { qualification: "", YOP: dayjs(new Date()) },
                            ],
                          });
                        }}
                      >
                        Add
                      </Button>
                    </Grid>
                  )}
                  {i !== 0 && (
                    <Grid item xs={6} md={3}>
                      <Button
                        fullWidth
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
                            ].filter((_, indexFilter) => !(indexFilter === i)),
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
                  id="candidateSkills"
                  options={skillsList.map((skill) => skill)}
                  filterSelectedOptions
                  value={candidate.skills}
                  onChange={(e, v) => {
                    const skillsToSplit = v.filter((v)=>v.includes(" "))
                    const remSkills = v.filter((v)=>!v.includes(" "))
                    const skillsToPush = []
                    skillsToSplit.forEach(element => {
                      skillsToPush.push(...element.split(" "))
                      
                    })
                    setCandidate({ ...candidate, skills:[...new Set([...remSkills,...skillsToPush])]  })
                  
                  }}
                  
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
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
            <Divider sx={{ marginTop: "4%" }} />
            <Divider>
              <Chip
                sx={{
                  backgroundColor: alpha("#0B0B0B", 0.5),
                  color: "white",
                }}
                label="EXPERIENCE INFORMATION"
                light
                size="large"
              />
            </Divider>
            <Divider sx={{ marginBottom: "2%" }} />
            <Grid container sx={{ margin: "2%" }}>
              <Grid item xs={12}>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  defaultValue="FRESHER"
                  name="row-radio-buttons-group"
                  onChange={handleExpandCompany}
                >
                  <FormControlLabel
                    value="EXPERIENCE"
                    control={<Radio />}
                    label="EXPERIENCE"
                    aria-label="show more"
                  />
                  <FormControlLabel
                    value="FRESHER"
                    control={<Radio />}
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
                        <Grid container rowSpacing={2} columnSpacing={1}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              className="candidateCompanyName"
                              label="Comapany Name"
                              variant="outlined"
                              value={x.companyName}
                              onChange={(e) => {
                                candidate.experience[i].companyName =
                                  e.target.value;
                                setCandidate({
                                  ...candidate,
                                  experience: candidate.experience,
                                });
                              }}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              className="candidateCompanyRole"
                              label="Role"
                              variant="outlined"
                              value={x.role}
                              fullWidth
                              onChange={(e) => {
                                candidate.experience[i].role = e.target.value;
                                setCandidate({
                                  ...candidate,
                                  experience: candidate.experience,
                                });
                              }}
                            />
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              fullWidth
                            >
                              <DatePicker
                                label="Start Year"
                                className="candidateCompanyStartDate"
                                sx={{ width: "100%" }}
                                fullWidth
                                value={x.startDate}
                                onChange={(e) => {
                                  candidate.experience[i].startDate = e;
                                  setCandidate({
                                    ...candidate,
                                    experience: candidate.experience,
                                  });
                                }}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              fullWidth
                            >
                              <DatePicker
                                label="End Year"
                                className="candidateCompanyEndDate"
                                sx={{ width: "100%" }}
                                fullWidth
                                value={x.endDate}
                                onChange={(e) => {
                                  candidate.experience[i].endDate = e;
                                  setCandidate({
                                    ...candidate,
                                    experience: candidate.experience,
                                  });
                                }}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item xs={12} ma={6}>
                            <TextField
                              label="Salary"
                              variant="outlined"
                              className="candidateCompanySalary"
                              fullWidth
                              onChange={(e) => {
                                candidate.experience[i].salary = e.target.value;
                                setCandidate({
                                  ...candidate,
                                  experience: candidate.experience,
                                });
                              }}
                              value={x.salary}
                            />
                          </Grid>
                        </Grid>
                        <Divider sx={{ marginTop: "2%", marginBottom: "2%" }} />
                        {i === 0 && (
                          <>
                            <Grid item xs={7.5} md={9} />
                            <Grid item xs={4.5} md={3}>
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
                                        startDate: dayjs(new Date()),
                                        endDate: dayjs(new Date()),
                                        experience: 0,
                                      },
                                    ],
                                  });
                                }}
                                sx={{
                                  height: "100%",
                                  backgroundColor: alpha("#0000FF", 0.5),
                                }}
                                endIcon={<ControlPointIcon />}
                              >
                                Add
                              </Button>
                            </Grid>
                          </>
                        )}
                        {i !== 0 && (
                          <>
                            <Grid item xs={7.5} md={9} />
                            <Grid item xs={4.5} md={3}>
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
                                      (_, indexFilter) => !(indexFilter === i)
                                    ),
                                  });
                                }}
                                sx={{
                                  height: "100%",
                                  backgroundColor: alpha("#FF0000", 0.6),
                                }}
                                endIcon={<RemoveCircleOutlineIcon />}
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
                <Divider sx={{ marginTop: "2%", marginBottom: "2%" }} />
              </CardContent>
            </Collapse>
            <Divider sx={{ marginTop: "4%" }} />
            <Divider>
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
            <Divider sx={{ marginBottom: "2%" }} />
            <Grid container rowSpacing={2} columnSpacing={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="candidateL1Assessment"
                  select
                  label="L1 Assessment"
                  value={candidate.l1Assessment}
                  onChange={(e) =>
                    setCandidate({
                      ...candidate,
                      l1Assessment: e.target.value,
                    })
                  }
                  fullWidth
                >
                  {assessment.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {access && (
                <Grid item xs={12} md={6}>
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
                      })
                    }
                  >
                    {assessment.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  id="candidateRemarks"
                  label="Remarks"
                  variant="outlined"
                  fullWidth
                  value={candidate.remarks}
                  onChange={(e) =>
                    setCandidate({ ...candidate, remarks: e.target.value })
                  }
                  multiline
                />
              </Grid>
              {["WD", "TAC", "GOOD"].includes(candidate.l1Assessment) && (
                <>
                  <Grid item xs={4}>
                    <Autocomplete
                      id="Companies"
                      disableClearable
                      options={companiesList}
                      getOptionLabel={(option) => option.companyName}
                      onChange={(e, newValue) => {
                        setCandidate({
                          ...candidate,
                          companyId: newValue._id,
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
                    />
                  </Grid>
                  <Grid item xs={4}>
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
                  <Grid item xs={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                      <DatePicker
                        label="Interview Date"
                        className="candidateCompanyEndDate"
                        sx={{ width: "100%" }}
                        fullWidth
                        value={candidate.interviewDate}
                        onChange={(e) => {
                          setCandidate({
                            ...candidate,
                            interviewDate: e,
                          });
                        }}
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
                        })
                      }
                      fullWidth
                    >
                      {interviewStatus.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </>
              )}
              {["TAC", "GOOD"].includes(candidate.l2Assessment) &&
                candidate.interviewStatus === "Select" && (
                  <>
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
                      ></TextField>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        id="candidateSelect"
                        select
                        label="Tenure Status"
                        value={candidate.select}
                        onChange={(e) =>
                          setCandidate({
                            ...candidate,
                            select: e.target.value,
                          })
                        }
                        fullWidth
                      >
                        {select.map((option) => (
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
                candidate.select === "Tracking" && (
                  <>
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
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        fullWidth
                      >
                        <DatePicker
                          label="Onboarding Date"
                          className="candidateonboardingDate"
                          sx={{ width: "100%" }}
                          fullWidth
                          onChange={(e) => {
                            setCandidate({
                              ...candidate,
                              onboardingDate: e.target.value,
                            });
                          }}
                          value={candidate.onboardingDate}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4}>
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        onChange={(e) => {
                          setCandidate({
                            ...candidate,
                            nextTrackingDate: e,
                          });
                        }}
                        value={candidate.nextTrackingDate}
                        fullWidth
                      >
                        <DatePicker
                          label="Next Tracking Date"
                          className="candidateNXD"
                          sx={{ width: "100%" }}
                          fullWidth
                          onChange={(e) => {
                            setCandidate({
                              ...candidate,
                              nextTrackingDate: e.target.value,
                            });
                          }}
                          value={candidate.nextTrackingDate}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </>
                )}
              <Grid item xs={7.5} md={9} />
              <Grid item xs={4.5} md={3}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  sx={{ backgroundColor: alpha("#0000FF", 0.5) }}
                  onClick={handleAddCandidate}
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
