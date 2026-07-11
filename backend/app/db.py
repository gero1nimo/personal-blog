from sqlmodel import SQLModel, create_engine, Session
from  .config import settings
from typing import Generator

db_engine = create_engine(settings.DATABASE_URL)
SQLModel.metadata.create_all(db_engine)

def db_dependency()-> Generator[Session, None, None]:
    db_session = Session(db_engine)
    try:
        yield db_session
    except Exception as e:
        print(f"Database Error: {e}")
    finally:
        db_session.close()