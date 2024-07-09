import { Box, Grid } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ProfileMainBody } from "../components/ProfileMainBody";
import NavbarNew from "../components/NavbarNew";

export const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage?.getItem("accesstoken")) {
      const response = jwtDecode(localStorage?.getItem("accesstoken"));
      if (
        response.token_type !== "access" 
        && response.exp<Math.floor(Date.now() / 1000)
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }

  
  }, []);

  return (
    <Box style={{ minHeight: "100vh" }}>
      <NavbarNew />
      <Grid container>
       
     
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <ProfileMainBody />
        </Grid>
      </Grid>
    
    </Box>
  );
};
