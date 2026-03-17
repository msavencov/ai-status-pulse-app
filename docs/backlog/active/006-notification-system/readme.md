# 006 — Notification System

## Goal
Notify admins when service status changes or new incidents are created. Currently there's no alerting — admins have to manually check the dashboard.

## Scope
- Email notifications on service down/degraded
- Email notifications on new incident creation
- Notification preferences per user (email on/off, which services)
- Integration with existing SMTP config (already in .env)
- Optional: webhook/Telegram notifications

## Dependencies
- 001-status-pulse-base (done)
- SMTP config already in .env (SMTP_HOST, SMTP_USER, etc.)

## What exists now
- SMTP environment variables defined but not used for status notifications
- Email templates exist for password reset only
- No notification preferences model
