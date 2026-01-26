import React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Button,
  alpha,
  Stack,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  Tooltip,
  Avatar,
  ListItemIcon,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { KeyboardDoubleArrowDown } from "@mui/icons-material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../Assets/Features/User/userSlice";
import img from "../../Assets/./Park_Logo.png";

const drawerWidth = 240;

export default function NavBar(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { employeeType, username } = useSelector((state) => state.user);
  const access = !["Recruiter", "Teamlead", "Intern"].includes(employeeType);

  // Logout dropdown
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openpop, setOpenPop] = React.useState(false);
  const [openpopDrawer, setOpenPopDrawer] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleClickOpen = () => setOpenPop(true);
  const handleClosePop = () => setOpenPop(false);
  const handleClickOpenDrawer = () => setOpenPopDrawer(true);
  const handleClosePopDrawer = () => setOpenPopDrawer(false);
  const handleLogout = () => {
    dispatch(
      setUser({ employeeType: "", username: "", userMail: "", userid: "" })
    );
    localStorage.setItem("user", JSON.stringify({ token: "" }));
    navigate("/login");
  };

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  // Shared link styles
  const baseLink = {
    fontWeight: "bold",
    fontSize: { xs: "1.2vh", sm: "1.5vh", md: "1.8vh", lg: "2vh" },
    letterSpacing: { xs: "1px", sm: "2px", md: "3px", lg: "4px" },
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: { xs: "65px", sm: "120px", md: "180px", lg: "100%" },
  };

  const liveLink = {
    ...baseLink,
    color: "#00FFEF",
    fontWeight: "light",
    fontSize: { sm: "2.1vh", md: "2.8vh" },
    overflow: "visible",
    letterSpacing: "1vh",
    transition: "all 0.8s ease",
    transform: "translateY(-1.2px) scale(1.09)",
    paddingLeft: "1vw"
  };

  const normalLink = {
    ...baseLink,
    color: "white",
    borderBottom: "none",
    fontWeight: "light",
    fontSize: { sm: "1.5vh", md: "1.8vh" },
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h5"
        sx={{
          my: 2,
          fontWeight: "bold",
          color: "white",
          fontSize: { xs: "1.5vh", sm: "2vh", md: "2.5vh" },
          letterSpacing: { xs: "2px", sm: "4px", md: "6px" },
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        THE PLACEMENT PARK
      </Typography>
      <Divider sx={{ borderColor: "white" }} />
      <Box>
        <Stack direction="column" spacing={2} paddingTop={3}>
          <Button sx={{ color: "white" }} onClick={() => navigate("/")}>
            Profile
          </Button>
          <Button
            sx={{ color: "white" }}
            onClick={() => navigate("companydashboard")}
          >
            Company
          </Button>
          {access && (
            <Button
              sx={{ color: "white" }}
              onClick={() => navigate("accountdashboard")}
            >
              Account
            </Button>
          )}
          <Button
            sx={{ color: "white" }}
            onClick={() => navigate("/ChangePassword")}
          >
            Change Password
          </Button>
          <Button sx={{ color: "white" }} onClick={handleClickOpenDrawer}>
            {username}
          </Button>
        </Stack>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar
          sx={{
            backgroundColor: alpha("#0B0B0B", 0.7),
            height: "7vh",
            justifyContent: "center",
          }}
        >
          <Toolbar>
            <Tooltip title="Open Developer settings">
              <IconButton sx={{ p: 0 }} onClick={handleDrawerToggle}>
                <Avatar
                  alt="THE PLACEMENT PARK LOGO"
                  src={img}
                  sx={{ width: "max-content", p: 0.25 }}
                />
              </IconButton>
            </Tooltip>

            {/* Company Name */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                ml: 1,
                display: { xs: "none", sm: "block" },
                fontWeight: "bold",
                fontSize: { xs: "1.4vh", sm: "2vh", md: "2.5vh", lg: "3vh" },
                color: "white",
                letterSpacing: { xs: "2px", sm: "4px", md: "6px", lg: "8px" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: { xs: "120px", sm: "250px", md: "400px", lg: "100%" },
              }}
            >
              THE PLACEMENT PARK
            </Typography>

            {/* Navbar Links */}
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Stack direction="row" spacing={1}>
                {/* <Button
                  color="inherit"
                  size="small"
                  sx={
                    location.pathname.toLowerCase().includes("month") ||
                    location.pathname.toLowerCase().includes("pie") ||
                    location.pathname.toLowerCase().includes("business") ||
                    location.pathname.toLowerCase().includes("daily")
                      ? liveLink
                      : normalLink
                  }
                  onClick={() => navigate("/admindashboard")}
                >
                  Dev
                </Button> */}
                <Button
                  color="inherit"
                  size="small"
                  sx={
                    location.pathname.toLowerCase().includes("candidate") ||
                    location.pathname.toLowerCase().includes("profile") ||
                    location.pathname.toLowerCase().includes("leads") ||
                    location.pathname === "/"
                      ? liveLink
                      : normalLink
                  }
                  onClick={() => navigate("/")}
                >
                  Profile
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  sx={
                    location.pathname.toLowerCase().includes("company")
                      ? liveLink
                      : normalLink
                  }
                  onClick={() => navigate("/companydashboard")}
                >
                  Company
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  sx={
                    location.pathname.toLowerCase().includes("institute")
                      ? liveLink
                      : normalLink
                  }
                  onClick={() => navigate("/institutedashboard")}
                >
                  Institute
                </Button>
                {access && (
                  <Button
                    color="inherit"
                    size="small"
                    sx={
                      location.pathname.toLowerCase().includes("account")
                        ? liveLink
                        : normalLink
                    }
                    onClick={() => navigate("/accountdashboard")}
                  >
                    Account
                  </Button>
                )}
                <Divider orientation="vertical" color="white" flexItem />

                {/* Username Button */}
                <Button
                  color="inherit"
                  sx={{
                    maxWidth: { xs: "20vw", sm: "15vw", md: "12vw", lg: "10vw" },
                    ...(location.pathname.toLowerCase().includes("development") ||
                    location.pathname.toLowerCase().includes("bulkupload") ||
                    location.pathname.toLowerCase().includes("admindashboard") || 
                    location.pathname.toLowerCase().includes("daily") || 
                    location.pathname.toLowerCase().includes("monthly") || 
                    location.pathname.toLowerCase().includes("piechart") ||
                    location.pathname.toLowerCase().includes("portalupdates") || 
                    location.pathname.toLowerCase().includes("contribution") || 
                    location.pathname.toLowerCase().includes("addextras") || location.pathname
                      .toLowerCase()
                      .includes("changepassword")
                      ? liveLink
                      : normalLink),
                  }}
                  endIcon={<KeyboardDoubleArrowDown />}
                  onClick={handleClick}
                >
                  {username}
                </Button>

                {/* Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{ "aria-labelledby": "settings-button" }}
                  sx={{
                    "& .MuiMenu-paper": {
                      color: "white",
                      backgroundColor: alpha("#0B0B0B", 0.9),
                    },
                  }}
                >
                  <MenuItem onClick={handleClickOpen} sx={{ color: "white" }}>
                    <ListItemIcon>
                      <Logout fontSize="small" sx={{ color: "white" }} />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                  <MenuItem
                    onClick={() => navigate("/ChangePassword")}
                    sx={{ color: "white" }}
                  >
                    <ListItemIcon>
                      <Settings fontSize="small" sx={{ color: "white" }} />
                    </ListItemIcon>
                    Change Password
                  </MenuItem>
                  {employeeType === "Admin" && (
                  <>
                  <MenuItem
                      onClick={() => navigate("/underdevelopment")}
                      sx={{ color: "white" }}
                    >
                      <ListItemIcon>
                        <NotificationsActiveOutlinedIcon
                          fontSize="small"
                          sx={{ color: "white" }}
                        />
                      </ListItemIcon>
                      Notifications
                  </MenuItem>
                  <MenuItem
                      onClick={() => navigate("/admindashboard")}
                      sx={{ color: "white" }}
                    >
                      <ListItemIcon>
                        <AnalyticsOutlinedIcon
                          fontSize="small"
                          sx={{ color: "white" }}
                        />
                      </ListItemIcon>
                      Admin Dashboard
                  </MenuItem>
                  </>
                  )}
                </Menu>
              </Stack>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Drawer for Mobile */}
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                color: "white",
                backgroundColor: "transparent",
              },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Box>

      {/* Logout Dialog */}
      <Dialog
        open={openpop}
        onClose={handleClosePop}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "transparent",
            backdropFilter: "blur(100px)",
            color: "white",
          },
        }}
      >
        <DialogTitle
          sx={{ p: 2, textTransform: "uppercase", letterSpacing: 6 }}
        >
          Logout
        </DialogTitle>
        <DialogContent dividers>
          <IconButton
            aria-label="close"
            onClick={handleClosePop}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            gutterBottom
            sx={{ wordBreak: "break-word", fontWeight: "bold" }}
          >
            Hey {username}, confirm your Logout!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
          <Button variant="contained" onClick={handleClosePop}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Drawer Logout */}
      <Dialog
        open={openpopDrawer}
        onClose={handleClosePopDrawer}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "transparent",
            backdropFilter: "blur(100px)",
            color: "white",
          },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textTransform: "uppercase", letterSpacing: 6 }}
        >
          Logout
        </DialogTitle>
        <DialogContent dividers>
          <IconButton
            aria-label="close"
            onClick={handleClosePopDrawer}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
          {employeeType === "Admin" && (
            <Typography gutterBottom sx={{ wordBreak: "break-word" }}>
              For Bulk-Upload & Add-Extras use Tab / Laptop.
            </Typography>
          )}
          <Typography
            gutterBottom
            sx={{ wordBreak: "break-word", fontWeight: "bold" }}
          >
            Hey {username}, confirm your Logout!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
          <Button variant="contained" onClick={handleClosePopDrawer}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
