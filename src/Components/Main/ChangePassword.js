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
import { toast } from "react-toastify";
import AxiosInstance from "./AxiosInstance";

export default function ChangePassword(props) {
  const navigate = useNavigate();
  const { userid } = useSelector((state) => state.user);
  const [warning, setWarning] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const getPasswordStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "Weak";
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password)) {
      return "Strong";
    }
    return "Medium";
  };

  const handlePasswordChange = async () => {
    setWarning("");
    if (passwords.new !== passwords.confirm) {
      setWarning("Confirm Password does not match. Please Check");
      return;
    }
    try {
      const res = await AxiosInstance.patch(`/employee/${userid}/password`, {
        current: passwords.current,
        new: passwords.new,
      });

      if (res.status.toString() === "200") {
        localStorage.setItem("user", JSON.stringify({ token: "" }));
        toast.success("Password Changed Successfully");
        navigate("/");
      } else {
        setWarning("Password change failed. Please try again.");
      }
    } catch (error) {
      setWarning(
        error.response?.data?.message ||
          "Error: Password change failed. Please try again."
      );
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{ paddingTop: { xs: "12vh", md: "9.5vh" }, paddingBottom: "2vh" }}
    >
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
            minHeight: "7vh",
            color: "white",
            fontWeight: "bold",
          }}
          title="CHANGE PASSWORD"
          titleTypographyProps={{
            sx: {
              fontSize: { xs: "2vh", sm: "2.4vh", md: "2.8vh" },
              letterSpacing: "4px",
              textAlign: "center",
              fontWeight: "light",
            },
          }}
        />
        <CardContent sx={{ backgroundColor: alpha("#FFFFFF", 0.7) }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="currentPassword"
                label="Current Password"
                type="text"
                variant="outlined"
                fullWidth
                autoComplete="new-password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    current: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="NewPassword"
                label="New Password"
                type="text"
                variant="outlined"
                fullWidth
                autoComplete="new-password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
                helperText={
                  getPasswordStrength(passwords.new) &&
                  `Strength: ${getPasswordStrength(passwords.new)}`
                }
                FormHelperTextProps={{
                  sx: { fontSize: { xs: "1.2vh", sm: "1.4vh" } },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="ConfirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                autoComplete="new-password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirm: e.target.value,
                  })
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
            <Grid item xs={12} md={4} mdOffset={8}>
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
            minHeight: "7vh",
          }}
        />
      </Card>
    </Container>
  );
}
