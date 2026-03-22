import psycopg
from sqlmodel import SQLModel, create_engine, Session, select
from app.core.config import settings


db_engine = create_engine(settings.DATABASE_URL)
SQLModel.metadata.create_all(db_engine)


def db_dependency() -> Session:
    db_session = Session(db_engine)
    try:
        yield db_session
    except Exception as e:
        print(f"Database error: {e}")
        
    finally:
        db_session.close()
    


