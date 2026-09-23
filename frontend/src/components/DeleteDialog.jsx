export default function DeleteDialog({ studentName, deleting, onCancel, onConfirm }) {
  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
        <div className="dialog-icon" aria-hidden="true">!</div>
        <h2 id="delete-title">Delete student?</h2>
        <p id="delete-description">Are you sure you want to delete <strong>{studentName}</strong>? This action cannot be undone.</p>
        <div className="dialog-actions">
          <button className="button secondary-button" type="button" onClick={onCancel} disabled={deleting}>Cancel</button>
          <button className="button danger-button" type="button" onClick={onConfirm} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete Student'}</button>
        </div>
      </section>
    </div>
  );
}
