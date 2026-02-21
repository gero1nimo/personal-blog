import sqlalchemy

connection = sqlalchemy.create_engine("sqlite:///./db.sqlite3", echo=True)