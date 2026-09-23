const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });
  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new Error('Unable to read the server response');
  }

  if (!response.ok || payload.success !== true) {
    const error = new Error(payload.message || 'The request could not be completed');
    error.status = response.status;
    throw error;
  }

  return payload;
}

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

export async function getStudent(id, signal) {
  const payload = await apiRequest(`/api/students/${id}`, { signal });
  return payload.student;
}

export async function createStudent(data) {
  const payload = await apiRequest('/api/students', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return payload.student;
}

export async function updateStudent(id, data) {
  const payload = await apiRequest(`/api/students/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
  return payload.student;
}

export async function deleteStudent(id) {
  return apiRequest(`/api/students/${id}`, { method: 'DELETE' });
}
