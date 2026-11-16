import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, ClipboardCheck, CalendarCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import api from '../service/api';

const HrDash = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/api/hr/dashboard')
            .then(res => setStats(res.data))
            .catch(err => setError(err.response?.data?.detail || 'Could not load dashboard'));
    }, []);

    const employees = Array.isArray(stats?.employee) 
        ? stats.employee.length 
        : (stats?.employees ?? 0);

    const cards = [
        ['Active employees', employees, Users],
        ['Departments', stats?.departments ?? 0, Building2],
        ['Pending leaves', stats?.pending_leaves ?? 0, ClipboardCheck],
        ['Today attendance', stats?.today_attendance ?? 0, CalendarCheck]
    ];

    return (
        <>
            <PageHeader title="Dashboard" subtitle="Overview of your company at a glance." />
            
            {error && <div className="alert error">{error}</div>}
            
            <div className="stat-grid">
                {cards.map(([label, value, Icon]) => (
                    <div className="stat-card" key={label}>
                        <div className="stat-icon">
                            <Icon />
                        </div>
                        <p>{label}</p>
                        <strong>{value ?? '—'}</strong>
                    </div>
                ))}
            </div>

            <div className="panel welcome">
                <div>
                    <span className="eyebrow">HR CONTROL CENTER</span>
                    <h2>Everything starts here.</h2>
                    <p className="muted">
                        Manage employee records, review leave requests and keep payroll up to date.
                    </p>
                </div>
                <div className="quick-links">
                    <Link to="/hr/employees">Manage employees →</Link>
                    <Link to="/hr/leaves">Review leave requests →</Link>
                    <Link to="/hr/payroll">Manage payroll →</Link>
                </div>
            </div>
        </>
    );
};

export default HrDash;
