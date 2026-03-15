import asyncio
from datetime import datetime, timezone

import httpx
from sqlmodel import Session, select

from app.core.db import engine
from app.models import HealthCheck, Incident, IncidentStatus, Service, ServiceStatus


async def check_service(service: Service) -> None:
    """Ping a single service, record result, create/resolve incidents."""
    is_healthy = False
    status_code = None
    response_time_ms = 0

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            start = datetime.now(timezone.utc)
            response = await client.get(service.url)
            elapsed = (datetime.now(timezone.utc) - start).total_seconds() * 1000
            status_code = response.status_code
            response_time_ms = int(elapsed)
            is_healthy = 200 <= status_code < 400
    except Exception:
        is_healthy = False

    with Session(engine) as session:
        # Record health check
        check = HealthCheck(
            service_id=service.id,
            status_code=status_code,
            response_time_ms=response_time_ms,
            is_healthy=is_healthy,
        )
        session.add(check)

        # Update service status
        db_service = session.get(Service, service.id)
        if db_service:
            db_service.current_status = (
                ServiceStatus.operational if is_healthy else ServiceStatus.down
            )
            session.add(db_service)

        # Auto-create incident on failure
        if not is_healthy:
            active_incident = session.exec(
                select(Incident)
                .where(Incident.service_id == service.id)
                .where(Incident.status != IncidentStatus.resolved)
            ).first()
            if not active_incident:
                incident = Incident(
                    service_id=service.id,
                    title=f"{service.name} is down",
                    status=IncidentStatus.investigating,
                )
                session.add(incident)

        # Auto-resolve on recovery
        if is_healthy:
            active_incidents = session.exec(
                select(Incident)
                .where(Incident.service_id == service.id)
                .where(Incident.status != IncidentStatus.resolved)
            ).all()
            for inc in active_incidents:
                inc.status = IncidentStatus.resolved
                inc.resolved_at = datetime.now(timezone.utc)
                session.add(inc)

        session.commit()


async def run_checker() -> None:
    """Infinite loop checking all services."""
    while True:
        with Session(engine) as session:
            services = list(session.exec(select(Service)).all())
        for service in services:
            await check_service(service)
        await asyncio.sleep(60)
