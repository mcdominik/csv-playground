from sqlalchemy import Column, Integer, String, Date, Text
from .database import Base
from sqlalchemy.sql import func


class CsvFiles(Base):
    __tablename__ = 'csvfiles'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, unique=True)
    content = Column(Text)
    created_date = Column(Date, default=func.current_date(), nullable=False)
