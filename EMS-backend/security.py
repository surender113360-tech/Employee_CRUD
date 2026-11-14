import os
from datetime import datetime,timezone,timedelta
from jose import jwt,JWTError
from passlib.context import CryptContext
from fastapi import Depends,HTTPException,status
# from fastapi.security import OAuth2PasswordBearer
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from db import get_db
from Models import User



load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY","dev-only-change-me")
ALGORITHM = "HS256"

# converting str to int
EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES","60"))

# password hashing
pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")

# extract the jwt token from the frontend
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
bearer_scheme = HTTPBearer()

# hasing the pswd
def hash_password(password:str)->str:
    return pwd_context.hash(password)
# verify the pswd
def verify_password(plain:str,hashed:str)->bool:
    return pwd_context.verify(plain,hashed)
# creating token
def create_access_token(user:User)->str:
    expires = datetime.now(timezone.utc)+timedelta(minutes=EXPIRE_MINUTES)
    return jwt.encode({"sub":str(user.id),"role":user.role,"exp":expires},SECRET_KEY,algorithm=ALGORITHM)
# verify token

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):

    token =credentials.credentials
    error = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid or Expired token")
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        user_id = int(payload.get("sub",0))
    except(JWTError,ValueError):
        raise error
    user = db.get(User,user_id)
    if not user or not user.is_active:
        raise error
    return user
def require_role(*roles):
    def checker(user:User=Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403,detail="you do not have permission")
        return user
    return checker