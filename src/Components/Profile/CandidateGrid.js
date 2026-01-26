import React, { useState, useEffect } from "react";
import {
   Button,
   Grid,
   Dialog,
   DialogContent,
   DialogActions,
   Typography,
   DialogTitle,
   IconButton,
   TextField,
   alpha,
   useMediaQuery,
   useTheme,
   MenuItem,
   InputLabel,
   Select,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import BorderColorTwoToneIcon from "@mui/icons-material/BorderColorTwoTone";
import DeleteSweepTwoToneIcon from "@mui/icons-material/DeleteSweepTwoTone";
import EditAttributesTwoToneIcon from "@mui/icons-material/EditAttributesTwoTone";
import AxiosInstance from "../Main/AxiosInstance";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "../../App.css";
import { INTERVIEW_STATUS } from "../Main/Constants";
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

export default function CandidateGrid() {
   const [open, setOpen] = useState(false);
   const [deleteData, setDeleteData] = useState({});
   const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
   const [selectedIds, setSelectedIds] = useState([]);
   const { employeeType, userid } = useSelector((state) => state.user);
   const rtAccess = [
      "Recruiter",
      "Intern",
      "Teamlead",
      "Business Development",
   ].includes(employeeType);
   const empId = userid;
   const isAdmin = employeeType === "Admin";
   const [tableData, setTableData] = useState([]);
   const gridapi = React.useRef();
   const [fileName, setFileName] = useState(String(new Date()));
   const [count, setCount] = useState(0);
   const [searchParams] = useSearchParams();
   const theme = useTheme();
   const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
   const [editOpen, setEditOpen] = useState(false);
   const [editData, setEditData] = useState({});
   const [remarks, setRemarks] = useState("");
   const type = searchParams.get("type") || "";
   const paramsObj = {};
   if (searchParams.has("companyId"))
      paramsObj.companyId = searchParams.get("companyId");
   if (searchParams.has("roleId"))
      paramsObj.roleId = searchParams.get("roleId");
   const urlParams = new URLSearchParams(paramsObj).toString();
   const [loadingToastId, setLoadingToastId] = useState(null);
   const url = `/candidate/data/${type}${urlParams ? "?" + urlParams : ""}`;

   useEffect(() => {
      let isMounted = true;
      const fetchAllPages = async () => {
         const startTime = performance.now();
         const toastId = toast.loading("Loading candidate data...");
         setLoadingToastId(toastId);
         try {
            const firstRes = await AxiosInstance.get(url, {
               params: { page: 1, limit: 1000 },
            });
            if (isMounted) setTableData(firstRes.data.candidates);

            const total = firstRes.data.total;
            const pageSize = 1000;
            const totalPages = Math.ceil(total / pageSize);

            let allCandidates = [...firstRes.data.candidates];

            for (let page = 2; page <= totalPages; page++) {
               const res = await AxiosInstance.get(url, {
                  params: { page, limit: pageSize },
               });
               allCandidates = allCandidates.concat(res.data.candidates);
            }

            if (isMounted) setTableData(allCandidates);
            const seconds = ((performance.now() - startTime) / 1000).toFixed(2);
            toast.update(toastId, {
               render: `Loaded ${allCandidates.length} candidates in ${seconds} seconds.`,
               type: "success",
               isLoading: false,
               autoClose: 4000,
            });
         } catch (error) {
            toast.update(toastId, {
               render: "Failed to fetch candidate data",
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
   }, [url]);

   const handleQuickEditPopup = async (id) => {
      try {
         const candidateData = await AxiosInstance.get("/candidate/" + id);

         setEditData(candidateData.data);
         setEditOpen(true);
      } catch (error) {}
   };

   const handleBulkDelete = () => {
      const ids = gridapi.current.api.getSelectedRows().map((row) => row._id);
      if (ids.length === 0) {
         toast.error("No Rows selected");
         return;
      }
      setSelectedIds(ids);
      setBulkDeleteOpen(true);
   };

   const confirmBulkDelete = async () => {
      const toastId = toast.loading("Deleting candidates...");
      try {
         await AxiosInstance.post("/candidate/bulkDelete", {
            ids: selectedIds,
         });
         setTableData((prev) =>
            prev.filter((d) => !selectedIds.includes(d._id)),
         );
         toast.update(toastId, {
            render: `Successfully deleted ${selectedIds.length} candidate(s)`,
            type: "success",
            isLoading: false,
            autoClose: 4000,
         });
         setBulkDeleteOpen(false);
         setSelectedIds([]);
      } catch (error) {
         toast.update(toastId, {
            render: "Failed to delete candidates",
            type: "error",
            isLoading: false,
            autoClose: 4000,
         });
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
            "/candidate/excelExport",
            { ids: selectedIds, name: fileName },
            { responseType: "blob" },
         );
         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", `${fileName || "candidates"}.xlsx`);
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

   const column = [
      {
         headerName: "Actions",
         width: isAdmin ? 180 : 150,
         field: "assignedEmployee",
         pinned: "left",
         cellRenderer: (props) => {
            if (!props.data) return null;
            return (
               <Grid container columnSpacing={0}>
                  <Grid item xs={isAdmin ? 3 : 4}>
                     <IconButton
                        color="primary"
                        size="small"
                        href={`/EditCandidate/${props.data._id}?edit=false`}
                     >
                        <VisibilityTwoToneIcon />
                     </IconButton>
                  </Grid>
                  <Grid item xs={isAdmin ? 3 : 4}>
                     <IconButton
                        size="small"
                        color="warning"
                        href={`/EditCandidate/${props.data._id}?edit=true`}
                        disabled={
                           !rtAccess
                              ? false
                              : props.data.assignedEmployee === empId
                                ? true
                                : false
                        }
                     >
                        <BorderColorTwoToneIcon />
                     </IconButton>
                  </Grid>
                  <Grid item xs={isAdmin ? 3 : 4}>
                     <IconButton
                        color="success"
                        size="small"
                        onClick={() => handleQuickEditPopup(props.data._id)}
                     >
                        <EditAttributesTwoToneIcon />
                     </IconButton>
                  </Grid>
                  {isAdmin && (
                     <Grid item xs={3}>
                        <IconButton
                           size="small"
                           color="error"
                           onClick={() => {
                              setDeleteData({
                                 name: props.data.fullName,
                                 id: props.data.candidateId,
                                 _id: props.data._id,
                              });
                              setOpen(true);
                           }}
                        >
                           <DeleteSweepTwoToneIcon />
                        </IconButton>
                     </Grid>
                  )}
               </Grid>
            );
         },
      },
      // {
      //   headerName: "Contacts",
      //   width: 140,
      //   pinned: "right",
      //   cellRenderer: (props) => {
      //     return (
      //       <>
      //         <Grid container columnSpacing={1}>
      //           <Grid item xs={6}>
      //             <IconButton
      //               aria-label="delete"
      //               color="success"
      //               href={`https://wa.me/${props.data.mobile[0]}`}
      //               target="_blank"
      //             >
      //               <WhatsAppIcon />
      //             </IconButton>
      //           </Grid>
      //           <Grid item xs={6}>
      //             <IconButton aria-label="delete" color="warning">
      //               <CallIcon />
      //             </IconButton>
      //           </Grid>
      //         </Grid>
      //       </>
      //     );
      //   },
      // },
      {
         headerName: "Created By",
         field: "createdByEmployee.name",
         headerCheckboxSelection: true,
         checkboxSelection: true,
         headerCheckboxSelectionFilteredOnly: true,
         width: 200,
      },
      { headerName: "Assigned to", field: "assignedEmployee.name" },
      { headerName: "Candidate Name", field: "fullName", pinned: "left" },
      { headerName: "Candidate ID", field: "candidateId" },
      { headerName: "Candidate Number", field: "mobile", sortable: false },
      { headerName: "Candidate Email ID", field: "email" },
      { headerName: "L1 Assessment", field: "l1Assessment" },
      { headerName: "L2 Assessment", field: "l2Assessment" },
      { headerName: "Company", field: "companyId.companyName" },
      { headerName: "Role", field: "roleId.role" },
      {
         headerName: "Interview Date",
         field: "interviewDate",
         valueFormatter: (p) =>
            p.value ? dayjs(p.value).format("DD/MM/YYYY") : p.value,
      },
      { headerName: "Interview Status", field: "interviewStatus" },
      { headerName: "Remarks", field: "remarks" },
      { headerName: "Tenure Status", field: "select" },
      {
         headerName: "Onboarding Date",
         field: "onboardingDate",
         valueFormatter: (p) =>
            p.value ? dayjs(p.value).format("DD/MM/YYYY") : p.value,
      },
      {
         headerName: "Next Tracking Date",
         field: "nextTrackingDate",
         valueFormatter: (p) =>
            p.value ? dayjs(p.value).format("DD/MM/YYYY") : p.value,
      },
      { headerName: "Rate", field: "rate", hide: rtAccess },
      {
         headerName: "Billing Date",
         field: "billingDate",
         valueFormatter: (p) =>
            p.value ? dayjs(p.value).format("DD/MM/YYYY") : p.value,
      },
      {
         headerName: "Invoice Date",
         field: "invoiceDate",
         valueFormatter: (p) =>
            p.value ? dayjs(p.value).format("DD/MM/YYYY") : p.value,
      },
      {
         headerName: "Invoice Number",
         field: "invoiceNumber",
      },
   ];

   const defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
   };

   return (
      <div style={{ height: "100vh", width: "100vw" }}>
         {/* Top Toolbar */}
         {!rtAccess && (
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
                     className="tw"
                     value={count}
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
               {/* <Grid item xs={12} sm={2} md={4} /> */}
               {isAdmin && (
                  <Grid item xs={12} sm={2} md={4}>
                     <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        className="gridButton"
                        onClick={handleBulkDelete}
                     >
                        Bulk Delete
                     </Button>
                  </Grid>
               )}
               <Grid item xs={12} sm={3}>
                  <TextField
                     size="small"
                     label="File Name"
                     value={fileName}
                     className="tw"
                     fullWidth
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
         )}

         {/* AG Grid */}
         <div
            className="ag-theme-quartz-dark custom-grid"
            style={{
               marginTop: rtAccess ? "10vh" : "1vh",
               marginLeft: isSmall ? "1%" : "0.2%",
               height: "84vh",
               width: isSmall ? "98%" : "99.6%",
            }}
         >
            <AgGridReact
               ref={gridapi}
               rowData={tableData}
               columnDefs={column}
               defaultColDef={defaultColDef}
               pagination={true}
               paginationPageSize={100}
               rowSelection="multiple"
               domLayout="normal"
               suppressHorizontalScroll={false} // <-- allow scroll
            />
         </div>

         {/* Delete Dialog */}
         <Dialog
            open={open}
            onClose={() => setOpen(false)}
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
                  textTransform: "uppercase",
                  letterSpacing: 6,
               }}
               //id="customized-dialog-title"
            >
               Confirm Delete
            </DialogTitle>
            <IconButton
               aria-label="close"
               onClick={() => setOpen(false)}
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
               <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                  Are you Sure that you want to Delete ?
               </Typography>
               <Typography sx={{ fontWeight: "bold", display: "inline" }}>
                  Candidate ID :
               </Typography>
               <Typography sx={{ display: "inline" }}>
                  {" "}
                  {deleteData.id}
               </Typography>
               <Typography></Typography>
               <Typography sx={{ fontWeight: "bold", display: "inline" }}>
                  Candidate Name :
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
                  sx={{ backgroundColor: alpha("#FF0000", 0.7) }}
                  onClick={() => {
                     AxiosInstance.delete("/candidate/" + deleteData._id)
                        .then(() => {
                           setTableData((prev) =>
                              prev.filter((d) => d._id !== deleteData._id),
                           );
                           toast.success("Candidate deleted successfully");
                        })
                        .catch(() => toast.error("Failed to delete candidate"));
                     setOpen(false);
                  }}
               >
                  Delete
               </Button>
               <Button
                  variant="contained"
                  size="large"
                  //sx={{ backgroundColor: alpha("#0000FF", 0.5) }}
                  onClick={() => setOpen(false)}
               >
                  Cancel
               </Button>
            </DialogActions>
         </Dialog>
         {/* Edit Dialog */}
         <Dialog
            open={editOpen}
            onClose={() => setEditOpen(false)}
            sx={{
               backgroundColor: "transparent",
               "& .MuiDialog-paper": {
                  backgroundColor: "transparent",
                  backdropFilter: "blur(20px)",
                  boxShadow: "none",
                  color: "white",
               },
            }}
         >
            <DialogTitle
               sx={{
                  textTransform: "uppercase",
                  letterSpacing: 6,
               }}
            >
               Quick Edit Candidate
            </DialogTitle>
            <IconButton
               aria-label="close"
               onClick={() => setEditOpen(false)}
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
               <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                  Candidate ID : <span>{editData.candidateId}</span>
               </Typography>
               <Typography
                  gutterBottom
                  sx={{ fontWeight: "bold", marginBottom: "4vh" }}
               >
                  Candidate Name : <span>{editData.fullName}</span>
               </Typography>

               <TextField
                  id="candidateInterviewStatus"
                  select
                  label="Interview Status"
                  className="tw"
                  value={editData.interviewStatus}
                  fullWidth
                  sx={{ marginBottom: "2vh" }}
                  onChange={(e) =>
                     setEditData({
                        ...editData,
                        interviewStatus: e.target.value,
                        interviewStatDate: new Date(),
                     })
                  }
               >
                  {INTERVIEW_STATUS.map((option) => (
                     <MenuItem key={option} value={option}>
                        {option}
                     </MenuItem>
                  ))}
               </TextField>
               <LocalizationProvider
                  gutterBottom
                  dateAdapter={AdapterDayjs}
                  fullWidth
               >
                  <DatePicker
                     label="Interview Date"
                     className="calenderMUI"
                     sx={{ width: "100%", marginBottom: "2vh" }}
                     fullWidth
                     format="DD/MM/YYYY"
                     value={dayjs(editData.interviewDate)}
                     onChange={(e) => {
                        setEditData({
                           ...editData,
                           interviewDate: e,
                        });
                     }}
                  />
               </LocalizationProvider>
               <LocalizationProvider
                  gutterBottom
                  dateAdapter={AdapterDayjs}
                  fullWidth
               >
                  <DatePicker
                     label="Next Tracking Date"
                     className="calenderMUI"
                     sx={{ width: "100%", marginBottom: "2vh" }}
                     fullWidth
                     format="DD/MM/YYYY"
                     value={dayjs(editData.nextTrackingDate)}
                     onChange={(e) => {
                        setEditData({
                           ...editData,
                           nextTrackingDate: e,
                        });
                     }}
                  />
               </LocalizationProvider>
               <TextField
                  className="tw"
                  sx={{ marginBottom: "2vh" }}
                  id="candidateLanguageRemark"
                  label="Remarks"
                  variant="outlined"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  fullWidth
               />
            </DialogContent>
            <DialogActions>
               <Button
                  variant="contained"
                  size="large"
                  color="success"
                  sx={{ backgroundColor: alpha("#00FF00", 0.6) }}
                  onClick={async () => {
                     try {
                        const updatedCandidateRes = await AxiosInstance.patch(
                           "/candidate/" + editData._id,
                           {
                              ...editData,
                           },
                        );
                        const addedRemarks = await AxiosInstance.post(
                           "/remarks",
                           {
                              remarks: remarks,
                              employeeId: userid,
                              candidateId: editData._id,
                           },
                        );
                        const updatedCandidateData = updatedCandidateRes.data;
                        setTableData((prev) =>
                           prev.map((d) =>
                              d._id === updatedCandidateData._id
                                 ? { ...d, ...updatedCandidateData }
                                 : d,
                           ),
                        );
                        toast.success("Candidate updated successfully");
                     } catch (error) {
                        toast.error("Failed to update candidate");
                     }

                     setEditOpen(false);
                  }}
               >
                  Save
               </Button>
               <Button
                  variant="contained"
                  size="large"
                  onClick={() => setEditOpen(false)}
               >
                  Cancel
               </Button>
            </DialogActions>
         </Dialog>

         {/* Bulk Delete Dialog */}
         <Dialog
            open={bulkDeleteOpen}
            onClose={() => setBulkDeleteOpen(false)}
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
                  textTransform: "uppercase",
                  letterSpacing: 6,
               }}
            >
               Confirm Bulk Delete
            </DialogTitle>
            <IconButton
               aria-label="close"
               onClick={() => setBulkDeleteOpen(false)}
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
               <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                  Are you sure you want to delete {selectedIds.length}{" "}
                  candidate(s)?
               </Typography>
               <Typography
                  sx={{ fontWeight: "bold", marginTop: "1vh", color: "red" }}
               >
                  This action cannot be undone.
               </Typography>
            </DialogContent>
            <DialogActions>
               <Button
                  variant="contained"
                  size="large"
                  color="error"
                  sx={{ backgroundColor: alpha("#FF0000", 0.7) }}
                  onClick={confirmBulkDelete}
               >
                  Delete All
               </Button>
               <Button
                  variant="contained"
                  size="large"
                  onClick={() => setBulkDeleteOpen(false)}
               >
                  Cancel
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
}
