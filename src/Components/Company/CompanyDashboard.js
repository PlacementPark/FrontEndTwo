import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CompanyDashboard(props) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://tpp-backend-eura.onrender.com/api/v1/company/counts",
          {
            headers: {
              authorization: JSON.parse(localStorage.getItem("user")).token,
            },
          }
        );

        if (!res) console.log("Something went wrong");
        var c = {};
        res.data.forEach((response) => {
          c[response._id] = response.count;
        });
        setCounts(c);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  //CARDS INLINE CSS
  const cardsStyle = {
    backgroundColor: "transparent",
    backdropFilter: "blur(70px)",
    color: "white",
    borderRadius: "20px",
    borderLeftStyle: "solid",
    borderLeftWidth: "0.5vh",
  };

  //CSS HANDLING FOR CARDS/BUTTON/PAGE ON XS AND SM
  const screenWidth = window.innerWidth;
  const inlineStyles = {
    paddingTop: '10vh',
    paddingBottom: '2vh',
    ...(screenWidth <= 576 && { marginLeft: '5%', width: '90%' }), // xs screens
    ...(screenWidth > 576 && { marginLeft: '20%', width: '60%' }),  // xs+ screens
  };

  return (
    <>
      <div
        style={inlineStyles}
      >
        <Grid container>
          <Grid item sm={2}/>
          <Grid item xs={12} sm={8}>
            <div className="dbButton" onClick={() => navigate("/addcompany")}>
              <Typography variant="h7" color="white" fontWeight="bold">
                ADD COMPANY
              </Typography>
            </div>
          </Grid>
        </Grid>
        {/* Lower Grid Data Cards */}
        <Grid
          container
          columnSpacing={5}
          rowSpacing={1}
          sx={{ paddingTop: "5vh" }}
        >
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ ...cardsStyle, borderLeftColor: "#00FFFF" }}
              onClick={() => navigate("/CompanyGrid")}
            >
              <Box>
                <CardContent sx={{ maxHeight: "5vh" }}>
                  <Typography variant="h7" fontWeight="bold">
                    ALL COMPANIES
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography variant="h5">
                    {Object.values(counts).reduce((a, b) => a + b, 0)}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ ...cardsStyle, borderLeftColor: "#FF00FF" }}
              onClick={() => navigate("/CompanyGrid?companyType=Empanelled")}
            >
              <Box>
                <CardContent sx={{ maxHeight: "5vh" }}>
                  <Typography variant="h7" fontWeight="bold">
                    EMPANELLED
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography variant="h5">
                    {counts["Empanelled"] ? counts["Empanelled"] : 0}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ ...cardsStyle, borderLeftColor: "#FF5C00" }}
              onClick={() => navigate("/CompanyGrid?companyType=Need to Approach")}
            >
              <Box>
                <CardContent sx={{ maxHeight: "5vh" }}>
                  <Typography variant="h7" fontWeight="bold">
                    NEED TO APPROACH
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography variant="h5">
                    {counts["Need to Approach"]
                      ? counts["Need to Approach"]
                      : 0}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ ...cardsStyle, borderLeftColor: "#FF0000" }}
              onClick={() => navigate("/CompanyGrid?companyType=In Process")}
            >
              <Box>
                <CardContent sx={{ maxHeight: "5vh" }}>
                  <Typography variant="h7" fontWeight="bold">
                    IN PROCESS
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography variant="h5">
                    {counts["In Process"] ? counts["In Process"] : 0}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ ...cardsStyle, borderLeftColor: "#00FF00" }}
              onClick={() => navigate("/CompanyGrid?companyType=Future")}
            >
              <Box>
                <CardContent sx={{ maxHeight: "5vh" }}>
                  <Typography variant="h7" fontWeight="bold">
                    FUTURE
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography variant="h5">
                    {counts["Future"] ? counts["Future"] : 0}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ ...cardsStyle, borderLeftColor: "#00FFFF" }}
              onClick={() => navigate("/CompanyGrid?companyType=Not Intrested")}
            >
              <Box>
                <CardContent sx={{ maxHeight: "5vh" }}>
                  <Typography variant="h7" fontWeight="bold">
                    NOT INTERESTED
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography variant="h5">
                    {counts["Not Intrested"] ? counts["Not Intrested"] : 0}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ ...cardsStyle, borderLeftColor: "#FF00FF" }}
              onClick={() => navigate("/CompanyGrid?companyType=Rejected")}
            >
              <Box>
                <CardContent sx={{ maxHeight: "5vh" }}>
                  <Typography variant="h7" fontWeight="bold">
                    REJECTED
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography variant="h5">
                    {counts["Rejected"] ? counts["Rejected"] : 0}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ ...cardsStyle, borderLeftColor: "#FF5C00" }}
              onClick={() => navigate("/CompanyGrid?companyType=No Response")}
            >
              <Box>
                <CardContent sx={{ maxHeight: "5vh" }}>
                  <Typography variant="h7" fontWeight="bold">
                    NO RESPONSE
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography variant="h5">
                    {counts["No Response"] ? counts["No Response"] : 0}
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
