from datetime import datetime,date
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from db import get_db
from Models import User,Employee,LeaveRequest,Attendance,Announcemnet,Payroll
from Schemas import LeaveCreate, LeaveOut, AttendanceOut, AnnouncementOut, PayrollOut
from security import require_role


router = APIRouter(
    prefix = "/api/employee",
    tags=["Employee"])

employee_only = require_role("employee")

def my_employee(user:User,db:Session):
    employee = db.query(Employee).filter(Employee.user_id==user.id).first()
    if not employee:
        raise HTTPException(status_code = 404,detail="your employee profile not linked yet.ask hr to link it")
    return employee

@router.get("/profile")
def profile (user:User=Depends(employee_only),db:Session=Depends(get_db)):
    return my_employee(user,db)

@router.post("/leaves",response_model=LeaveOut,status_code=201)
def apply_leave(payload:LeaveCreate,user:User=Depends(employee_only),db:Session=Depends(get_db)):
    employee = my_employee(user,db)
    if payload.end_date < payload.start_date:
        raise HTTPException(status_code=400,detail="end date cannot be before start date")
    if payload.leave_type not in ("EL","LOP","SICK","CASUAL"):
        raise HTTPException(status_code=400,detail="unsuppoerted leave type")
    item = LeaveRequest(employee_id=employee.id,**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.get("/leaves",response_model=list[LeaveOut])
def my_leaves(user:User=Depends(employee_only),db:Session=Depends(get_db)):
    employee = my_employee(user,db)
    return db.query(LeaveRequest).filter(LeaveRequest.employee_id == employee.id).order_by(LeaveRequest.applied_at.desc()).all()


@router.post("/attendance/clock-in",response_model=AttendanceOut)
def clock_in(user:User=Depends(employee_only),db:Session=Depends(get_db)):
    employee = my_employee(user,db)
    today = date.today()
    row = db.query(Attendance).filter(Attendance.employee_id ==employee.id,Attendance.work_date==today).first()
    if row and row.check_in:
        raise HTTPException(status_code=409,detail="Already clocked in today")
    if not row:
        row = Attendance(employee_id =employee.id,work_date=today)
        db.add(row)
    row.check_in =datetime.now()
    db.commit()
    db.refresh(row)
    return row


@router.post("/attendance/clock-out",response_model=AttendanceOut)
def clock_out(user:User=Depends(employee_only),db:Session=Depends(get_db)):
    employee = my_employee(user,db)
    row= db.query(Attendance).filter(Attendance.employee_id ==employee.id,Attendance.work_date==date.today()).first()
    if not row or not row.check_in:
        raise HTTPException(status_code=400,detail="clock in first")
    if row.check_out:
        raise HTTPException(status_code=409,detail="already checked out")
    row.check_out=datetime.now()
    db.add(row)
    db.commit()
    db.refresh(row)
    return row

@router.get("/attendance",response_model=list[AttendanceOut])
def my_attendance(user:User=Depends(employee_only),db:Session=Depends(get_db)):
    employee = my_employee(user,db)
    return db.query(Attendance).filter(Attendance.employee_id==employee.id).order_by(Attendance.work_date.desc()).all()

@router.get("/announcement",response_model=list[AnnouncementOut])
def announcement(db:Session=Depends(get_db),_=Depends(employee_only)):
    return db.query(Announcemnet).order_by(Announcemnet.created_at.desc()).all()

@router.get("/payroll",response_model=list[PayrollOut])
def my_payroll(user:User=Depends(employee_only),db:Session=Depends(get_db)):
    employee = my_employee(user,db)
    return db.query(Payroll).filter(Payroll.employee_id==employee.id).order_by(Payroll.year.desc(),Payroll.month.desc()).all()
    

