import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StudentForm from '../components/StudentForm.jsx';
import { createStudent } from '../services/studentApi.js';

export default function AddStudent() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(values) {
    setSubmitting(true);
    setError('');
    try {
      const student = await createStudent(values);
      navigate(`/students/${student.id}`);
    } catch (requestError) {
      setError(requestError.message || 'Unable to add student.');
      setSubmitting(false);
    }
  }

  return (
    <div className="page-content narrow-content">
      <header className="page-header form-page-header">
        <div><p className="eyebrow">Directory</p><h1>Add Student</h1><p className="page-subtitle">Create a new student record.</p></div>
        <Link className="text-link" to="/students">← Back to Students</Link>
      </header>
      <section className="panel form-panel">
        <div className="section-heading"><div><h2>Student information</h2><p>Enter the details below to add a student.</p></div></div>
        <StudentForm submitLabel="Add Student" submittingLabel={submitting ? 'Adding Student...' : ''} onSubmit={handleSubmit} serverError={error} />
      </section>
    </div>
  );
}
