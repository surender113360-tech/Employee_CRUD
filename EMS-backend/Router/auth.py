from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from db import get_db
from Models import User
from Schemas import LoginIn,TokenOut,UserOut
from security import verify_password,create_access_token,get_current_user






router =APIRouter(prefix='/api/auth',
                  tags=["Authentication"])




@router.post('/login',response_model=TokenOut)
def login(payload:LoginIn,db:Session=Depends(get_db)):
    user = db.query(User).filter(User.emai==payload.email).first()
    if not user or not  verify_password (payload.password,user.hashed_pswd):
        # verify_password (payload.password,user.hashed_password)
        raise HTTPException(status_code=401,detail="incorrect email or password")
    return{"access_token":create_access_token(user),"role":user.role}



@router.get("/me",response_model=UserOut)
def me(user:User = Depends(get_current_user)):
    return user