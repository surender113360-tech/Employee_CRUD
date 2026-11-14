from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import base,engine,session
import Models
from seed import seed_defaults
from Router import auth,hr,employee


base.metadata.create_all(bind=engine)
with session() as db:
    seed_defaults(db)

app = FastAPI(title="HRMS API",version = "1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router)
app.include_router(hr.router)
app.include_router(employee.router)


@app.get('/')
def root():
    return{
        "message":"HRMS API is running",
        "docs":"/docs"
    }
