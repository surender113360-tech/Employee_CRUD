from db import session,base,engine
from user_model import users
from pwdlib import PasswordHash

pwd_hasher = PasswordHash.recommended()
db = session()

base.metadata.create_all(bind = engine)

hr=users(
    email = "hr@gamil.com",
    password = pwd_hasher.hash("hr123"),
    role = "hr"
)

employee = users(
    email = "employee@gmail.com",
    password = pwd_hasher.hash("employee123"),
    role = "employee"
)

hr_exists = db.query(users).filter(users.email == hr.email).first()
employee_exits = db.query(users).filter(users.email == employee.email).first()
if not hr_exists:
    db.add(hr)
    db.commit()
    print("HR user created successfully.")

if not employee_exits:
  db.add(employee)
  db.commit()
  print("employee user added successfully")


db.close()

