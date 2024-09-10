import { Box, Grid, Typography } from "@mui/material";

export const BannerSection = ({image,title,subtitle}) => {
  return (
    <Box
      sx={{
        width: "100vw",
        textAlign: "center",
        backgroundImage:
          `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        paddingTop: {xs:"8vw",lg:"2vw",md:"2vw"},
        paddingBottom: "15vw",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Overlay with opacity
          zIndex: 1,
        },
      }}
    >
      <Grid
        container
        sx={{
          position: "relative",
          zIndex: 2,
          color: "white",
          padding: { xs: "20px", sm: "20px", md: "50px" },
        }}
      >
        <Grid item xs={12} sm={12} lg={6} md={6}>
          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "2.4rem",
                md: "2.6rem",
                lg: "2.6rem",
              },
              marginTop: { xs: "20px", md: "80px" },
              fontWeight: "bold",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.1rem",
                md: "1.2rem",
                lg: "1.2rem",
              },
              marginTop: "10px",
              fontWeight: "500",
              padding: { xs: "10px", sm: "10px", md: "0px" },
            }}
          >
            {subtitle}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
      </Grid>
    </Box>
  );
};
