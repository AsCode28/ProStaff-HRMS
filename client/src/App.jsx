import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// lazy loading: each page loads only when opened
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Leaves = lazy(() => import('./pages/Leaves'));
const LeaveRequests = lazy(() => import('./pages/LeaveRequests'));
const Announcements = lazy(() => import('./pages/Announcements'));
const Trainings = lazy(() => import('./pages/Trainings'));
const ManageUsers = lazy(() => import('./pages/ManageUsers'));

const P = ({ children, roles }) => <ProtectedRoute roles={roles}>{children}</ProtectedRoute>;

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container my-4">
        <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<P><Dashboard /></P>} />
            <Route path="/profile" element={<P><Profile /></P>} />
            <Route path="/attendance" element={<P><Attendance /></P>} />
            <Route path="/leaves" element={<P><Leaves /></P>} />
            <Route path="/announcements" element={<P><Announcements /></P>} />
            <Route path="/trainings" element={<P><Trainings /></P>} />
            <Route path="/requests" element={<P roles={['manager', 'hr']}><LeaveRequests /></P>} />
            <Route path="/users" element={<P roles={['hr']}><ManageUsers /></P>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}
