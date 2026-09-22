import { pool } from '../config/db.js';

const studentFields = ['name', 'email', 'phone', 'department', 'level'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sendDatabaseUnavailable(response) {
  return response.status(500).json({
    success: false,
    message: 'Database connection is not configured'
  });
}

function parseStudentId(value) {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function validateStudentFields(body, fields, requireAll) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Request body must be a JSON object';
  }

  const suppliedFields = Object.keys(body);
  const unsupportedField = suppliedFields.find((field) => !fields.includes(field));
  if (unsupportedField) {
    return `Unsupported field: ${unsupportedField}`;
  }

  if (requireAll) {
    const missingField = fields.find(
      (field) => typeof body[field] !== 'string' || body[field].trim() === ''
    );
    if (missingField) {
      return `${missingField} is required`;
    }
  } else if (suppliedFields.length === 0) {
    return 'At least one student field is required';
  }

  for (const field of suppliedFields) {
    if (typeof body[field] !== 'string' || body[field].trim() === '') {
      return `${field} must be a non-empty string`;
    }
  }

  if (body.email !== undefined && !emailPattern.test(body.email.trim())) {
    return 'email must be a valid email address';
  }

  return null;
}

function normalizedValues(body, fields) {
  return fields.map((field) => body[field].trim());
}

function handleDatabaseError(response, error) {
  if (error.code === '23505') {
    return response.status(409).json({
      success: false,
      message: 'A student with this email already exists'
    });
  }

  console.error('Student database operation failed:', error.code || 'unknown');
  return response.status(500).json({
    success: false,
    message: 'An unexpected database error occurred'
  });
}

export async function getStudents(_request, response) {
  if (!pool) return sendDatabaseUnavailable(response);

  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, department, level, created_at FROM students ORDER BY created_at DESC, id DESC'
    );
    return response.json({ success: true, students: result.rows });
  } catch (error) {
    return handleDatabaseError(response, error);
  }
}

export async function getStudentById(request, response) {
  const id = parseStudentId(request.params.id);
  if (!id) {
    return response.status(400).json({ success: false, message: 'Student ID must be a positive integer' });
  }
  if (!pool) return sendDatabaseUnavailable(response);

  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, department, level, created_at FROM students WHERE id = $1',
      [id]
    );
    if (result.rowCount === 0) {
      return response.status(404).json({ success: false, message: 'Student not found' });
    }
    return response.json({ success: true, student: result.rows[0] });
  } catch (error) {
    return handleDatabaseError(response, error);
  }
}

export async function createStudent(request, response) {
  const validationError = validateStudentFields(request.body, studentFields, true);
  if (validationError) {
    return response.status(400).json({ success: false, message: validationError });
  }
  if (!pool) return sendDatabaseUnavailable(response);

  try {
    const values = normalizedValues(request.body, studentFields);
    const result = await pool.query(
      `INSERT INTO students (name, email, phone, department, level)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, department, level, created_at`,
      values
    );
    return response.status(201).json({
      success: true,
      message: 'Student created successfully',
      student: result.rows[0]
    });
  } catch (error) {
    return handleDatabaseError(response, error);
  }
}

export async function updateStudent(request, response) {
  const id = parseStudentId(request.params.id);
  if (!id) {
    return response.status(400).json({ success: false, message: 'Student ID must be a positive integer' });
  }

  const validationError = validateStudentFields(request.body, studentFields, false);
  if (validationError) {
    return response.status(400).json({ success: false, message: validationError });
  }
  if (!pool) return sendDatabaseUnavailable(response);

  const fields = Object.keys(request.body);
  const values = normalizedValues(request.body, fields);
  const assignments = fields.map((field, index) => `${field} = $${index + 1}`);

  try {
    const result = await pool.query(
      `UPDATE students
       SET ${assignments.join(', ')}
       WHERE id = $${values.length + 1}
       RETURNING id, name, email, phone, department, level, created_at`,
      [...values, id]
    );
    if (result.rowCount === 0) {
      return response.status(404).json({ success: false, message: 'Student not found' });
    }
    return response.json({
      success: true,
      message: 'Student updated successfully',
      student: result.rows[0]
    });
  } catch (error) {
    return handleDatabaseError(response, error);
  }
}

export async function deleteStudent(request, response) {
  const id = parseStudentId(request.params.id);
  if (!id) {
    return response.status(400).json({ success: false, message: 'Student ID must be a positive integer' });
  }
  if (!pool) return sendDatabaseUnavailable(response);

  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return response.status(404).json({ success: false, message: 'Student not found' });
    }
    return response.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    return handleDatabaseError(response, error);
  }
}
