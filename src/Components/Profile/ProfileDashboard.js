import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProfileDashboard() {
   // STATES HANDLING AND VARIABLES
   const navigate = useNavigate();
   const { employeeType } = useSelector((state) => state.user);
   const access = !["Recruiter", "Teamlead", "Intern"].includes(employeeType);
   const [counts, setCounts] = React.useState(null);

   // API CALLS HANDLING
   React.useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await axios.get(
               "https://tpp-backend-eura.onrender.com/api/v1/candidate/values/counts",
               {
                  headers: {
                     authorization: JSON.parse(localStorage.getItem("user"))
                        .token,
                  },
               }
            );

            setCounts(res.data);
         } catch (error) {
            console.log(error);
         }
      };
      fetchData();
   }, []);

   //CARDS INLINE CSS
   const cardsStyle = {
      height: "14.5vh",
      backgroundColor: "transparent",
      backdropFilter: "blur(70px)",
      color: "white",
      borderRadius: "20px",
      borderLeftStyle: "solid",
      borderLeftWidth: "0.5vh",
   };

   // JSX CODE
   return (
      <>
         <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }}>
            <Grid container spacing={2} sx={{ paddingTop: "9vh" }}>
               <Grid item xs={6} md={3}>
                  <div
                     className="dbButton"
                     onClick={() => navigate("AddCandidate")}
                  >
                     <Typography variant="h7" color="white" fontWeight="bold">
                        ADD CANDIDATE
                     </Typography>
                  </div>
               </Grid>
               <Grid
                  item
                  xs={6}
                  md={3}
                  onClick={() => navigate("SearchProfile")}
               >
                  <div className="dbButton">
                     <Typography variant="h7" color="white" fontWeight="bold">
                        SEARCH PROFILE
                     </Typography>
                  </div>
               </Grid>
               {access && (
                  <>
                     <Grid
                        item
                        xs={6}
                        md={3}
                        onClick={() => navigate("AssignCandidate")}
                     >
                        <div className="dbButton">
                           <Typography
                              variant="h7"
                              color="white"
                              fontWeight="bold"
                           >
                              ASSIGN PROFILE
                           </Typography>
                        </div>
                     </Grid>
                     <Grid
                        item
                        xs={6}
                        md={3}
                        onClick={() => navigate("PotentialLeads")}
                     >
                        <div className="dbButton">
                           <Typography
                              variant="h7"
                              color="white"
                              fontWeight="bold"
                           >
                              POTENTIAL LEADS
                           </Typography>
                        </div>
                     </Grid>
                  </>
               )}
            </Grid>
            {/* Lower Grid Data Cards */}
            <Grid
               container
               columnSpacing={2}
               rowSpacing={1}
               sx={{ paddingTop: "2vh", paddingBottom: "2vh" }}
            >
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF5C00" }}
                     onClick={() => navigate("/CandidateGrid?type=all")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              ALL CANDIDATES
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["all"] ? counts["all"] : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF0000" }}
                     onClick={() =>
                        navigate("/CandidateGrid?type=newCandidates")
                     }
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              NEW CANDIDATES
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["newCandidates"]
                                 ? counts["newCandidates"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#00FF00" }}
                     onClick={() => navigate("/CandidateGrid?type=L1WD")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              L1 WD
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["L1WD"] ? counts["L1WD"] : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#00FFFF" }}
                     onClick={() => navigate("/CandidateGrid?type=L2WD")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              L2 WD
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["L2WD"] ? counts["L2WD"] : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF00FF" }}
                     onClick={() => navigate("/CandidateGrid?type=Awaiting")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              L2 AWAITING
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["Awaiting"]
                                 ? counts["Awaiting"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF5C00" }}
                     onClick={() => navigate("/CandidateGrid?type=L2DND")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              L2 DND
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["L2DND"] ? counts["L2DND"] : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF0000" }}
                     onClick={() => navigate("/CandidateGrid?type=NSWI")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              NO SHOW WALK-IN
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["NSWI"] ? counts["NSWI"] : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#00FF00" }}
                     onClick={() => navigate("/CandidateGrid?type=NSIC")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              NO SHOW IC
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["NSIC"] ? counts["NSIC"] : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#00FFFF" }}
                     onClick={() =>
                        navigate("/CandidateGrid?type=VirtualInterview")
                     }
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              INTERVIEW SCHEDULED
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["VirtualInterview"]
                                 ? counts["VirtualInterview"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF00FF" }}
                     onClick={() =>
                        navigate("/CandidateGrid?type=InterviewScheduled")
                     }
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              INTERVIEW IN-PROCESS
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["InterviewScheduled"]
                                 ? counts["InterviewScheduled"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF5C00" }}
                     onClick={() =>
                        navigate("/CandidateGrid?type=AwaitingJoining")
                     }
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              AWAITING JOINING
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["AwaitingJoining"]
                                 ? counts["AwaitingJoining"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF0000" }}
                     onClick={() => navigate("/CandidateGrid?type=OfferDrop")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              OFFER DROP
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["OfferDrop"]
                                 ? counts["OfferDrop"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#00FF00" }}
                     onClick={() =>
                        navigate("/CandidateGrid?type=TrackingTenure")
                     }
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              TRACKING TENURE
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["TrackingTenure"]
                                 ? counts["TrackingTenure"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#00FFFF" }}
                     onClick={() => navigate("/CandidateGrid?type=N2B")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              N2B
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["N2B"] ? counts["N2B"] : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF00FF" }}
                     onClick={() =>
                        navigate("/CandidateGrid?type=InvoiceProcessed")
                     }
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              INVOICE PROCESSED
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["InvoiceProcessed"]
                                 ? counts["InvoiceProcessed"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF5C00" }}
                     onClick={() => navigate("/CandidateGrid?type=Billed")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              BILLED
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["Billed"]
                                 ? counts["Billed"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF0000" }}
                     onClick={() => navigate("/CandidateGrid?type=NonTenure")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              NON TENURE
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["NonTenure"]
                                 ? counts["NonTenure"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#00FF00" }}
                     onClick={() => navigate("/CandidateGrid?type=Hold")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              HOLD
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["Hold"] ? counts["Hold"] : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#00FFFF" }}
                     onClick={() => navigate("/CandidateGrid?type=Rejects")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              REJECTS
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["Rejects"]
                                 ? counts["Rejects"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF00FF" }}
                     onClick={() => navigate("/CandidateGrid?type=NonLeads")}
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              NON LEADS
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["NonLeads"]
                                 ? counts["NonLeads"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF5C00" }}
                     onClick={() =>
                        navigate("/CandidateGrid?type=ProcessRampdown")
                     }
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              PROCESS RAMPDOWN
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["ProcessRampdown"]
                                 ? counts["ProcessRampdown"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF0000" }}
                     onClick={() =>
                        navigate("/CandidateGrid?type=ClientRampdown")
                     }
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              CLIENT RAMPDOWN
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["ClientRampdown"]
                                 ? counts["ClientRampdown"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#00FF00" }}
                     onClick={() =>
                        navigate("/CandidateGrid?type=L1L2WrongNumbers")
                     }
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              L1 & L2 WRONG NUMBERS
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["L1L2WrongNumbers"]
                                 ? counts["L1L2WrongNumbers"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#00FFFF" }}
                     onClick={() =>
                        navigate("/CandidateGrid?type=L1L2Blacklist")
                     }
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              L1 & L2 BLACKLIST
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["L1L2Blacklist"]
                                 ? counts["L1L2Blacklist"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={6} sm={4} md={12 / 5}>
                  <Card
                     sx={{ ...cardsStyle, borderLeftColor: "#FF00FF" }}
                     onClick={() =>
                        navigate("/CandidateGrid?type=BusinessTracking")
                     }
                  >
                     <Box>
                        <CardContent sx={{ maxHeight: "5vh" }}>
                           <Typography variant="h7" fontWeight="bold">
                              BUSINESS TRACKING
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent>
                           <Typography variant="h5">
                              {counts && counts["BusinessTracking"]
                                 ? counts["BusinessTracking"]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
            </Grid>
         </div>
      </>
   );
}
