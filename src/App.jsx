import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExamSession from './pages/ExamSession';

// Placeholder pour les vues Admin restantes
const Placeholder = ({ title }) => (
  <div className="fade-in" style={{ padding: '30px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
    <h2 style={{ color: '#2d3436', fontWeight: '800' }}>{title}</h2>
    <p style={{ color: '#636e72', marginTop: '10px' }}>Cette interface sera disponible dans la prochaine vague de developpement.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="exam/:id" element={<ExamSession />} />
          </Route>

          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Placeholder title="Panel Administrateur" />} />
            <Route path="submissions" element={<Placeholder title="Gestion des copies" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
