# pylint: skip-file

"""Create initial tables and their history tables

Revision ID: 745091662d3a
Revises:
Create Date: 2025-11-28 17:23:25.917453

"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "745091662d3a"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# ------------------------------------------------------------
# Helper: Create history table + trigger
# ------------------------------------------------------------

HISTORY_FUNCTION_TEMPLATE = """
CREATE OR REPLACE FUNCTION {table}_history_trigger_fn() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO {table}_history (op, changed_at, new_data)
        VALUES ('I', NOW(), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO {table}_history (op, changed_at, old_data, new_data)
        VALUES ('U', NOW(), row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO {table}_history (op, changed_at, old_data)
        VALUES ('D', NOW(), row_to_json(OLD));
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;
"""

TRIGGER_TEMPLATE = """
CREATE TRIGGER {table}_history_trigger
AFTER INSERT OR UPDATE OR DELETE ON {table}
FOR EACH ROW EXECUTE FUNCTION {table}_history_trigger_fn();
"""


def create_history_for(table_name: str):
    """Creates history table + function + trigger."""
    op.create_table(
        f"{table_name}_history",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("op", sa.String, nullable=False),
        sa.Column("changed_at", sa.DateTime, nullable=False),
        sa.Column("old_data", postgresql.JSONB),
        sa.Column("new_data", postgresql.JSONB),
    )

    op.execute(HISTORY_FUNCTION_TEMPLATE.format(table=table_name))
    op.execute(TRIGGER_TEMPLATE.format(table=table_name))


# ------------------------------------------------------------
# Upgrade
# ------------------------------------------------------------


def upgrade() -> None:
    # Enums
    product_category_enum = postgresql.ENUM(
        "Fruit",
        "Grain",
        "Resource",
        "Oil",
        "Other",
        name="product_category",
        create_type=True,
    )

    quantity_unit_enum = postgresql.ENUM(
        "kg",
        "liters",
        "tons",
        "units",
        name="quantity_unit",
        create_type=True,
    )

    document_type_enum = postgresql.ENUM(
        "CPF",
        "CNPJ",
        "CREA",
        "CRBIO",
        "INMETRO",
        "OTHER",
        name="document_type",
        create_type=True,
    )

    # --------------------------------------------------------
    # Main tables
    # --------------------------------------------------------

    op.create_table(
        "products",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("category", sa.Enum(name="product_category"), nullable=False),
        sa.Column("quantity_value", sa.Float, nullable=False),
        sa.Column("quantity_unit", sa.Enum(name="quantity_unit"), nullable=False),
        sa.Column("origin_country", sa.String, nullable=False),
        sa.Column("origin_state", sa.String),
        sa.Column("origin_city", sa.String),
        sa.Column("origin_latitude", sa.Float),
        sa.Column("origin_longitude", sa.Float),
        sa.Column("lot_number", sa.String),
        sa.Column("carbon_emission", sa.Float),
        sa.Column("metadata", postgresql.JSONB),
        sa.Column("tags", postgresql.ARRAY(sa.String)),
    )

    op.create_table(
        "producers",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("document_type", sa.Enum(name="document_type"), nullable=False),
        sa.Column("document_number", sa.String, nullable=False),
        sa.Column("address_country", sa.String, nullable=False),
        sa.Column("address_state", sa.String),
        sa.Column("address_city", sa.String),
        sa.Column("address_latitude", sa.Float),
        sa.Column("address_longitude", sa.Float),
        sa.Column("car_code", sa.String),
        sa.Column("contact_phone", sa.String),
        sa.Column("contact_email", sa.String),
        sa.Column("contact_website", sa.String),
        sa.Column("metadata", postgresql.JSONB),
    )

    op.create_table(
        "auditors",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("document_type", sa.Enum(name="document_type"), nullable=False),
        sa.Column("document_number", sa.String, nullable=False),
    )

    op.create_table(
        "certifiers",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("document_type", sa.Enum(name="document_type"), nullable=False),
        sa.Column("document_number", sa.String, nullable=False),
    )

    op.create_table(
        "certifier_auditors",
        sa.Column("certifier_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("certifiers.id"), primary_key=True),
        sa.Column("auditor_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("auditors.id"), primary_key=True),
    )

    op.create_table(
        "certificates",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("version", sa.String, nullable=False),
        sa.Column("product_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("products.id")),
        sa.Column("producer_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("producers.id")),
        sa.Column("certifier_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("certifiers.id")),
        sa.Column("norms_complied", postgresql.ARRAY(sa.String)),
        sa.Column("sustainability_criteria", postgresql.ARRAY(sa.String)),
        sa.Column("notes", sa.Text),
        sa.Column("issued_at", sa.DateTime, nullable=False),
        sa.Column("valid_until", sa.DateTime),
        sa.Column("last_audited_at", sa.DateTime),
        sa.Column("authenticity_serial_code", sa.String, nullable=False),
        sa.Column("authenticity_qr_code_url", sa.String),
        sa.Column("authenticity_signature", sa.Text),
        sa.Column("canonical_hash", sa.String, nullable=False),
    )

    # --------------------------------------------------------
    # History tables + triggers
    # --------------------------------------------------------

    for tbl in [
        "products",
        "producers",
        "auditors",
        "certifiers",
        "certifier_auditors",
        "certificates",
    ]:
        create_history_for(tbl)


# ------------------------------------------------------------
# Downgrade
# ------------------------------------------------------------
def downgrade() -> None:
    for tbl in [
        "certificates",
        "certifier_auditors",
        "certifiers",
        "auditors",
        "producers",
        "products",
    ]:
        op.drop_table(f"{tbl}_history")
        op.execute(f"DROP FUNCTION IF EXISTS {tbl}_history_trigger_fn() CASCADE")

    op.drop_table("certificates")
    op.drop_table("certifier_auditors")
    op.drop_table("certifiers")
    op.drop_table("auditors")
    op.drop_table("producers")
    op.drop_table("products")

    op.execute("DROP TYPE IF EXISTS document_type CASCADE")
    op.execute("DROP TYPE IF EXISTS quantity_unit CASCADE")
    op.execute("DROP TYPE IF EXISTS product_category CASCADE")
