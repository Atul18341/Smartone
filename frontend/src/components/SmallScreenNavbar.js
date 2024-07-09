import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";

export const SmallScreenNavbar = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [hide, setHide] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const Logout = () => {
    const token = localStorage.getItem("accesstoken");
    if (!token) {
      console.log("No access token found");
      return;
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://amarnath013.pythonanywhere.com/api/user/logout/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        localStorage.removeItem("accesstoken");
        navigate("/");
      })
      .catch((error) => {
        console.log("Logout failed: ", error);
      });
  };

  return (
    <>
      {hide && (
        <Box
          sx={{ position: "fixed", bottom: "20%",
            left:{
              xs: "10%",
              sm: "40%",
              md: "40%",
            }
           }}
          className="bg-purple-100 w-fit h-auto p-10 text-purple-700 rounded-md z-20"
        >
          <Typography variant="p">Logout</Typography>
          <br />
          <Typography variant="p" className="mb-5">
            Are you sure want to logout?
          </Typography>
          <Box className="flex gap-5 mt-5">
            <Button onClick={(e) => setHide(false)}>Cancel</Button>
            <Button onClick={Logout}>Sure</Button>
          </Box>
        </Box>
      )}
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon tabs example"
        style={{
          position: "fixed",
          bottom: "0%",
          zIndex: "100",
          backgroundColor: "#86868b",
          width: "100%",
        }}
        variant="fullWidth"
        scrollButtons="auto"
        sx={{
          "& .css-y0fr9s-MuiButtonBase-root-MuiTab-root": {
            minWidth: "11px",
          },
        }}
      >
          <Tab
          icon={<SpaceDashboardIcon onClick={(e) => navigate("/dashboard")} />}
          aria-label="person"
        />
        <Tab
          icon={<EventBusyIcon onClick={(e) => navigate("/leave")} />}
          aria-label="phone"
        />
        <Tab
          icon={<AccountCircleIcon onClick={(e) => navigate("/profile")} />}
          aria-label="favorite"
        />
        <Tab icon={<ExitToAppIcon onClick={(e) => setHide(true)}/>} aria-label="person" />
      
      </Tabs>
    </>
  );
};
