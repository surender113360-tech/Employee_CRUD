import uuid 
from datetime import date,timedelta
from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter,Depends,Form,UploadFile,File,HTTPException,status,Header
from HR.schemas import EmployeeOffboard,salary_update,leave_review,attendance_review,process_sal,salary_res
from HR import hr_models
from db import get_db
from sqlalchemy.orm import Session
from typing import Annotated
from sqlalchemy import extract
import calendar



router = APIRouter(
    prefix = "/hr"
    
)

class leave_create(BaseModel):
    employee_id:str
    leave_type:str
    start_date:date
    end_date:date


def generate_employee_id() ->str:
    current_year = date.today().year
    random_id = uuid.uuid4().hex[:6].upper()
    return f"EMP-{current_year}-{random_id}"



@router.post("/emp-onboard",status_code = status.HTTP_201_CREATED)
async def onboard_emp(
    first_name:str = Form(...),
    last_name : str = Form(...),
    email : str = Form(...),
    department : str = Form(...),
    base_salary: float = Form(...),
    account_no : str = Form(...),
    ifsc_code : str = Form(...),
    aadhar_file : UploadFile = File(...,description = "aadhaar Card Copy"),
    bank_proof : UploadFile = File(...,description = "cancelled Cheque or passbook copy"),
    db:Session = Depends(get_db)):

    existing_emp = db.query(hr_models.EmployeeProfile).filter(hr_models.EmployeeProfile.email == email).first()
    if existing_emp:
        raise HTTPException(status_code = 400,detail = "An employee with this email already exists.")
    emp_id = generate_employee_id()
    aadhar_filename = aadhar_file.filename
    bank_filename = bank_proof.filename
    db_employee = hr_models.EmployeeProfile(
        employee_id = emp_id,
        first_name = first_name,
        last_name = last_name,
        email = email,
        department = department,
        base_salary = base_salary,
        account_no = account_no,
        ifsc_code = ifsc_code,
        aadhar_filename = aadhar_filename,
        bank_filename = bank_filename,
        status = "Active"

    )

    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)

    return{
        "status":"Employee onboarded successfully",
        "employee_id":emp_id,
        "details":{"name":f"{first_name}{last_name}","depart":department},
        "document_saved":[aadhar_filename,bank_filename]

    }



@router.post("/employee-offboard")
async def offboard_employee(data:EmployeeOffboard,db:Session = Depends(get_db)):
    employee = db.query(hr_models.EmployeeProfile).filter(hr_models.EmployeeProfile.employee_id == data.employee_id).first()

    if not employee:
        raise HTTPException(status_code = 404,detail = f"Employee profile with ID{data.employee_id}not found")
    
    employee.status = "terminated"
    db.commit()

    return{
        "message": f" offboarding compeleted for profile {data.employee_id}",
        "seperation_date": data.terimination_date,
        "status":"Archieve/Inactive"
        
    }

@router.put("/salary-update")
async def salary_upd (data:salary_update,db :Session = Depends(get_db)):
    emp_salary = db.query(hr_models.EmployeeProfile).filter(hr_models.EmployeeProfile.employee_id ==  data.emplooyee_id).first()
    if not emp_salary:
        raise HTTPException(status_code=404,detail="user not found")
    emp_salary.base_salary = data.new_base_salary
    db.commit()
    
    return{
        "message":f"salary profile updated for {data.emplooyee_id}",
        "new_rate":data.new_base_salary,
        "effective_from":data.effective_date
        
    }

@router.post("/leave-review",status_code = status.HTTP_201_CREATED)
async def apply_leave(payload: leave_create,db:Session = Depends(get_db)):
    employee_exits = db.query(hr_models.EmployeeProfile).filter(hr_models.EmployeeProfile.employee_id == payload.employee_id).first()
    if not employee_exits:
        raise HTTPException(status_code = 404,detail = f"cant apply for the leave {payload.employee_id} not found")
    new_leave = hr_models.Leave(
        employee_id = employee_exits.employee_id,
        leave_type = payload.leave_type,
        start_date = payload.start_date,
        end_date = payload.end_date,
        status = "pending",
        hr_remarks = "pending review"
    )
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)

    return{
        "msg":"leave application submitted  and linked to profile succesfully",
        "ticket_id":new_leave.id,
        "employee_id":new_leave.employee_id,
        "status":new_leave.status
    }


    
