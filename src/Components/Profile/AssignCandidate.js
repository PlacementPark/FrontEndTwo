import React, { useState, useMemo } from "react";
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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../Main/AxiosInstance";

import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  L1_STATUS,
  L2_STATUS,
  SELECT_STATUS,
  INTERVIEW_STATUS,
  LANGUAGE_LEVEL,
  SOURCE,
} from "../Main/Constants";
export default function AssignCandidate() {
  // STATES HANDLING AND VARIABLES
  const navigate = useNavigate();
  const [companiesList, setCompaniesList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [qualificationList, setQualificationList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [languageList, setLanguageList] = useState([{ language: " " }]);
  const [candidate, setCandidate] = useState({
    fullName: [""],
    mobile: null,
    email: null,
    homeTown: [],
    currentCity: [],
    qualification: [],
    minYOP: null,
    maxYOP: null,
    language: [],
    all: [],
    any: [[]],
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
    source: [],
    tag: null,
    uploadedFileName: null,
  });

  // Input values for filtered select all
  const [allInputValue, setAllInputValue] = useState("");
  const [anyInputValues, setAnyInputValues] = useState([""]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // API CALLS HANDLING
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AxiosInstance.get(
          "/company/candidateCompanyType?companyType=Empanelled",
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
      return dayjsDate.startOf("day").format("YYYY-MM-DD");
    }
    return dayjsDate;
  };

  const getDateRangeForQuery = (value) => {
    if (!value) return null;

    let date;
    if (value?.$isDayjsObject) {
      date = value.toDate();
    } else if (typeof value?.format === "function") {
      date = value.toDate();
    } else if (value instanceof Date) {
      date = value;
    } else if (typeof value === "string") {
      date = new Date(value);
    }

    if (!date || Number.isNaN(date.getTime())) return null;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return { $gte: startOfDay, $lte: endOfDay };
  };

  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const formatPreviewValue = (value) => {
    if (value === null || value === undefined || value === "") return null;
    if (Array.isArray(value)) {
      const filtered = value.filter(
        (item) => item !== null && item !== undefined && item !== "",
      );
      if (filtered.some(Array.isArray)) {
        return filtered
          .map((group, index) => {
            const items = Array.isArray(group)
              ? group.filter(
                  (item) => item !== null && item !== undefined && item !== "",
                )
              : [];
            return items.length > 0
              ? `Set ${index + 1}: ${items.join(", ")}`
              : null;
          })
          .filter(Boolean)
          .join(" | ");
      }
      return filtered.length > 0 ? filtered.join(", ") : null;
    }
    if (typeof value?.format === "function") {
      return value.format("DD/MM/YYYY");
    }
    return String(value);
  };

  const getSelectedFilterSummary = () => {
    const summary = [];

    const pushField = (label, value) => {
      const formattedValue = formatPreviewValue(value);
      if (formattedValue) {
        summary.push({ label, value: formattedValue });
      }
    };

    pushField("Full Name", candidate.fullName);
    pushField("Mobile Number", candidate.mobile);
    pushField("Email ID", candidate.email);
    pushField("Home Town", candidate.homeTown);
    pushField("Current City", candidate.currentCity);
    pushField("Qualification", candidate.qualification);
    pushField("Language", candidate.language);
    pushField("All Skills", candidate.all);
    pushField("Any Skills", candidate.any);
    pushField("Previous Company", candidate.companyName);
    pushField("Previous Role", candidate.role);
    pushField("L1 Assessment", candidate.l1Assessment);
    pushField("L2 Assessment", candidate.l2Assessment);
    pushField("Remarks", candidate.remarks);
    pushField("Interview Status", candidate.interviewStatus);
    pushField("Select Status", candidate.select);
    pushField(
      "Created By",
      candidate.createdByEmployee.map((empId) => {
        const employee = employeeList.find((emp) => emp._id === empId);
        return employee ? employee.name : empId;
      }),
    );
    pushField(
      "Assigned To",
      candidate.assignedEmployee.map((empId) => {
        const employee = employeeList.find((emp) => emp._id === empId);
        return employee ? employee.name : empId;
      }),
    );
    pushField("Minimum YOP", candidate.minYOP);
    pushField("Maximum YOP", candidate.maxYOP);
    pushField("Minimum Interview Date", candidate.mininterviewDate);
    pushField("Maximum Interview Date", candidate.maxinterviewDate);
    pushField("Created On", candidate.createdOn);
    pushField("Last Updated On", candidate.lastUpdatedOn);
    pushField("Assigned On", candidate.assignedOn);
    pushField("L1 Set Date", candidate.l1StatDate);
    pushField("L2 Set Date", candidate.l2StatDate);
    pushField("Interview Set Date", candidate.interviewStatDate);
    pushField("Tenure Set Date", candidate.tenureStatDate);
    pushField("Select Date", candidate.selectDate);
    pushField("Offer Drop Date", candidate.offerDropDate);
    pushField("Non Tenure Date", candidate.nonTenureDate);
    pushField("Invoice Credit Date", candidate.invoiceCreditDate);
    pushField("End Tracking Date", candidate.endTrackingDate);
    pushField("Source", candidate.source);
    pushField("Tag", candidate.tag);
    pushField("Uploaded File Name", candidate.uploadedFileName);

    return summary.length > 0
      ? summary
      : [
          {
            label: "No filters selected",
            value: "The form is empty. You can still continue.",
          },
        ];
  };

  const handlePreviewSubmit = () => {
    setSelectedFilters(getSelectedFilterSummary());
    setPreviewOpen(true);
  };

  const handleAddAnyGroup = () => {
    setCandidate({ ...candidate, any: [...candidate.any, []] });
    setAnyInputValues([...anyInputValues, ""]);
  };

  const handleRemoveAnyGroup = (groupIndex) => {
    const updatedGroups = candidate.any.filter(
      (_, index) => index !== groupIndex,
    );
    setCandidate({
      ...candidate,
      any: updatedGroups.length > 0 ? updatedGroups : [[]],
    });

    const updatedInputValues = anyInputValues.filter(
      (_, index) => index !== groupIndex,
    );
    setAnyInputValues(
      updatedInputValues.length > 0 ? updatedInputValues : [""],
    );
  };

  const handleAnyGroupChange = (groupIndex, value) => {
    const updatedGroups = [...candidate.any];
    updatedGroups[groupIndex] = value;
    setCandidate({ ...candidate, any: updatedGroups });
  };

  const handleAssignCandidate = async () => {
    var query = [];
    if (candidate.fullName) {
      const fullNameTerms = candidate.fullName
        .filter((name) => typeof name === "string" && name.trim())
        .map((name) => name.trim());

      if (fullNameTerms.length > 0) {
        const fullNameQueries = fullNameTerms.map((term) => ({
          fullName: {
            $regex: ".*" + escapeRegex(term) + ".*",
            $options: "i",
          },
        }));

        query.push(
          fullNameQueries.length === 1
            ? fullNameQueries[0]
            : { $or: fullNameQueries },
        );
      }
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
    const anySkillGroups = (candidate.any || [])
      .map((group) =>
        Array.isArray(group)
          ? group.filter((item) => typeof item === "string" && item.trim())
          : [],
      )
      .filter((group) => group.length > 0);

    if (anySkillGroups.length > 0) {
      anySkillGroups.forEach((group) => {
        query.push({ skills: { $in: group } });
      });
    }
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
    if (candidate.mininterviewDate || candidate.maxinterviewDate) {
      const minRange = candidate.mininterviewDate
        ? getDateRangeForQuery(candidate.mininterviewDate)
        : null;
      const maxRange = candidate.maxinterviewDate
        ? getDateRangeForQuery(candidate.maxinterviewDate)
        : null;

      if (minRange && maxRange) {
        query.push({
          interviewDate: {
            $gte: minRange.$gte,
            $lte: maxRange.$lte,
          },
        });
      } else if (minRange) {
        query.push({ interviewDate: { $gte: minRange.$gte } });
      } else if (maxRange) {
        query.push({ interviewDate: { $lte: maxRange.$lte } });
      }
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

    // Date field queries - use inclusive day ranges so a single selected date only returns that day
    if (candidate.createdOn) {
      const range = getDateRangeForQuery(candidate.createdOn);
      if (range) query.push({ createdOn: range });
    }
    if (candidate.lastUpdatedOn) {
      const range = getDateRangeForQuery(candidate.lastUpdatedOn);
      if (range) query.push({ lastUpdatedOn: range });
    }
    if (candidate.assignedOn) {
      const range = getDateRangeForQuery(candidate.assignedOn);
      if (range) query.push({ assignedOn: range });
    }
    if (candidate.l1StatDate) {
      const range = getDateRangeForQuery(candidate.l1StatDate);
      if (range) query.push({ l1StatDate: range });
    }
    if (candidate.l2StatDate) {
      const range = getDateRangeForQuery(candidate.l2StatDate);
      if (range) query.push({ l2StatDate: range });
    }
    if (candidate.interviewStatDate) {
      const range = getDateRangeForQuery(candidate.interviewStatDate);
      if (range) query.push({ interviewStatDate: range });
    }
    if (candidate.tenureStatDate) {
      const range = getDateRangeForQuery(candidate.tenureStatDate);
      if (range) query.push({ tenureStatDate: range });
    }
    if (candidate.selectDate) {
      const range = getDateRangeForQuery(candidate.selectDate);
      if (range) query.push({ selectDate: range });
    }
    if (candidate.offerDropDate) {
      const range = getDateRangeForQuery(candidate.offerDropDate);
      if (range) query.push({ offerDropDate: range });
    }
    if (candidate.nonTenureDate) {
      const range = getDateRangeForQuery(candidate.nonTenureDate);
      if (range) query.push({ nonTenureDate: range });
    }
    if (candidate.invoiceCreditDate) {
      const range = getDateRangeForQuery(candidate.invoiceCreditDate);
      if (range) query.push({ invoiceCreditDate: range });
    }
    if (candidate.endTrackingDate) {
      const range = getDateRangeForQuery(candidate.endTrackingDate);
      if (range) query.push({ endTrackingDate: range });
    }

    // String field queries
    if (candidate.source.length > 0)
      query.push({
        source: {
          $in: candidate.source,
        },
      });
    if (candidate.tag)
      query.push({
        tag: {
          $regex: ".*" + candidate.tag + ".*",
          $options: "i",
        },
      });
    if (candidate.uploadedFileName)
      query.push({
        uploadedFileName: {
          $regex: ".*" + candidate.uploadedFileName + ".*",
        },
      });
    var finalq = {};
    if (query.length > 0)
      if (candidate.all.length > 0)
        finalq = { skills: { $all: [...candidate.all] }, $or: [...query] };
      else finalq = { $and: [...query] };
    else {
      if (candidate.all.length > 0)
        finalq = { skills: { $all: [...candidate.all] } };
    }

    setPreviewOpen(false);
    navigate("/AssignCandidateGrid", {
      replace: true,
      state: {
        query: { ...finalq },
      },
    });
  };

  // Filtered options and handlers for select all
  const allFilteredOptions = useMemo(() => {
    return skillsList.filter((option) =>
      option.toLowerCase().includes(allInputValue.toLowerCase()),
    );
  }, [allInputValue, skillsList]);

  const handleSelectAllFiltered = () => {
    const map = new Map();
    candidate.all.forEach((item) => map.set(item, item));
    allFilteredOptions.forEach((item) => map.set(item, item));
    setCandidate({ ...candidate, all: Array.from(map.values()) });
  };

  const anyFilteredOptions = useMemo(() => {
    return skillsList.filter((option) =>
      option
        .toLowerCase()
        .includes(
          anyInputValues[anyInputValues.length - 1]?.toLowerCase() || "",
        ),
    );
  }, [anyInputValues, skillsList]);

  const handleSelectAnyFiltered = () => {
    const targetIndex = Math.max(0, candidate.any.length - 1);
    const map = new Map();
    (candidate.any[targetIndex] || []).forEach((item) => map.set(item, item));
    anyFilteredOptions.forEach((item) => map.set(item, item));

    const updatedGroups = [...candidate.any];
    updatedGroups[targetIndex] = Array.from(map.values());
    setCandidate({ ...candidate, any: updatedGroups });
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
            {candidate.fullName.map((x, i) => (
              <>
                <Grid item xs={9}>
                  <TextField
                    id="outlined-basic"
                    label="Full Name"
                    variant="outlined"
                    value={x}
                    required
                    onChange={(e) => {
                      candidate.fullName[i] = e.target.value;
                      setCandidate({
                        ...candidate,
                        fullName: candidate.fullName,
                      });
                    }}
                    fullWidth
                  />
                </Grid>
                {i === 0 && (
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
                          fullName: [...candidate.fullName, ""],
                        })
                      }
                    >
                      Add
                    </Button>
                  </Grid>
                )}
                {i !== 0 && (
                  <Grid item xs={3}>
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
                            (_, indexFilter) => !(indexFilter === i),
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
                  <TextField {...params} label="Candidate Current City" />
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
                  <TextField {...params} label="Candidate Quaification" />
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
              <Stack spacing={2}>
                <Button variant="contained" onClick={handleSelectAllFiltered}>
                  Select All Filtered
                </Button>
                <Autocomplete
                  multiple
                  freeSolo
                  id="candidateSkills"
                  options={skillsList.map((skill) => skill)}
                  filterSelectedOptions
                  value={candidate.all}
                  inputValue={allInputValue}
                  onInputChange={(event, newInputValue) => {
                    setAllInputValue(newInputValue);
                  }}
                  onChange={(e, v) => setCandidate({ ...candidate, all: v })}
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
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <Button variant="contained" onClick={handleSelectAnyFiltered}>
                  Select ANY Filtered
                </Button>
                {candidate.any.map((group, groupIndex) => (
                  <Grid
                    container
                    spacing={1}
                    key={`any-skill-group-${groupIndex}`}
                  >
                    <Grid item xs={9}>
                      <Autocomplete
                        multiple
                        freeSolo
                        id={`candidateAnySkills-${groupIndex}`}
                        options={skillsList.map((skill) => skill)}
                        filterSelectedOptions
                        value={group}
                        sx={{
                          height: "100%",
                        }}
                        inputValue={anyInputValues[groupIndex] || ""}
                        onInputChange={(event, newInputValue) => {
                          const updatedInputs = [...anyInputValues];
                          updatedInputs[groupIndex] = newInputValue;
                          setAnyInputValues(updatedInputs);
                        }}
                        onChange={(e, v) => handleAnyGroupChange(groupIndex, v)}
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
                            label={
                              groupIndex === 0
                                ? "Any"
                                : `Any Set ${groupIndex + 1}`
                            }
                            sx={{
                              height: "100%",
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<ControlPointIcon />}
                        onClick={handleAddAnyGroup}
                      >
                        Add
                      </Button>
                      {candidate.any.length > 1 && (
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          size="large"
                          startIcon={<RemoveCircleOutlineIcon />}
                          onClick={() => handleRemoveAnyGroup(groupIndex)}
                        >
                          Remove
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Stack>
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
                    companyId: newValue?._id ? newValue._id : newValue,
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
                  <TextField {...params} label="Candidate Interview Status" />
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
                  <TextField {...params} label="Candidate Select Status" />
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
                    createdByEmployee: v?.map((a) => (a?._id ? a._id : a)),
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
                    assignedEmployee: v?.map((a) => (a?._id ? a._id : a)),
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
              <Autocomplete
                multiple
                id="candidateSource"
                options={SOURCE.map((s) => s)}
                filterSelectedOptions
                value={candidate.source || []}
                onChange={(e, v) =>
                  setCandidate({
                    ...candidate,
                    source: v,
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Source" />
                )}
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
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Uploaded File Name"
                value={candidate.uploadedFileName || ""}
                onChange={(e) => {
                  setCandidate({
                    ...candidate,
                    uploadedFileName: e.target.value,
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
                onClick={handlePreviewSubmit}
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

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Review Selected Filters</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please review the selected fields before continuing.
          </Typography>
          <List dense>
            {selectedFilters.map((item) => (
              <ListItem key={item.label} alignItems="flex-start">
                <ListItemText
                  primary={item.label}
                  secondary={item.value}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssignCandidate}>
            Confirm & Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
