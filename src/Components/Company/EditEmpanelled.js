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
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
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
    HR: [{ HRName: "", HRMobile: [""], HREmail: "" }],
    about: "",
    remarks: "",
    response: "Empanelled",
    empanelled: true,
    roles: [],
  });

  // API CALLS HANDLING
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://tpp-backend-eura.onrender.com/api/v1/company/company/" + id,
          {
            headers: {
              authorization: JSON.parse(localStorage.getItem("user")).token,
            },
          }
        );
        setCompany(res.data);
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
                    "/CandidateGrid?type=Rejects&&roleId=" + props.data._id
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
                    "/CandidateGrid?type=OfferDrop&&roleId=" + props.data._id
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
                    "/CandidateGrid?type=joined&&roleId=" + props.data._id
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
                    navigate(`/EditRole/${id}/${props.data._id}?edit=false`)
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
      await axios.patch(
        "https://tpp-backend-eura.onrender.com/api/v1/company/company/" + id,
        { ...company, roles: company.roles.map((r) => r._id) },
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      );
      toast.success("Company Edited Successfully");
      navigate(`/CompanyDashBoard`);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRoleDelete = () => {
    try {
      axios.delete(
        "https://tpp-backend-eura.onrender.com/api/v1/company/" +
          id +
          "/role/" +
          deleteData._id,
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
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
            title={editable ? "EDIT COMPANY DETAILS" : "VIEW COMPANY DETAILS"}
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
              {access && (
                <>
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
                            InputProps={{
                              readOnly: !editable,
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
                            InputProps={{
                              readOnly: !editable,
                            }}
                          />
                        </Grid>
                        {y.HRMobile.map((x, i) => (
                          <>
                            <Grid item xs={editable ? 9 : 12}>
                              <TextField
                                className="HRMobile"
                                type="number"
                                label="HR Mobile Number"
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
                                InputProps={{
                                  readOnly: !editable,
                                }}
                              />
                            </Grid>
                            {editable && i === 0 && (
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
                            {editable && i !== 0 && (
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
                        {editable && j === 0 && (
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
                        {editable && j !== 0 && (
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

                  <Grid item xs={6}>
                    <TextField
                      id="empanelled"
                      select
                      label="Empanelled Status"
                      fullWidth
                      value={company.empanelled}
                      onChange={(e) =>
                        setCompany({ ...company, empanelled: e.target.value })
                      }
                      InputProps={{
                        readOnly: !editable,
                      }}
                    >
                      {Empanelled.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="response"
                      select
                      label="Response"
                      fullWidth
                      value={company.response}
                      onChange={(e) =>
                        setCompany({ ...company, response: e.target.value })
                      }
                      InputProps={{
                        readOnly: !editable,
                      }}
                    >
                      {source.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
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
                        setCompany({ ...company, remarks: e.target.value })
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
                      onClick={() => navigate("/AddRole/" + company._id)}
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
                <ExcelExport height="100%" excelData={{}} fileName={fileName} />
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
                      : company.roles.filter((v) => v.status === true)
                  }
                  columnDefs={column}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={100}
                  selection={selection}
                  paginationPageSizeSelector={paginationPageSizeSelector}
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
          <Typography sx={{ display: "inline" }}> {deleteData.id}</Typography>
          <Typography></Typography>
          <Typography sx={{ fontWeight: "bold", display: "inline" }}>
            Candidate Name :
          </Typography>
          <Typography sx={{ display: "inline" }}> {deleteData.name}</Typography>
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
