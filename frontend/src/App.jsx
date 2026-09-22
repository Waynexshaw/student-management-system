import { Link, Route, Routes } from 'react-router-dom';

function PagePlaceholder({ title, description }) {
  return (
    <main className="page-shell">
      <p className="eyebrow">Student Management System</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link className="back-link" to="/">Return to dashboard foundation</Link>
    </main>
  );
}

function Dashboard() {
  return (
    <main className="page-shell">
      <p className="eyebrow">Student Management System</p>
      <h1>Dashboard foundation</h1>
      <p>Phase 1 routing is ready. Student management screens will be added in a later phase.</p>
      <nav aria-label="Application routes">
        <Link to="/students">Student list placeholder</Link>
        <Link to="/students/new">Add student placeholder</Link>
      </nav>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/students" element={<PagePlaceholder title="Student list" description="The student list will be implemented in a later phase." />} />
      <Route path="/students/new" element={<PagePlaceholder title="Add student" description="The add-student form will be implemented in a later phase." />} />
      <Route path="/students/:id" element={<PagePlaceholder title="Student details" description="Student details will be implemented in a later phase." />} />
      <Route path="/students/:id/edit" element={<PagePlaceholder title="Edit student" description="The edit-student form will be implemented in a later phase." />} />
    </Routes>
  );
}
