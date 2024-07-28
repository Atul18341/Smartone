import React from 'react'
import "./UnderDevelopment.css"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NavbarNew from "../components/NavbarNew";
import {Footer} from "../components/Footer";

function UnderDevelopment() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage?.getItem("accesstoken")) {
      const response = jwtDecode(sessionStorage?.getItem("accesstoken"));
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
    <>
   
     
      <div class="fullArea" >
      <NavbarNew/>
      <div class="context">
        <h1>This Page is Under Development</h1>
      </div>
        <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
      </div >
      <Footer/>
    </>
  )
}

export default UnderDevelopment
