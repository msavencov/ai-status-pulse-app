"""Add service healthcheck incident tables, drop item

Revision ID: a1b2c3d4e5f6
Revises: 1a31ce608336
Create Date: 2026-03-15 16:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '1a31ce608336'
branch_labels = None
depends_on = None


def upgrade():
    # Drop old item table
    op.drop_table('item')

    # Create service table
    op.create_table('service',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('url', sqlmodel.sql.sqltypes.AutoString(length=2048), nullable=False),
        sa.Column('category', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
        sa.Column('check_interval', sa.Integer(), nullable=False),
        sa.Column('current_status', sa.Enum('operational', 'degraded', 'down', name='servicestatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # Create healthcheck table
    op.create_table('healthcheck',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('service_id', sa.Uuid(), nullable=False),
        sa.Column('status_code', sa.Integer(), nullable=True),
        sa.Column('response_time_ms', sa.Integer(), nullable=False),
        sa.Column('is_healthy', sa.Boolean(), nullable=False),
        sa.Column('checked_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['service_id'], ['service.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # Create incident table
    op.create_table('incident',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('service_id', sa.Uuid(), nullable=False),
        sa.Column('title', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=False),
        sa.Column('status', sa.Enum('investigating', 'identified', 'monitoring', 'resolved', name='incidentstatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['service_id'], ['service.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade():
    op.drop_table('incident')
    op.drop_table('healthcheck')
    op.drop_table('service')

    # Recreate item table
    op.create_table('item',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('title', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('description', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('owner_id', sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # Drop enums
    sa.Enum(name='servicestatus').drop(op.get_bind())
    sa.Enum(name='incidentstatus').drop(op.get_bind())
