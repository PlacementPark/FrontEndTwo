import React, { useState, useMemo, useRef, useEffect } from "react";
import {
   Button,
   Grid,
   DialogActions,
   DialogContent,
   DialogTitle,
   Dialog,
   Typography,
   IconButton,
   TextField,
   createTheme,
   ThemeProvider,
   useMediaQuery,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import CloseIcon from "@mui/icons-material/Close";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import BorderColorTwoToneIcon from "@mui/icons-material/BorderColorTwoTone";
import DeleteSweepTwoToneIcon from "@mui/icons-material/DeleteSweepTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";

import AxiosInstance from "../Main/AxiosInstance";

export default function CompanyGrid() {
   const [open, setOpen] = useState(false);
   const { employeeType } = useSelector((state) => state.user);
   const [tableData, setTableData] = useState([]);
   const access = !["Recruiter", "Teamlead", "Intern"].includes(employeeType);
   const [deleteData, setDeleteData] = useState({});
   const [searchParams] = useSearchParams();
   const gridapi = useRef();
   const [fileName, setFileName] = useState(String(new Date()));
   const [count, setCount] = useState(0);
   const [loadingToastId, setLoadingToastId] = useState(null);

   const navigate = useNavigate();
   const theme = createTheme();
   const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

   // Build URL
   const type = searchParams.get("companyType") || "";
   const paramsObj = {};
   if (searchParams.has("companyType")) {
      paramsObj.companyType = searchParams.get("companyType");
   }
   const urlParams = new URLSearchParams(paramsObj).toString();
   const baseUrl = `/company/companyType${urlParams ? "?" + urlParams : ""}`;

   // Fetch data
   useEffect(() => {
      let isMounted = true;
      const fetchAllPages = async () => {
         const startTime = performance.now();
         const toastId = toast.loading("Loading company data...");
         setLoadingToastId(toastId);

         try {
            const firstRes = await AxiosInstance.get(baseUrl, {
               params: { page: 1, limit: 100 },
            });

            if (isMounted) setTableData(firstRes.data.companies);

            const total = firstRes.data.total;
            const pageSize = 100;
            const totalPages = Math.ceil(total / pageSize);

            let allCompanies = [...firstRes.data.companies];
            for (let page = 2; page <= totalPages; page++) {
               const res = await AxiosInstance.get(baseUrl, {
                  params: { page, limit: pageSize },
               });
               allCompanies = allCompanies.concat(res.data.companies);
            }

            if (isMounted) setTableData(allCompanies);

            const seconds = ((performance.now() - startTime) / 1000).toFixed(2);
            toast.update(toastId, {
               render: `Loaded ${allCompanies.length} companies in ${seconds} seconds.`,
               type: "success",
               isLoading: false,
               autoClose: 4000,
            });
         } catch (error) {
            toast.update(toastId, {
               render: "Failed to fetch company data",
               type: "error",
               isLoading: false,
               autoClose: 4000,
            });
         }
      };
      fetchAllPages();

      return () => {
         isMounted = false;
         if (loadingToastId) toast.dismiss(loadingToastId);
      };
   }, [baseUrl]);

   // Button theme
   const { palette } = createTheme();
   const { augmentColor } = palette;
   const createColor = (mainColor) =>
      augmentColor({ color: { main: mainColor } });
   const buttonTheme = createTheme({
      palette: {
         white: createColor("#FFFFF0"),
      },
   });

   // Column definitions
   const column = [
      {
         headerName: "Actions",
         width: 200,
         cellRenderer: (props) => {
            if (!props.data) return null;
            return (
               <Grid container columnSpacing={1}>
                  <Grid item xs={access ? 4 : 12}>
                     <IconButton
                        color="primary"
                        size="small"
                        href={`/EditEmpanelled/${props.data._id}?edit=false`}
                     >
                        <VisibilityTwoToneIcon />
                     </IconButton>
                  </Grid>
                  {access && (
                     <>
                        <Grid item xs={4}>
                           <IconButton
                              size="small"
                              color="warning"
                              href={`/EditEmpanelled/${props.data._id}?edit=true`}
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
                                    name: props.data.companyName,
                                    id: props.data.companyId,
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
               </Grid>
            );
         },
      },
      {
         headerName: "Company Name",
         field: "companyName",
         headerCheckboxSelection: true,
         checkboxSelection: true,
         headerCheckboxSelectionFilteredOnly: true,
      },
      {
         headerName: "HR Name",
         field: "HR.HRName",
         hide: !access,
         valueGetter: (params) =>
            params.data?.HR?.map((hr) => hr.HRName).join(", "),
      },
      {
         headerName: "HR Mobile",
         field: "HR.HRMobile",
         hide: !access,
         valueGetter: (params) =>
            params.data?.HR?.map((hr) => hr.HRMobile).join(", "),
         filter: true,
      },
      {
         headerName: "HR Email",
         field: "HR.HREmail",
         hide: !access,
         valueGetter: (params) =>
            params.data?.HR?.map((hr) => hr.HREmail).join(", "),
      },
      { headerName: "Remarks", field: "remarks", hide: !access },
      {
         headerName: "Status",
         width: 100,
         cellRenderer: (props) =>
            props.data ? (
               props.data.empanelled ? (
                  <IconButton color="success">
                     <CheckCircleTwoToneIcon />
                  </IconButton>
               ) : (
                  <IconButton color="error">
                     <CancelTwoToneIcon />
                  </IconButton>
               )
            ) : null,
      },
      ...[
         "In Process",
         "Rejected",
         "Awaiting Joining",
         "Offer Drop",
         "Joined",
      ].map((label) => ({
         headerName: label,
         width: 120,
         cellRenderer: (props) => {
            if (!props.data) return null;
            const key = label
               .toLowerCase()
               .replace(" ", "")
               .replace("awaitingjoining", "awaiting")
               .replace("offerdrop", "offerDrop");
            return (
               <ThemeProvider theme={buttonTheme}>
                  <Grid item xs={12}>
                     <Button
                        color="white"
                        size="large"
                        onClick={() =>
                           navigate(
                              `/CandidateGrid?type=${label.replace(" ", "")}&&companyId=${
                                 props.data._id
                              }`,
                           )
                        }
                     >
                        {props.data[key] || 0}
                     </Button>
                  </Grid>
               </ThemeProvider>
            );
         },
      })),
   ];

   const defaultColDef = {
      sortable: true,
      editable: false,
      filter: true,
      rowSelection: "multiple",
   };

   const selection = useMemo(
      () => ({
         mode: "multiRow",
         groupSelects: "descendants",
      }),
      [],
   );
   const paginationPageSizeSelector = useMemo(() => [200, 500, 1000], []);

   // Handlers
   const handleClickOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);

   const handleDelete = async (id) => {
      try {
         await AxiosInstance.delete("/company/" + id);
         gridapi.current?.api?.refreshInfiniteCache();
         handleClose();
         toast.success("Company deleted successfully");
      } catch (error) {
         toast.error("Failed to delete company");
      }
   };

   const handleExcelExport = async () => {
      const selectedIds = gridapi.current.api
         .getSelectedRows()
         .map((row) => row._id);
      if (selectedIds.length === 0) {
         toast.error("No Rows selected");
         return;
      }
      const toastId = toast.loading("Exporting Excel...");
      try {
         const response = await AxiosInstance.post(
            "/company/excelExport",
            { ids: selectedIds, name: fileName },
            { responseType: "blob" },
         );
         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", `${fileName || "companies"}.xlsx`);
         document.body.appendChild(link);
         link.click();
         link.remove();
         toast.update(toastId, {
            render: "Excel exported successfully!",
            type: "success",
            isLoading: false,
            autoClose: 4000,
         });
      } catch (error) {
         toast.update(toastId, {
            render: "Failed to export Excel",
            type: "error",
            isLoading: false,
            autoClose: 4000,
         });
      }
   };

   return (
      <div style={{ height: "100vh", width: "100vw" }}>
         {/* Toolbar */}
         <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{
               pt: "9vh",
               px: isSmall ? 1 : 3,
               width: "100vw",
               flexWrap: "wrap",
            }}
         >
            <Grid item xs={6} sm={2} md={1}>
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
            <Grid item xs={6} sm={2}>
               <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  className="gridButton"
                  onClick={() => {
                     if (tableData.length === 0) {
                        toast.error("No Rows to select");
                        return;
                     }
                     for (
                        let i = 0;
                        i < Math.min(count, tableData.length);
                        i++
                     ) {
                        const node = gridapi?.current?.api?.getRowNode(i);
                        if (node) node.setSelected(true);
                     }
                  }}
               >
                  Select
               </Button>
            </Grid>
            <Grid item xs={12} sm={2} md={4} />
            <Grid item xs={12} sm={3}>
               <TextField
                  size="small"
                  label="File Name"
                  value={fileName}
                  fullWidth
                  className="tw"
                  onChange={(e) => setFileName(e.target.value)}
               />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
               <Button
                  fullWidth
                  variant="contained"
                  color="inherit"
                  className="gridButton"
                  onClick={handleExcelExport}
               >
                  Export Excel
               </Button>
            </Grid>
         </Grid>

         {/* Grid */}
         <div
            className="ag-theme-quartz-dark custom-grid"
            style={{
               marginTop: "1vh",
               marginLeft: isSmall ? "1%" : "0.2%",
               height: "84vh",
               width: isSmall ? "98%" : "99.6%",
            }}
         >
            <AgGridReact
               ref={gridapi}
               columnDefs={column}
               defaultColDef={defaultColDef}
               rowData={tableData}
               pagination
               cacheBlockSize={100}
               paginationPageSize={100}
               selection={selection}
               paginationPageSizeSelector={paginationPageSizeSelector}
               rowSelection={"multiple"}
               maxConcurrentDatasourceRequests={1}
               infiniteInitialRowCount={100}
            />
         </div>

         {/* Delete Dialog */}
         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
               backgroundColor: "transparent",
               "& .MuiDialog-paper": {
                  backgroundColor: "transparent",
                  backdropFilter: "blur(2px)",
                  boxShadow: "none",
                  color: "white",
               },
            }}
         >
            <DialogTitle
               sx={{
                  m: 0,
                  p: 2,
                  textTransform: "uppercase",
                  letterSpacing: 6,
               }}
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
                  Company ID :
               </Typography>
               <Typography sx={{ display: "inline" }}>
                  {" "}
                  {deleteData.companyId}
               </Typography>
               <Typography></Typography>
               <Typography sx={{ fontWeight: "bold", display: "inline" }}>
                  Company Name :
               </Typography>
               <Typography sx={{ display: "inline" }}>
                  {" "}
                  {deleteData.name}
               </Typography>
            </DialogContent>
            <DialogActions>
               <Button
                  variant="contained"
                  size="large"
                  color="error"
                  //sx={{ backgroundColor: alpha("#FF0000", 0.4) }}
                  onClick={() => handleDelete(deleteData._id)}
               >
                  Delete
               </Button>
               <Button
                  variant="contained"
                  size="large"
                  //sx={{ backgroundColor: alpha("#0000FF", 0.5) }}
                  onClick={handleClose}
               >
                  Cancel
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
