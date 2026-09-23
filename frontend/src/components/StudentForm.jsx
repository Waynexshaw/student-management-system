import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const emptyValues = { name: '', email: '', phone: '', department: '', level: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const levels = ['100', '200', '300', '400', '500'];

function validate(values) {
  const errors = {};
  for (const field of Object.keys(emptyValues)) {
    if (!values[field].trim()) errors[field] = `${field[0].toUpperCase()}${field.slice(1)} is required`;
  }
  if (values.email.trim() && !emailPattern.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }
  return errors;
}

export default function StudentForm({ initialValues = emptyValues, submitLabel, submittingLabel, onSubmit, serverError, cancelTo = '/students' }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({ ...emptyValues, ...initialValues });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues({ ...emptyValues, ...initialValues });
    setErrors({});
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const editableValues = Object.fromEntries(
      Object.keys(emptyValues).map((key) => [key, values[key].trim()])
    );
    await onSubmit(editableValues);
  }

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="form-error-banner" role="alert">{serverError}</div>}
      <div className="form-grid">
        <div className="field-group full-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" value={values.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} autoComplete="name" />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className="field-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={values.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} autoComplete="email" />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        <div className="field-group">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" value={values.phone} onChange={handleChange} aria-invalid={Boolean(errors.phone)} autoComplete="tel" />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>
        <div className="field-group">
          <label htmlFor="department">Department</label>
          <input id="department" name="department" type="text" value={values.department} onChange={handleChange} aria-invalid={Boolean(errors.department)} />
          {errors.department && <span className="field-error">{errors.department}</span>}
        </div>
        <div className="field-group">
          <label htmlFor="level">Level</label>
          <select id="level" name="level" value={values.level} onChange={handleChange} aria-invalid={Boolean(errors.level)}>
            <option value="">Select level</option>
            {levels.map((level) => <option key={level} value={level}>{level} Level</option>)}
          </select>
          {errors.level && <span className="field-error">{errors.level}</span>}
        </div>
      </div>
      <div className="form-actions">
        <button className="button secondary-button" type="button" onClick={() => navigate(cancelTo)} disabled={Boolean(submittingLabel)}>Cancel</button>
        <button className="button primary-button" type="submit" disabled={Boolean(submittingLabel)}>{submittingLabel || submitLabel}</button>
      </div>
    </form>
  );
}
