import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SlotAdminPage from './pages/admin/SlotAdminPage';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import IdleTimeout from './components/layout/IdleTimeout';
import MyAppointmentsPage from './pages/student/AppointmentsPage';
import ProfilePage from './pages/student/ProfilePage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import ActivatePage from './pages/auth/ActivatePage';

function App() {
  return (
    <BrowserRouter>
      <IdleTimeout />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/activate" element={<ActivatePage />} />

        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute>
              <MyAppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/slots"
          element={
            <ProtectedRoute requireAdmin={true}>
              <SlotAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminAppointmentsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;