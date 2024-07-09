import React, { useEffect, useState } from "react";
import "./VerifySemesterRegistration.css";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";
import { BaseUrl } from "../BaseUrl";

const ApprovedList = () => {
  const [print, setPrint] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [loading1,setLoading1]=useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${BaseUrl}/verify-semester-registration/?status=approved`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          },
        };

        const response = await axios.request(config);
        console.log(response.data);
        setLoading1(false);
        setSearchResults(response.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handlePrint = () => {
    setPrint(true);
    window.print();
    setPrint(false);
  };

 
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredResults = searchResults.filter((data) => {
      const regNumber = data?.registration_details_info?.student_details?.personal_information?.registration_number.toLowerCase();
      const semesterName = data?.registration_details_info?.semester?.semester_name.toLowerCase();
     
      return regNumber.includes(searchTerm) || semesterName.includes(searchTerm) 
    });

    setSearchResults(filteredResults);

    // Set search message based on filtered results
    if (filteredResults.length === 0 && searchTerm.trim() !== "") {
      setSearchMessage("No records found");
    } else {
      setSearchMessage("");
    }
  };

  // Extract unique registration numbers using Set
  const uniqueRegistrationNumbers = Array.from(new Set(searchResults.map(data =>
    data?.registration_details_info?.student_details?.personal_information?.registration_number)));

  // Show cards when searchTerm is empty or matches records
  const showCards = searchTerm === "" || searchResults.some(data => {
    const regNumber = data?.registration_details_info?.student_details?.personal_information?.registration_number.toLowerCase();
    const semesterName = data?.registration_details_info?.semester?.semester_name.toLowerCase();
    return regNumber.includes(searchTerm) || semesterName.includes(searchTerm);
  });

  return (
    <>
      <div className="print">
        <h2 className="text1">Approved List</h2>

       
        {/* <div className="search-bar">
          <input
            type="search"
            id="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <ul id="search-results"></ul>
        </div> */}

        <button className="printbtn" onClick={handlePrint}>
          Download
        </button>

        {loading1 &&  <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>}
        <div>
          {searchMessage && <p>{searchMessage}</p>}
          {uniqueRegistrationNumbers?.length===0 ? (<center>
            <img src="./images/No_data.png" alt="" style={{width:"310px",borderRadius:"10px",marginTop:"30px"}}/></center>):( uniqueRegistrationNumbers.map((regNumber, index) => {
            // Find the first occurrence of this registration number in searchResults
            const student = searchResults.find(data =>
              data?.registration_details_info?.student_details?.personal_information?.registration_number === regNumber);

           

            return (
              <div key={index} className="id-card">
                <div className="info">
                  <p>
                    <span className="label">Name:</span>{" "}
                    {student?.registration_details_info?.student_details?.personal_information?.first_name}{" "}{student?.registration_details_info?.student_details?.personal_information?.last_name}
                  </p>
                  <p>
                    <span className="label">Registration No:</span>{" "}
                    {student?.registration_details_info?.student_details?.personal_information?.registration_number}
                  </p>
                  <p>
                    <span className="label">Semester:</span>{" "}
                    {student?.registration_details_info?.semester?.semester_name}
                  </p>
                </div>
                
              </div>
            );
          
          }))}
        </div>
      </div>
    </>
  );
};

export default ApprovedList;
