import React, { useState, useEffect } from "react";
import { createTheme, useMediaQuery } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useSearchParams } from "react-router-dom";
import AxiosInstance from "../Main/AxiosInstance";

export default function PortalUpdates() {
   // STATES HANDLING AND VARIABLES
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
         headerName: "Employee Name",
         field: "name",
         pinned: "left",
         width: 200,
      },
      {
         headerName: "Employee ID",
         field: "",
         width: 150,
      },
      {
         headerName: "DOJ",
         field: "",
         width: 150,
      },
      {
         headerName: "Total Profile",
         field: "",
         width: 150,
      },
      {
         headerName: "Profiles Created",
         field: "",
         width: 150,
      },
      {
         headerName: "Profiles Edited",
         field: "",
         width: 150,
      },
      {
         headerName: "Skill Added",
         field: "",
         width: 150,
      },
      {
         headerName: "Tags Added",
         field: "",
         width: 150,
      },
      {
         headerName: "Source Selected",
         field: "",
         width: 150,
      },
      {
         headerName: "Home Town",
         field: "",
         width: 150,
      },
      {
         headerName: "Current City",
         field: "",
         width: 150,
      },
      {
         headerName: "Langauge Added",
         field: "",
         width: 150,
      },
      {
         headerName: "Langauge Level Added",
         field: "",
         width: 150,
      },
      {
         headerName: "Qualification Added",
         field: "",
         width: 150,
      },
      {
         headerName: "Experience Added",
         field: "",
         width: 150,
      },
      {
         headerName: "Remarks Added",
         field: "",
         width: 150,
      },
      {
         headerName: "DND",
         field: "",
         width: 150,
      },
      {
         headerName: "Non DND",
         field: "",
         width: 150,
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
