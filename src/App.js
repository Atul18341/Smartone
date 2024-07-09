import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { RegisterUser } from "./pages/RegisterUser";
import {Home} from "./pages/Home.js";
import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/Login";
import { Leave } from "./pages/Leave";
import { Profile } from "./pages/Profile";
import { BonafideCertificate } from "./pages/BonafideCertificate";
import { EditProfile } from "./pages/EditProfile";
import { About } from "./pages/About.js";
import {ChangePassword} from "./components/ChangePassword.js";
import {SemesterRegistration} from "./components/Semester/SemesterRegistration";
import BonafideForm from "./pages/BonafideForm.js";
import { GuestRoom } from "./pages/GuestRoom.js";
import { Logout } from "./pages/Logout.js";
import { HostelRoomRequest } from "./pages/HostelRoomRequest.js";
import HostelfeePayment from './pages/HostelfeePayment.js'
import { SemSubject } from "./pages/SemSubject.js";
import SemBranch from "./pages/SemBranch.js";
import ComplaintForm from "./pages/Complain.js";
import UnderDevelopment from "./pages/UnderDevelopment";
import NoDuesForDegree from "./components/NoDuesForDegree/NoDuesForDegree.js"
import { HostelNoDueReq } from "./pages/HostelNoDueReq.js";
import CollegeForm from "./pages/College.js";
import HostelRoomAllotment from "./pages/HostelRoomAllotment.js";
import AddFeesCaretaker from "./pages/AddFessCaretaker.js";
import VerifySemesterRegistration from "./components/VerifySemesterRegistration/VerifySemesterRegistration.js";
import FacultySemesterRegistration from "./components/VerifySemesterRegistration/FacultySemesterRegistration.js";
import ShowHostelRoomRequest from "./pages/ShowHostelRoomRequest.js";
import Contact from "./pages/Contact.js";
import NoDuesForDegreeApproval from "./pages/NoDuesForDegreeApproval";
import NotFoundPage from "./pages/NotFoundPage.js";

function App() {
  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profileEdit" element={<EditProfile />} />
            <Route path="/about" element={<About/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path='/bonafide-form' element={<BonafideForm/>}/>
            <Route path='/guest-room' element={<GuestRoom/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/hostel-room-request" element={<HostelRoomRequest/>}/>
            <Route path="/add-college" element={<CollegeForm/>}/>
            <Route path="/hostel-room-allotment-requests" element={<ShowHostelRoomRequest/>}/>
            <Route
              path="/bonafideCertificate"
              element={<BonafideCertificate />}
            />
             <Route path="/change-password" element={<ChangePassword/>}/>
             <Route path="/hostel-no-dues-request" element={<HostelNoDueReq/>}/>
             <Route
              path="/semesterRegistration"
              element={<SemesterRegistration />}
            />
            <Route path='/No-dues-for-degree-approval' element={<NoDuesForDegreeApproval/>}/>
            <Route path="/add-fees" element={<AddFeesCaretaker/>}/>
            <Route path="/hostel-room-allotment" element={<HostelRoomAllotment/>}/>
            <Route path="/sem-sub-register" element={<SemSubject/>}/>
            <Route path="/sem-branch-register" element={<SemBranch/>}/>
            <Route path="/hostel-mess-fee-payment" element={<HostelfeePayment/>} />
            <Route path="/complaints" element={ <ComplaintForm/> } />
            <Route path="/underDevelopment" element={ <UnderDevelopment/> } />
            <Route path="/no-dues-for-degree" element={ <NoDuesForDegree/> } />
            <Route path="/verifySemesterRegistration" element={<VerifySemesterRegistration/>} />
            <Route path="/facultySemesterRegistration/:id/:reg" element={<FacultySemesterRegistration/>} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </Router>

    </>
  );
}

export default App;