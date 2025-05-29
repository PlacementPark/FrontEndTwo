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
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

      const res = await axios.post(
        "https://tpp-backend-eura.onrender.com/api/v1/company",
        { ...company },
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      );
      toast.success("Company Added Successfully");
      navigate(`/EditEmpanelled/${res.data._id}?edit=true`);
    } catch (error) {}
  };
  const checkNumber = async (num) => {
    try {
      const res = await axios.get(
        "https://tpp-backend-eura.onrender.com/api/v1/company/mobile/" + num,

        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      );
      if (res.data.status === true) toast.error("Number already exists");
    } catch (error) {}
  };

  //JSX CODE
  return (
    <Container maxWidth={false} sx={{ paddingTop: "9.5vh", width: { sm: "90%", md: "70%" }, paddingBottom: "2vh" }}>
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
                  setCompany({ ...company, companyName: e.target.value })
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
                  setCompany({ ...company, companyType: e.target.value })
                }
              >
                {["Product", "Service", "Product & Service"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
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
                      onChange={(e) => {
                        var HRs = [...company.HR];
                        HRs[j].HRName = e.target.value;
                        setCompany({ ...company, HR: HRs });
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="HREmail"
                      label="HR Email ID"
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
                          className="HRMobile"
                          type="number"
                          label="HR Mobile Number"
                          variant="outlined"
                          value={x}
                          onChange={(e) => {
                            if (!/^\d*$/.test(e.target.value))
                              toast.warning("Only Number allowed in Mobile");
                            handleMobileChange(e, j, i);
                          }}
                          onBlur={(e) => {
                            if (!/^\d{10}$/.test(e.target.value)) {
                              if (e.target.value.length === 0) return;
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
                        size="large"
                        style={{ height: "100%" }}
                        endIcon={<ControlPointIcon />}
                        onClick={() => {
                          const newHR = [
                            ...company.HR,
                            { HRName: "", HRMobile: [""], HREmail: "" },
                          ];
                          setCompany({ ...company, HR: newHR });
                        }}
                      >
                        Add HR
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
                        Remove HR
                      </Button>
                    </Grid>
                  )}
                </>
              );
            })}
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
              <TextField
                id="empanelled"
                select
                label="Empanelled Status"
                fullWidth
                value={company.empanelled}
                onChange={(e) =>
                  setCompany({ ...company, empanelled: e.target.value })
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
