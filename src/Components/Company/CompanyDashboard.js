import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../Main/AxiosInstance";
import { useSelector } from "react-redux";
export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const { employeeType } = useSelector((state) => state.user);
  const access = employeeType ==="Recruiter";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AxiosInstance.get("/company/counts");
        if (!res) console.log("Something went wrong");

        const c = {};
        res.data.data.forEach((response) => {
          c[response._id] = response.count;
        });
        setCounts(c);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Optimized card style
  const cardsStyle = {
    minHeight: "9vh",
    maxHeight: "13vh",
    backgroundColor: "transparent",
    backdropFilter: "blur(70px)",
    color: "white",
    borderRadius: "16px",
    borderLeftStyle: "solid",
    borderLeftWidth: "0.4vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "1rem 1.2rem",
    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    transition: "all 0.4s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-6px) scale(1.04)",
      boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
      background: "rgba(255, 255, 255, 0.1)",
      color: "#00FFEF",
      borderColor: "#FFF700",
      borderLeftWidth: "0.7vh",
      letterSpacing: "0.2vh",
    },
  };

  const cardItems = access
     ? [
          {
             label: "EMPANELLED",
             color: "#FF00FF",
             path: "/CompanyGrid?companyType=Empanelled",
             count: counts["Empanelled"] || 0,
          },
       ]
     : [
          {
             label: "ALL COMPANIES",
             color: "#00FFFF",
             path: "/CompanyGrid",
             count: Object.values(counts).reduce((a, b) => a + b, 0),
          },
          {
             label: "EMPANELLED",
             color: "#FF00FF",
             path: "/CompanyGrid?companyType=Empanelled",
             count: counts["Empanelled"] || 0,
          },
          {
             label: "NEED TO APPROACH",
             color: "#FF5C00",
             path: "/CompanyGrid?companyType=Need to Approach",
             count: counts["Need to Approach"] || 0,
          },
          {
             label: "IN PROCESS",
             color: "#FF0000",
             path: "/CompanyGrid?companyType=In Process",
             count: counts["In Process"] || 0,
          },
          {
             label: "FUTURE",
             color: "#00FF00",
             path: "/CompanyGrid?companyType=Future",
             count: counts["Future"] || 0,
          },
          {
             label: "NOT INTERESTED",
             color: "#00FFFF",
             path: "/CompanyGrid?companyType=Not Intrested",
             count: counts["Not Intrested"] || 0,
          },
          {
             label: "REJECTED",
             color: "#FF00FF",
             path: "/CompanyGrid?companyType=Rejected",
             count: counts["Rejected"] || 0,
          },
          {
             label: "NO RESPONSE",
             color: "#FF5C00",
             path: "/CompanyGrid?companyType=No Response",
             count: counts["No Response"] || 0,
          },
       ];

  return (
     <Box
        sx={{
           paddingTop: "10vh",
           paddingX: { xs: "5%", md: "20%" },
           paddingBottom: "3vh",
        }}
     >
        {/* Add Company Button */}
        <Grid container spacing={1} justifyContent="center">
           <Grid item xs={6}>
              <div
                 className="dbButton"
                 onClick={() => navigate("/addcompany")}
                 style={{ textAlign: "center", marginBottom: "3vh" }}
              >
                 <Typography
                    variant="subtitle2"
                    color="white"
                    fontWeight="light"
                    letterSpacing={2.5}
                    sx={{
                       fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                       textAlign: "center",
                       whiteSpace: "normal",
                       lineHeight: 1.2,
                    }}
                 >
                    ADD COMPANY
                 </Typography>
              </div>
           </Grid>
           <Grid item xs={6} onClick={() => navigate("/searchcompany")}>
              <div className="dbButton">
                 <Typography
                    variant="subtitle2"
                    color="white"
                    fontWeight="light"
                    letterSpacing={2.5}
                    sx={{
                       fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                       textAlign: "center",
                       whiteSpace: "normal",
                       lineHeight: 1.2,
                    }}
                 >
                    SEARCH COMPANY
                 </Typography>
              </div>
           </Grid>
        </Grid>

        {/* Cards */}
        <Grid container spacing={3}>
           {cardItems.map((item, index) => (
              <Grid item xs={12} sm={access ? 12 : 6} key={index}>
                 <Card
                    sx={{
                       ...cardsStyle,
                       borderLeftColor: item.color,
                       cursor: "pointer",
                       paddingTop: "6.5vh",
                    }}
                    onClick={() => navigate(item.path)}
                 >
                    <CardContent sx={{ padding: 0 }}>
                       <Typography
                          variant="subtitle2"
                          fontWeight="light"
                          sx={{
                             fontSize: {
                                xs: "0.9rem",
                                sm: "0.95rem",
                                md: "1rem",
                             },
                             whiteSpace: "normal",
                             overflowWrap: "break-word",
                             lineHeight: 1.3,
                             textAlign: "left",
                          }}
                       >
                          {item.label}
                       </Typography>
                       <Typography
                          variant="h6"
                          sx={{
                             fontSize: {
                                xs: "1.3rem",
                                sm: "1.5rem",
                                md: "1.7rem",
                             },
                             textAlign: "left",
                             fontWeight: "bold",
                          }}
                          mt={1}
                       >
                          {item.count}
                       </Typography>
                    </CardContent>
                 </Card>
              </Grid>
           ))}
        </Grid>
     </Box>
  );
}
