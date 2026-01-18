import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  alpha,
  CardMedia,
  Button,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  Stack,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import image from "../../Assets/Placement.jpeg";
import { useDispatch } from "react-redux";
import { setUser } from "../../Assets/Features/User/userSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AxiosInstance from "./AxiosInstance";

export default function Login() {
  // STATES
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // TOGGLE PASSWORD
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // LOGIN FUNCTION
  const handleLogin = async () => {
    try {
      const res = await AxiosInstance.post("/auth/login", {
        userMail: username,
        password,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ username, token: "Bearer " + res.data.token })
      );

      dispatch(
        setUser({
          userMail: res.data.userMail,
          employeeType: res.data.employeeType,
          userid: res.data.userid,
          username: res.data.username,
        })
      );

      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Card
          elevation={6}
          sx={{
            borderRadius: 4,
            backgroundColor: alpha("#FFFFFF", 0.15),
            backdropFilter: "blur(0.5px)",
            //color: "white",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              height: { xs: "18vh", md: "20vh" },
              objectFit: "cover",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
            image={image}
            alt="The Placement Park logo"
          />

          <CardContent>
            <Typography
              variant="h5"
              textAlign="center"
              fontWeight="bold"
              letterSpacing={6}
              gutterBottom
            >
              LOGIN
            </Typography>

            {/* Email */}
            <TextField
              fullWidth
              label="Email ID"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{ sx: { borderRadius: 2, backgroundColor: "white" } }}
            />

            {/* Password */}
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="center"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                sx={{ borderRadius: 2, backgroundColor: "white" }}
              />
            </FormControl>

            {/* Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              mt={3}
              justifyContent="center"
            >
              <Button
                fullWidth
                variant="contained"
                size="large"
                color="error"
                onClick={() => {
                  setUsername("");
                  setPassword("");
                }}
                sx={{
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                Clear
              </Button>
              <Button
                fullWidth
                variant="contained"
                size="large"
                color="success"
                onClick={handleLogin}
                sx={{
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                Login
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}