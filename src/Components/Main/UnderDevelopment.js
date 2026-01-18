import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  useMediaQuery,
  createTheme,
} from "@mui/material";
import ConstructionTwoToneIcon from "@mui/icons-material/ConstructionTwoTone";
import { useNavigate } from "react-router-dom";

export default function UnderDevelopment() {
  const navigate = useNavigate();
  const theme = createTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "white",
        textAlign: "center",
        px: isSmall ? 2 : 6,
      }}
    >
      <Grid container spacing={3} direction="column" alignItems="center">
        {/* Icon */}
        <Grid item>
          <ConstructionTwoToneIcon sx={{ fontSize: isSmall ? 80 : 120, color: "#00FFEF" }} />
        </Grid>

        {/* Title */}
        <Grid item>
          <Typography
            variant={isSmall ? "h4" : "h2"}
            sx={{
              fontWeight: "light",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Feature Under Development
          </Typography>
        </Grid>

        {/* Subtitle */}
        <Grid item>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.8,
              maxWidth: "600px",
              fontWeight: "light",
            }}
          >
            🚧 We’re working hard to bring this feature to life. Stay tuned for
            updates!
          </Typography>
        </Grid>

        {/* Action Buttons */}
        <Grid item container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "white",
                px: 4,
                py: 1,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
              }}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#00FFEF",
                color: "black",
                px: 4,
                py: 1,
                "&:hover": { backgroundColor: "#00ffa2ff" },
              }}
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}