import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.user);

  // Common card style (matches employeeDashboard.js)
  const cardsStyle = {
    minHeight: "6vh",
    maxHeight: "10vh",
    backgroundColor: "transparent",
    backdropFilter: "blur(70px)",
    color: "white",
    borderRadius: "40px",
    borderLeftStyle: "solid",
    borderLeftWidth: "0.5vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "1rem 2.2rem",
    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    transition: "all 0.4s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-6px) scale(1.04)",
      background: "rgba(255, 255, 255, 0.1)",
      color: "#00FFEF",
      borderColor: "#FFF700",
      borderLeftWidth: "0.7vh",
      letterSpacing: "0.5vh",
      boxShadow: "0 0 20px rgba(0,255,239,0.4)",
    },
  };

  // Responsive layout spacing
  const screenWidth = window.innerWidth;
  const inlineStyles = {
    paddingTop: "10vh",
    paddingBottom: "2vh",
    ...(screenWidth <= 576 && { marginLeft: "5%", width: "90%" }),
    ...(screenWidth > 576 && { marginLeft: "10%", width: "80%" }),
  };

  return (
    <div style={inlineStyles}>
      {/* Page Header */}
      <Grid container>
        <Grid item sm={2} />
        <Grid item xs={12} sm={8}>
          <Typography
            variant="h5"
            align="center"
            sx={{
              color: "white",
              fontWeight: "light",
              fontSize: { sm: "3vh", md: "5vh" },
              letterSpacing: "0.5vh",
            }}
          >
            Welcome Back,&nbsp;
            <Box
              component="span"
              sx={{
                color: "#00FFEF",
                fontWeight: "light",
                textTransform: "uppercase",
                letterSpacing: "0.9vh",
              }}
            >
              {username}
            </Box>
            !
          </Typography>
        </Grid>
      </Grid>

      {/* Button Cards */}
      <Grid container columnSpacing={5} rowSpacing={3} sx={{ paddingTop: "5vh" }}>
        {[
          { title: "DAILY PERFORMANCE", color: "#FF5C00", path: "/dailygrid?employeeType=Recruiter" },
          { title: "MONTHLY PERFORMANCE", color: "#FF0000", path: "/monthlygrid?employeeType=Recruiter" },
          { title: "BUSINESS PERFORMANCE", color: "#00FF00", path: "/businessgrid" },
          { title: "PORTAL UPDATES", color:"#00FFFF", path: "/portalupdates?employeeType=Recruiter"},
          { title: "COMPANY CONTRIBUTION 1", color:"#FF00FF", path: "/contributionp1?companyType=Not Intrested"},
          { title: "COMPANY CONTRIBUTION 2", color:"#FF5C00", path: "/underdevelopment"},
          { title: "BULK UPLOADS", color:"#FF0000", path: "/bulkupload"},
          { title: "ADD EXTRAS", color:"#00FF00", path: "/AddExtras"},
          { title: "PIE CHARTS", color: "#00FFFF", path: "/underdevelopment" },
          { title: "ANALYSIS", color: "#FF00FF", path: "/piechart?type=L1WD" },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Card
              sx={{
                ...cardsStyle,
                borderLeftColor: item.color,
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="light"
                  marginTop="1vh"
                  align={item.full ? "center" : "left"}
                  sx={{fontSize: { sm: "2.2vh", md: "2.8vh" }}}
                >
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
