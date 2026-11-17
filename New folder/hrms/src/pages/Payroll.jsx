import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../service/api';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Status from '../components/Status';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatError(e, fallback) {
  const detail = e.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map(err => `${err.loc[err.loc.length - 1]}: ${err.msg}`).join(', ');
  }
  return detail || fallback;
}

export default function Payroll({ mode = 'hr' }) {
  const isHR = mode === 'hr';
  const initialForm = {
    employee_id: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basic_salary: '',
    lop_days: 0,
    deductions: 0
  };

  const [rows, setRows] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);

  async function load() {
    try {
      const { data } = await api.get(isHR ? '/api/hr/payroll' : '/api/employee/payroll');
      setRows(Array.isArray(data) ? data : data.items || []);
      setError('');
    } catch (e) {
      setError(formatError(e, 'Could not load payroll'));
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

  async function create(e) {
    e.preventDefault();
    try {
      await api.post('/api/hr/payroll', {
        ...form,
        employee_id: Number(form.employee_id),
        month: Number(form.month),
        year: Number(form.year),
        basic_salary: Number(form.basic_salary),
        lop_days: Math.max(0, Number(form.lop_days)),
        deductions: Math.max(0, Number(form.deductions))
      });
      setOpen(false);
      setForm(initialForm);
      setError('');
      load();
    } catch (e) {
      setError(formatError(e, 'Could not create payroll'));
    }
  }

  return (
    <>
      <PageHeader
        title="Payroll"
        subtitle={isHR ? 'Create and review employee payroll records.' : 'View your payroll records.'}
        action={
          isHR && (
            <button className="btn primary" onClick={() => setOpen(true)}>
              <Plus size={16} /> Create payroll
            </button>
          )
        }
      />

      {error && <div className="alert error">{error}</div>}

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              {isHR && <th>Employee</th>}
              <th>Month</th>
              <th>Year</th>
              <th>Basic salary</th>
              <th>Deductions</th>
              <th>Net salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                {isHR && <td>{r.employee_name || r.full_name || r.employee_id}</td>}
                <td>{MONTHS[Number(r.month) - 1] || r.month}</td>
                <td>{r.year}</td>
                <td>₹{Number(r.basic_salary || 0).toLocaleString('en-IN')}</td>
                <td>₹{Number(r.deductions || 0).toLocaleString('en-IN')}</td>
                <td>
                  <b>₹{Number(r.net_salary || 0).toLocaleString('en-IN')}</b>
                </td>
                <td>
                  <Status value={r.status} />
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={isHR ? 7 : 6} className="empty">
                  No payroll records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div title="Create payroll" onClose={() => setOpen(false)}>
          <form className="form-grid" onSubmit={create}>
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
              <span>Month</span>
              <select
                value={form.month}
                required
                onChange={e => setForm({ ...form, month: e.target.value })}
              >
                {MONTHS.map((name, idx) => (
                  <option key={name} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            {['year', 'basic_salary', 'lop_days', 'deductions'].map(k => (
              <label className="field" key={k}>
                <span>{k.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                <input
                  type="number"
                  min={k === 'year' ? 2000 : 0}
                  step={k === 'lop_days' ? '0.5' : '1'}
                  value={form[k]}
                  required={['year', 'basic_salary'].includes(k)}
                  onChange={e => setForm({ ...form, [k]: e.target.value })}
                />
              </label>
            ))}

            <div className="form-actions span-2">
              <button type="button" className="btn secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn primary">Save payroll</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
