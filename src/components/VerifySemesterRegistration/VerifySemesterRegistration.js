import React, { useEffect, useState } from "react";
import "./VerifySemesterRegistration.css";
import ApprovedList from "./ApprovedList";
import NavbarNew from "../NavbarNew";
import Footer from "../Home/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Box, CircularProgress } from "@mui/material";
import { BaseUrl } from "../BaseUrl";

const VerifySemesterRegistration = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading,setLoading]=useState(true);




  useEffect(() => {
  
    console.log(localStorage.getItem("accesstoken"))
    
    if (localStorage?.getItem("accesstoken")) {
      const response = jwtDecode(localStorage?.getItem("accesstoken"));
      if (response.exp < Math.floor(Date.now() / 1000) || (response.role!=='hod' && response.role!=='admin') ) {
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
          `${BaseUrl}/semester-registrations/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
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

  const navigate=useNavigate();

  const handleCardClick = (id,reg) => {
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
      <div className="printHide">
        <h2 className="text1 mb-4">Semester Registration List</h2>
        <div>
          {searchResults.map((data, index) => (
            <div key={index} className="id-card" onClick={() => handleCardClick(data.id,data.student_details.personal_information.registration_number)}>
              <div className="info">
                <p>
                  <span className="label">Name:</span>{" "}
                  {data.student_details.personal_information.first_name}{" "}
                  {data.student_details.personal_information.last_name}
                </p>
                <p>
                  <span className="label">Registration No:</span>{" "}
                  {data.student_details.personal_information.registration_number}
                </p>
                <p>
                  <span className="label">Semester:</span>{" "}
                  {data.semester.semester_name}
                </p>
              </div>
              <br/>
             
            </div>
          ))}
        </div>
      </div>

      {/* Approve list */}
      <ApprovedList />
      <Footer />
    </>
  );
};

export default VerifySemesterRegistration;
