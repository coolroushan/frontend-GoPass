import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import VisitorRegistration from './pages/VisitorRegistration';
import Attendance from './pages/Attendance';
import AdminLogin from './pages/AdminLogin';
import EventPass from './pages/EventPass';
import Reports from './pages/Reports';
import QRAttendance from './pages/QRAttendance';
import Events from './pages/Events';
import PageNotFound from './pages/PageNotFound';
import ProtectedRoute from './routes/ProtectedRoute';

// Import the ProtectedRoute component


function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTE --- */}
        {/* Accessible by anyone. This is where unauthenticated users are sent. */}
        <Route path="/signin" element={<AdminLogin />} />

        {/* --- PROTECTED ROUTES --- */}
        {/* We wrap the Layout route inside the ProtectedRoute. 
            This checks for the token before rendering the Layout or any children. */}
        <Route element={<ProtectedRoute />}>
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="visitor" element={<VisitorRegistration />} />
            <Route path="event-passes" element={<EventPass />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="qr-attendance" element={<QRAttendance />} />
            <Route path="events" element={<Events />} />
          </Route>

        </Route>

        {/* --- 404 PAGE --- */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;