import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import VerifyOtp from "./pages/varifyOTP.jsx";
import Register from "./pages/register.jsx";
import ForgotPassword from "./pages/forgot-password.jsx";
import VerifyResetOtp from "./pages/Vrfy-Reset-otp.jsx";
import ResetPassword from "./pages/reser-password.jsx";
import DashboardLayout from "./components/dashbordLayout.jsx";
import Dashboard from "./components/dashbord.jsx";
import Tasks from "./pages/task.jsx"
import CreateTask from "./pages/create-task.jsx"
import Trash from "./pages/trash.jsx"
import Profile from "./pages/profile.jsx"
import Notifications from "./pages/notification.jsx";
import UpdateTask from "./pages/update-task.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

           <Route path="tasks" element={<Tasks />} />

          <Route path="create-task" element={<CreateTask />} />

          <Route path="trash" element={<Trash />} />

          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route  path="update-task/:id"element={<UpdateTask />}
/>
        </Route>
 
      </Routes>
    </BrowserRouter>
  );
}

export default App;