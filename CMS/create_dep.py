# from fastapi import Depends, HTTPException, status
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from jose import jwt, JWTError
# from sqlalchemy.orm import Session
# from db import get_db
# from user_model import users



# security = HTTPBearer()
# sceret_key = "myseceretkey"
# algorithm = "HS256"

# def get_curr_user(credentials:HTTPAuthorizationCredentials = Depends(security),
#                   db:Session = Depends(get_db)):
#     token = credentials.credentials
#     try: