import uuid

from fastapi import APIRouter

from app import crud
from app.api.deps import SessionDep
from app.models import HealthCheckPublic, IncidentsPublic, ServicesPublic

router = APIRouter(prefix="/status", tags=["public"])


@router.get("/services", response_model=ServicesPublic)
def public_services(session: SessionDep):
    services, count = crud.get_services(session=session)
    return ServicesPublic(data=services, count=count)


@router.get(
    "/services/{service_id}/checks", response_model=list[HealthCheckPublic]
)
def public_health_checks(
    session: SessionDep, service_id: uuid.UUID, limit: int = 100
):
    return crud.get_health_checks(
        session=session, service_id=service_id, limit=limit
    )


@router.get("/incidents", response_model=IncidentsPublic)
def public_incidents(
    session: SessionDep,
    active_only: bool = True,
    skip: int = 0,
    limit: int = 100,
):
    incidents, count = crud.get_incidents(
        session=session, skip=skip, limit=limit, active_only=active_only
    )
    return IncidentsPublic(data=incidents, count=count)
