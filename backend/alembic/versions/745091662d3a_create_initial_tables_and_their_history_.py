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
        "FRUIT",
        "GRAIN",
        "RESOURCE",
        "OIL",
        "OTHER",
        name="product_category",
        create_type=False,
    )
    product_category_enum.create(op.get_bind(), checkfirst=True)

    quantity_unit_enum = postgresql.ENUM(
        "KG",
        "LITERS",
        "TONS",
        "UNITS",
        name="quantity_unit",
        create_type=False,
    )
    quantity_unit_enum.create(op.get_bind(), checkfirst=True)

    document_type_enum = postgresql.ENUM(
        "CPF",
        "CNPJ",
        "CREA",
        "CRBIO",
        "INMETRO",
        "OTHER",
        name="document_type",
        create_type=False,
    )
    document_type_enum.create(op.get_bind(), checkfirst=True)

    # --------------------------------------------------------
    # Main tables
    # --------------------------------------------------------

    op.create_table(
        "products",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("category", product_category_enum, nullable=False),
        sa.Column("quantity_value", sa.Float, nullable=False),
        sa.Column("quantity_unit", quantity_unit_enum, nullable=False),
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
        sa.Column("document_type", document_type_enum, nullable=False),
        sa.Column("document_number", sa.String, nullable=False),
        sa.Column("address_country", sa.String, nullable=False),
        sa.Column("address_state", sa.String, nullable=True),
        sa.Column("address_city", sa.String, nullable=True),
        sa.Column("address_latitude", sa.Float, nullable=False),
        sa.Column("address_longitude", sa.Float, nullable=False),
        sa.Column("car_code", sa.String, nullable=True),
        sa.Column("contact_phone", sa.String, nullable=True),
        sa.Column("contact_email", sa.String, nullable=True),
        sa.Column("contact_website", sa.String, nullable=True),
        sa.Column("metadata", postgresql.JSONB, nullable=True),
    )

    op.create_table(
        "auditors",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("document_type", document_type_enum, nullable=False),
        sa.Column("document_number", sa.String, nullable=False),
    )

    op.create_table(
        "certifiers",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("document_type", document_type_enum, nullable=False),
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
        sa.Column("product_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("producer_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("producers.id"), nullable=False),
        sa.Column("certifier_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("certifiers.id"), nullable=False),
        sa.Column("norms_complied", postgresql.ARRAY(sa.String), nullable=False),
        sa.Column("sustainability_criteria", postgresql.ARRAY(sa.String), nullable=False),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("issued_at", sa.String, nullable=True),
        sa.Column("valid_until", sa.String, nullable=True),
        sa.Column("last_audited_at", sa.String, nullable=True),
        sa.Column("authenticity_serial_code", sa.String, nullable=True),
        sa.Column("authenticity_qr_code_url", sa.String, nullable=True),
        sa.Column("authenticity_certifier_signature", sa.Text, nullable=True),
        sa.Column("authenticity_certifier_address", sa.String, nullable=True),
        sa.Column("authenticity_pdf_hash", sa.String, nullable=True),
        sa.Column("canonical_hash", sa.String, nullable=True),
        sa.Column("blockchain_id", sa.String, nullable=True),
    )

    # Create indexes
    op.create_index(
        "ix_certificates_product_id",
        "certificates",
        ["product_id"],
    )
    op.create_index(
        "ix_certificates_producer_id",
        "certificates",
        ["producer_id"],
    )
    op.create_index(
        "ix_certificates_certifier_id",
        "certificates",
        ["certifier_id"],
    )
    op.create_index(
        "ix_certificates_canonical_hash",
        "certificates",
        ["canonical_hash"],
        unique=True,
    )
    op.create_index(
        "ix_certificates_authenticity_pdf_hash",
        "certificates",
        ["authenticity_pdf_hash"],
        unique=True,
    )
    op.create_index(
        "ix_producers_document_number",
        "producers",
        ["document_number"],
        unique=True,
    )
    op.create_index(
        "ix_certifiers_document_number",
        "certifiers",
        ["document_number"],
        unique=True,
    )
    op.create_index(
        "ix_auditors_document_number",
        "auditors",
        ["document_number"],
        unique=True,
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
    op.drop_index("ix_certificates_authenticity_pdf_hash", table_name="certificates")
    op.drop_index("ix_certificates_canonical_hash", table_name="certificates")
    op.drop_index("ix_certificates_certifier_id", table_name="certificates")
    op.drop_index("ix_certificates_producer_id", table_name="certificates")
    op.drop_index("ix_certificates_product_id", table_name="certificates")
    op.drop_index("ix_certifiers_document_number", table_name="certifiers")
    op.drop_index("ix_producers_document_number", table_name="producers")
    op.drop_index("ix_auditors_document_number", table_name="auditors")

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
