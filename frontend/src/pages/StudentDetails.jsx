import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DeleteDialog from '../components/DeleteDialog.jsx';
import { deleteStudent, getStudent } from '../services/studentApi.js';

function initials(name) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

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

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setError('');
    getStudent(id, controller.signal)
      .then((record) => { if (!controller.signal.aborted) { setStudent(record); setStatus('success'); } })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        if (requestError.status === 404) setStatus('not-found');
        else { setError('Unable to load student.'); setStatus('error'); }
      });
    return () => controller.abort();
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteStudent(id);
      navigate('/students');
    } catch (requestError) {
      setDeleting(false);
      setShowDelete(false);
      setError(requestError.message || 'Unable to delete student.');
    }
  }

  if (status === 'loading') return <div className="page-content"><div className="panel loading-panel loading-state" role="status">Loading student...</div></div>;
  if (status === 'not-found') return <div className="page-content"><NotFoundState /></div>;
  if (status === 'error') return <div className="page-content"><div className="panel error-panel error-state" role="alert"><div><strong>Unable to load student.</strong><span>{error}</span></div><Link className="button secondary-button" to="/students">Back to Students</Link></div></div>;

  return (
    <div className="page-content narrow-content">
      <header className="page-header form-page-header">
        <div><p className="eyebrow">Directory</p><h1>Student Details</h1><p className="page-subtitle">Review the selected student record.</p></div>
        <Link className="text-link" to="/students">← Back to Students</Link>
      </header>
      {error && <div className="form-error-banner" role="alert">{error}</div>}
      <section className="panel details-panel">
        <div className="details-hero"><span className="large-avatar" aria-hidden="true">{initials(student.name)}</span><div><h2>{student.name}</h2><p>{student.department} · Level {student.level}</p></div></div>
        <div className="details-grid">
          <div><span className="detail-label">Email</span><strong>{student.email}</strong></div>
          <div><span className="detail-label">Phone</span><strong>{student.phone}</strong></div>
          <div><span className="detail-label">Department</span><strong>{student.department}</strong></div>
          <div><span className="detail-label">Level</span><strong>{student.level} Level</strong></div>
          <div><span className="detail-label">Added</span><strong>{new Date(student.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</strong></div>
        </div>
        <div className="details-actions"><Link className="button secondary-button" to="/students">Back to Students</Link><Link className="button primary-button" to={`/students/${student.id}/edit`}>Edit Student</Link><button className="button danger-outline-button" type="button" onClick={() => setShowDelete(true)}>Delete Student</button></div>
      </section>
      {showDelete && <DeleteDialog studentName={student.name} deleting={deleting} onCancel={() => setShowDelete(false)} onConfirm={handleDelete} />}
    </div>
  );
}
