import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { BaseUrl, Url } from "../components/BaseUrl";
import { enqueueSnackbar } from "notistack";
import { Box, CircularProgress, Button } from "@mui/material";
import { FaPrint } from "react-icons/fa"; // Ensure you have react-icons installed or remove this icon

export const BonafideCertificate = () => {
  const [result, setResult] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  // --- Auth Logic (Kept same as provided) ---
  const regenerateToken = () => {
    if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
      const response1 = jwtDecode(sessionStorage?.getItem("refreshtoken"));
      if (
        response.exp < Math.floor(Date.now() / 1000) ||
        response1.exp < Math.floor(Date.now() / 1000)
      ) {
        navigate("/login");
      } else {
        if (
          sessionStorage.getItem("refreshtoken") &&
          sessionStorage.getItem("accesstoken")
        ) {
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
              sessionStorage.setItem("accesstoken", response.data.access);
            })
            .catch((error) => {
              if (error?.message === "Request failed with status code 500") {
                navigate("/login");
              }
              if (
                error?.response?.data?.errors?.detail ===
                "Given token not valid for any token type"
              ) {
                navigate("/login");
              }
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
    // Set current date for the certificate
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    setCurrentDate(`${dd}/${mm}/${yyyy}`);

    const token = sessionStorage.getItem("accesstoken");
    const token1 = sessionStorage.getItem("refreshtoken");

    if (token && token1) {
      let currentDateToken = new Date();
      const decodedToken = jwtDecode(token);

      if (
        decodedToken.exp * 1000 - currentDateToken.getTime() <
        59 * 60 * 1000
      ) {
        try {
          regenerateToken();
        } catch (error) {
          console.error("Error generating token:", error);
        }
      }

      const response = jwtDecode(token);

      axios
        .get(
          `${BaseUrl}/${response.college}/bonafide/?search=${
            jwtDecode(sessionStorage.getItem("accesstoken")).registration_number
          }`,
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
              autoHideDuration: 3000,
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
            navigate("/login");
          }
        });
    } else {
      navigate("/login");
    }
  }, []);

  const handlePrint = () => {
    window.print();
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

  // Extract Data for cleaner JSX
  const data = result?.[0];
  const college = data?.college_details;
  const student = data?.student_details?.personal_information;
  const academic = data?.student_details?.academic_information;

  return (
    <>
      {/* --- CSS for A4 Paper Layout --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Tinos:wght@400;700&display=swap');

          body {
            background-color: #f3f4f6; /* gray-100 */
          }
          
          .certificate-container {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            font-family: 'Tinos', serif; /* Official Serif Font */
            color: #000;
            position: relative;
          }

          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            body {
              background-color: white;
            }
            .certificate-container {
              margin: 0;
              box-shadow: none;
              width: 100%;
              height: 100%;
              padding: 20mm;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      {/* --- Control Bar (Hidden on Print) --- */}
      <Box
        className="no-print"
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          marginTop: 4,
          marginBottom: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPrint />}
          onClick={handlePrint}
        >
          Print / Download PDF
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      {/* --- A4 Paper Container --- */}
      <div className="certificate-container">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
            {/* Logo */}
            <div className="w-1/5 flex justify-center">
             {college?.college_logo && (
                <img
                  src={`https://smartone.pythonanywhere.com${college.college_logo}`}
                  alt="Logo"
                  className="h-28 w-28 object-contain"
                />
             )}
            </div>

            {/* College Details */}
            <div className="w-3/5 text-center">
                <h1 className="text-sm font-bold tracking-widest uppercase mb-1">
                    Department of Science & Technology
                </h1>
                <h2 className="text-2xl font-bold uppercase text-blue-900 mb-1 leading-tight">
                    {college?.college_name}
                </h2>
                <p className="text-sm font-semibold mb-1">
                    {college?.college_address}
                </p>
                <p className="text-xs text-gray-700">
                    Email: {college?.college_email} | Phone: {college?.phone_number}
                </p>
            </div>

            {/* Spacer/QR Placeholder */}
            <div className="w-1/5"></div>
        </div>

        {/* Ref No & Date Row */}
        <div className="flex justify-between text-base font-semibold mb-12 px-2">
            <p>Ref No: <span className="font-normal border-b border-dotted border-black px-2">{data?.id ? `BON/${new Date().getFullYear()}/${data.id}` : "_________"}</span></p>
            <p>Date: <span className="font-normal">{currentDate}</span></p>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold uppercase underline decoration-2 underline-offset-4">
                Bonafide Certificate
            </h1>
        </div>

        {/* Body Content */}
        <div className="text-lg leading-loose text-justify px-2 mb-20 font-light">
            <p className="indent-10">
                This is to certify that Mr./Ms. <span className="font-bold text-xl uppercase px-2">{student?.first_name} {student?.last_name}</span>, 
                Son/Daughter of <span className="font-bold text-xl uppercase px-2">{student?.father_name}</span>, 
                bearing Registration Number <span className="font-bold text-xl px-2">{student?.registration_number}</span> 
                is a bonafide student of this Institution.
            </p>
            <p className="mt-6 indent-10">
                He/She is currently studying in the <span className="font-bold">{academic?.year}</span> Year 
                (Session <span className="font-bold">{academic?.session || "20__-20__"}</span>) 
                of the <span className="font-bold uppercase">{academic?.branch}</span> Branch under the B.Tech Programme.
            </p>
            <p className="mt-6 indent-10">
                His/Her date of admission to this institute is <span className="font-bold">{academic?.date_of_admission || "N/A"}</span>. 
                To the best of my knowledge, he/she bears a good moral character.
            </p>
        </div>

        {/* Footer / Signature */}
        <div className="flex justify-between items-end mt-20 px-4">
            <div className="text-center">
               {/* Optional: Clerk Signature */}
            </div>

            <div className="text-center w-64">
                <div className="h-16 mb-2">
                    {/* Placeholder for Digital Signature Image if available */}
                </div>
                <p className="font-bold text-lg">Principal / O.S.D</p>
                <p className="text-sm font-semibold">{college?.college_name}</p>
                <p className="text-xs">{college?.college_address?.split(',')[0]}</p>
            </div>
        </div>

        {/* Bottom Note */}
        <div className="absolute bottom-10 left-0 w-full text-center text-xs text-gray-500">
            <p>This is a computer-generated document.</p>
        </div>

      </div>
    </>
  );
};

export default BonafideCertificate;
