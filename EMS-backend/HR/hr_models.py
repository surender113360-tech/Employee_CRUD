from sqlalchemy import Column,Integer,String,Float,Date,DateTime,Boolean,ForeignKey,UniqueConstraint,Enum
import enum
from db import base

class EmployeeProfile(base):
    __tablename__ = "employee_profiles"
    id = Column(Integer,primary_key=True,index=True)
    employee_id = Column(String,unique = True,index = True,nullable= False)
    first_name = Column(String,nullable=False)
    last_name = Column(String,nullable=False)
    email = Column(String,unique = True,index = True,nullable= False)
    department = Column(String,nullable = False)
    base_salary = Column(Float,nullable = False)
    account_no = Column(Float,nullable=False)
    ifsc_code = Column(String,nullable = False)
    aadhar_filename = Column(String,nullable = False)
    bank_filename = Column(String,nullable = False)
    status = Column(String,default = "Active")


class leave_type(str,enum.Enum):
    casual_leave = "cl"
    sick_leave = "sl"
    loss_of_pay = "lop"

class leave_status(str,enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class Leave(base):
    __tablename__ = "leave_records"
    id = Column(Integer,primary_key = True,index = True)
    employee_id = Column(String,index = True,nullable = False)
    leave_type = Column(Enum(leave_type),nullable = False)
    start_date = Column(Date,nullable = False)
    end_date = Column(Date,nullable = False)
    status = Column(Enum(leave_status),default = "pending",nullable = False)
    hr_remarks = Column(String,nullable = True)



class AttendanceStatus(str,enum.Enum):
    full_day = "Full  day"
    half_day = " Half day"
    absent = "Absent"
    present = "present"
{ ''}

class AttendanceLog(base):
    __tablename__ = "attendance_logs"
    id = Column(Integer,primary_key = True,index = True)
    employee_id = Column(String,index = True,nullable = False)
    log_date = Column(Date,nullable = False)
    check_in_time = Column(DateTime,nullable = True)
    check_out_time = Column(DateTime,nullable = True)
    status = Column(Enum(AttendanceStatus),nullable = False, default = AttendanceStatus.present)

class Salary(base):
    __tablename__ = "Salary"
    id = Column(Integer,primary_key = True,index = True)
    employee_id = Column(String,ForeignKey("employee_profiles.employee_id",ondelete="CASCADE"))
    month = Column(Integer,nullable = False)
    year = Column(Integer,nullable = False)
    base_salary = Column(Float,nullable = False)
    leave_deduction = Column(Float,default = 0.0,nullable = False)
    final_payout = Column(Float,nullable = False)
    __table_args__ = (
        UniqueConstraint('employee_id','month','year',name = 'employee_monthly_salary'),
    )