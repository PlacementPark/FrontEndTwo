import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../Main/AxiosInstance";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AxiosInstance.get("/employee/counts/counts");
        if (!res) console.log("Something went wrong");

        const counts = {};
        res.data.forEach((c) => {
          counts[c["_id"]] = c["count"];
        });
        setData(counts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Modern Card Styles
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

  const cardItems = [
    {
      label: "RECRUITER",
      color: "#00FFFF",
      path: "/AccountGrid?employeeType=Recruiter",
      count: data["Recruiter"] || 0,
    },
    {
      label: "TEAM LEAD",
      color: "#00FF00",
      path: "/AccountGrid?employeeType=Teamlead",
      count: data["Teamlead"] || 0,
    },
    {
      label: "MANAGER",
      color: "#FF5C00",
      path: "/AccountGrid?employeeType=Manager",
      count: data["Manager"] || 0,
    },
    {
      label: "INTERN",
      color: "#FF0000",
      path: "/AccountGrid?employeeType=Intern",
      count: data["Intern"] || 0,
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
      {/* Add Employee Button */}
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={6}>
          <div
            className="dbButton"
            onClick={() => navigate("/addaccount")}
            style={{
              textAlign: "center",
              marginBottom: "3vh",
              cursor: "pointer",
            }}
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
              ADD EMPLOYEE
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div
            className="dbButton"
            onClick={() => navigate("/searchaccount")}
            style={{
              textAlign: "center",
              marginBottom: "3vh",
              cursor: "pointer",
            }}
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
              SEARCH EMPLOYEE
            </Typography>
          </div>
        </Grid>
      </Grid>

      {/* Employee Type Cards */}
      <Grid container spacing={3}>
        {cardItems.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card
              sx={{
                ...cardsStyle,
                borderLeftColor: item.color,
                paddingTop: "6.5vh",
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent sx={{ padding: 0 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="light"
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
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
                    fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" },
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
