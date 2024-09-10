import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { BaseUrl, Url } from "../components/BaseUrl";
import { enqueueSnackbar } from "notistack";
import { Box, CircularProgress } from "@mui/material";

export const BonafideCertificate = () => {
  const [result, setResult] = useState([]);
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [college,setCollege]=useState();



  const regenerateToken = () => {
    if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      const response1 = jwtDecode(sessionStorage?.getItem("refreshtoken"));
      if (response.exp < Math.floor(Date.now() / 1000) || response1.exp < Math.floor(Date.now() / 1000)) {
        navigate("/login");
      }else{
        if (sessionStorage.getItem("refreshtoken") && sessionStorage.getItem("accesstoken")) {
          let data = {
            refresh: sessionStorage?.getItem("refreshtoken"),
          };
    
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${Url}/token/refresh/`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage?.getItem("accesstoken")}`,
            },
            data: data,
          };
    
          axios
            .request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
              sessionStorage.setItem("accesstoken", response.data.access);
            })
            .catch((error) => {
              if(error?.message==='Request failed with status code 500'){
                navigate('/login');
              }
              if(error?.response?.data?.errors?.detail==="Given token not valid for any token type"){
                enqueueSnackbar("Logging out", {
                  variant: "error",
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                  },
                  autoHideDuration: 3000,
                });  
                navigate("/login");
              }
              console.log(error);
            });
        } else {
          navigate("/login");
        }
      }
    } else {
      navigate("/login");
    }
   
  };

  useEffect(() => {
    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");
  
    if (token && token1) {
      let currentDate = new Date();
      const decodedToken = jwtDecode(token);
  
      if (decodedToken.exp * 1000 - currentDate.getTime() < 59 * 60 * 1000) {
        try {
          regenerateToken(); // Wait for the token regeneration to complete
        } catch (error) {
          console.error(
            "Error in request interceptor while regenerating token:",
            error
          );
        }
      }
  
      const response = jwtDecode(token);
  
      axios
        .get(
          `${BaseUrl}/${response.college}/bonafide/?search=${jwtDecode(
            sessionStorage.getItem("accesstoken")
          ).registration_number}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accesstoken")}`,
            },
          }
        )
        .then((response) => {
          setLoading(false);
          if (response?.data?.[0]?.status === "pending") {
            enqueueSnackbar("Bonafide Certificate is not verified yet.", {
              variant: "warning",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              autoHideDuration: 1000,
            });
            navigate("/dashboard");
          }
          setResult(response.data);
        })
        .catch((error) => {
          console.error(error);
  
          if (
            error?.response?.data?.errors?.detail ===
            "Given token not valid for any token type"
          ) {
            enqueueSnackbar("Logging out", {
              variant: "error",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              autoHideDuration: 3000,
            });
            navigate("/login");
          }
        });
      setCollege(response.college);
    } else {
      navigate("/login");
    }
  }, []);
  

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
      <div className="container mx-auto print:px-0 print:py-0 print:mx-0 print:w-full print:max-w-none">
        <div className="flex justify-between items-center pb-4 print:flex-col print:items-start">
          <div className="flex items-center space-x-2 print:hidden"></div>
        </div>
        <div className="border border-gray-200 rounded-lg px-8 py-12 print:border-none print:rounded-none print:px-16 print:py-16">
          <div className="text-center pb-4">
            <div className="flex flex-col items-center space-y-4">
              <img
                src={`https://smart-backend-uebh.onrender.com${result?.[0]?.college_details?.college_logo}`}
                alt="College Logo"
                className="w-24 h-24 print:w-32 print:h-32 object-cover rounded-2xl"
              />
              <div className="text-center">
                <h2 className="text-2xl font-bold print:text-3xl">
                  DEPARTMENT OF SCIENCE & TECHNOLOGY
                </h2>
                <h3 className="text-xl font-medium print:text-2xl">
                 {result?.[0]?.college_details?.college_name}, {result?.[0]?.college_details?.college_address}
                </h3>
                <p className="text-gray-500 print:text-lg">
                {result?.[0]?.college_details?.college_address}
                  <br />
                  PH. NO. {result?.[0]?.college_details?.phone_number}
                  <br />
                  E-MAIL ID- <span>{result?.[0]?.college_details?.college_email}</span>
                </p>
              </div>
            </div>
          </div>
          <center>
            <h2
              className="text-2xl font-bold pb-2"
              style={{ textDecoration: "underline" }}
            >
              Bonafide Certificate
            </h2>
          </center>
          <p className="text-justify leading-loose print:text-lg">
            This is to certify that{" "}
            <b>
              {result?.[0]?.student_details?.personal_information?.first_name?.slice(0, 1)?.toUpperCase()}
              {result?.[0]?.student_details?.personal_information?.first_name?.slice(1)}{" "}
              {result?.[0]?.student_details?.personal_information?.last_name?.slice(0, 1)?.toUpperCase()}
              {result?.[0]?.student_details?.personal_information?.last_name?.slice(1)}
            </b>{" "}
            S/o or D/o{" "}
            <b>
              {" "}
              {result?.[0]?.student_details?.personal_information?.father_name?.slice(0, 1)?.toUpperCase()}
              {result?.[0]?.student_details?.personal_information?.father_name?.slice(1)}
            </b>{" "}
            bearing College Roll No.-{" "}
            <b> {result?.[0]?.student_details?.personal_information?.registration_number}</b> is a bonafide student
            of<b> {result?.[0]?.student_details?.academic_information?.year} </b>Semester/Year. (Batch{" "}
            <b>{profile?.academic_information?.session}</b>)
            <b> {result?.[0]?.student_details?.academic_information?.branch?.toUpperCase()} Department</b>, under B.Tech
            Programme of this Institute. Class starts from{" "}
            <b>{result?.[0]?.student_details?.academic_information?.date_of_admission}</b> After completing the usual
            academic procedure, he/she has been enrolled under the 04 years
            B.Tech programme of the Institute.
          </p>
          <div className="flex justify-end print:justify-center">
            <p className="text-right print:text-center">
              Principal/OSD
              <br />
              {result?.[0]?.college_details?.college_name}
              <br />
              {result?.[0]?.college_details?.college_address}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BonafideCertificate;
