# create_login.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pwdlib import PasswordHash
from jose import jwt
from db import get_db
from user_model import users
from login_schema import Login

router = APIRouter()
pswd = PasswordHash.recommended()

secert_key = "myseceretkey"
algorithm = "HS256"

@router.post('/login')
def login(data: Login, db: Session = Depends(get_db)):
    user = db.query(users).filter(users.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with email {data.email} not found")
        
    if not pswd.verify(data.password, user.password):
        raise HTTPException(status_code=404, detail="Invalid password")
        
    token_data = {"user_id": user.id, "role": user.role}
    token = jwt.encode(token_data, secert_key, algorithm=algorithm)
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role
    }
