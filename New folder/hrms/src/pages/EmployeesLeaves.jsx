import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../service/api';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Status from '../components/Status';

function formatError(e, fallback) {
  const detail = e.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map(err => `${err.loc[err.loc.length - 1]}: ${err.msg}`).join(', ');
  }
  return detail || fallback;
}

export default function EmployeeLeaves() {
  const initialForm = {
    leave_type: 'EL',
    start_date: '',
    end_date: '',
    reason: ''
  };

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);

  async function load() {
    try {
      const { data } = await api.get('/api/employee/leaves');
      setRows(Array.isArray(data) ? data : data.items || []);
      setError('');
    } catch (e) {
      setError(formatError(e, 'Could not load the leave history'));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function apply(e) {
    e.preventDefault();
    try {
      await api.post('/api/employee/leaves', form);
      setOpen(false);
      setForm(initialForm);
      setError('');
      load();
    } catch (e) {
      setError(formatError(e, 'Could not submit leave request'));
    }
  }

  return (
    <>
      <PageHeader
        title="My leave requests"
        subtitle="Apply for leave and track approval status."
        action={
          <button className="btn primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> Apply leave
          </button>
        }
      />

      {error && <div className="alert error">{error}</div>}

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.leave_type}</td>
                <td>{String(r.start_date || '').slice(0, 10)}</td>
                <td>{String(r.end_date || '').slice(0, 10)}</td>
                <td>{r.reason}</td>
                <td>
                  <Status value={r.status} />
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="5" className="empty">
                  No leave applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div title="Apply for leave" onClose={() => setOpen(false)}>
          <form onSubmit={apply}>
            <label className="field">
              <span>Leave type</span>
              <select
                value={form.leave_type}
                onChange={e => setForm({ ...form, leave_type: e.target.value })}
              >
                <option value="EL">Earned Leave (EL)</option>
                <option value="LOP">Loss of Pay (LOP)</option>
              </select>
            </label>

            <div className="form-grid">
              <label className="field">
                <span>Start date</span>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={e => setForm({ ...form, start_date: e.target.value })}
                  required
                />
              </label>

              <label className="field">
                <span>End date</span>
                <input
                  type="date"
                  value={form.end_date}
                  min={form.start_date || undefined}
                  onChange={e => setForm({ ...form, end_date: e.target.value })}
                  required
                />
              </label>
            </div>

            <label className="field">
              <span>Reason</span>
              <textarea
                rows="4"
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
                required
              />
            </label>

            <div className="form-actions">
              <button type="button" className="btn secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn primary">Submit request</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
