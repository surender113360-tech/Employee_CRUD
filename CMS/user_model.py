from sqlalchemy import Column,Integer,String
from db import base


class users(base):
    __tablename__ = 'users'
    id = Column(Integer,primary_key = True,index = True)
    email = Column(String, unique = True,index = True)
    password = Column(String,nullable = False)
    role = Column(String , nullable = False)