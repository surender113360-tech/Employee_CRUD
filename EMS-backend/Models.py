from datetime import datetime, date
from sqlalchemy import String, Integer, Boolean, Float, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db import base


class User(base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    emai: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    hashed_pswd: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="employee")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    employee: Mapped["Employee"] = relationship(back_populates="user", uselist=False)


class Departments(base):
    __tablename__ = "departments"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)


class Employee(base):
    __tablename__ = "employees"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), unique=True, nullable=True)
    employee_code: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    emai: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(25), nullable=True)
    desigination: Mapped[str] = mapped_column(String(100), default="employee")
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    joining_date: Mapped[date] = mapped_column(Date, default=date.today)
    salary: Mapped[float] = mapped_column(Float, default=0)
    status: Mapped[str] = mapped_column(String(20), default="Active")
    user: Mapped[User | None] = relationship(back_populates="employee")


class LeaveRequest(base):
    __tablename__ = "leave_requests"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    leave_type: Mapped[str] = mapped_column(String(20))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    reason: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    applied_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Attendance(base):
    __tablename__ = "attendance"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    work_date: Mapped[date] = mapped_column(Date, default=date.today)
    check_in: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    check_out: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="present")


class Announcemnet(base):
    __tablename__ = "announcemnets"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(180))
    message: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Payroll(base):
    __tablename__ = "payroll"
    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    month: Mapped[int] = mapped_column(Integer)
    year: Mapped[int] = mapped_column(Integer)
    basic_salary: Mapped[float] = mapped_column(Float)
    lop_days: Mapped[int] = mapped_column(Integer, default=0)
    deductions: Mapped[float] = mapped_column(Float, default=0)
    net_salary: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(20), default="generated")
