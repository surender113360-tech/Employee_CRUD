from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base

data_base='postgresql+psycopg://postgres:root@localhost:5432/company%20management%20system'
engine = create_engine(data_base)
session = sessionmaker(bind = engine,autocommit = False,autoflush = False)
base = declarative_base()


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

def create_table():
    base.metadata.create_all(bind=engine)
