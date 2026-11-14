# import uuid 
from datetime import date
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from db import get_db
from Models import Employee,Departments,LeaveRequest,Announcemnet,Attendance,Payroll,User
from Schemas import EmployeeCreate,EmployeeOut,DepartmentIn,DepartmentOut,LeaveOut,AnnouncementIn,AnnouncementOut,PayrollIn,PayrollOut
from security import require_role




router = APIRouter(
    prefix = "/api/hr",
    tags=["HR operations"])
hr_only = require_role("hr")





@router.get('/dashboard')
def dashboard (db:Session=Depends(get_db), _=Depends(hr_only)):
    return{
        "employee":db.query(Employee).filter(Employee.status =="Active").count(),
        "departments":db.query(Departments).count(),
        "pending_leaves":db.query(LeaveRequest).filter(LeaveRequest.status == "pending").count(),
        "today_attendance":db.query(Attendance).filter(Attendance.work_date == date.today()).count()
        }




@router.get("/employees",response_model=list[EmployeeOut])
def employees(db:Session=Depends(get_db),_ = Depends(hr_only)):
    return db.query(Employee).order_by(Employee.id.desc()).all()




@router.post("/employees",response_model=EmployeeOut,status_code=201)
def add_employee(payload:EmployeeCreate,db:Session=Depends(get_db),_=Depends(hr_only)):
    if db.query(Employee).filter((Employee.emai==payload.email)|(Employee.employee_code == payload.employee_code)).first():
        raise HTTPException(status_code=409,detail="email or employee code already exists")
    user=db.query(User).filter(User.emai == payload.email).first()
    
    data =payload.model_dump()
    data["emai"]=data.pop("email")
    employee =Employee(**data,user_id = user.id if user else None)
    db.add(employee);
    db.commit()
    db.refresh(employee)
    return employee



@router.put("/employees/{employee_id}",response_model=EmployeeOut)
def update_employee(employee_id:int,payload:EmployeeCreate,db:Session=Depends(get_db),_=Depends(hr_only)):
    employee = db.get(Employee,employee_id)
    if not employee:
        raise HTTPException(status_code=404,detail="Employee not found")
    data = payload.model_dump()
    data ["emai"] =data.pop("email")
    for key,value in data.items():
        setattr(employee,key,value)
    db.commit();
    db.refresh(employee)
    return employee

    

    
@router.delete("/employees/{employee_id}")
def offboard_employee(employee_id:int,db:Session=Depends(get_db),_=Depends(hr_only)):
    employee = db.get(Employee,employee_id)
    if not employee:
        raise HTTPException(status_code=404,detail="employee not found")
    employee.status="inactive"
    db.commit()
    return{"message":"Employee marked inactive"}



@router.get("/departments",response_model=list[DepartmentOut])
def department(db:Session=Depends(get_db),_=Depends(hr_only)):
    return db.query(Departments).all()




@router.post("/departments",response_model=DepartmentOut,status_code=201)
def add_department(payload:DepartmentIn,db:Session=Depends(get_db),_=Depends(hr_only)):
    department = Departments(name = payload.name)
    db.add(department)
    db.commit()
    db.refresh(department)
    return department





@router.get("/leaves",response_model=list[LeaveOut])
def leaves(db:Session=Depends(get_db),_=Depends(hr_only)):
    return db.query(LeaveRequest).order_by(LeaveRequest.applied_at.desc()).all()





@router.patch("/leaves/{leave_id}/{decision}")
def decide_leave(leave_id:int,decision:str,db:Session=Depends(get_db),_=Depends(hr_only)):
    if decision not in ("approve","rejected"):
        raise HTTPException(status_code=400,detail="desicion must be accepted or rejected")
    leave = db.get(LeaveRequest,leave_id)
    if not leave:
        raise HTTPException(status_code=404,detail="leave request not found")
    if leave.status !="pending":
        raise HTTPException(status_code=409,detail="request already processed")
    leave.status = "approved" if decision=="approve" else "rejected"
    db.commit()
    return{
        "message":f"leave{leave.status}"
        }



@router.post("/announcement",response_model=AnnouncementOut,status_code=201)
def add_announcement(payload:AnnouncementIn,db:Session=Depends(get_db),_=Depends(hr_only)):
    item = Announcemnet(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item



@router.get("/announcement",response_model=list[AnnouncementOut])
def announcements(db:Session=Depends(get_db),_=Depends(hr_only)):
    return db.query(Announcemnet).order_by(Announcemnet.created_at.desc()).all()



@router.post("/payroll",response_model=PayrollOut,status_code=201)
def generate_payroll(payload:PayrollIn,db:Session=Depends(get_db),_=Depends(hr_only)):
    employee = db.get(Employee,payload.employee_id)
    if not employee:
        raise HTTPException(status_code=404,detail="employee not found")
    days_in_month = 30
    lop_amount = (payload.basic_salary/days_in_month)*payload.lop_days
    net = max(0,payload.basic_salary-lop_amount-payload.deductions)
    row = Payroll(**payload.model_dump(),net_salary = round(net,2))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row



@router.get("/payroll",response_model=list[PayrollOut])
def payroll(db:Session =Depends(get_db),_=Depends(hr_only)):
    return db.query(Payroll).order_by(Payroll.year.desc(),Payroll.month.desc()).all()





        

    