@router.post("/attendance-log-override")
async def log_attendance(log:attendance_review,db:Session = Depends(get_db)):
    in_time  = log.check_in_time.replace(tzinfo=None) if log.check_in_time else None
    out_time  = log.check_out_time.replace(tzinfo=None) if log.check_out_time else None

    
    if  in_time and out_time:
        if  in_time > out_time:
            raise HTTPException(status_code = 400 , detail = "invalid timestamps check-in-time cannot be check-out-time")

        
    calculated_status = hr_models.AttendanceStatus.absent
    if  in_time and out_time:
        time_worked =  out_time - in_time
        requried_duration = timedelta(hours = 8,minutes = 30)

        if time_worked >= requried_duration:
            calculated_status = hr_models.AttendanceStatus.full_day
        else:
            calculated_status = hr_models.AttendanceStatus.half_day
    elif  in_time:
        calculated_status = hr_models.AttendanceStatus.present



    existing_log = db.query(hr_models.AttendanceLog).filter(hr_models.AttendanceLog.employee_id == str(log.employee_id),
                                                            hr_models.AttendanceLog.log_date == log.log_date).first()
    
    if  existing_log:
        existing_log.check_in_time = in_time
        existing_log.check_out_time = out_time
        existing_log.status = calculated_status
        db.commit()
        db.refresh(existing_log)
        target_rec = existing_log
    else:
        new_log = hr_models.AttendanceLog(
            employee_id = log.employee_id,
            log_date = log.log_date,
            check_in_time = in_time,
            check_out_time = out_time,
            status = calculated_status
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        target_rec = new_log
    

    
    return{
        "message":"Attendance override successly ",
        "employee_id":target_rec.employee_id,
        "log_date":str(target_rec.log_date),
        "timestamps": target_rec.status
    }
except Exception as e :
    raise HTTPException(status_code = status.HTTP_500_INTERNAL_SERVER_ERROR, details = f"internal app carsh{str(e)}")

@router.post("/salary-calculate",response_model = salary_res,status_code = status.HTTP_201_CREATED)
async def cal_salary(payload:process_sal,db:Session = Depends(get_db)):
    employee = db.query(hr_models.EmployeeProfile).filter(hr_models.EmployeeProfile.employee_id == payload.employee_id).first()
    if not employee:
        raise HTTPException(status_code = 404 ,detail = f"no employee found{payload.employee_id}")

    already_cal = db.query(hr_models.Salary).filter(
        hr_models.Salary.employee_id == payload.employee_id,
        hr_models.Salary.month == payload.month,
        hr_models.Salary.year == payload.year
    ).first()

    if already_cal:
        raise HTTPException(status_code = 400 ,detail = f"salary for {payload.month}/{payload.year}has already generated ")

    days_in_month = calendar.monthrange(payload.year,payload.month)[1]
    daily_rate = payload.base_salary/days_in_month

    leaves = db.query(hr_models.Leave).filter(hr_models.Leave.employee_id == payload.employee_id,
                                              hr_models.Leave.status.ilike("approved"),
                                              hr_models.Leave.leave_type =="LOP",
                                              extract("month",hr_models.Leave.start_date) ==payload.month,
                                              extract("year",hr_models.Leave.start_date) == payload.year
                                              ).all()
    total_leaves = 0
    for leave in leaves:
        leave_duration = (leave.end_date - leave.start_date).days+1
        total_leaves += leave_duration
    leave_deduction = total_leaves * daily_rate
    final_payout = payload.base_salary - leave_deduction

    if final_payout < 0:
        final_payout = 0.0

    db_salary = hr_models.Salary(
        employee_id = payload.employee_id,
        month = payload.month,
        year = payload.year,
        base_salary = payload.base_salary,
        leave_deduction = round(leave_deduction,2),
        final_payout = round(final_payout,2)
    )

    db.add(db_salary)
    db.commit()
    db.refresh(db_salary)

    return db_salary
    



