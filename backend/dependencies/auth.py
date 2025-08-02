from fastapi import Header, HTTPException

def get_current_email(authorization: str = Header(...)):
    if not authorization.startswith("token_"):
        raise HTTPException(status_code=401, detail="Token inválido")
    return authorization.replace("token_", "")
