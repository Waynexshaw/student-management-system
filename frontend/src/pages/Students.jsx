import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudents } from '../services/studentApi.js';

function StudentAvatar({ name }) {
  return <span className="avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>;
}

function StudentActions({ id }) {
  return (
    <div className="row-actions">
      <Link className="action-link" to={`/students/${id}`}>View</Link>
      <Link className="action-link" to={`/students/${id}/edit`}>Edit</Link>
    </div>
  );
}

function EmptyStudents() {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">○</div>
      <h2>No students found</h2>
      <p>Student records will appear here after you add your first student.</p>
      <Link className="button primary-button" to="/students/new">Add Student</Link>
    </div>
  );
}

export default function Students() {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('loading');
  const [retryToken, setRetryToken] = useState(0);

  const loadStudents = useCallback(async (signal) => {
    setStatus('loading');
    try {
      const records = await getStudents(signal);
      if (!signal.aborted) {
        setStudents(records);
        setStatus('success');
      }
    } catch {
      if (!signal.aborted) setStatus('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadStudents(controller.signal);
    return () => controller.abort();
  }, [loadStudents, retryToken]);

  return (
    <div className="page-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Directory</p>
          <h1>Students</h1>
          <p className="page-subtitle">Manage and review your student records.</p>
        </div>
        <Link className="button primary-button" to="/students/new">+ Add Student</Link>
      </header>

      {status === 'loading' && <div className="panel notice loading-state" role="status">Loading students...</div>}
      {status === 'error' && (
        <div className="panel notice error-state" role="alert">
          <div><strong>Unable to load students.</strong><span>Please try again.</span></div>
          <button className="button retry-button" onClick={() => setRetryToken((value) => value + 1)}>Retry</button>
        </div>
      )}
      {status === 'success' && (
        <section className="panel student-panel">
          <div className="section-heading list-heading">
            <div>
              <h2>All Students</h2>
              <p>{students.length} {students.length === 1 ? 'record' : 'records'} in the directory.</p>
            </div>
          </div>
          {students.length === 0 ? <EmptyStudents /> : (
            <>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Department</th><th>Level</th><th>Actions</th></tr></thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td><span className="table-name"><StudentAvatar name={student.name} /><strong>{student.name}</strong></span></td>
                        <td>{student.email}</td>
                        <td>{student.phone}</td>
                        <td>{student.department}</td>
                        <td><span className="level-badge">{student.level}</span></td>
                        <td><StudentActions id={student.id} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mobile-student-list">
                {students.map((student) => (
                  <article className="mobile-student-card" key={student.id}>
                    <div className="mobile-card-header"><span className="table-name"><StudentAvatar name={student.name} /><strong>{student.name}</strong></span><span className="level-badge">{student.level}</span></div>
                    <dl><div><dt>Email</dt><dd>{student.email}</dd></div><div><dt>Phone</dt><dd>{student.phone}</dd></div><div><dt>Department</dt><dd>{student.department}</dd></div></dl>
                    <StudentActions id={student.id} />
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
