import psycopg
from app.models import project, blog
from sqlmodel import SQLModel, create_engine, Session, select

db_parameters = {
    "host": "localhost",
    "port": 5432,
    "dbname": "postgres",
    "user": "postgres",
    "password": "Ayzit56"
}

db_engine = create_engine(f"postgresql+psycopg://{db_parameters['user']}:{db_parameters['password']}@{db_parameters['host']}:{db_parameters['port']}/{db_parameters['dbname']}")
SQLModel.metadata.create_all(db_engine)


def db_dependency():
    db_session = Session(db_engine)
    try:
        yield db_session
    except Exception as e:
        print(f"Database error: {e}")
        
    finally:
        db_session.close()
    


