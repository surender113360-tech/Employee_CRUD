from pydantic import BaseModel,EmailStr
from typing import Optional
from datetime import date, datetime


class EmployeeOffboard(BaseModel):
    employee_id:str
    terimination_date:datetime
    reason:str
    eligible_for_rehire:bool


class salary_update(BaseModel):
    emplooyee_id:str
    new_base_salary:float
    effective_date:date


class leave_review(BaseModel):
    leave_id:int
    status:str
    hr_remarks:Optional[str] = None

class attendance_review(BaseModel):
    employee_id:str
    log_date: date
    check_in_time : Optional[datetime] = None
    check_out_time : Optional[datetime] = None
    status : str



class process_sal(BaseModel):
    employee_id:str 
    month:int
    year:int
    base_salary:float

class salary_res(BaseModel):
    id:int
    employee_id:str
    month:int
    year:int
    base_salary:float
    leave_deductions:float
    final_payout:float

    class config:
        from_attributes = True