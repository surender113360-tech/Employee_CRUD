# main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from db import engine, base
from create_login import router as auth_router
from security import check_role, get_curr_user
import user_model
from HR.router import router as hr_router
from HR.schemas import EmployeeOffboard 
from HR import hr_models




base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(
    auth_router,
    prefix='/auth',
    tags=['authentication']
)

app.include_router(
    hr_router,
    prefix = '/hr',
    tags = ['hr operations'],
    dependencies=[Depends(check_role(allowed_roles=['hr']))]

)

allow_hr_only = ['hr']
allow_employee_only = ['employee']



@app.get('/hr')
def hr_dashboard(current_user: user_model.users = Depends(check_role(allowed_roles=allow_hr_only))):
    return {
        "status": "welcome to the HR dashboard",
        "message": f"Hello Administrative Admin {current_user.email}. Access granted."
    }

@app.get('/employee')
def employee_dashboard(current_user: user_model.users = Depends(get_curr_user)):
    return {
        "message": "welcome to the  employee dashboard",
        "user": current_user.email,
        "role": current_user.role
    }
