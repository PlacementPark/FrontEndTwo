import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AccountDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://tpp-backend-eura.onrender.com/api/v1/employee/counts/counts",
          {
            headers: {
              authorization: JSON.parse(localStorage.getItem("user")).token,
            },
          }
        );

        if (!res) console.log("Something went wrong");
        const counts = {};
        for (const c of res.data) {
          counts[c["_id"]] = c["count"];
        }

        setData(counts);
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
    paddingTop: "10vh",
    paddingBottom: "2vh",
    ...(screenWidth <= 576 && { marginLeft: "5%", width: "90%" }), // xs screens
    ...(screenWidth > 576 && { marginLeft: "20%", width: "60%" }), // xs+ screens
  };

  return (
    <>
      <div style={inlineStyles}>
        <Grid container>
          <Grid item sm={2} />
          <Grid item xs={12} sm={8}>
            <div className="dbButton" onClick={() => navigate("/addaccount")}>
              <Typography variant="h7" color="white" fontWeight="bold">
                ADD EMPLOYEE
              </Typography>
            </div>
          </Grid>
        </Grid>
        {/* Data Grid (70%) */}
        <Grid
          container
          columnSpacing={5}
          rowSpacing={1}
          sx={{ paddingTop: "5vh" }}
        >
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ ...cardsStyle, borderLeftColor: "#00FFFF" }}
              onClick={() => navigate("/AccountGrid?employeeType=Recruiter")}
            >
              <Box>
                <CardContent sx={{ maxHeight: "5vh" }}>
                  <Typography variant="h7" fontWeight="bold">
                    RECRUITER
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography variant="h5">
                    {data["Recruiter"] ? data["Recruiter"] : 0}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ ...cardsStyle, borderLeftColor: "#00FF00" }}
              onClick={() => navigate("/AccountGrid?employeeType=Teamlead")}
            >
              <Box>
                <CardContent sx={{ maxHeight: "5vh" }}>
                  <Typography variant="h7" fontWeight="bold">
                    TEAM LEAD
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography variant="h5">
                    {data["Teamlead"] ? data["Teamlead"] : 0}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ ...cardsStyle, borderLeftColor: "#FF5C00" }}
              onClick={() =>
                navigate("/AccountGrid?employeeType=Manager")
              }
            >
              <Box>
                <CardContent sx={{ maxHeight: "5vh" }}>
                  <Typography variant="h7" fontWeight="bold">
                    MANAGER
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography variant="h5">
                    {data["Manager"] ? data["Manager"] : 0}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ ...cardsStyle, borderLeftColor: "#FF0000" }}
              onClick={() => navigate("/AccountGrid?employeeType=Intern")}
            >
              <Box>
                <CardContent sx={{ maxHeight: "5vh" }}>
                  <Typography variant="h7" fontWeight="bold">
                    INTERN
                  </Typography>
                </CardContent>
              </Box>
              <Box>
                <CardContent>
                  <Typography variant="h5">
                    {data["Intern"] ? data["Intern"] : 0}
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
