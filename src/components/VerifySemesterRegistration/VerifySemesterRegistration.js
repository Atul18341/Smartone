import React, { useEffect, useState } from "react";
import "./VerifySemesterRegistration.css";
import ApprovedList from "./ApprovedList";
import NavbarNew from "../NavbarNew";
import Footer from "../Home/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Box, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { BaseUrl } from "../BaseUrl";

const VerifySemesterRegistration = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(sessionStorage.getItem("accesstoken"));

    if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        (response.role !== "hod" && response.role !== "super-admin")
      ) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchApprovedStudents = async () => {
      try {
        const response = await axios.get(
          `${BaseUrl}/${
            jwtDecode(sessionStorage.getItem("accesstoken")).college
          }/semester-registrations/`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
            },
          }
        );
        console.log(response.data);
        setSearchResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchApprovedStudents();
  }, []);

  const navigate = useNavigate();

  const handleCardClick = (id, reg) => {
    navigate(`/facultySemesterRegistration/${id}/${reg}`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
      <NavbarNew />
      <Box
        sx={{
          width: "100vw",
          textAlign: "center",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1544006659-f0b21884ce1d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          paddingTop: "2vw",
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
                marginTop: { xs: "20px", md: "50px" },
                fontWeight: "bold",
              }}
            >
              Semester Registration Requests
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
             Efficiently manage semester registration approvals by prioritizing student submissions and verifying details. Customize the approval process to ensure timely registration and accurate record-keeping.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} lg={6} md={6}></Grid>
        </Grid>
      </Box>
      <center>
        <h2 className="mt-8 mb-4 ">Semester Registration List</h2>
        <Divider
          sx={{
            backgroundColor: "blue",
            width: { lg: "8%", xs: "30%", md: "10%" },
            fontWeight: "800",
            textAlign: "center",
            marginTop: "5px",
          }}
        />
      </center>
      <div className="printHide">
       
       
        <div>
          {searchResults.length > 0 ? (
            searchResults?.map((data, index) => (
              <div
                key={index}
                className="id-card"
                onClick={() =>
                  handleCardClick(
                    data.id,
                    data.student_details.personal_information
                      .registration_number
                  )
                }
              >
                <div className="info">
                  <p>
                    <span className="label">Name:</span>{" "}
                    {data.student_details.personal_information.first_name}{" "}
                    {data.student_details.personal_information.last_name}
                  </p>
                  <p>
                    <span className="label">Registration No:</span>{" "}
                    {
                      data.student_details.personal_information
                        .registration_number
                    }
                  </p>
                  <p>
                    <span className="label">Semester:</span>{" "}
                    {data.semester.semester_name}
                  </p>
                </div>
                <br />
              </div>
            ))
          ) : (
            <center>
              <img
                src="../images/semester_no_data.png"
                alt=""
                style={{
                  width: "300px",
                  marginTop: "40px",
                  marginBottom: "40px",
                }}
              />
            </center>
          )}
        </div>
      </div>

      <ApprovedList />
      <Footer />
    </>
  );
};

export default VerifySemesterRegistration;
