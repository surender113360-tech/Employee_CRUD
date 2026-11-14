from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker,declarative_base


load_dotenv()
data_base_url = os.getenv("DATABASE_URL")


engine = create_engine(data_base_url)
session = sessionmaker(bind = engine,autocommit = False,autoflush = False)
base = declarative_base()


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()


