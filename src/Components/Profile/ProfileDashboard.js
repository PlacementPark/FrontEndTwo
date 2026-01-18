import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AxiosInstance from "../Main/AxiosInstance";
import "../../App.css";

export default function ProfileDashboard() {
   const navigate = useNavigate();
   const { employeeType } = useSelector((state) => state.user);
   const access = !["Recruiter", "Teamlead", "Intern"].includes(employeeType);
   const AssignAccess = ["Teamlead", "Admin", "Manager"].includes(employeeType);
   const [counts, setCounts] = React.useState(null);

   React.useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await AxiosInstance.get("/candidate/values/counts");
            setCounts(res.data);
         } catch (error) {
            console.log(error);
         }
      };
      fetchData();
   }, []);

   // Compact card style
   const cardsStyle = {
      height: "13vh",
      backgroundColor: "transparent",
      backdropFilter: "blur(70px)",
      color: "white",
      borderRadius: "16px",
      borderLeftStyle: "solid",
      borderLeftWidth: "0.4vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start", // 👈 aligns content to left
      paddingLeft: "0.8rem", // some spacing from border
      paddingTop: "4vh",
      boxShadow: "0 8px 20px rgba(0,0,0,0.25)", // soft shadow
      transition: "all 0.5s ease",
      cursor: "pointer",
      "&:hover": {
         transform: "translateY(-5px) scale(1.06)", // lift effect
         boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
         background: "rgba(255, 255, 255, 0.1)", // brighten on hover
         color: "#00FFEF",
         borderColor: "#FFF700",
         borderLeftWidth: "1vh",
         letterSpacing: "0.5vh",
      },
   };

   return (
      <div
         style={{ paddingLeft: "1vw", paddingRight: "1vw", paddingTop: "3vh" }}
      >
         {/* Top Buttons */}
         <Box sx={{ px: "1vw", paddingBottom: "0.8vh" }}>
            <Grid container spacing={1} sx={{ pt: "6vh" }}>
               <Grid item xs={6} md={3}>
                  <div
                     className="dbButton"
                     onClick={() => navigate("AddCandidate")}
                  >
                     <Typography
                        variant="subtitle2"
                        color="white"
                        fontWeight="light"
                        letterSpacing={2.5}
                        sx={{
                           fontSize: {
                              xs: "0.7rem",
                              sm: "0.8rem",
                              md: "0.9rem",
                           },
                           textAlign: "center",
                           whiteSpace: "normal",
                           lineHeight: 1.2,
                        }}
                     >
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
                     <Typography
                        variant="subtitle2"
                        color="white"
                        fontWeight="light"
                        letterSpacing={2.5}
                        sx={{
                           fontSize: {
                              xs: "0.7rem",
                              sm: "0.8rem",
                              md: "0.9rem",
                           },
                           textAlign: "center",
                           whiteSpace: "normal",
                           lineHeight: 1.2,
                        }}
                     >
                        SEARCH PROFILE
                     </Typography>
                  </div>
               </Grid>

               {AssignAccess && (
                  <Grid
                     item
                     xs={6}
                     md={3}
                     onClick={() => navigate("AssignCandidate")}
                  >
                     <div className="dbButton">
                        <Typography
                           variant="subtitle2"
                           color="white"
                           fontWeight="light"
                           letterSpacing={2.5}
                           sx={{
                              fontSize: {
                                 xs: "0.7rem",
                                 sm: "0.8rem",
                                 md: "0.9rem",
                              },
                              textAlign: "center",
                              whiteSpace: "normal",
                              lineHeight: 1.2,
                           }}
                        >
                           ASSIGN PROFILE
                        </Typography>
                     </div>
                  </Grid>
               )}
               {access && (
                  <Grid
                     item
                     xs={6}
                     md={3}
                     onClick={() => navigate("PotentialLeads")}
                  >
                     <div className="dbButton">
                        <Typography
                           variant="subtitle2"
                           color="white"
                           fontWeight="light"
                           letterSpacing={2.5}
                           sx={{
                              fontSize: {
                                 xs: "0.7rem",
                                 sm: "0.8rem",
                                 md: "0.9rem",
                              },
                              textAlign: "center",
                              whiteSpace: "normal",
                              lineHeight: 1.2,
                           }}
                        >
                           POTENTIAL LEADS
                        </Typography>
                     </div>
                  </Grid>
               )}
            </Grid>
         </Box>

         {/* Candidate Status Cards */}
         <Grid
            container
            columnSpacing={1.5}
            rowSpacing={1.5}
            sx={{ paddingTop: "1.5vh", paddingBottom: "1.5vh" }}
         >
            {[
               { label: "ALL CANDIDATES", color: "#FF5C00", key: "all" },
               {
                  label: "NEW CANDIDATES",
                  color: "#FF0000",
                  key: "newCandidates",
               },
               { label: "L1 WD", color: "#00FF00", key: "L1WD" },
               { label: "L2 WD", color: "#00FFFF", key: "L2WD" },
               { label: "L2 AWAITING", color: "#FF00FF", key: "Awaiting" },
               { label: "L2 DND", color: "#FF5C00", key: "L2DND" },
               { label: "NO SHOW WALK-IN", color: "#FF0000", key: "NSWI" },
               { label: "NO SHOW IC", color: "#00FF00", key: "NSIC" },
               {
                  label: "INTERVIEW SCHEDULED",
                  color: "#00FFFF",
                  key: "VirtualInterview",
               },
               {
                  label: "INTERVIEW IN-PROCESS",
                  color: "#FF00FF",
                  key: "InterviewScheduled",
               },
               {
                  label: "AWAITING JOINING",
                  color: "#FF5C00",
                  key: "AwaitingJoining",
               },
               { label: "OFFER DROP", color: "#FF0000", key: "OfferDrop" },
               {
                  label: "TRACKING TENURE",
                  color: "#00FF00",
                  key: "TrackingTenure",
               },
               { label: "N2B", color: "#00FFFF", key: "N2B" },
               {
                  label: "INVOICE PROCESSED",
                  color: "#FF00FF",
                  key: "InvoiceProcessed",
               },
               { label: "BILLED", color: "#FF5C00", key: "Billed" },
               { label: "NON TENURE", color: "#FF0000", key: "NonTenure" },
               { label: "HOLD", color: "#00FF00", key: "Hold" },
               { label: "REJECTS", color: "#00FFFF", key: "Rejects" },
               { label: "NON LEADS", color: "#FF00FF", key: "NonLeads" },
               {
                  label: "PROCESS RAMPDOWN",
                  color: "#FF5C00",
                  key: "ProcessRampdown",
               },
               {
                  label: "CLIENT RAMPDOWN",
                  color: "#FF0000",
                  key: "ClientRampdown",
               },
               {
                  label: "L1 & L2 WRONG NUMBERS",
                  color: "#00FF00",
                  key: "L1L2WrongNumbers",
               },
               {
                  label: "BLACKLIST",
                  color: "#00FFFF",
                  key: "Blacklist",
               },
               {
                  label: "BUSINESS TRACKING",
                  color: "#FF00FF",
                  key: "BusinessTracking",
               },
            ].map((card, idx) => (
               <Grid item xs={6} sm={4} md={12 / 5} key={idx}>
                  <Card
                     //className="cardsStyle"
                     sx={{ ...cardsStyle, borderLeftColor: card.color }}
                     onClick={() => navigate(`/CandidateGrid?type=${card.key}`)}
                  >
                     <Box>
                        <CardContent sx={{ py: 0 }}>
                           <Typography
                              variant="subtitle2"
                              fontWeight="light"
                              sx={{
                                 fontSize: {
                                    xs: "0.9rem",
                                    sm: "0.85rem",
                                    md: "1rem",
                                 },
                                 whiteSpace: "normal",
                                 overflowWrap: "break-word",
                                 lineHeight: 1.2,
                                 textAlign: "left",
                              }}
                           >
                              {card.label}
                           </Typography>
                        </CardContent>
                     </Box>
                     <Box>
                        <CardContent sx={{ py: 0 }}>
                           <Typography
                              variant="h6"
                              sx={{
                                 fontSize: {
                                    xs: "1.15rem",
                                    sm: "1.35rem",
                                    md: "1.49rem",
                                 },
                                 textAlign: "left",
                                 fontWeight: "bold",
                              }}
                           >
                              {counts && counts[card.key]
                                 ? counts[card.key]
                                 : 0}
                           </Typography>
                        </CardContent>
                     </Box>
                  </Card>
               </Grid>
            ))}
         </Grid>
      </div>
   );
}
