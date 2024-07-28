import { Box, Button, Typography } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { RiLockPasswordFill } from "react-icons/ri";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const Sidebar = () => {
  const navigate = useNavigate();
  function leave() {
    navigate("/leave");
  }
  const [hide, setHide] = useState(false);

  const Logout = () => {
    const token = sessionStorage.getItem("accesstoken");
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
        sessionStorage.removeItem("accesstoken");
        navigate('/');
      })
      .catch((error) => {
        console.log("Logout failed: ", error);
      });
  };

  return (
    <Box
      style={{
        height: "85vh",
        background: "linear-gradient(to bottom, whitesmoke , #7042C0 40%)",
        marginTop: "10px",
        marginLeft: "20px",
        marginBottom:"5px",
        borderRadius: "20px 20px 20px 20px",
      }}
    >
      <Box style={{ padding: "40px" }}>
        {hide && (
          <Box
            style={{ position: "fixed", left: "25%", top: "50%" }}
            className="bg-purple-100 w-[20%] h-auto p-10 text-purple-700 rounded-md z-20"
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
        <Box>
          <img
            src="../images/dashboard_logo.png"
            alt=""
            style={{ width: "150px", height: "auto" }}
          />
        </Box>

        <Box
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "30px",
            color: "white",
          }}
        >
          <SpaceDashboardIcon />
          <Typography
            variant="p"
            onClick={(e) => navigate("/dashboard")}
            className="cursor-pointer"
          >
            Dashboard
          </Typography>
        </Box>

        <Box
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            color: "white",
          }}
        >
          <AccountCircleIcon />
          <Typography
            variant="p"
            onClick={(e) => navigate("/profile")}
            className="cursor-pointer"
          >
            Profile
          </Typography>
        </Box>

        <Box
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            color: "white",
          }}
        >
          <RiLockPasswordFill />
          <Typography
            variant="p"
            onClick={(e) => navigate("/change-password")}
            className="cursor-pointer"
          >
            Change Password
          </Typography>
        </Box>
        <Box
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "30px",
            color: "white",
          }}
        >
          <CardGiftcardIcon />
          <Typography
            variant="p"
            onClick={(e) => navigate("/bonafideCertificate")}
            className="cursor-pointer"
          >
            Bonafide Certificate
          </Typography>
        </Box>

        {/* <Box
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            color: "white",
          }}
        >
          <MessageIcon />
          <Typography variant="p">Result</Typography>
        </Box> */}

        {/* <Box
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            color: "white",
          }}
        >
          <SpaceDashboardIcon />
          <Typography variant="p">Skills</Typography>
        </Box> */}
        <Box
          onClick={leave}
          className="cursor-pointer"
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            color: "white",
          }}
        >
          <EventBusyIcon />
          <Typography variant="p">Transfer/Leaving Certificate</Typography>
        </Box>

        <Box
          style={{
            display: "flex",
            gap: "10px",
            margin: "55px 0px 20px 0px",
            color: "white",
          }}
        >
          <ExitToAppIcon />
          <Typography
            variant="p"
            onClick={(e) => setHide(true)}
            className="cursor-pointer"
          >
            Logout
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
