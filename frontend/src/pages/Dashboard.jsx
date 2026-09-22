import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard.jsx';
import { getStudents } from '../services/studentApi.js';

function EmptyRecentStudents() {
  return (
    <div className="empty-state compact-empty">
      <div className="empty-icon" aria-hidden="true">○</div>
      <h3>No students yet</h3>
      <p>Student records will appear here after they are added.</p>
      <Link className="button secondary-button" to="/students/new">Add Student</Link>
    </div>
  );
}

export default function Dashboard() {
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

  const departments = new Set(students.map((student) => student.department).filter(Boolean)).size;
  const levels = new Set(students.map((student) => student.level).filter(Boolean)).size;
  const recentStudents = students.slice(0, 5);

  return (
    <div className="page-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Overview of your student records.</p>
        </div>
        <Link className="button primary-button" to="/students/new">+ Add Student</Link>
      </header>

      {status === 'loading' && <div className="notice loading-state" role="status">Loading students...</div>}
      {status === 'error' && (
        <div className="notice error-state" role="alert">
          <div><strong>Unable to load students.</strong><span>Please try again.</span></div>
          <button className="button retry-button" onClick={() => setRetryToken((value) => value + 1)}>Retry</button>
        </div>
      )}

      {status === 'success' && (
        <>
          <section className="stats-grid" aria-label="Student summary">
            <StatCard label="Total Students" value={students.length} detail="All student records" tone="blue" />
            <StatCard label="Departments" value={departments} detail="Unique departments" tone="green" />
            <StatCard label="Levels" value={levels} detail="Academic levels" tone="purple" />
          </section>

          <section className="panel recent-panel">
            <div className="section-heading">
              <div>
                <h2>Recent Students</h2>
                <p>The newest records in your student directory.</p>
              </div>
              <Link className="text-link" to="/students">View all students <span aria-hidden="true">→</span></Link>
            </div>
            {recentStudents.length === 0 ? <EmptyRecentStudents /> : (
              <div className="recent-list">
                {recentStudents.map((student) => (
                  <Link className="recent-item" to={`/students/${student.id}`} key={student.id}>
                    <span className="avatar" aria-hidden="true">{student.name.charAt(0).toUpperCase()}</span>
                    <span className="recent-identity"><strong>{student.name}</strong><small>{student.email}</small></span>
                    <span className="recent-meta">{student.department}<small>Level {student.level}</small></span>
                    <span className="recent-arrow" aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
