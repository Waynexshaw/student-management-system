const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getApiHealth() {
  const response = await fetch(`${API_URL}/api/health`);
  return response.json();
}

export async function getStudents(signal) {
  const response = await fetch(`${API_URL}/api/students`, { signal });
  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new Error('Unable to read the server response');
  }

  if (!response.ok || payload.success !== true || !Array.isArray(payload.students)) {
    throw new Error('Unable to load students');
  }

  return payload.students;
}
