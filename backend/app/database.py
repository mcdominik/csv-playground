import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DATABASE_HOST = os.getenv("DATABASE_HOST", "localhost")
DATABASE_USER = os.getenv("DATABASE_USER", "postgres")
DATABASE_NAME = os.getenv("DATABASE_NAME", "transformer")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", "postgres")
DATABASE_PORT = os.getenv("DATABASE_PORT", "5432")

URL_DATABASE = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"
engine = create_engine(URL_DATABASE)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
