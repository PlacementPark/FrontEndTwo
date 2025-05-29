import React, { useState } from "react";
import {
  Button,
  Container,
  BottomNavigation,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Alert,
  alpha,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

export default function ChangePassword(props) {

  // STATES HANDLING AND VARIABLES
  const navigate = useNavigate();
  const { userid } = useSelector((state) => state.user);
  const [warning, setWarning] = useState("");
  const [passwords, setPasswords] = React.useState({
    current: "",
    new: "",
    confirm: "",
  });

  // FUNCTIONS HANDLING AND API POST CALLS
  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      setWarning("Confirm Password does not match. Please Check");
      return;
    }
    try {
      const res = await axios.patch(
        "https://tpp-backend-eura.onrender.com/api/v1/employee/" +
          userid +
          "/password",
        { ...passwords },
        {
          headers: {
            authorization: JSON.parse(localStorage.getItem("user")).token,
          },
        }
      );
      if (res.sucess === false) setWarning(res.message);
      props.setUser({});
      localStorage.setItem("user", JSON.stringify({ token: "" }));
      toast.success("Password Changed Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      setWarning(error.response.data?.message);
    }
  };

  //JSX CODE
  return (
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
          title="CHANGE PASSWORD"
          titleTypographyProps={{
            sx: {
              fontSize: "2.8vh",
              letterSpacing: "5px",
            },
          }}
        />
        <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.7) }}>
          <Grid container rowSpacing={2} columnSpacing={1}>
            <Grid item xs={12}>
              <TextField
                id="currentPassword"
                label="Current Password"
                variant="outlined"
                fullWidth
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="NewPassword"
                label="New Password"
                variant="outlined"
                fullWidth
                value={passwords.new}
                onChange={(e, v) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="ConfirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                value={passwords.confirm}
                onChange={(e, v) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              {warning && (
                <Alert
                  severity="error"
                  onClose={() => {
                    setWarning("");
                  }}
                >
                  {warning}
                </Alert>
              )}
            </Grid>
            <Grid item xs={8} />
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  height: "100%",
                  backgroundColor: alpha("#0000FF", 0.5),
                }}
                onClick={handlePasswordChange}
              >
                SUBMIT
              </Button>
            </Grid>
          </Grid>
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
  );
}
