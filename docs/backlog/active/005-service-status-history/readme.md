# 005 — Service Status Change History

## Goal
Track and display service status changes over time. Currently the dashboard "Recent Activity" block only shows incidents because there's no API for service status change log.

## Scope
- Add ServiceStatusChange model (service_id, old_status, new_status, changed_at, reason)
- Record status changes automatically when health checker updates service status
- API endpoint: GET /api/v1/services/{id}/status-history
- Dashboard: extend Recent Activity to include service status changes
- Public status page: show status change history per service

## Dependencies
- 001-status-pulse-base (done)

## What exists now
- Service model has `current_status` field (updated by health checker)
- No history of status changes is recorded
- Dashboard Recent Activity only shows incidents
