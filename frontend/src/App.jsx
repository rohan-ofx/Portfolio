import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import ProtectedAdminRoute from "./admin/components/AdminRoute.jsx";

import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import Skills from "./pages/Skills.jsx";
import Experience from "./pages/Experience.jsx";
import Education from "./pages/Education.jsx";
import Certification from "./pages/Certificates.jsx";
import Achievements from "./pages/Achievements.jsx";
import CodingProfile from "./pages/CodingProfile.jsx";
import Contact from "./pages/Contact.jsx";

import Register from "./admin/pages/Register.jsx";
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import Projectss from "./admin/pages/project.jsx";
import SkillsAdmin from "./admin/pages/Skill.jsx";
import NewSkill from "./admin/pages/NewSkills.jsx";
import EditSkill from "./admin/pages/EditSkill.jsx";
import ExperienceAdmin from "./admin/pages/Experience.jsx";
import NewExperience from "./admin/pages/NewExperience.jsx";
import EditExperience from "./admin/pages/EditExperience.jsx";
import EducationAdmin from "./admin/pages/Education.jsx";
import NewEducation from "./admin/pages/NewEducation.jsx";
import EditEducation from "./admin/pages/EditEducation.jsx";
import CertificationsAdmin from "./admin/pages/Certification.jsx";
import NewCertification from "./admin/pages/NewCertification.jsx";
import EditCertification from "./admin/pages/EditCertification.jsx";
import AchievementsAdmin from "./admin/pages/Achivements.jsx";
import NewAchievement from "./admin/pages/NewAchivement.jsx";
import EditAchievement from "./admin/pages/EditAchivement.jsx";
import CodingProfilesAdmin from "./admin/pages/CodingProfile.jsx";
import NewCodingProfile from "./admin/pages/NewCodingProfile.jsx";
import EditCodingProfile from "./admin/pages/EditCodingProfile.jsx";
import SiteSettings from "./admin/pages/SiteSettings.jsx";
import Messages from "./admin/pages/Message.jsx";
import NewProject from "./admin/pages/NewProject.jsx";
import EditProject from "./admin/pages/EditProject.jsx";

function App() {
  return (
    <>
      

      <Routes>

        <Route element={<PublicLayout/>}>

        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/education" element={<Education />} />
        <Route path="/certifications" element={<Certification />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/coding" element={<CodingProfile />} />
        <Route path="/contact" element={<Contact />} />

        </Route>

        <Route
            path="/admin/login" 
             element={<AdminLogin/>}
             />
             <Route
                path="/admin/register"
                   element={<Register />}/>
             
             <Route element={<ProtectedAdminRoute/>}>
             <Route element={<AdminLayout/>}>
             <Route path="/admin/dashboard" element={<Dashboard/>}/>
             <Route path="/admin/projects" element={<Projectss/>}/>
             <Route path="/admin/projects/new" element={<NewProject />} />
             <Route path="/admin/projects/edit/:id" element={<EditProject />} />
             <Route path="/admin/skills" element={<SkillsAdmin />} />
              <Route path="/admin/skills/new" element={<NewSkill />} />
              <Route path="/admin/skills/edit/:id" element={<EditSkill />} />
              <Route path="/admin/experience" element={<ExperienceAdmin />}/>
              <Route path="/admin/experience/new" element={<NewExperience />}/>
              <Route path="/admin/experience/edit/:id" element={<EditExperience />}/>
              <Route  path="/admin/education"  element={<EducationAdmin />}/>
              <Route path="/admin/education/new" element={<NewEducation />}/>
              <Route path="/admin/education/edit/:id" element={<EditEducation />}/>
              <Route
  path="/admin/certifications"
  element={<CertificationsAdmin />}
/>

<Route
  path="/admin/certifications/new"
  element={<NewCertification />}
/>

<Route
  path="/admin/certifications/edit/:id"
  element={<EditCertification />}
/>
<Route
  path="/admin/achievements"
  element={<AchievementsAdmin />}
/>

<Route
  path="/admin/achievements/new"
  element={<NewAchievement />}
/>

<Route
  path="/admin/achievements/edit/:id"
  element={<EditAchievement />}
/>
<Route
  path="/admin/coding"
  element={<CodingProfilesAdmin />}
/>

<Route
  path="/admin/coding/new"
  element={<NewCodingProfile />}
/>

<Route
  path="/admin/coding/edit/:id"
  element={<EditCodingProfile />}
/>
<Route
  path="/admin/settings"
  element={<SiteSettings />}
/>
<Route
  path="/admin/messages"
  element={<Messages />}
/>
             </Route>

         </Route>
       
      </Routes>

    
    </>
  );
}

export default App;