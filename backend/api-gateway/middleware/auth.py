"""JWT Authentication Middleware"""
from typing import Optional
from fastapi import Request, HTTPException, status
from jose import jwt, JWTError
from config import settings

async def verify_token(request: Request) -> Optional[dict]:
    """Verify JWT token from request header"""
    token = request.headers.get("Authorization")
    
    if not token:
        return None
    
    try:
        scheme, credentials = token.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
        
        payload = jwt.decode(
            credentials,
            settings.JWT_SECRET_KEY,
            algorithms=["HS256"]
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )

async def get_current_user(request: Request) -> dict:
    """Dependency to get current user from token"""
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization token"
        )
    
    try:
        scheme, credentials = token.split()
        payload = jwt.decode(
            credentials,
            settings.JWT_SECRET_KEY,
            algorithms=["HS256"]
        )
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
