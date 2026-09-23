import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StudentForm from '../components/StudentForm.jsx';
import { getStudent, updateStudent } from '../services/studentApi.js';

function NotFoundState() {
  return (
    <div className="panel centered-state">
      <div className="empty-icon" aria-hidden="true">?</div>
      <h2>Student not found</h2>
      <p>The student may have been removed or does not exist.</p>
      <Link className="button secondary-button" to="/students">Back to Students</Link>
    </div>
  );
}

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState('loading');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    getStudent(id, controller.signal)
      .then((record) => { if (!controller.signal.aborted) { setStudent(record); setStatus('success'); } })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setStatus(requestError.status === 404 ? 'not-found' : 'error');
        setError(requestError.status === 404 ? '' : 'Unable to load student.');
      });
    return () => controller.abort();
  }, [id]);

  async function handleSubmit(values) {
    setSubmitting(true);
    setError('');
    try {
      await updateStudent(id, values);
      navigate(`/students/${id}`);
    } catch (requestError) {
      setError(requestError.message || 'Unable to update student.');
      setSubmitting(false);
    }
  }

  if (status === 'loading') return <div className="page-content"><div className="panel loading-panel loading-state" role="status">Loading student...</div></div>;
  if (status === 'not-found') return <div className="page-content"><NotFoundState /></div>;
  if (status === 'error') return <div className="page-content"><div className="panel error-panel error-state" role="alert"><div><strong>Unable to load student.</strong><span>{error}</span></div><Link className="button secondary-button" to="/students">Back to Students</Link></div></div>;

  return (
    <div className="page-content narrow-content">
      <header className="page-header form-page-header">
        <div><p className="eyebrow">Directory</p><h1>Edit Student</h1><p className="page-subtitle">Update the selected student record.</p></div>
        <Link className="text-link" to={`/students/${id}`}>← Back to Details</Link>
      </header>
      <section className="panel form-panel">
        <div className="section-heading"><div><h2>Student information</h2><p>Update the details below and save your changes.</p></div></div>
        <StudentForm initialValues={student} submitLabel="Save Changes" submittingLabel={submitting ? 'Saving...' : ''} onSubmit={handleSubmit} serverError={error} cancelTo={`/students/${id}`} />
      </section>
    </div>
  );
}
