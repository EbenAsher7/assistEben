import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import RegisterAttendance from "./pages/RegisterAttendance";
// import NewRegister from "./pages/NewRegister";
import Administration from "./pages/Administration";
import PageRegister from "./pages/PageRegister";
import QuestionUser from "./components/Preguntas/QuestionUser";
import QuestionsAdmin from "./components/Admin/QuestionsAdmin";
import ProtectedRoute from "./pages/ProtectedRoute";
import TutorialesPage from "./pages/TutorialesPage";

const App = () => {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 w-full h-dvh overflow-y-auto pb-5 text-black dark:text-white">
      <Navbar />
      <div className="mt-[60px] sm:mt-[70px] "></div> {/* Navbar height */}
      <Toaster />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/registerAttendance" element={<RegisterAttendance />} />
        <Route path="/newRegister" element={<PageRegister />} />
        <Route path="/admin" element={<Administration />} />
        <Route path="/questions" element={<QuestionUser />} />
        <Route path="/tutoriales" element={<TutorialesPage />} />
        <Route
          path="/adminquestions"
          element={
            <ProtectedRoute>
              <QuestionsAdmin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
