import React from 'react'
import  Footer  from '../components/Home/Footer'
import HostelfeePayments from "../components/HostelFeePayments"
import NavbarNew from '../components/NavbarNew'
import { BannerSection } from '../components/BannerSection'

function HostelfeePayment() {
  return (
    <>
      <NavbarNew/>
      <BannerSection image={"../images/banner7.jpg"} title={"Hostel/Mess Fees Payment"} subtitle={"Efficiently manage hostel/mess payment requests by prioritizing student submissions and ensuring accurate verification. Customize the process to guarantee timely payments and precise record-keeping."}/>
      <HostelfeePayments/>
      <Footer/>
    </>
  )
}

export default HostelfeePayment
