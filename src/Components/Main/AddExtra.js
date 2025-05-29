import React from "react";
import axios from "axios";
import {
  Card,
  Container,
  Grid,
  CardContent,
  BottomNavigation,
  CardHeader,
  Button,
  alpha,
} from "@mui/material";
import { Autocomplete, TextField, Alert } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

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
        const extraRes = await axios.get(
          "https://tpp-backend-eura.onrender.com/api/v1/extra/all",
          {
            headers: {
              authorization: JSON.parse(localStorage.getItem("user")).token,
            },
          }
        );

        extraRes.data.forEach(({ _id, data }) => {
          if (_id === "Locations") setLocationList(data);
          else if (_id === "Qualifications") setQualificationList(data);
          else if (_id === "Languages") setLanguageList(data);;
        });
      } catch (error) {}
    };
    fetchData();
  }, []);
  const handleLocation = async () => {
    try {
      const locationdata = await axios.patch(
        "https://tpp-backend-eura.onrender.com/api/v1/extra/locations",
        { data: [...new Set([...final.location, ...locationList])] },
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      );
      setFinal({
        location: [],
        language: [],
        qualification: [],
        languageLevel: [],
        assessment: [],
        interviewStatus: [],
        select: [],
      });
      setWarning("Location List Updated Successfully");
      setLocationList(locationdata.data.data);
    } catch (error) {}
  };
  const handleLanguage = async () => {
    try {
      const langdata = await axios.patch(
        "https://tpp-backend-eura.onrender.com/api/v1/extra/languages",
        { data: [...new Set([...final.language, ...languageList])] },
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      );
      setFinal({
        location: [],
        language: [],
        qualification: [],
        languageLevel: [],
        assessment: [],
        interviewStatus: [],
        select: [],
      });
      setWarning("Language List Updated Successfully");
      setLanguageList(langdata.data.data);
    } catch (error) {}
  };
  const handleQualification = async () => {
    try {
      const qualdata = await axios.patch(
        "https://tpp-backend-eura.onrender.com/api/v1/extra/qualifications",
        { data: [...new Set([...final.qualification, ...qualificationList])] },
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      );
      setFinal({
        location: [],
        language: [],
        qualification: [],
        languageLevel: [],
        assessment: [],
        interviewStatus: [],
        select: [],
      });
      setWarning("Qualification List Updated Successfully");
      setQualificationList(qualdata.data.data);
    } catch (error) {}
  };

  //JSX CODE
  return (
    <>
      <Container sx={{ paddingTop: "9.5vh", width: "96%", paddingBottom: "2vh" }}>
        <Card
          sx={{
            borderRadius: "20px",
            backgroundColor: "transparent",
          }}
        >
          <CardHeader
            sx={{
              backgroundColor: alpha("#0B0B0B", 0.5),
              backdropFilter: "blur(5px)",
              height: "7.5vh",
              color: "white",
            }}
            title="ADD EXTRAS"
            titleTypographyProps={{
              sx: {
                fontSize: "2.8vh",
                letterSpacing: "5px",
              },
            }}
          />
          <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.7) }}>
            <Container>
              <div>
                <Grid container rowSpacing={2} columnSpacing={1}>
                  <Grid item xs={9}>
                    <Autocomplete
                      multiple
                      freeSolo
                      id="location"
                      options={locationList}
                      getOptionLabel={(option) => option}
                      value={final.location}
                      onChange={(e, v) => {
                        setFinal({ ...final, location: v });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Location" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{
                        height: "100%",
                        backgroundColor: alpha("#0000FF", 0.5),
                      }}
                      endIcon={<ControlPointIcon />}
                      onClick={handleLocation}
                    >
                      ADD
                    </Button>
                  </Grid>
                  <Grid item xs={9}>
                    <Autocomplete
                      multiple
                      freeSolo
                      id="Language"
                      options={languageList}
                      getOptionLabel={(option) => option}
                      value={final.language}
                      onChange={(e, v) => {
                        setFinal({ ...final, language: v });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Language" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{
                        height: "100%",
                        backgroundColor: alpha("#0000FF", 0.5),
                      }}
                      endIcon={<ControlPointIcon />}
                      onClick={handleLanguage}
                    >
                      ADD
                    </Button>
                  </Grid>
                  <Grid item xs={9}>
                    <Autocomplete
                      multiple
                      freeSolo
                      id="qualification"
                      options={qualificationList}
                      getOptionLabel={(option) => option}
                      value={final.qualification}
                      onChange={(e, v) => {
                        setFinal({ ...final, qualification: v });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Qualification" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{
                        height: "100%",
                        backgroundColor: alpha("#0000FF", 0.5),
                      }}
                      endIcon={<ControlPointIcon />}
                      onClick={handleQualification}
                    >
                      ADD
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    {warning && (
                      <Alert
                        severity="success"
                        onClose={() => {
                          setWarning("");
                        }}
                      >
                        {warning}
                      </Alert>
                    )}
                  </Grid>
                </Grid>
              </div>
            </Container>
          </CardContent>
          <BottomNavigation
            sx={{
              backgroundColor: alpha("#0B0B0B", 0.5),
              backdropFilter: "blur(5px)",
              height: "7vh",
            }}
          />
        </Card>
      </Container>
    </>
  );
}
