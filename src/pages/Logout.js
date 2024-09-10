import React from "react";
import { ImSad } from "react-icons/im";
import { Box, Button, Typography } from "@mui/material";
import NavbarNew from "../components/NavbarNew";
import Footer from "../components/Home/Footer";
import { useNavigate } from "react-router-dom";
import './logout.css';

export const Logout = () => {
  const navigate = useNavigate();
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; Secure; SameSite=Strict`;
  }
  const handleLogout = () => {
    sessionStorage?.removeItem("accesstoken");
    sessionStorage?.removeItem("refreshtoken");
    sessionStorage?.removeItem("RollNumber");
    deleteCookie('rollnumber');
    navigate('/');
  };

  return (
    <>
      <NavbarNew />
      <div className="logout-container">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
        <div className="circle circle4"></div>
        <div className="circle circle5"></div>
        <div className="circle circle6"></div>
        <Box className="logout-box" sx={{
            boxShadow: { lg: 3, md: 3, sm: 3, xs: 0},borderRadius: '16px',
                
        }}>
            {/* <ImSad style={{ fontSize: "3.9rem", color: "rgb(107 169 169)" }} /> */}
          <center>
            <img src="./images/logout.png" alt="" style={{width:"100px"}}/>
          </center>
          <center><p style={{fontSize:"1.5rem",marginTop:"10px"}}>You're leaving...</p></center>
          <Typography variant="h6" component="h6" style={{ margin: "10px 0px 20px 0px" }}>
            Are you sure you want to logout?
          </Typography>
          <Button fullWidth variant="contained" sx={{ backgroundColor: "rgb(107 169 169)", color: "white", borderRadius:"20px", }} onClick={() => navigate('/dashboard')}>
              No
            </Button>
            <Button fullWidth variant="contained" sx={{ backgroundColor: "rgb(107 169 169)", color: "white",marginTop:"10px", borderRadius:"20px", }} onClick={handleLogout}>
              Yes, Log me out
            </Button>
            
         
        </Box>
      </div>
      <Footer />
    </>
  );
};

export default Logout;
