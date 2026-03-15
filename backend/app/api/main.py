from fastapi import APIRouter

from app.api.routes import incidents, login, private, public, services, users, utils
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(services.router)
api_router.include_router(incidents.router)
api_router.include_router(public.router)


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
