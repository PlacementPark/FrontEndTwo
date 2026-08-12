import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Autocomplete,
  Grid,
  Chip,
  BottomNavigation,
  Container,
  TextField,
  MenuItem,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  alpha,
} from "@mui/material";
import { toast } from "react-toastify";

import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import AxiosInstance from "../Main/AxiosInstance";

export default function EditRole() {
  // STATES HANDLING AND VARIABLES
  const navigate = useNavigate();
  const { companyId, id } = useParams();
  const [skillsList, setSkillsList] = React.useState([]);
  const [locationList, setLocationList] = React.useState([]);
  const [searchParams] = useSearchParams();
  const editable = searchParams.get("edit") === "true";
  const [qualificationList, setQualificationList] = React.useState([]);
  const [company, setCompany] = React.useState({
    companyName: "",
    HRName: "",
    HRMobile: [""],
    HREmail: "",
    about: "",
    remarks: "",
    response: "Empanelled",
    empanelled: true,
  });
  const [role, setRole] = React.useState({
    status: true,
    role: "",
    designation: "",
    processType: "Domestic",
    happens: "",
    experience: "",
    mandatorySkills: [],
    optionalSkills: [[]],
    qualification: [],
    shift: "",
    salary: "",
    cabFacility: true,
    processWorkType: "",
    location: [],
    area: "",
    bond: 0,
    ageCriteria: "",
    period: "Permanent",
    otherDocs: "",
    originalJD: "",
    faqs: "",
    rejectionReasons: [],
    billingTerm: 0,
    endTrackingDate: 0,
    industry: "",
    aboutCompany: "",
  });

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
    
  ];

  // FUNCTIONS HANDLING AND SEARCH API CALLS
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AxiosInstance.get("/company/company/" + companyId);
        const roleres = await AxiosInstance.get(
          "/company/" + companyId + "/role/" + id,
        );
        const extraRes = await AxiosInstance.get("/extra/all");
        setCompany(res.data.data);
        setRole({
          ...roleres.data.data[0],
          optionalSkills: normalizeOptionalSkills(
            roleres.data.data[0]?.optionalSkills,
          ),
        });

        extraRes.data.forEach(({ _id, data }) => {
          if (_id === "Skills") setSkillsList(data);
          else if (_id === "Locations") setLocationList(data);
          else if (_id === "Qualifications") setQualificationList(data);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const normalizeOptionalSkills = (value) => {
    if (Array.isArray(value)) {
      if (value.every((item) => Array.isArray(item))) {
        return value.map((group) => (Array.isArray(group) ? group : []));
      }
      return [value.filter((item) => typeof item === "string")];
    }
    return [[]];
  };

  const handleAddOptionalSkillsGroup = () => {
    setRole({ ...role, optionalSkills: [...role.optionalSkills, []] });
  };

  const handleRemoveOptionalSkillsGroup = (groupIndex) => {
    const updatedGroups = role.optionalSkills.filter(
      (_, index) => index !== groupIndex,
    );
    setRole({
      ...role,
      optionalSkills: updatedGroups.length > 0 ? updatedGroups : [[]],
    });
  };

  const handleOptionalSkillsGroupChange = (groupIndex, value) => {
    const updatedGroups = [...role.optionalSkills];
    updatedGroups[groupIndex] = value;
    setRole({ ...role, optionalSkills: updatedGroups });
  };

  const handleEditRole = async () => {
    try {
      await AxiosInstance.patch("/company/" + companyId + "/role/" + id, {
        ...role,
      });

      await AxiosInstance.patch("/extra/skills", {
        data: [
          ...new Set([
            ...role.mandatorySkills,
            ...role.optionalSkills.flatMap((group) => group || []),
            ...skillsList,
          ]),
        ],
      });
      toast.success("Role Edited Successfully");
      navigate(`/EditEmpanelled/${companyId}?edit=true`);
    } catch (error) {
      console.log(error);
    }
  };

  //JSX CODE
  return (
    <>
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
            title={editable ? "EDIT ROLE INFORMATION" : "VIEW ROLE INFORMATION"}
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
              {/* <Grid item xs={6} md={4}>
                <TextField
                  id="roleStatus"
                  select
                  label="Status"
                  fullWidth
                  value={role.status}
                  InputProps={{
                    readOnly: !editable,
                  }}
                  onChange={(e) => setRole({ ...role, status: e.target.value })}
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
                  InputProps={{
                    readOnly: !editable,
                  }}
                  value={role.period}
                  onChange={(e) => setRole({ ...role, period: e.target.value })}
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
                  InputProps={{
                    readOnly: !editable,
                  }}
                  value={role.industry}
                  onChange={(e) =>
                    setRole({ ...role, industry: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="processWorkType"
                  select
                  label="Notice Period/ Buyout"
                  fullWidth
                  InputProps={{
                    readOnly: !editable,
                  }}
                  value={role.processWorkType}
                  onChange={(e) =>
                    setRole({
                      ...role,
                      processWorkType: e.target.value,
                    })
                  }
                >
                  {["Notice Period", "Buyout"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  id="roleRole"
                  label="Role Name"
                  variant="outlined"
                  value={role.role}
                  onChange={(e) => setRole({ ...role, role: e.target.value })}
                  fullWidth
                  InputProps={{
                    readOnly: !editable,
                  }}
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
                  InputProps={{
                    readOnly: !editable,
                  }}
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
                  InputProps={{
                    readOnly: !editable,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="roleBond"
                  label="Bond"
                  variant="outlined"
                  value={role.bond}
                  onChange={(e) => setRole({ ...role, bond: e.target.value })}
                  fullWidth
                  InputProps={{
                    readOnly: !editable,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="roleProcessType"
                  select
                  label="Process Type"
                  fullWidth
                  InputProps={{
                    readOnly: !editable,
                  }}
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
                  InputProps={{
                    readOnly: !editable,
                  }}
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
                  id="roleHappens"
                  label="What Happens in the Role (Roles & Responsibilities)"
                  multiline
                  variant="outlined"
                  value={role.happens}
                  InputProps={{
                    readOnly: !editable,
                  }}
                  onChange={(e) =>
                    setRole({ ...role, happens: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="roleExperience"
                  label="Experience / Fresher"
                  multiline
                  variant="outlined"
                  value={role.experience}
                  onChange={(e) =>
                    setRole({ ...role, experience: e.target.value })
                  }
                  fullWidth
                  InputProps={{
                    readOnly: !editable,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="roleSalary"
                  label="Salary + Incentive + Bonus"
                  value={role.salary}
                  onChange={(e) => setRole({ ...role, salary: e.target.value })}
                  fullWidth
                  InputProps={{
                    readOnly: !editable,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  id="roleLocation"
                  options={locationList.map((location) => location)}
                  filterSelectedOptions
                  readOnly={!editable}
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
                  onChange={(e) => setRole({ ...role, area: e.target.value })}
                  fullWidth
                  InputProps={{
                    readOnly: !editable,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  id="rolequalifications"
                  options={qualificationList.map(
                    (qualification) => qualification,
                  )}
                  readOnly={!editable}
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
                    <TextField {...params} label="Qualification Requirement" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="roleOtherDocs"
                  label="Other and Documentation Requirement"
                  variant="outlined"
                  value={role.otherDocs}
                  InputProps={{
                    readOnly: !editable,
                  }}
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
                  InputProps={{
                    readOnly: !editable,
                  }}
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
                  InputProps={{
                    readOnly: !editable,
                  }}
                  value={role.originalJD}
                  onChange={(e) =>
                    setRole({ ...role, originalJD: e.target.value })
                  }
                  multiline
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="roleFAQs"
                  label="FAQs"
                  variant="outlined"
                  fullWidth
                  value={role.faqs}
                  InputProps={{
                    readOnly: !editable,
                  }}
                  onChange={(e) => setRole({ ...role, faqs: e.target.value })}
                  multiline
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="roleRejectionReasons"
                  label="Rejection Reasons"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    readOnly: !editable,
                  }}
                  value={role.rejectionReasons}
                  onChange={(e) =>
                    setRole({
                      ...role,
                      rejectionReasons: e.target.value,
                    })
                  }
                  multiline
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  id="roleSkills"
                  options={skillsList.map((skill) => skill)}
                  filterSelectedOptions
                  readOnly={!editable}
                  value={role.mandatorySkills}
                  onChange={(e, v) => setRole({ ...role, mandatorySkills: v })}
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
                <Grid container spacing={1}>
                  {role.optionalSkills.map((group, groupIndex) => (
                    <Grid
                      item
                      xs={12}
                      key={`optional-skill-group-${groupIndex}`}
                    >
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={9}>
                          <Autocomplete
                            multiple
                            freeSolo
                            id={`roleOptionalSkills-${groupIndex}`}
                            options={skillsList.map((skill) => skill)}
                            filterSelectedOptions
                            readOnly={!editable}
                            value={group}
                            onChange={(e, v) =>
                              handleOptionalSkillsGroupChange(groupIndex, v)
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
                        <Grid item xs={3}>
                          {/* <Button
                            variant="outlined"
                            size="small"
                            onClick={handleAddOptionalSkillsGroup}
                            disabled={!editable}
                          >
                            +
                          </Button> */}
                          <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                              backgroundColor: alpha("#0000FF", 0.5),
                              height: "100%",
                            }}
                            endIcon={<ControlPointIcon />}
                            onClick={handleAddOptionalSkillsGroup}
                            disabled={!editable}
                          >
                            Add
                          </Button>
                          {role.optionalSkills.length > 1 && (
                            // <Button
                            //   variant="outlined"
                            //   color="error"
                            //   size="small"
                            //   onClick={() =>
                            //     handleRemoveOptionalSkillsGroup(groupIndex)
                            //   }
                            //   disabled={!editable}
                            //   sx={{ ml: 1 }}
                            // >
                            //   -
                            // </Button>
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
                              onClick={() =>
                                handleRemoveOptionalSkillsGroup(groupIndex)
                              }
                              disabled={!editable}
                            >
                              Remove
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  type="number"
                  label="Billing Term"
                  id="billingTerm"
                  variant="outlined"
                  fullWidth
                  value={role.billingTerm}
                  inputProps={{
                    disabled: !editable,
                  }}
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
                  id="endTrackingDate"
                  label="End Tracking Date"
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    disabled: !editable,
                  }}
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
                  onChange={(e) => setRole({ ...role, shift: e.target.value })}
                  fullWidth
                  InputProps={{
                    readOnly: !editable,
                  }}
                />
              </Grid>
              <Grid item xs={9} />
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    height: "100%",
                    backgroundColor: alpha("#0000FF", 0.5),
                  }}
                  InputProps={{
                    readOnly: !editable,
                  }}
                  onClick={handleEditRole}
                >
                  SUBMIT
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: alpha("#28a745", 0.8),
                  }}
                  onClick={async () => {
                    try {
                      const response = await AxiosInstance.get(
                        `/company/${companyId}/role/${id}/download`,
                        {
                          responseType: "blob",
                        },
                      );
                      const url = window.URL.createObjectURL(
                        new Blob([response.data]),
                      );
                      const link = document.createElement("a");
                      link.href = url;
                      const contentType = response.headers["content-type"];
                      const fileName = response.headers["content-disposition"]
                        ? response.headers["content-disposition"].split(
                            "filename=",
                          )[1]
                        : `role_${id}.pdf`;
                      link.setAttribute("download", fileName);
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      window.URL.revokeObjectURL(url);
                      toast.success("Role downloaded successfully");
                    } catch (error) {
                      console.log(error);
                      toast.error("Failed to download role");
                    }
                  }}
                >
                  DOWNLOAD ROLE
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
