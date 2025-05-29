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
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import Logout from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../Assets/Features/User/userSlice";
import img from "../../Assets/./Park_Logo.png";

const drawerWidth = 240;

export default function NavBar(props) {
  // Navigating and Access Control
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { employeeType, username } = useSelector((state) => state.user);
  const access = !["Recruiter", "Teamlead", "Intern"].includes(employeeType);

  // Dropdown logout JSX
  const [anchorEl, setAnchorEl] = React.useState(false);
  const [openpop, setOpenPop] = React.useState(false);
  const [openpopDrawer, setOpenPopDrawer] = React.useState(false);
  const handleClickOpen = () => {
    setOpenPop(true);
  };
  const handleClickOpenDrawer = () => {
    setOpenPopDrawer(true);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClosePop = () => {
    setOpenPop(false);
  };
  const handleClosePopDrawer = () => {
    setOpenPopDrawer(false);
  };
  const handleLogout = () => {
    dispatch(
      setUser({ employeeType: "", username: "", userMail: "", userid: "" })
    );
    localStorage.setItem("user", JSON.stringify({ token: "" }));
    navigate("/login");
  };
  const open = Boolean(anchorEl);

  // Nav Bar MUI JSX
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h5" sx={{ my: 2, fontWeight: "bold" }}>
        THE PLACEMENT PARK
      </Typography>
      <Divider />
      <Box>
        <Stack direction="column" spacing={0}>
          <Button color="inherit" size="large" onClick={() => navigate("/")}>
            Profile
          </Button>
          <Button
            color="inherit"
            size="large"
            onClick={() => navigate("companydashboard")}
          >
            Company
          </Button>
          {access && (
            <Button
              color="inherit"
              size="large"
              onClick={() => navigate("accountdashboard")}
            >
              Account
            </Button>
          )}
          <Button
            color="inherit"
            size="large"
            onClick={() => navigate("/ChangePassword")}
          >
            Change Password
          </Button>
          <Button color="inherit" onClick={handleClickOpenDrawer}>
            {username}
          </Button>
        </Stack>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  // Nav Bar Working Page Header Name Styling
  const liveLink = {
    fontWeight: "bold",
    color: "rgb(0, 204, 255)",
    fontSize: "2.6vh",
    letterSpacing: "6px",
  };
  const normalLink = {
    fontWeight: "bold",
    fontSize: "1.7vh",
  };

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
            <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }} onClick={handleDrawerToggle}>
                <Avatar
                  alt="THE PLACEMENT PARK LOGO PNG"
                  src={img}
                  sx={{ width: "max-content" }}
                />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h6"
              component="div"
              letterSpacing="5px"
              sx={{
                flexGrow: 1,
                marginLeft: "0.5vw",
                display: { xs: "none", sm: "block" },
                fontWeight: "bold",
                fontSize: { xs: "none", sm: "2vh", md: "3vh" },
              }}
            >
              THE PLACEMENT PARK
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Stack direction="row" spacing={1}>
                <Button
                  color="inherit"
                  size="small"
                  sx={
                    location.pathname.toLowerCase().search("candidate") !==
                      -1 ||
                    location.pathname.toLowerCase().search("profile") !== -1 ||
                    location.pathname.toLowerCase().search("leads") !== -1 ||
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
                    location.pathname.toLowerCase().search("company") !== -1 ||
                    location.pathname.toLowerCase().search("empanelled") !==-1 ||
                    location.pathname.toLowerCase().search("role") !== -1
                      ? liveLink
                      : normalLink
                  }
                  onClick={() => navigate("/companydashboard")}
                >
                  Company
                </Button>
                {access && (
                  <Button
                    color="inherit"
                    size="small"
                    sx={
                      location.pathname.toLowerCase().search("account") !==-1 ||
                      location.pathname.toLowerCase().search("employee") !== -1
                        ? liveLink
                        : normalLink
                    }
                    onClick={() => navigate("/accountdashboard")}
                  >
                    Account
                  </Button>
                )}
                {employeeType === "Admin" && (
                  <>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      color="white"
                      flexItem
                    />
                    <Button
                      color="inherit"
                      size="small"
                      sx={
                        location.pathname === "/bulkupload"
                          ? liveLink
                          : normalLink
                      }
                      onClick={() => navigate("/bulkupload")}
                    >
                      Bulk Upload
                    </Button>
                  </>
                )}
                <Divider
                  orientation="vertical"
                  variant="middle"
                  color="white"
                  flexItem
                />
                <Button
                  color="inherit"
                  onClick={handleClick}
                  aria-controls={open ? "AddOns-Menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  sx={
                    location.pathname.toLowerCase().search("addextras") !==
                      -1 ||
                    location.pathname.toLowerCase().search("changepassword") !==
                      -1
                      ? liveLink
                      : normalLink
                  }
                  endIcon={<KeyboardDoubleArrowDown />}
                >
                  {username}
                </Button>
                <Menu
                  id="AddOns-Menu"
                  anchorEl={anchorEl}
                  open={open}
                  MenuListProps={{ "aria-labelledby": "resources-button" }}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                >
                  <MenuItem onClick={handleClickOpen}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/ChangePassword")}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Change Password
                  </MenuItem>
                  {employeeType === "Admin" && (
                    <MenuItem onClick={() => navigate("/AddExtras")}>
                      <ListItemIcon>
                        <GroupAddOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      Add Extras
                    </MenuItem>
                  )}
                </Menu>
              </Stack>
            </Box>
          </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                color: "white",
                backgroundColor: alpha("#0b0b0b", 0.5),
              },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Box>
      <Dialog
        open={openpop}
        onClose={handleClosePop}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          backgroundColor: "transparent",
          "& .MuiDialog-paper": {
            backgroundColor: "transparent",
            backdropFilter: "blur(100px)",
            boxShadow: "none",
            color: "white",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2,
            textTransform: "uppercase",
            letterSpacing: 6,
          }}
          id="customized-dialog-title"
        >
          Logout
        </DialogTitle>
        <DialogContent dividers className="dw">
          <IconButton
            aria-label="close"
            onClick={handleClosePop}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            gutterBottom
            sx={{
              wordBreak: "break-word",
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
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
      <Dialog
        open={openpopDrawer}
        onClose={handleClosePopDrawer}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          backgroundColor: "transparent",
          "& .MuiDialog-paper": {
            backgroundColor: "transparent",
            backdropFilter: "blur(100px)",
            boxShadow: "none",
            color: "white",
          },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textTransform: "uppercase", letterSpacing: 6 }}
          id="customized-dialog-title"
        >
          Logout
        </DialogTitle>
        <DialogContent dividers className="dw">
          <IconButton
            aria-label="close"
            onClick={handleClosePopDrawer}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {employeeType === "Admin" && (
            <Typography
              gutterBottom
              sx={{
                wordBreak: "break-word",
              }}
            >
              For Bulk-Upload & Add-Extras use Tab / Laptop.
            </Typography>
          )}
          <Typography
            gutterBottom
            sx={{
              wordBreak: "break-word",
              fontWeight: "bold",
            }}
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
