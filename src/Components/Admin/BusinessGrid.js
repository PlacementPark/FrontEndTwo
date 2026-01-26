import React, { useState, useEffect } from "react";
import {
   Button,
   Grid,
   Typography,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   IconButton,
   alpha,
   createTheme,
   useMediaQuery,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import AxiosInstance from "../Main/AxiosInstance";

export default function BusinessGrid() {
   // STATES HANDLING AND VARIABLES
   const [open, setOpen] = React.useState(false);
   const [employeeList, setEmployeeList] = useState([]);
   const [searchParams] = useSearchParams();
   const gridapi = React.useRef();
   const theme = createTheme();
   const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

   // FUNCTIONS HANDLING AND SEARCH API CALLS
   useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await AxiosInstance.get(
               "/employee/employeeType/" + searchParams.get("employeeType"),
            );
            setEmployeeList(res.data);
         } catch (error) {
            console.log(error);
         }
      };
      fetchData();
   }, [setEmployeeList, searchParams]);

   // GRID HEADER/COLOUMS HANDLING
   const column = [
      {
         headerName: "Month",
         field: "",
         pinned: "left",
         width: 200,
      },
      {
         headerName: "Awaiting Joining",
         field: "",
         width: 150,
      },
      {
         headerName: "Tracking",
         field: "",
         width: 150,
      },
      {
         headerName: "Invoice Created & Y2C",
         field: "",
         width: 150,
      },
      {
         headerName: "Inovice Credited",
         field: "",
         width: 150,
      },
      {
         headerName: "Business Gen",
         field: "",
         width: 150,
      },
      {
         headerName: "Offer Drop",
         field: "",
         width: 150,
      },
      {
         headerName: "Non Tenure",
         field: "",
         width: 150,
      },
      {
         headerName: "Rampdown",
         field: "",
         width: 150,
      },
      {
         headerName: "Cash Projection",
         field: "",
         width: 150,
      },
      {
         headerName: "Yet to Tenure",
         field: "",
         width: 150,
      },
      {
         headerName: "Ready to Billed",
         field: "",
         width: 150,
      },
      {
         headerName: "Invoice Created",
         field: "",
         width: 150,
      },
      {
         headerName: "Invoice Credited",
         field: "",
         width: 150,
      },
      {
         headerName: "Non Tenure",
         field: "",
         width: 150,
      },
      {
         headerName: "Handloan",
         field: "",
         width: 150,
      },
      {
         headerName: "Taxes",
         field: "",
         width: 150,
      },
      {
         headerName: "Expenses",
         field: "",
         width: 150,
      },
      {
         headerName: "O/S Expense",
         field: "",
         width: 150,
      },
      {
         headerName: "Captial Re-Payment",
         field: "",
         width: 150,
      },
      {
         headerName: "Total Expense",
         field: "",
         width: 150,
      },
      {
         headerName: "Business Gen",
         field: "",
         width: 150,
      },
      {
         headerName: "Expenses Remarks",
         field: "",
         width: 150,
      },
   ];

   const defaultColDef = {
      sortable: true,
      editable: false,
      cellEditor: false,
      filter: true,
      rowSelection: "multiple",
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

   return (
      <>
         <div style={{ height: "100vh", width: "100vw", paddingTop: "6.5vh" }}>
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
                  rowData={employeeList}
                  columnDefs={column}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={100}
                  selection={selection}
                  paginationPageSizeSelector={paginationPageSizeSelector}
                  rowSelection={"multiple"}
                  rowHeight={28} // <-- set row height here
                  headerHeight={35} // <-- set header height here
               />
            </div>
         </div>
      </>
   );
}
