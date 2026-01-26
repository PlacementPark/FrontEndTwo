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
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInstance from "../Main/AxiosInstance";
import "../../App.css";

var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

export default function PieChart() {
   const { employeeType } = useSelector((state) => state.user);
   const isAdmin = employeeType === "Admin";
   const [tableData, setTableData] = useState([]);
   const gridapi = React.useRef();
   const [searchParams] = useSearchParams();
   const theme = useTheme();
   const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
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
            console.log(allCandidates);

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

   const column = [
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
      { headerName: "Rate", field: "rate", hide: !isAdmin },
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
      <div style={{ height: "100vh", width: "100vw", paddingTop: "6.5vh" }}>
         {/* AG Grid */}
         <div
            className="ag-theme-quartz-dark custom-grid"
            style={{
               marginTop: "1vh",
               marginLeft: isSmall ? "1%" : "0.2%",
               height: "92vh",
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
               //rowHeight={28}      // <-- set row height here
               headerHeight={35} // <-- set header height here
            />
         </div>
      </div>
   );
}
