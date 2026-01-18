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
import { toast } from "react-toastify";
import ExcelExport from "./ExcelExport";
import { useSelector } from "react-redux";
import AxiosInstance from "./AxiosInstance";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function Bulkupload() {
   const { userid } = useSelector((state) => state.user);

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

   // === COMPANY FILE UPLOAD ===
   const handleCompanyFileUpload = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
         const reader = new FileReader();
         reader.onload = async (event) => {
            try {
               const workbook = XLSX.read(event.target?.result, {
                  type: "binary",
               });
               const sheetName = workbook.SheetNames[0];
               const worksheet = workbook.Sheets[sheetName];
               const rawData = XLSX.utils.sheet_to_json(worksheet);

               const errors = [];
               const validCompanies = [];

               rawData.forEach((row, index) => {
                  const rowErrors = [];

                  // Required: companyName - handle undefined, null, and number types
                  const companyNameValue = row.companyName
                     ? String(row.companyName).trim()
                     : "";
                  if (!companyNameValue) {
                     rowErrors.push("companyName is required");
                  }

                  // HR array processing
                  let hrArray = [];
                  if (row.HRName || row.HRMobile || row.HREmail) {
                     const hrNames = row.HRName
                        ? String(row.HRName).split("|")
                        : [""];
                     const hrMobiles = row.HRMobile
                        ? String(row.HRMobile).split("|")
                        : [""];
                     const hrEmails = row.HREmail
                        ? String(row.HREmail).split("|")
                        : [""];

                     const maxLen = Math.max(
                        hrNames.length,
                        hrMobiles.length,
                        hrEmails.length
                     );
                     for (let i = 0; i < maxLen; i++) {
                        const hrMobileStr = (hrMobiles[i] || "").trim();
                        const hrMobileList = hrMobileStr
                           ? hrMobileStr.split(",").map((m) => m.trim())
                           : [];

                        // Validate mobile numbers
                        const invalidMobiles = hrMobileList.filter(
                           (m) => !/^[0-9]\d{9}$/.test(m)
                        );
                        if (invalidMobiles.length > 0) {
                           rowErrors.push(
                              `HR ${
                                 i + 1
                              }: Invalid mobile: ${invalidMobiles.join(", ")}`
                           );
                        }

                        // Validate email
                        const email = (hrEmails[i] || "").trim();
                        if (
                           email &&
                           !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                        ) {
                           rowErrors.push(`HR ${i + 1}: Invalid email format`);
                        }

                        hrArray.push({
                           HRName: (hrNames[i] || "").trim(),
                           HRMobile: hrMobileList,
                           HREmail: email,
                           HRDesignation: (
                              row[`HRDesignation${i + 1}`] || ""
                           ).trim(),
                           HRLocation: (row[`HRLocation${i + 1}`] || "").trim(),
                        });
                     }
                  }

                  if (rowErrors.length === 0) {
                     const company = {
                        companyName: companyNameValue,
                        companyId: row.companyId
                           ? String(row.companyId).trim()
                           : undefined,
                        HR: hrArray,
                        about: row.about ? String(row.about).trim() : "",
                        companyType: row.companyType
                           ? String(row.companyType).trim()
                           : undefined,
                        remarks: row.remarks ? String(row.remarks).trim() : "",
                        response: row.response
                           ? String(row.response).trim()
                           : "No Response",
                        empanelled: row.empanelled
                           ? String(row.empanelled).toLowerCase() === "true"
                           : false,
                        paymentTerms: row.paymentTerms
                           ? parseInt(row.paymentTerms)
                           : undefined,
                     };
                     validCompanies.push(company);
                  } else {
                     errors.push({
                        row: index + 2,
                        company: companyNameValue || "Unknown",
                        issues: rowErrors,
                     });
                  }
               });

               if (errors.length > 0) {
                  let errorMessage = `Found ${errors.length} error(s):\n\n`;
                  errors.slice(0, 5).forEach((error) => {
                     errorMessage += `Row ${error.row}: ${error.issues.join(
                        ", "
                     )}\n`;
                  });
                  if (errors.length > 5) {
                     errorMessage += `\n... and ${
                        errors.length - 5
                     } more error(s)`;
                  }
                  toast.error(errorMessage);
                  return;
               }

               const toastId = toast.loading(
                  `Uploading ${validCompanies.length} company(ies)...`
               );
               try {
                  await AxiosInstance.post(
                     "/company/bulkinsert",
                     { companies: validCompanies },
                     { timeout: 60000 }
                  );
                  toast.update(toastId, {
                     render: `Successfully uploaded ${validCompanies.length} company(ies)`,
                     type: "success",
                     isLoading: false,
                     autoClose: 4000,
                  });
               } catch (uploadError) {
                  toast.update(toastId, {
                     render:
                        uploadError.response?.data?.message ||
                        "Failed to upload companies",
                     type: "error",
                     isLoading: false,
                     autoClose: 4000,
                  });
               }
            } catch (parseError) {
               toast.error("Failed to parse Excel file");
               console.error(parseError);
            }
         };
         reader.readAsBinaryString(file);
      } catch (error) {
         toast.error("Failed to read file");
         console.error(error);
      }
   };

   // === EMPLOYEE FILE UPLOAD ===
   const handleEmployeeFileUpload = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
         const reader = new FileReader();
         reader.onload = async (event) => {
            try {
               const workbook = XLSX.read(event.target?.result, {
                  type: "binary",
               });
               const sheetName = workbook.SheetNames[0];
               const worksheet = workbook.Sheets[sheetName];
               const rawData = XLSX.utils.sheet_to_json(worksheet);

               const errors = [];
               const validEmployees = [];

               rawData.forEach((row, index) => {
                  const rowErrors = [];

                  // Required: name - handle undefined, null, and number types
                  const nameValue = row.name ? String(row.name).trim() : "";
                  if (!nameValue) {
                     rowErrors.push("name is required");
                  }

                  // Required: mobile
                  const mobileValue = row.mobile
                     ? String(row.mobile).trim()
                     : "";
                  if (!mobileValue) {
                     rowErrors.push("mobile is required");
                  } else {
                     const mobiles = mobileValue
                        .split(",")
                        .map((m) => m.trim());
                     const invalidMobiles = mobiles.filter(
                        (m) => !/^[0-9]\d{9}$/.test(m)
                     );
                     if (invalidMobiles.length > 0) {
                        rowErrors.push(
                           `Invalid mobile: ${invalidMobiles.join(", ")}`
                        );
                     }
                  }

                  // Email validation
                  const emailValue = row.email ? String(row.email).trim() : "";
                  if (
                     emailValue &&
                     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
                  ) {
                     rowErrors.push("Invalid email format");
                  }

                  // Parent mobile validation
                  const parentMobileValue = row.parentMobile
                     ? String(row.parentMobile).trim()
                     : "";
                  if (parentMobileValue) {
                     const parentMobiles = parentMobileValue
                        .split(",")
                        .map((m) => m.trim());
                     const invalidParentMobiles = parentMobiles.filter(
                        (m) => !/^[0-9]\d{9}$/.test(m)
                     );
                     if (invalidParentMobiles.length > 0) {
                        rowErrors.push(
                           `Invalid parentMobile: ${invalidParentMobiles.join(
                              ", "
                           )}`
                        );
                     }
                  }

                  // Gender validation
                  const validGenders = ["Male", "Female", "Other"];
                  const genderValue = row.gender
                     ? String(row.gender).trim()
                     : "";
                  if (genderValue && !validGenders.includes(genderValue)) {
                     rowErrors.push("Gender must be Male, Female, or Other");
                  }

                  // DOB and DOJ date validation
                  let dobDate = null,
                     dojDate = null;
                  if (row.DOB) {
                     dobDate = new Date(row.DOB);
                     if (isNaN(dobDate.getTime())) {
                        rowErrors.push("Invalid DOB format (use YYYY-MM-DD)");
                     }
                  }
                  if (row.DOJ) {
                     dojDate = new Date(row.DOJ);
                     if (isNaN(dojDate.getTime())) {
                        rowErrors.push("Invalid DOJ format (use YYYY-MM-DD)");
                     }
                  }

                  if (rowErrors.length === 0) {
                     const mobiles = mobileValue
                        .split(",")
                        .map((m) => m.trim());
                     const employee = {
                        name: nameValue,
                        email: emailValue || undefined,
                        mobile: mobiles,
                        parentMobile: parentMobileValue || undefined,
                        gender: genderValue || "Male",
                        currentAddress: row.currentAddress
                           ? String(row.currentAddress).trim()
                           : undefined,
                        permanentAddress: row.permanentAddress
                           ? String(row.permanentAddress).trim()
                           : undefined,
                        DOB: dobDate,
                        DOJ: dojDate,
                        documentation: row.documentation
                           ? String(row.documentation) === "1" ||
                             String(row.documentation).toLowerCase() === "true"
                           : true,
                        status: row.status
                           ? String(row.status) === "1" ||
                             String(row.status).toLowerCase() === "true"
                           : true,
                        employeeType: row.employeeType
                           ? String(row.employeeType).trim()
                           : undefined,
                     };
                     validEmployees.push(employee);
                  } else {
                     errors.push({
                        row: index + 2,
                        name: nameValue || "Unknown",
                        issues: rowErrors,
                     });
                  }
               });

               if (errors.length > 0) {
                  let errorMessage = `Found ${errors.length} error(s):\n\n`;
                  errors.slice(0, 5).forEach((error) => {
                     errorMessage += `Row ${error.row}: ${error.issues.join(
                        ", "
                     )}\n`;
                  });
                  if (errors.length > 5) {
                     errorMessage += `\n... and ${
                        errors.length - 5
                     } more error(s)`;
                  }
                  toast.error(errorMessage);
                  return;
               }

               const toastId = toast.loading(
                  `Uploading ${validEmployees.length} employee(s)...`
               );
               try {
                  await AxiosInstance.post(
                     "/employee/bulkinsert",
                     { employees: validEmployees },
                     { timeout: 60000 }
                  );
                  toast.update(toastId, {
                     render: `Successfully uploaded ${validEmployees.length} employee(s)`,
                     type: "success",
                     isLoading: false,
                     autoClose: 4000,
                  });
               } catch (uploadError) {
                  toast.update(toastId, {
                     render:
                        uploadError.response?.data?.message ||
                        "Failed to upload employees",
                     type: "error",
                     isLoading: false,
                     autoClose: 4000,
                  });
               }
            } catch (parseError) {
               toast.error("Failed to parse Excel file");
               console.error(parseError);
            }
         };
         reader.readAsBinaryString(file);
      } catch (error) {
         toast.error("Failed to read file");
         console.error(error);
      }
   };

   // === CANDIDATE FILE UPLOAD ===
   const handleCandidateFileUpload = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
         const reader = new FileReader();
         reader.onload = async (event) => {
            try {
               const workbook = XLSX.read(event.target?.result, {
                  type: "binary",
               });
               const sheetName = workbook.SheetNames[0];
               const worksheet = workbook.Sheets[sheetName];
               const rawData = XLSX.utils.sheet_to_json(worksheet);

               const errors = [];
               const validCandidates = [];

               rawData.forEach((row, index) => {
                  const rowErrors = [];

                  // Required: fullName - handle undefined, null, and number types
                  const fullNameValue = row.fullName
                     ? String(row.fullName).trim()
                     : "";
                  if (!fullNameValue) {
                     rowErrors.push("fullName is required");
                  }

                  // Required: mobile (validate each number)
                  const mobileValue = row.mobile
                     ? String(row.mobile).trim()
                     : "";
                  if (!mobileValue) {
                     rowErrors.push("mobile is required");
                  } else {
                     const mobiles = mobileValue
                        .split(",")
                        .map((m) => m.trim());
                     const invalidMobiles = mobiles.filter(
                        (m) => !/^[0-9]\d{9}$/.test(m)
                     );
                     if (invalidMobiles.length > 0) {
                        rowErrors.push(
                           `Invalid mobile: ${invalidMobiles.join(", ")}`
                        );
                     }
                  }

                  // Email validation (optional)
                  const emailValue = row.email ? String(row.email).trim() : "";
                  if (emailValue) {
                     const emails = emailValue.split(",").map((e) => e.trim());
                     const invalidEmails = emails.filter(
                        (e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
                     );
                     if (invalidEmails.length > 0) {
                        rowErrors.push(
                           `Invalid email: ${invalidEmails.join(", ")}`
                        );
                     }
                  }

                  // Parse qualifications: "B.Tech:2020|M.Tech:2022"
                  let qualifications = [];
                  const qualsValue = row.qualifications
                     ? String(row.qualifications).trim()
                     : "";
                  if (qualsValue) {
                     const quals = qualsValue.split("|");
                     qualifications = quals.map((q) => {
                        const [qualification, YOP] = q
                           .split(":")
                           .map((x) => x.trim());
                        return { qualification, YOP };
                     });
                  }

                  // Parse languages: "English:Fluent:Good|Hindi:Native:Native"
                  let languages = [];
                  const langsValue = row.languages
                     ? String(row.languages).trim()
                     : "";
                  if (langsValue) {
                     const langs = langsValue.split("|");
                     languages = langs.map((l) => {
                        const [language, remarks, level] = l
                           .split(":")
                           .map((x) => x.trim());
                        return { language, remarks, level: level || "Poor" };
                     });
                  }

                  // Parse skills: "Java,Python,React"
                  let skills = [];
                  const skillsValue = row.skills
                     ? String(row.skills).trim()
                     : "";
                  if (skillsValue) {
                     skills = skillsValue.split(",").map((s) => s.trim());
                  }

                  // Parse experience: "Company:Role:Salary:StartDate:EndDate:Years|..."
                  let experience = [];
                  const expValue = row.experience
                     ? String(row.experience).trim()
                     : "";
                  if (expValue) {
                     const exps = expValue.split("|");
                     experience = exps.map((exp) => {
                        const [
                           companyName,
                           role,
                           salary,
                           startDate,
                           endDate,
                           expYears,
                        ] = exp.split(":").map((x) => x.trim());
                        return {
                           companyName,
                           role,
                           salary,
                           startDate: new Date(startDate),
                           endDate: new Date(endDate),
                           experience: parseInt(expYears) || 0,
                        };
                     });
                  }

                  if (rowErrors.length === 0) {
                     const mobiles = mobileValue
                        .split(",")
                        .map((m) => m.trim());
                     const emails = emailValue
                        ? emailValue.split(",").map((e) => e.trim())
                        : [];

                     const candidate = {
                        fullName: fullNameValue,
                        mobile: mobiles,
                        email: emails.length > 0 ? emails : undefined,
                        candidateId: row.candidateId
                           ? String(row.candidateId).trim()
                           : undefined,
                        homeTown: row.homeTown
                           ? String(row.homeTown).trim()
                           : undefined,
                        currentCity: row.currentCity
                           ? String(row.currentCity).trim()
                           : undefined,
                        rate: row.rate ? parseInt(row.rate) : undefined,
                        qualifications:
                           qualifications.length > 0
                              ? qualifications
                              : undefined,
                        languages: languages.length > 0 ? languages : undefined,
                        skills: skills.length > 0 ? skills : undefined,
                        experience:
                           experience.length > 0 ? experience : undefined,
                        interviewDate: row.interviewDate
                           ? new Date(row.interviewDate)
                           : undefined,
                        interviewStatus: row.interviewStatus
                           ? String(row.interviewStatus).trim()
                           : undefined,
                        remarks: row.remarks
                           ? String(row.remarks).trim()
                           : undefined,
                        select: row.select
                           ? String(row.select).trim()
                           : undefined,
                        EMP_ID: row.EMP_ID
                           ? String(row.EMP_ID).trim()
                           : undefined,
                        onboardingDate: row.onboardingDate
                           ? new Date(row.onboardingDate)
                           : undefined,
                        nextTrackingDate: row.nextTrackingDate
                           ? new Date(row.nextTrackingDate)
                           : undefined,
                        billingDate: row.billingDate
                           ? new Date(row.billingDate)
                           : undefined,
                        invoiceDate: row.invoiceDate
                           ? new Date(row.invoiceDate)
                           : undefined,
                        invoiceNumber: row.invoiceNumber
                           ? String(row.invoiceNumber).trim()
                           : undefined,
                        l1Assessment: row.l1Assessment
                           ? String(row.l1Assessment).trim()
                           : undefined,
                        l2Assessment: row.l2Assessment
                           ? String(row.l2Assessment).trim()
                           : undefined,
                        source: row.source
                           ? String(row.source).trim()
                           : undefined,
                        tag: row.tag ? String(row.tag).trim() : undefined,
                        endTrackingDate: row.endTrackingDate
                           ? new Date(row.endTrackingDate)
                           : undefined,
                        createdOn: new Date(),
                        lastUpdatedOn: new Date(),
                        assignedOn: new Date()
                           ,
                        // l1StatDate: row.l1StatDate
                        //    ? new Date(row.l1StatDate)
                        //    : undefined,
                        // l2StatDate: row.l2StatDate
                        //    ? new Date(row.l2StatDate)
                        //    : undefined,
                        // interviewStatDate: row.interviewStatDate
                        //    ? new Date(row.interviewStatDate)
                        //    : undefined,
                        // tenureStatDate: row.tenureStatDate
                        //    ? new Date(row.tenureStatDate)
                        //    : undefined,
                        // selectDate: row.selectDate
                        //    ? new Date(row.selectDate)
                        //    : undefined,
                        // offerDropDate: row.offerDropDate
                        //    ? new Date(row.offerDropDate)
                        //    : undefined,
                        // nonTenureDate: row.nonTenureDate
                        //    ? new Date(row.nonTenureDate)
                        //    : undefined,
                        // invoiceCreditDate: row.invoiceCreditDate
                        //    ? new Date(row.invoiceCreditDate)
                        //    : undefined,
                        createdByEmployee: userid,
                        assignedEmployee: userid,
                     };
                     validCandidates.push(candidate);
                  } else {
                     errors.push({
                        row: index + 2,
                        candidate: fullNameValue || "Unknown",
                        issues: rowErrors,
                     });
                  }
               });

               if (errors.length > 0) {
                  let errorMessage = `Found ${errors.length} error(s):\n\n`;
                  errors.slice(0, 5).forEach((error) => {
                     errorMessage += `Row ${error.row}: ${error.issues.join(
                        ", "
                     )}\n`;
                  });
                  if (errors.length > 5) {
                     errorMessage += `\n... and ${
                        errors.length - 5
                     } more error(s)`;
                  }
                  toast.error(errorMessage);
                  return;
               }

               const toastId = toast.loading(
                  `Uploading ${validCandidates.length} candidate(s)...`
               );
               try {
                  await AxiosInstance.post(
                     "/candidate/bulkinsert",
                     { candidates: validCandidates },
                     { timeout: 60000 }
                  );
                  toast.update(toastId, {
                     render: `Successfully uploaded ${validCandidates.length} candidate(s)`,
                     type: "success",
                     isLoading: false,
                     autoClose: 4000,
                  });
               } catch (uploadError) {
                  toast.update(toastId, {
                     render:
                        uploadError.response?.data?.message ||
                        "Failed to upload candidates",
                     type: "error",
                     isLoading: false,
                     autoClose: 4000,
                  });
               }
            } catch (parseError) {
               toast.error("Failed to parse Excel file");
               console.error(parseError);
            }
         };
         reader.readAsBinaryString(file);
      } catch (error) {
         toast.error("Failed to read file");
         console.error(error);
      }
   };

   // CARD STYLE
   const cardsStyle = {
      background: "rgba(255, 255, 255, 0.05)", // subtle glass look
      backdropFilter: "blur(5px)", // smoother blur
      color: "white",
      borderRadius: "20px",
      borderLeftStyle: "solid",
      borderLeftWidth: "0.5vw",
      boxShadow: "0 8px 20px rgba(0,0,0,0.25)", // soft shadow
      transition: "all 0.3s ease",
      "&:hover": {
         transform: "translateY(-5px) scale(1.02)", // lift effect
         boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
         background: "rgba(255, 255, 255, 0.1)", // brighten on hover
         borderColor: "#FFF700",
         borderLeftWidth: "1vh",
      },
   };
   // const cardsStyle = {
   //    backgroundColor: "transparent",
   //    backdropFilter: "blur(70px)",
   //    color: "white",
   //    borderRadius: "20px",
   //    borderLeftStyle: "solid",
   //    borderLeftWidth: "0.5vh",
   //    height: "100%",
   //    display: "flex",
   //    flexDirection: "column",
   //    justifyContent: "space-between",
   // };

   return (
      <Container
         disableGutters
         maxWidth="xl"
         sx={{
            paddingTop: { xs: "12vh", md: "20vh" },
            paddingBottom: "4vh",
            px: { xs: 2, sm: 4, md: 6 },
         }}
      >
         <Grid container spacing={3}>
            {/* COMPANY BULK */}
            <Grid item xs={12} md={6} lg={3}>
               <Card sx={{ ...cardsStyle, borderLeftColor: "#00FFFF" }}>
                  <Box>
                     <CardContent sx={{ pb: 1 }}>
                        <Typography
                           variant="h6"
                           fontWeight="light"
                           textAlign="center"
                           letterSpacing={4}
                        >
                           COMPANY
                        </Typography>
                     </CardContent>
                  </Box>
                  <Box
                     flexGrow={1}
                     display="flex"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <CardContent sx={{ width: "100%" }}>
                        <Button
                           fullWidth
                           size="large"
                           sx={{
                              backgroundColor: alpha("#0000FF", 0.5),
                              mb: 2,
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
                           excelData={[
                              {
                                 companyName: "TechCorp Industries",
                                 companyId: "COMP001",
                                 HRName: "Rajesh Kumar|Priya Sharma",
                                 HRMobile: "9876543210,8765432109|9123456789",
                                 HREmail:
                                    "rajesh@techcorp.com|priya@techcorp.com",
                                 HRDesignation1: "HR Manager|HR Lead",
                                 HRLocation1: "Mumbai|Bangalore",
                                 about: "Leading IT solutions company",
                                 companyType: "IT Services",
                                 remarks: "Preferred vendor",
                                 response: "Active",
                                 empanelled: "TRUE",
                                 paymentTerms: 30,
                              },
                              {
                                 companyName: "Global Solutions Ltd",
                                 companyId: "COMP002",
                                 HRName: "Amit Patel",
                                 HRMobile: "8899776655",
                                 HREmail: "amit@globalsol.com",
                                 HRDesignation1: "HR Executive",
                                 HRLocation1: "Delhi",
                                 about: "Consulting and staffing services",
                                 companyType: "Staffing",
                                 remarks: "New partner",
                                 response: "Interested",
                                 empanelled: "FALSE",
                                 paymentTerms: 45,
                              },
                           ]}
                           fileName={"Company Template"}
                           buttonName={"Bulk Template"}
                        />
                     </CardContent>
                  </Box>
               </Card>
            </Grid>

            {/* EMPLOYEE BULK */}
            <Grid item xs={12} md={6} lg={3}>
               <Card sx={{ ...cardsStyle, borderLeftColor: "#00FF00" }}>
                  <Box>
                     <CardContent sx={{ pb: 1 }}>
                        <Typography
                           variant="h6"
                           fontWeight="light"
                           textAlign="center"
                           letterSpacing={4}
                        >
                           EMPLOYEE
                        </Typography>
                     </CardContent>
                  </Box>
                  <Box
                     flexGrow={1}
                     display="flex"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <CardContent sx={{ width: "100%" }}>
                        <Button
                           fullWidth
                           size="large"
                           sx={{
                              backgroundColor: alpha("#0000FF", 0.5),
                              mb: 2,
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
                           excelData={[
                              {
                                 name: "Vikram Singh",
                                 email: "vikram@company.com",
                                 mobile: "9876543210,8765432109",
                                 parentMobile: "9123456789",
                                 gender: "Male",
                                 currentAddress: "Mumbai, Maharashtra",
                                 permanentAddress: "Delhi, NCR",
                                 DOB: "1995-05-15",
                                 DOJ: "2023-01-10",
                                 documentation: "1",
                                 status: "1",
                                 employeeType: "Recruiter",
                              },
                              {
                                 name: "Neha Gupta",
                                 email: "neha@company.com",
                                 mobile: "8899776655",
                                 parentMobile: "8765432109",
                                 gender: "Female",
                                 currentAddress: "Bangalore, Karnataka",
                                 permanentAddress: "Pune, Maharashtra",
                                 DOB: "1993-08-22",
                                 DOJ: "2023-06-15",
                                 documentation: "1",
                                 status: "1",
                                 employeeType: "Admin",
                              },
                           ]}
                           fileName={"Employee Template"}
                           buttonName={"Bulk Template"}
                        />
                     </CardContent>
                  </Box>
               </Card>
            </Grid>

            {/* CANDIDATE BULK */}
            <Grid item xs={12} md={6} lg={3}>
               <Card sx={{ ...cardsStyle, borderLeftColor: "#FF5C00" }}>
                  <Box>
                     <CardContent sx={{ pb: 1 }}>
                        <Typography
                           variant="h6"
                           fontWeight="light"
                           textAlign="center"
                           letterSpacing={4}
                        >
                           CANDIDATE
                        </Typography>
                     </CardContent>
                  </Box>
                  <Box
                     flexGrow={1}
                     display="flex"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <CardContent sx={{ width: "100%" }}>
                        <Button
                           fullWidth
                           size="large"
                           sx={{
                              backgroundColor: alpha("#0000FF", 0.5),
                              mb: 2,
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
                           excelData={[
                              {
                                 fullName: "Arjun Sharma",
                                 mobile: "9876543210,9123456789",
                                 email: "arjun@email.com,arjun.sharma@mail.com",
                                 candidateId: "CD001",
                                 homeTown: "Mumbai",
                                 currentCity: "Bangalore",
                                 rate: "65000",
                                 skills: "Java,Spring Boot,SQL,Docker",
                                 qualifications: "B.Tech:2020|M.Tech:2022",
                                 languages:
                                    "English:Fluent:Good|Hindi:Native:Native",
                                 experience:
                                    "ABC Corp:Senior Developer:70000:2018-01-15:2021-06-30:3|XYZ Ltd:Developer:60000:2021-07-01:2023-12-31:2",
                                 interviewDate: "2024-01-15",
                                 interviewStatus: "Selected",
                                 onboardingDate: "2024-02-01",
                                 nextTrackingDate: "2024-03-15",
                                 billingDate: "2024-03-01",
                                 invoiceDate: "2024-03-05",
                                 remarks:
                                    "Strong technical background, quick learner",
                                 select: "Yes",
                                 EMP_ID: "EMP001",
                                 invoiceNumber: "INV-2024-001",
                                 l1Assessment: "Pass",
                                 l2Assessment: "Pass",
                                 source: "LinkedIn",
                                 tag: "Active",

                                 
                              },
                              {
                                 fullName: "Priya Menon",
                                 mobile: "8765432109",
                                 email: "priya@email.com",
                                 candidateId: "CD002",
                                 homeTown: "Delhi",
                                 currentCity: "Gurgaon",
                                 rate: "45000",
                                 skills: "JavaScript,React,Node.js,MongoDB",
                                 qualifications: "BCA:2021",
                                 languages:
                                    "English:Professional:Good|Tamil:Native:Native",
                                 experience:
                                    "Tech Startup:Full Stack Developer:55000:2022-03-01:2024-01-31:1",
                                 interviewDate: "2024-01-20",
                                 interviewStatus: "Pending",
                                 onboardingDate: "2024-02-10",
                                 nextTrackingDate: "2024-03-20",
                                 billingDate: "2024-03-05",
                                 invoiceDate: "2024-03-10",
                                 remarks:
                                    "Good problem-solving, fresh graduate",
                                 select: "No",
                                 EMP_ID: "EMP002",
                                 invoiceNumber: "INV-2024-002",
                                 l1Assessment: "Pass",
                                 l2Assessment: "Pending",
                                 source: "Indeed",
                                 tag: "Promising",
                                 
                              },
                           ]}
                           fileName={"Candidate Template"}
                           buttonName={"Bulk Template"}
                        />
                     </CardContent>
                  </Box>
               </Card>
            </Grid>

            {/* COMPANY ROLE BULK */}
            <Grid item xs={12} md={6} lg={3}>
               <Card sx={{ ...cardsStyle, borderLeftColor: "#FF0000" }}>
                  <Box>
                     <CardContent sx={{ pb: 1 }}>
                        <Typography
                           variant="h6"
                           fontWeight="light"
                           textAlign="center"
                           letterSpacing={4}
                        >
                           COMPANY ROLE
                        </Typography>
                     </CardContent>
                  </Box>
                  <Box
                     flexGrow={1}
                     display="flex"
                     alignItems="center"
                     justifyContent="center"
                  >
                     <CardContent sx={{ width: "100%" }}>
                        <Button
                           fullWidth
                           size="large"
                           sx={{
                              backgroundColor: alpha("#0000FF", 0.5),
                              mb: 2,
                           }}
                           variant="contained"
                           component="label"
                           disabled
                           tabIndex={-1}
                           startIcon={<CloudUploadIcon />}
                        >
                           Bulk Upload
                        </Button>
                        <ExcelExport
                           excelData={[{ name: "", mobile: "", email: "" }]}
                           fileName={"Role Template"}
                           buttonName={"Bulk Template"}
                           disabled
                        />
                     </CardContent>
                  </Box>
               </Card>
            </Grid>
         </Grid>
      </Container>
   );
}
