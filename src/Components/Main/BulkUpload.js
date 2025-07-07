import React from "react";
import {
   Card,
   Container,
   Grid,
   CardContent,
   Button,
   styled,
   alpha,
   Box,
   Typography,
} from "@mui/material";
import * as XLSX from "xlsx";
import _ from "lodash";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import ExcelExport from "./ExcelExport";
import { useSelector } from "react-redux";

export default function Bulkupload(props) {
   const { employeeType, userid } = useSelector((state) => state.user);
   const VisuallyHiddenInput = styled("input")({
      clip: "rect(0 0 0 0)",
      clipPath: "inset(50%)",
      height: 1,
      overflow: "hidden",
      position: "absolute",
      bottom: 0,
      left: 0,
      whiteSpace: "nowrap",
      width: 1,
   });
   const handleCompanyFileUpload = (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();

      reader.onload = async (event) => {
         const workbook = XLSX.read(event.target.result, { type: "binary" });
         const sheetName = workbook.SheetNames[0];
         const sheet = workbook.Sheets[sheetName];
         var sheetData = XLSX.utils.sheet_to_json(sheet);

         const data = sheetData.map((sheet) => {
            var { HRMobile, HRName, HREmail, empanelled, ...rest } = sheet;
            const HRMobileList = String(HRMobile).includes(", ")
               ? HRMobile.split(", ")
               : [HRMobile];
            const HREmailList = String(HREmail).includes(",")
               ? HREmail.split(",")
               : [HREmail];
            const HRNameList = String(HRName).includes(",")
               ? HRName.split(",")
               : [HRName];
            const HRList = HRNameList.map((hrname, i) => {
               return {
                  HRName: hrname,
                  HREmail: HREmailList[i],
                  HRMobile: [HRMobileList[i]],
               };
            });
            return {
               ...rest,
               HR: HRList,
               empanelled: empanelled === "TRUE",
            };
         });
         const resp = axios.post(
            "https://tpp-backend-eura.onrender.com/api/v1/company/bulkinsert",
            data,
            {
               headers: {
                  authorization: JSON.parse(localStorage.getItem("user")).token,
               },
            }
         );
         toast.promise(resp, {
            pending: "Data is Uploading. Please wait....",
            success: "Company Data Uploaded",
            error: {
               render({ data }) {
                  return (
                     "Could insert only " +
                     String(data.response.data.message.result.insertedCount) +
                     " Rows"
                  );
               },
            },
         });

         e.target.value = null;
      };
      reader.readAsBinaryString(file);
   };
   const handleEmployeeFileUpload = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (event) => {
         const workbook = XLSX.read(event.target.result, { type: "binary" });
         const sheetName = workbook.SheetNames[0];
         const sheet = workbook.Sheets[sheetName];
         const sheetData = XLSX.utils.sheet_to_json(sheet);
         const data = sheetData.map((row) => {
            var { gender, documentation, status, DOJ, DOB, ...rest } = row;
            gender = !gender ? "Male" : gender;
            documentation = !documentation ? 0 : documentation;
            status = !status ? 1 : status;
            DOJ = !DOJ ? new Date() : DOJ;
            DOB = !DOB ? new Date() : DOB;
            return { gender, documentation, status, DOJ, DOB, ...rest };
         });
         const resp = axios.post(
            "https://tpp-backend-eura.onrender.com/api/v1/employee/bulkinsert",
            data,
            {
               headers: {
                  authorization: JSON.parse(localStorage.getItem("user")).token,
               },
            }
         );
         toast.promise(resp, {
            pending: "Data is Uploading. Please wait....",
            success: "Employee Data Uploaded",
            error: {
               render({ data }) {
                  return (
                     "Could insert only " +
                     String(data.response.data.message.result.insertedCount) +
                     " Rows"
                  );
               },
            },
         });

         e.target.value = null;
      };
      reader.readAsBinaryString(file);
   };
   const handleCandidateFileUpload = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (event) => {
         const workbook = XLSX.read(event.target.result, { type: "binary" });
         const sheetName = workbook.SheetNames[0];
         const sheet = workbook.Sheets[sheetName];
         const sheetData = XLSX.utils.sheet_to_json(sheet);
         const data = sheetData.map((sd) => {
            const {
               skills = "",
               language = "",
               level = "",
               qualification = "",
               YOP = "",
               companyName = "",
               role = "",
               startDate,
               endDate,
               salary,
               languageRemark = "",
               interviewDate,
               onboardingDate,
               nextTrackingDate,
               billingDate,
               invoiceDate,
               mobile,
               email = [""],
               ...rest
            } = sd;
            var languages = language?.split(",");
            var levels = level?.split(",");
            var languageRemarks = languageRemark?.split(",");
            var languages = languages?.map((l, i) => {
               return {
                  language: l,
                  level: levels[i],
                  remarks: languageRemarks[i],
               };
            });
            const skillList = skills.includes(",") ? skills.split(",") : skills;
            const newStart = startDate
               ? new Date(Math.round((startDate - 25569) * 86400 * 1000))
               : null;
            const mobileList = String(mobile).includes(", ")
               ? mobile.split(", ")
               : mobile;
            const emailList = email.includes(",") ? email.split(",") : email;

            const newEnd = endDate
               ? new Date(Math.round((endDate - 25569) * 86400 * 1000))
               : null;
            const newInterviewDate = interviewDate
               ? new Date(Math.round((interviewDate - 25569) * 86400 * 1000))
               : null;
            const newOnboardingDate = onboardingDate
               ? new Date(Math.round((onboardingDate - 25569) * 86400 * 1000))
               : null;
            const newNextTrackingDate = nextTrackingDate
               ? new Date(Math.round((nextTrackingDate - 25569) * 86400 * 1000))
               : null;
            const newBillingDate = billingDate
               ? new Date(Math.round((billingDate - 25569) * 86400 * 1000))
               : null;
            const newInvoiceDate = invoiceDate
               ? new Date(Math.round((invoiceDate - 25569) * 86400 * 1000))
               : null;

            const exp =
               newStart !== null && newEnd !== null
                  ? Math.round(
                       (newEnd.getTime() - newStart.getTime()) /
                          1000 /
                          (60 * 60 * 24) /
                          365.25,
                       2
                    )
                  : null;
            var YOPs = YOP.includes(",") ? YOP.split(",") : null;
            var qualifications = qualification.includes(",")
               ? qualification.split((v, i) => {
                    return { qualification: v, YOP: YOPs[i] };
                 })
               : [{ qualification: "", YOP: new Date().getFullYear() }];
            return {
               ...rest,
               languages: languages,
               mobile: mobileList,
               email: emailList,
               skills: skillList,
               qualifications: qualifications,
               interviewDate: newInterviewDate,
               onboardingDate: newOnboardingDate,
               nextTrackingDate: newNextTrackingDate,
               billingDate: newBillingDate,
               invoiceDate: newInvoiceDate,
               experience: {
                  companyName,
                  role,
                  salary,
                  startDate: newStart,
                  endDate: newEnd,
                  experience: exp,
               },
               assignedEmployee: userid,
               createdByEmployee: userid,
            };
         });

         const resp = axios.post(
            "https://tpp-backend-eura.onrender.com/api/v1/candidate/bulkinsert",
            data,
            {
               headers: {
                  authorization: JSON.parse(localStorage.getItem("user")).token,
               },
            }
         );
         toast.promise(resp, {
            pending: "Data is Uploading. Please wait....",
            success: "Candidate Data Uploaded",
            error: {
               render({ data }) {
                  return (
                     "Could insert only " +
                     String(data.response.data.message.result.insertedCount) +
                     " Rows"
                  );
               },
            },
         });

         e.target.value = null;
      };
      reader.readAsBinaryString(file);
   };

   //CARDS INLINE CSS
   const cardsStyle = {
      backgroundColor: "transparent",
      backdropFilter: "blur(70px)",
      color: "white",
      borderRadius: "20px",
      borderLeftStyle: "solid",
      borderLeftWidth: "0.5vh",
   };

   //JSX CODE
   return (
      <>
         {/*NEW CODE FOR BULK UPLOAD*/}
         <Container
            disableGutters
            maxWidth={false}
            sx={{ paddingTop: "20vh", width: "60%", paddingBottom: "2vh" }}
         >
            <Grid container columnSpacing={5} rowSpacing={2}>
               {/*Company Bulk*/}
               <Grid item xs={6}>
                  <Card sx={{ ...cardsStyle, borderLeftColor: "#00FFFF" }}>
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography
                              variant="h6"
                              textTransform="uppercase"
                              fontWeight="bold"
                           >
                              COMPANY
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent
                           sx={{
                              paddingTop: "4vh",
                              width: "70%",
                              marginLeft: "15%",
                           }}
                        >
                           <Button
                              fullWidth
                              size="large"
                              sx={{
                                 backgroundColor: alpha("#0000FF", 0.5),
                                 height: "100%",
                                 marginBottom: "1vh",
                              }}
                              variant="contained"
                              component="label"
                              tabIndex={-1}
                              startIcon={<CloudUploadIcon />}
                           >
                              Bulk Upload
                              <VisuallyHiddenInput
                                 type="file"
                                 onChange={handleCompanyFileUpload}
                              />
                           </Button>
                           <ExcelExport
                              sx={{ height: "100%" }}
                              excelData={[
                                 {
                                    companyName: "",
                                    HRName: "",
                                    HRMobile: "value1,value2",
                                    HREmail: "",
                                    about: "",
                                    remarks: "",
                                    response: "",
                                    empanelled: "TRUE/FALSE",
                                    companyType: "",
                                 },
                              ]}
                              fileName={"Company Template"}
                              buttonName={"Bulk Template"}
                           />
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               {/*End of Company Bulk*/}
               {/*Company Role Bulk*/}
               <Grid item xs={6}>
                  <Card sx={{ ...cardsStyle, borderLeftColor: "#00FF00" }}>
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h6" fontWeight="bold">
                              EMPLOYEE
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent
                           sx={{
                              paddingTop: "4vh",
                              width: "70%",
                              marginLeft: "15%",
                           }}
                        >
                           <Button
                              fullWidth
                              size="large"
                              sx={{
                                 backgroundColor: alpha("#0000FF", 0.5),
                                 height: "100%",
                                 marginBottom: "1vh",
                              }}
                              variant="contained"
                              component="label"
                              tabIndex={-1}
                              startIcon={<CloudUploadIcon />}
                           >
                              Bulk Upload
                              <VisuallyHiddenInput
                                 type="file"
                                 onChange={handleEmployeeFileUpload}
                              />
                           </Button>
                           <ExcelExport
                              sx={{ height: "100%" }}
                              excelData={[
                                 {
                                    name: "",
                                    mobile: "",
                                    parentMobile: "",
                                    email: "",
                                    gender: "Male/Female",
                                    DOB: "",
                                    DOJ: "",
                                    documentation: "1/0",
                                    status: "1/0",
                                    employeeType: "",
                                 },
                              ]}
                              fileName={"Employee Template"}
                              buttonName={"Bulk Template"}
                           />
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               {/*End of Employee Bulk*/}
               {/*Candidate Bulk*/}
               <Grid item xs={6}>
                  <Card sx={{ ...cardsStyle, borderLeftColor: "#FF5C00" }}>
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h6" fontWeight="bold">
                              CANDIDATE
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent
                           sx={{
                              paddingTop: "4vh",
                              width: "70%",
                              marginLeft: "15%",
                           }}
                        >
                           <Button
                              fullWidth
                              size="large"
                              sx={{
                                 backgroundColor: alpha("#0000FF", 0.5),
                                 height: "100%",
                                 marginBottom: "1vh",
                              }}
                              variant="contained"
                              component="label"
                              tabIndex={-1}
                              startIcon={<CloudUploadIcon />}
                           >
                              Bulk Upload
                              <VisuallyHiddenInput
                                 type="file"
                                 onChange={handleCandidateFileUpload}
                              />
                           </Button>
                           <ExcelExport
                              sx={{ height: "100%" }}
                              excelData={[
                                 {
                                    fullName: "",
                                    mobile: "value1, value2",
                                    email: "value1,value2",
                                    homeTown: "",
                                    currentCity: "",
                                    language: "value1,value2",
                                    level: "value1,value2",
                                    languageRemark: "value1,value2",
                                    qualification: "value1,value2",
                                    YOP: "value1,value2",
                                    companyName: "",
                                    role: "",
                                    salary: "",
                                    startDate: "",
                                    endDate: "",
                                    skills: "",
                                    l1Assessment: "",
                                    l2Assessment: "",
                                    remarks: "",
                                    interviewStatus: "",
                                    select: "",
                                    EMP_ID: "",
                                    onboardingDate: "",
                                    nextTrackingDate: "",
                                    rate: "",
                                    billingDate: "",
                                    invoiceNumber: "",
                                    invoiceDate: "",
                                    companyId: "",
                                    roleId: "",
                                 },
                              ]}
                              fileName={"Candidate Template"}
                              buttonName={"Bulk Template"}
                           />
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               {/*End of Candidate Bulk*/}
               {/*Company Role Bulk*/}
               <Grid item xs={6}>
                  <Card sx={{ ...cardsStyle, borderLeftColor: "#FF0000" }}>
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h6" fontWeight="bold">
                              COMPANY ROLE
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent
                           sx={{
                              paddingTop: "4vh",
                              width: "70%",
                              marginLeft: "15%",
                           }}
                        >
                           <Button
                              fullWidth
                              size="large"
                              sx={{
                                 backgroundColor: alpha("#0000FF", 0.5),
                                 height: "100%",
                                 marginBottom: "1vh",
                              }}
                              variant="contained"
                              component="label"
                              disabled={true}
                              tabIndex={-1}
                              startIcon={<CloudUploadIcon />}
                           >
                              Bulk Upload
                              <VisuallyHiddenInput
                                 type="file"
                                 onChange={handleCompanyFileUpload}
                              />
                           </Button>
                           <ExcelExport
                              sx={{ height: "100%" }}
                              excelData={[
                                 {
                                    name: "",
                                    mobile: "",
                                    parentMobile: "",
                                    email: "",
                                    gender: "Male/Female",
                                    DOB: "",
                                    DOJ: "",
                                    documentation: "1/0",
                                    status: "1/0",
                                    employeeType: "",
                                 },
                              ]}
                              fileName={"Role Template"}
                              buttonName={"Bulk Template"}
                              disabled={true}
                           />
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               {/*End of Company Role Bulk*/}
            </Grid>
         </Container>
         {/*EOD OF NEW CODE FOR BULK UPLOAD*/}
      </>
   );
}
