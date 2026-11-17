import { useEffect, useState } from 'react';
import { Clock3, Plus } from 'lucide-react';
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

export default function Attendance({ mode = 'employee' }) {
  const isHR = mode === 'hr';
  const today = new Date().toLocaleDateString('en-CA');

  const initialForm = {
    employee_id: '',
    work_date: today,
    check_in: '09:00',
    check_out: '18:00',
    status: 'present'
  };

  const [rows, setRows] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(initialForm);

  const todayRecord = rows.find(r => String(r.work_date || '').slice(0, 10) === today);
  const hasClockedIn = Boolean(todayRecord?.check_in);
  const hasClockedOut = Boolean(todayRecord?.check_out);

  async function load() {
    try {
      const { data } = await api.get(isHR ? '/api/hr/attendance' : '/api/employee/attendance');
      setRows(Array.isArray(data) ? data : data.items || []);
      setError('');
    } catch (e) {
      setError(formatError(e, 'Could not load attendance'));
    }
  }

  useEffect(() => {
    load();
    if (isHR) {
      api.get('/api/hr/employees')
        .then(res => setEmployees(Array.isArray(res.data) ? res.data : res.data.items || []))
        .catch(() => {});
    }
  }, [isHR]);

  async function punch(action) {
    setBusy(true);
    setError('');
    try {
      await api.post(`/api/employee/attendance/${action}`);
      await load();
    } catch (e) {
      setError(formatError(e, 'Attendance action failed'));
    } finally {
      setBusy(false);
    }
  }

  async function createManual(e) {
    e.preventDefault();
    try {
      await api.post('/api/hr/attendance', {
        employee_id: Number(form.employee_id),
        work_date: form.work_date,
        check_in: form.check_in || null,
        check_out: form.check_out || null,
        status: form.status
      });
      setOpen(false);
      setForm(initialForm);
      setError('');
      load();
    } catch (e) {
      setError(formatError(e, 'Could not create attendance record'));
    }
  }

  return (
    <>
      <PageHeader
        title={isHR ? 'Manage attendance' : 'My attendance'}
        subtitle={
          isHR
            ? 'Company attendance overview and manual entry.'
            : 'View your attendance and record your workday.'
        }
        action={
          isHR ? (
            <button className="btn primary" onClick={() => setOpen(true)}>
              <Plus size={16} /> Mark attendance
            </button>
          ) : (
            <div className="button-row">
              <button
                className="btn primary"
                disabled={busy || hasClockedIn}
                onClick={() => punch('clock-in')}
              >
                <Clock3 size={16} /> {hasClockedIn ? 'Clocked in' : 'Clock in'}
              </button>
              <button
                className="btn secondary"
                disabled={busy || !hasClockedIn || hasClockedOut}
                onClick={() => punch('clock-out')}
              >
                {hasClockedOut ? 'Clocked out' : 'Clock out'}
              </button>
            </div>
          )
        }
      />

      {error && <div className="alert error">{error}</div>}

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              {isHR && <th>Employee</th>}
              <th>Date</th>
              <th>Check in</th>
              <th>Check out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                {isHR && <td>{r.employee_name || r.full_name || r.employee_id}</td>}
                <td>{String(r.work_date || '').slice(0, 10)}</td>
                <td>{r.check_in || '—'}</td>
                <td>{r.check_out || '—'}</td>
                <td>
                  <Status value={r.status} />
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={isHR ? 5 : 4} className="empty">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal title="Mark manual attendance" onClose={() => setOpen(false)}>
          <form className="form-grid" onSubmit={createManual}>
            <label className="field span-2">
              <span>Employee</span>
              <select
                value={form.employee_id}
                required
                onChange={e => setForm({ ...form, employee_id: e.target.value })}
              >
                <option value="">Select employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name} ({emp.employee_code})
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Work date</span>
              <input
                type="date"
                value={form.work_date}
                required
                onChange={e => setForm({ ...form, work_date: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Status</span>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="half_day">Half Day</option>
                <option value="leave">Leave</option>
              </select>
            </label>

            <label className="field">
              <span>Check in</span>
              <input
                type="time"
                value={form.check_in}
                onChange={e => setForm({ ...form, check_in: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Check out</span>
              <input
                type="time"
                value={form.check_out}
                onChange={e => setForm({ ...form, check_out: e.target.value })}
              />
            </label>

            <div className="form-actions span-2">
              <button type="button" className="btn secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn primary">Save attendance</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
