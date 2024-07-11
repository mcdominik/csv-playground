from fastapi.responses import JSONResponse
import uvicorn
from fastapi import Body, FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Annotated, Optional
from .celery_worker import process_some_task
from .database import engine, SessionLocal
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from . import models


app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)


class CsvBase(BaseModel):
    title: str
    content: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependancy = Annotated[Session, Depends(get_db)]


@app.get('/csv-files')
async def get_files_(db: db_dependancy, title: Optional[str] = None):
    if not title:
        result = db.query(models.CsvFiles).all()
        if not result:
            raise HTTPException(status_code=404, detail='File not found')
        return result

    results = db.query(models.CsvFiles).filter(
        models.CsvFiles.title == title).first()
    print(results)
    if not results:
        raise HTTPException(status_code=404, detail="File not found")
    return results


@app.post("/csv-files")
async def create_file(csv_file: CsvBase, db: db_dependancy):
    new_file = models.CsvFiles(title=csv_file.title, content=csv_file.content)
    db.add(new_file)
    try:
        db.commit()
        db.refresh(new_file)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Title must be unique")
    return new_file


@app.post("/csv-files/enrich-json")
async def enrich_file_with_json(key_csv: str, key_json: str, json_string: str, title: str, db: db_dependancy):
    if not title:
        raise HTTPException(status_code=404, detail='File not found')
    result = db.query(models.CsvFiles).filter(
        models.CsvFiles.title == title).first()

    print(result)
    print(json_string)
    print(key_csv)
    print(key_json)

    if not result:
        return result


@app.get("/push")
async def push(device_token: str):
    process_some_task.delay(device_token)
    return {"message": "Notification sent"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
