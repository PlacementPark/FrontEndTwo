import React from "react";
import {
  Container,
  TextField,
  Card,
  CardHeader,
  CardContent,
  BottomNavigation,
  Chip,
  Autocomplete,
  Button,
  Grid,
  Alert,
  alpha,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import ExcelExport from "../Main/ExcelExport";
import { flatten } from "flat";
import { toast } from "react-toastify";

export default function PotentialLeads() {
  // STATES HANDLING AND VARIABLES
  const [companiesList, setCompaniesList] = React.useState([]);
  const [rolesList, setRolesList] = React.useState([]);
  const gridapi = React.useRef();
  const [count, setCount] = React.useState(0);
  const [fileName, setFileName] = React.useState(String(new Date()));
  const [potentialLeadList, setPotentialLeadList] = React.useState([]);
  const [employeeList, setEmployeeList] = React.useState([]);
  const [assignees, setAssignees] = React.useState([]);
  const [warning, setWarning] = React.useState("");
  const Empanelled = [
    "Hide All Rejects",
    "Hide Offer Drops",
    "Hide L1 non Leads",
    "Hide L2 non Leads",
    "Hide DND",
    "Hide Interview In process",
    "Hide Awaiting Joining & Tenure Tracking",
    "Hide Non tenure & Rampdown",
  ].map((x, i) => {
    return { label: x, value: i + 1 };
  });
  const [searchParams, setSearchParams] = React.useState({
    company: "",
    role: "",
    query: [],
  });
  const [displayParams, setDisplayParams] = React.useState({
    company: "",
    role: "",
    query: [],
  });

  // GRID HEADER/COLOUMS HANDLING
  const selection = React.useMemo(() => {
    return {
      mode: "multiRow",
      groupSelects: "descendants",
    };
  }, []);
  const paginationPageSizeSelector = React.useMemo(() => {
    return [200, 500, 1000];
  }, []);

  const column = [
    {
      headerName: "Created By",
      field: "createdByEmployee.name",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
    },
    { headerName: "Assigned to", field: "assignedEmployee.name" },
    { headerName: "Name", field: "fullName" },
    { headerName: "ID", field: "candidateId" },
    { headerName: "Skills", field: "skills", sortable: false },
    { headerName: "Current Location", field: "currentCity" },
    { headerName: "Home town", field: "homeTown" },
    { headerName: "_id", field: "_id", hide: true, supressToolPanel: true },
  ];

  const defaultColDef = {
    sortable: true,
    editable: false,
    cellEditor: false,
    filter: true,
    rowSelection: "multiple",
  };

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
        const empres = await axios.get(
          "https://tpp-backend-eura.onrender.com/api/v1/employee",
          {
            headers: {
              authorization: JSON.parse(localStorage.getItem("user")).token,
            },
          }
        );

        setCompaniesList(res.data);
        setEmployeeList(empres.data.employees);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // FUNCTIONS HANDLING, SEARCH AND POST API CALLS
  const handleGetLeads = async () => {
    if (searchParams.company === "") {
      toast.error("Please Select Company");
      return;
    }
    if (searchParams.role === "") {
      toast.error("Please Select Role");
      return;
    }
    var query = [];
    searchParams.query.forEach(({ label, value }) => {
      switch (value) {
        case 1:
          query.push({
            companyId: searchParams.company,
            roleId: searchParams.role,
            interviewStatus: {
              $in: [
                "Reject FSR Communication",
                "Reject FSR Stability",
                "Reject FSR Domain",
                "Reject Amcat",
                "Reject Amcat - Technical Issue Reject Amcat Cooling Period",
                "Reject Versant",
                "Reject Versant - Technical Issue",
                "Reject Versant Cooling Period",
                "Reject Technical",
                "Reject Typing",
                "Reject Group Discussion",
                "Reject Ops/Client Communication",
                "Reject Ops/Client Stability",
                "Reject Ops/Client Domain",
                "Reject Training",
              ],
            },
          });
          break;
        case 2:
          query.push({
            companyId: searchParams.company,
            roleId: searchParams.role,
            interviewStatus: {
              $in: ["Offer Drop"],
            },
          });
          break;
        case 3:
          query.push({
            l1Assessment: {
              $in: [
                "NE-Fresher",
                "NI-In-Job",
                "NI-Experienced",
                "NI-Convincing",
              ],
            },
          });
          break;
        case 4:
          query.push({
            l2Assessment: {
              $in: [
                "NE-Fresher",
                "NI-In-Job",
                "NI-Experienced",
                "NI-Convincing",
              ],
            },
          });
          break;
        case 5:
          query.push({
            $or: [
              {
                l2Assessment: {
                  $in: ["DND"],
                },
              },
              {
                l1Assessment: {
                  $in: ["DND"],
                },
              },
            ],
          });
          break;
        case 6:
          query.push({
            interviewStatus: {
              $in: [
                "TPP Venue",
                "Client Venue",
                "Virtual Interview",
                "Pending FSR",
                "Pending Amcat",
                "Pending Versant",
                "Pending Technical",
                "Pending Typing",
                "Pending Group Discussion",
                "Pending Ops/Client",
                "Pending Training",
              ],
            },
          });
          break;
        case 7:
          query.push({
            $or: [
              {
                interviewStatus: {
                  $in: ["Select"],
                },
              },
              {
                select: {
                  $in: ["Tracking"],
                },
              },
            ],
          });
          break;
        case 8:
          query.push({
            select: {
              $in: ["Non Tenure", "Process Rampdown", "Client Rampdown"],
            },
          });
          break;
        default:
          break;
      }
    });

    try {
      const res = await axios.post(
        "https://tpp-backend-eura.onrender.com/api/v1/candidate/candidate/potentialleads",
        {
          query: query,
          roleId: searchParams.role,
          companyId: searchParams.company,
        },
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      );
      setTimeout(() => {
        setPotentialLeadList(res.data);
      });
    } catch (error) {}
  };
  const handleAssign = async () => {
    var selectedRows = gridapi.current.api.getSelectedRows();
    var emp = assignees;
    var srCount = selectedRows.length;
    var empCount = assignees.length;
    if (srCount === 0) {
      setWarning("Select Rows to continue");
      return;
    } else if (empCount === 0) {
      setWarning("Select Empoloyees to Assign");
      return;
    }
    var ind = 0;
    var i = 0;
    var count = parseInt(srCount / empCount);
    var assignedData = [];
    while (srCount / count > 0) {
      const part = selectedRows.slice(ind, count + ind);
      if (i === empCount)
        assignedData[i - 1].part = assignedData[i - 1].part.concat(part);
      else assignedData.push({ emp: emp[i], part: part.map((o) => o._id) });
      i += 1;
      srCount -= count;
      ind += count;
    }
    try {
      await axios.post(
        "https://tpp-backend-eura.onrender.com/api/v1/candidate/candidate/assign",
        {
          list: assignedData,
          companyId: searchParams.company,
          roleId: searchParams.role,
        },
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      );
      setTimeout(
        () =>
          setPotentialLeadList(
            potentialLeadList.filter((lead) => {
              return !selectedRows.map((row) => row._id).includes(lead._id);
            })
          ),
        setWarning("")
      );
    } catch (error) {}
  };

  //JSX CODE
  return (
    <>
      <Container
        maxWidth={false}
        sx={{ paddingTop: "9vh", width: "96%" }}
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
            title="POTENTAIL LEADS"
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
                <Autocomplete
                  freeSolo
                  id="Companies"
                  disableClearable
                  options={companiesList}
                  getOptionLabel={(option) => option.companyName}
                  onChange={(e, newValue) => {
                    setSearchParams({ ...searchParams, company: newValue._id });
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
              <Grid item xs={12} md={6}>
                <Autocomplete
                  freeSolo
                  id="Roles"
                  disableClearable
                  options={rolesList}
                  getOptionLabel={(option) => option.role}
                  
                  onChange={(e, newValue) => {
                    setSearchParams({ ...searchParams, role: newValue._id });
                    
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
              <Grid item xs={12}>
                <Autocomplete
                  id="c"
                  multiple
                  options={Empanelled}
                  getOptionLabel={(option) => option.label}
                  value={searchParams.query}
                  onChange={(e, newValue) => {
                    setSearchParams({
                      ...searchParams,
                      query: newValue,
                    });
                  }}
                  filterSelectedOptions
                  renderOption={(props, item) => (
                    <li {...props} key={item.key}>
                      {item.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Hide options"
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={8} />
              <Grid item xs={4}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  sx={{
                    backgroundColor: alpha("#0000FF", 0.5),
                    height: "100%",
                  }}
                  onClick={handleGetLeads}
                >
                  Submit
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
            title="CANDIDATES DATA"
            titleTypographyProps={{
              sx: {
                fontSize: "2.8vh",
                letterSpacing: "5px",
              },
            }}
          />
          <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.7) }}>
            <Grid
              container
              columnSpacing={1}
              rowSpacing={2}
              sx={{ paddingBottom: "2vh" }}
            >
              <Grid item xs={8}>
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
                  onChange={(e, newValue) =>
                    setAssignees(newValue.map((option) => option._id))
                  }
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          variant="outlined"
                          label={option.name}
                          key={key}
                          {...tagProps}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select Recruiter to Assign" />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  sx={{
                    backgroundColor: alpha("#0000FF", 0.5),
                    height: "100%",
                  }}
                  onClick={handleAssign}
                >
                  ASSIGN
                </Button>
              </Grid>
              <Grid item xs={8} sm={2} md={1.5}>
                <TextField
                  type="number"
                  label="No.of Rows"
                  value={count}
                  fullWidth
                  onChange={(e) => setCount(e.target.value)}
                />
              </Grid>
              <Grid item xs={4} sm={3} md={2}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  sx={{
                    backgroundColor: alpha("#0000FF", 0.5),
                    height: "100%",
                  }}
                  onClick={() => {
                    if (potentialLeadList.length === 0) {
                      setWarning("No Rows to select");
                      return;
                    }
                    for (var i = 0; i < count; i++) {
                      var node = gridapi.current.api.getRowNode(i);
                      node.setSelected(true);
                    }
                  }}
                >
                  Select
                </Button>
              </Grid>
              <Grid item md={2} display={{ xs: "none", md: "block" }} />
              <Grid item xs={7.5} sm={4.5}>
                <TextField
                  label="File Name"
                  value={fileName}
                  fullWidth
                  onChange={(e) => setFileName(e.target.value)}
                />
              </Grid>
              <Grid item xs={4.5} sm={2.5} md={2}>
                <ExcelExport
                  excelData={potentialLeadList.map((l) => flatten(l))}
                  fileName={fileName}
                />
              </Grid>
              <Grid item xs={12}>
                {warning && (
                  <Alert
                    severity="error"
                    onClose={() => {
                      setWarning("");
                    }}
                  >
                    {warning}
                  </Alert>
                )}
              </Grid>
            </Grid>
            <div
              className="ag-theme-quartz-dark"
              style={{
                height: "100%",
                width: "100%",
                position: "inherit",
              }}
            >
              <AgGridReact
                ref={gridapi}
                domLayout="autoHeight"
                rowData={potentialLeadList}
                columnDefs={column}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={100}
                selection={selection}
                paginationPageSizeSelector={paginationPageSizeSelector}
                rowSelection={"multiple"}
                isRowSelectable={() => true}
              />
            </div>
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
