import React from "react";
import { Button, alpha } from "@mui/material";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { flatten } from "flat";

const ExcelExport = ({ excelData=null,gridRef, fileName, buttonName = "Download", disabled = false }) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const exportToExcel = async () => {
    if (disabled) return;
    let expdata = excelData
    if(gridRef?.current && !excelData)
      expdata = gridRef.current.api.getSelectedRows().map((l)=>flatten(l));
    const ws = XLSX.utils.json_to_sheet(expdata);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  //JSX CODE
  return (
    <>
      <Button
        variant="contained"
        startIcon={<CloudDownloadIcon />}
        onClick={(e) => exportToExcel(fileName)}
        color="success"
        sx={{
          height: "100%",
          cursor: disabled ? "not-allowed" : "pointer",
          backgroundColor: disabled ? alpha("#808080", 0.5) : alpha("#008000", 0.5),
          "&:hover": {
            backgroundColor: disabled ? alpha("#808080", 0.5) : alpha("#008000", 0.7),
          },
          color: disabled ? "#bfbfbf" : "#fff",
        }}
        disabled={disabled}
        fullWidth
      >
        {buttonName}
      </Button>
    </>
  );
};
export default ExcelExport;