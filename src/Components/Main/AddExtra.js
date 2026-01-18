import React from "react";
import {
   Card,
   Container,
   Grid,
   CardContent,
   BottomNavigation,
   CardHeader,
   Button,
   alpha,
   TextField,
   Alert,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AxiosInstance from "./AxiosInstance";

export default function AddExtras() {
   // STATES HANDLING AND VARIABLES
   const [locationList, setLocationList] = React.useState([]);
   const [qualificationList, setQualificationList] = React.useState([]);
   const [warning, setWarning] = React.useState("");
   const [languageList, setLanguageList] = React.useState([]);
   const [final, setFinal] = React.useState({
      location: [],
      language: [],
      qualification: [],
      languageLevel: [],
      assessment: [],
      interviewStatus: [],
      select: [],
   });

   // FUNCTIONS HANDLING AND API POST CALLS
   React.useEffect(() => {
      const fetchData = async () => {
         try {
            const extraRes = await AxiosInstance.get("/extra/all");
            extraRes.data.forEach(({ _id, data }) => {
               if (_id === "Locations") setLocationList(data);
               else if (_id === "Qualifications") setQualificationList(data);
               else if (_id === "Languages") setLanguageList(data);
            });
         } catch (error) {}
      };
      fetchData();
   }, []);

   const resetFinal = () =>
      setFinal({
         location: [],
         language: [],
         qualification: [],
         languageLevel: [],
         assessment: [],
         interviewStatus: [],
         select: [],
      });

   const handleLocation = async () => {
      try {
         const locationdata = await AxiosInstance.patch("/extra/locations", {
            data: [...new Set([...final.location, ...locationList])],
         });
         resetFinal();
         setWarning("Location List Updated Successfully");
         setLocationList(locationdata.data.data);
      } catch (error) {}
   };

   const handleLanguage = async () => {
      try {
         const langdata = await AxiosInstance.patch("/extra/languages", {
            data: [...new Set([...final.language, ...languageList])],
         });
         resetFinal();
         setWarning("Language List Updated Successfully");
         setLanguageList(langdata.data.data);
      } catch (error) {}
   };

   const handleQualification = async () => {
      try {
         const qualdata = await AxiosInstance.patch("/extra/qualifications", {
            data: [...new Set([...final.qualification, ...qualificationList])],
         });
         resetFinal();
         setWarning("Qualification List Updated Successfully");
         setQualificationList(qualdata.data.data);
      } catch (error) {}
   };

   // COMMON BUTTON STYLE
   const buttonStyle = {
      height: "100%",
      backgroundColor: alpha("#0000FF", 0.6),
      fontWeight: "bold",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      "&:hover": {
         backgroundColor: alpha("#0000FF", 0.8),
         transform: "translateY(-2px)",
         boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
      },
   };

   return (
      <Container sx={{ pt: "9.5vh", pb: "2vh", width: { xs: "100%", md: "96%" } }}>
         <Card
            sx={{
               borderRadius: "20px",
               background: "rgba(255,255,255,0.08)",
               backdropFilter: "blur(12px)",
               boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
               overflow: "hidden",
            }}
         >
            <CardHeader
               sx={{
                  backgroundColor: alpha("#0B0B0B", 0.6),
                  backdropFilter: "blur(6px)",
                  height: { xs: "auto", md: "7.5vh" },
                  color: "white",
                  textAlign: "center",
                  py: { xs: 2, md: 0 },
               }}
               title="ADD EXTRAS"
               titleTypographyProps={{
                  sx: {
                     fontSize: { xs: "2.2vh", md: "2.8vh" },
                     letterSpacing: "5px",
                     fontWeight: "light",
                  },
               }}
            />
            <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.7), p: { xs: 2, md: 3 } }}>
               <Grid container spacing={2}>
                  {/* Location */}
                  <Grid item xs={12} md={9}>
                     <Autocomplete
                        multiple
                        freeSolo
                        options={locationList}
                        getOptionLabel={(option) => option}
                        value={final.location}
                        onChange={(e, v) => setFinal({ ...final, location: v })}
                        renderInput={(params) => (
                           <TextField {...params} label="Location" variant="outlined" />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} md={3}>
                     <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={buttonStyle}
                        endIcon={<ControlPointIcon />}
                        onClick={handleLocation}
                     >
                        ADD
                     </Button>
                  </Grid>

                  {/* Language */}
                  <Grid item xs={12} md={9}>
                     <Autocomplete
                        multiple
                        freeSolo
                        options={languageList}
                        getOptionLabel={(option) => option}
                        value={final.language}
                        onChange={(e, v) => setFinal({ ...final, language: v })}
                        renderInput={(params) => (
                           <TextField {...params} label="Language" variant="outlined" />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} md={3}>
                     <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={buttonStyle}
                        endIcon={<ControlPointIcon />}
                        onClick={handleLanguage}
                     >
                        ADD
                     </Button>
                  </Grid>

                  {/* Qualification */}
                  <Grid item xs={12} md={9}>
                     <Autocomplete
                        multiple
                        freeSolo
                        options={qualificationList}
                        getOptionLabel={(option) => option}
                        value={final.qualification}
                        onChange={(e, v) =>
                           setFinal({ ...final, qualification: v })
                        }
                        renderInput={(params) => (
                           <TextField {...params} label="Qualification" variant="outlined" />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} md={3}>
                     <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={buttonStyle}
                        endIcon={<ControlPointIcon />}
                        onClick={handleQualification}
                     >
                        ADD
                     </Button>
                  </Grid>

                  {/* Alert */}
                  {warning && (
                     <Grid item xs={12}>
                        <Alert
                           severity="success"
                           sx={{
                              borderRadius: "12px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                           }}
                           onClose={() => setWarning("")}
                        >
                           {warning}
                        </Alert>
                     </Grid>
                  )}
               </Grid>
            </CardContent>
            <BottomNavigation
               sx={{
                  backgroundColor: alpha("#0B0B0B", 0.5),
                  backdropFilter: "blur(6px)",
                  height: "7vh",
               }}
            />
         </Card>
      </Container>
   );
}