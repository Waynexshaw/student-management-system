import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import AddStudent from './pages/AddStudent.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EditStudent from './pages/EditStudent.jsx';
import Students from './pages/Students.jsx';
import StudentDetails from './pages/StudentDetails.jsx';

function PagePlaceholder({ title, description }) {
  return (
    <main className="placeholder-page">
      <p className="eyebrow">StudentMS</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link className="button secondary-button" to="/">Return to dashboard</Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/new" element={<AddStudent />} />
        <Route path="/students/:id" element={<StudentDetails />} />
        <Route path="/students/:id/edit" element={<EditStudent />} />
      </Route>
    </Routes>
  );
}
