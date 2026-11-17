import React, { useEffect, useState } from 'react';
import { Plus, Search, Pencil, UserX } from 'lucide-react';
import api from '../service/api';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';

const blank = {
  employee_code: '',
  full_name: '',
  email: '',
  phone: '',
  desigination: '',
  department_id: '',
  joining_date: '',
  salary: '',
};

export default function Employees() {
  const [rows, setRows] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const [e, d] = await Promise.all([
        api.get('/api/hr/employees'),
        api.get('/api/hr/departments'),
      ]);
      setRows(Array.isArray(e.data) ? e.data : e.data.items || []);
      setDepartments(Array.isArray(d.data) ? d.data : d.data.items || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load employees');
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startAdd() {
    setEditing(null);
    setForm(blank);
    setError('');
    setOpen(true);
  }

  function startEdit(row) {
    setEditing(row);
    setForm({
      ...blank,
      ...row,
      desigination: row.desigination || row.designation || '',
      department_id: row.department_id ?? '',
      joining_date: row.joining_date?.slice(0, 10) || '',
    });
    setError('');
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const payload = {
      ...form,
      department_id: form.department_id ? Number(form.department_id) : null,
      salary: Number(form.salary || 0),
    };
    try {
      if (editing) {
        await api.put(`/api/hr/employees/${editing.id}`, payload);
      } else {
        await api.post('/api/hr/employees', payload);
      }
      setOpen(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save employee');
    } finally {
      setBusy(false);
    }
  }

  async function deactivate(row) {
    if (!window.confirm(`Deactivate ${row.full_name}?`)) return;
    setError('');
    try {
      await api.delete(`/api/hr/employees/${row.id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not deactivate employee');
    }
  }

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const deptName =
      departments.find((d) => d.id === r.department_id)?.name ||
      r.department_name ||
      '';
    return (
      r.full_name?.toLowerCase().includes(q) ||
      r.employee_code?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      deptName.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <PageHeader
        title="Employees"
        subtitle="Add, view, edit and manage employee records."
        action={
          <button className="btn primary" onClick={startAdd}>
            <Plus size={16} /> Add employee
          </button>
        }
      />

      {error && !open && <div className="alert error">{error}</div>}

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Search employees…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span className="muted">{filtered.length} employees</span>
      </div>

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Code</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>
                  <b>{r.full_name}</b>
                  <small>{r.email}</small>
                </td>
                <td>{r.employee_code}</td>
                <td>
                  {departments.find((d) => d.id === r.department_id)?.name ||
                    r.department_name ||
                    '—'}
                </td>
                <td>{r.desigination || r.designation || '—'}</td>
                <td>₹{Number(r.salary || 0).toLocaleString('en-IN')}</td>
                <td>
                  <button
                    className="icon-btn"
                    title="Edit"
                    onClick={() => startEdit(r)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="icon-btn danger-text"
                    title="Deactivate"
                    onClick={() => deactivate(r)}
                  >
                    <UserX size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan="6" className="empty">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal
          title={editing ? 'Edit employee' : 'Add employee'}
          onClose={() => setOpen(false)}
        >
          <form className="form-grid" onSubmit={save}>
            {Object.entries({
              employee_code: 'Employee code',
              full_name: 'Full name',
              email: 'Email',
              phone: 'Phone',
              desigination: 'Designation',
              joining_date: 'Joining date',
              salary: 'Salary',
            }).map(([key, label]) => (
              <label className="field" key={key}>
                <span>{label}</span>
                <input
                  type={
                    key === 'email'
                      ? 'email'
                      : key === 'joining_date'
                      ? 'date'
                      : key === 'salary'
                      ? 'number'
                      : 'text'
                  }
                  value={form[key] ?? ''}
                  required={['employee_code', 'full_name', 'email'].includes(key)}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            ))}

            <label className="field">
              <span>Department</span>
              <select
                value={form.department_id}
                onChange={(e) =>
                  setForm({ ...form, department_id: e.target.value })
                }
              >
                <option value="">No department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>

            {error && <div className="alert error span-2">{error}</div>}

            <div className="form-actions span-2">
              <button
                type="button"
                className="btn secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn primary" disabled={busy}>
                {busy ? 'Saving…' : 'Save employee'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
