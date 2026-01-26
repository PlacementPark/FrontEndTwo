import React, { useState, useMemo, useRef, useEffect } from "react";
import { createTheme, useMediaQuery } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosInstance from "../Main/AxiosInstance";

export default function CompanyContributionP1() {
   const [tableData, setTableData] = useState([]);
   const [searchParams] = useSearchParams();
   const gridapi = useRef();
   const [loadingToastId, setLoadingToastId] = useState(null);
   const theme = createTheme();
   const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

   // Build URL
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

   // Dropdown options for months
   const statusOptions = [
      "Active",
      "In-Active",
      "Hold",
      "Blacklist",
      "Rampdown",
      "Future Connect",
   ];

   // Columns
   const column = [
      {
         headerName: "Company Name",
         field: "companyName",
         pinned: "left",
         sortable: true,
         width: 220,
      },
      // Generate 12 month columns dynamically
      ...[
         "Jan",
         "Feb",
         "Mar",
         "Apr",
         "May",
         "Jun",
         "Jul",
         "Aug",
         "Sep",
         "Oct",
         "Nov",
         "Dec",
      ].map((month) => ({
         headerName: month,
         field: month.toLowerCase(),
         editable: true,
         cellEditor: "agSelectCellEditor",
         cellEditorParams: {
            values: statusOptions,
         },
         cellStyle: {
            textAlign: "center",
         },
         width: 120,
      })),
   ];

   const defaultColDef = {
      sortable: true,
      editable: false,
      filter: true,
      resizable: true,
   };

   const selection = useMemo(
      () => ({
         mode: "multiRow",
         groupSelects: "descendants",
      }),
      [],
   );
   const paginationPageSizeSelector = useMemo(() => [200, 500, 1000], []);

   return (
      <div style={{ height: "100vh", width: "100vw", paddingTop: "6.5vh" }}>
         {/* Grid */}
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
               rowHeight={28}
               headerHeight={35}
            />
         </div>
      </div>
   );
}
