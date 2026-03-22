import jwt
# from app.db import db_dependency
# from fastapi import Depends, HTTPException, status
# from sqlmodel import select
# from models import User
import cryptography
import pathlib



print(cryptography.__builtins__)


# def verify_user(username: str, password: str, session = Depends(db_dependency)) -> bool:
#     user = session.exec(select(User).where(User.email == username)).first()
#     if not user: 
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    
#     return verify_password(password, user.hashed_password)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
    
#     return plain_password == hashed_password
