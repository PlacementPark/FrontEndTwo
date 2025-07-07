import React from "react";
import {
   Grid,
   Card,
   CardContent,
   Typography,
   TextField,
   alpha,
   CardMedia,
   CardActions,
   Button,
   IconButton,
   OutlinedInput,
   InputLabel,
   InputAdornment,
   FormControl,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import image from "../../Assets/Placement.jpeg";
import { useDispatch } from "react-redux";
import { setUser } from "../../Assets/Features/User/userSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
   // STATES HANDLING AND VARIABLES
   const [username, setUsername] = React.useState("");
   const [password, setPassword] = React.useState("");
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [showPassword, setShowPassword] = React.useState(false);
   const handleClickShowPassword = () => setShowPassword((show) => !show);

   // FUNCTIONS HANDLING AND API POST CALLS
   const handleLogin = () => {
      axios
         .post("https://tpp-backend-eura.onrender.com/api/v1/auth/login", {
            userMail: username,
            password: password,
         })
         .then((res) => {
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
         })
         .catch((err) => {
            toast.error(err.response.data.message);
         });
   };

   //CSS HANDLING FOR CARDS/BUTTON/PAGE ON XS AND SM
   const screenWidth = window.innerWidth;
   const inlineStyles = {
      paddingBottom: "2vh",
      ...(screenWidth <= 576 && { marginLeft: "5%", width: "90%" }), // xs screens
      ...(screenWidth > 576 && { marginLeft: "32.5%", width: "35%" }), // xs+ screens
   };

   //JSX CODE
   return (
      <>
         <div>
            <div style={{ paddingTop: "20vh" }}>
               <Card
                  sx={{
                     ...inlineStyles,
                     backgroundColor: alpha("#FFFFFF", 0.4),
                  }}
               >
                  <CardMedia
                     component={"img"}
                     sx={{ height: "20vh", width: "100%" }}
                     image={image}
                     alt="The Placement Park logo"
                  />
                  <CardContent>
                     <Typography
                        gutterBottom
                        variant="h5"
                        textAlign="center"
                        fontWeight="bold"
                        letterSpacing="10px"
                        sx={{ marginBottom: "-12px" }}
                     >
                        LOGIN
                     </Typography>
                  </CardContent>
                  <CardActions sx={{ m: 2 }}>
                     <Grid container rowSpacing={2} columnSpacing={4}>
                        <Grid item xs={12}>
                           <TextField
                              fullWidth
                              label="Email ID"
                              variant="outlined"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                           />
                        </Grid>
                        <Grid item xs={12}>
                           <FormControl variant="outlined" fullWidth>
                              <InputLabel htmlFor="outlined-adornment-password">
                                 Password
                              </InputLabel>
                              <OutlinedInput
                                 id="outlined-adornment-password"
                                 type={showPassword ? "text" : "password"}
                                 endAdornment={
                                    <InputAdornment position="end">
                                       <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={handleClickShowPassword}
                                          edge="end"
                                       >
                                          {showPassword ? (
                                             <VisibilityOff />
                                          ) : (
                                             <Visibility />
                                          )}
                                       </IconButton>
                                    </InputAdornment>
                                 }
                                 label="Password"
                                 value={password}
                                 onChange={(e) => setPassword(e.target.value)}
                              />
                           </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                           <Button
                              fullWidth
                              variant="contained"
                              size="large"
                              color="primary"
                              sx={{ backgroundColor: alpha("#0000FF", 0.5) }}
                              onClick={() => {
                                 setUsername("");
                                 setPassword("");
                              }}
                           >
                              Clear
                           </Button>
                        </Grid>
                        <Grid item xs={6}>
                           <Button
                              fullWidth
                              variant="contained"
                              size="large"
                              color="success"
                              sx={{ backgroundColor: alpha("#008000", 0.7) }}
                              onClick={handleLogin}
                           >
                              Login
                           </Button>
                        </Grid>
                     </Grid>
                  </CardActions>
               </Card>
            </div>
         </div>
      </>
   );
}
