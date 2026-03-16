"""merge migration heads

Revision ID: bed9ca68309f
Revises: a1b2c3d4e5f6, fe56fa70289e
Create Date: 2026-03-16 05:50:29.601440

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'bed9ca68309f'
down_revision = ('a1b2c3d4e5f6', 'fe56fa70289e')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
