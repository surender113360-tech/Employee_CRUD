from datetime import datetime,date
from pydantic import BaseModel,EmailStr,ConfigDict,Field


class LoginIn(BaseModel):
    email:EmailStr
    password:str



class TokenOut(BaseModel):
    access_token:str
    token_type:str="bearer"
    role:str



class UserOut(BaseModel):
    id: int
    full_name: str
    email: str = Field(validation_alias="emai")
    role: str
    model_config = ConfigDict(from_attributes=True)




class EmployeeCreate(BaseModel):
    employee_code:str
    full_name:str
    email:EmailStr
    phone:str|None =None
    desigination:str="Employee"
    department_id:int|None = None
    joining_date:date
    salary:float=Field(ge=0)




class EmployeeOut(EmployeeCreate):
    id: int
    email: EmailStr = Field(validation_alias="emai")
    status: str
    model_config = ConfigDict(from_attributes=True)



class LeaveCreate(BaseModel):
    leave_type:str
    start_date:date
    end_date:date
    reason:str




class LeaveOut(LeaveCreate):
    id:int
    employee_id:int
    status:str
    applied_at:datetime
    model_config=ConfigDict(from_attributes=True)




class DepartmentIn(BaseModel):
    name:str


class DepartmentOut(DepartmentIn):
    id:int
    model_config=ConfigDict(from_attributes=True)




class AnnouncementIn(BaseModel):
    title:str
    message:str



class AnnouncementOut(AnnouncementIn):
    id:int
    created_at:datetime
    model_config=ConfigDict(from_attributes=True)



class AttendanceOut(BaseModel):
    id:int
    employee_id:int
    work_date:date
    check_in:datetime|None
    check_out:datetime|None
    status:str
    model_config=ConfigDict(from_attributes=True)




class PayrollIn(BaseModel):
    employee_id:int
    month:int=Field(ge=1,le=12)
    year:int=Field(ge=0)
    basic_salary:float=Field(ge=0)
    lop_days:int = Field(default=0,ge= 0)
    deductions:float=Field(default=0,ge=0)


    


class PayrollOut(PayrollIn):
    id:int
    net_salary:float
    status:str
    model_config=ConfigDict(from_attributes=True)