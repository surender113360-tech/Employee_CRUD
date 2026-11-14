from sqlalchemy.orm import Session
from datetime import date
from Models import User,Departments,Employee
from security import hash_password

def seed_defaults(db:Session):
    if not db.query(User).filter(User.emai=="hr@gmail.com").first():
        db.add(User( full_name = "HR",
                    emai="hr@gmail.com",
                    hashed_pswd= hash_password("123"),
                    role = "hr"
                    ))

    emp_user = db.query(User).filter(User.emai =="employee@gmail.com").first()
    if not emp_user:

        emp_user = User(
            full_name="Employee",
            emai ="employee@gmail.com",
            hashed_pswd = hash_password("456"),
            role = "employee"

        )
        db.add(emp_user)
        db.flush()

    if not db.query(Employee).filter(Employee.user_id == emp_user.id).first():
        db.add(Employee(
            user_id = emp_user.id,
            employee_code = "EMP001",
            full_name = "employee",
            emai = "employee@gmail.com",
            desigination = "Employee",
            joining_date = date.today(),
            salary = 25000,
            status = "Active"

        ))
    for name in ["IT", "HR", "Finance", "Operations"]:
        if not db.query(Departments).filter(Departments.name == name).first():
            db.add(Departments(name=name))

    db.commit()