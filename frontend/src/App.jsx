import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Students from './pages/Students.jsx';

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
        <Route path="/students/new" element={<PagePlaceholder title="Add Student" description="The student form will be available in a later phase." />} />
        <Route path="/students/:id" element={<PagePlaceholder title="Student Details" description="Student details will be available in a later phase." />} />
        <Route path="/students/:id/edit" element={<PagePlaceholder title="Edit Student" description="Student editing will be available in a later phase." />} />
      </Route>
    </Routes>
  );
}
