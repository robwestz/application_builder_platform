"""Database Generator - Generates Prisma schema from Blueprint.database"""

from typing import Any


class DatabaseGenerator:
    """Generates Prisma schema and SQLModel models from Blueprint database spec"""

    TYPE_MAPPING = {
        # Blueprint type → Prisma type
        "string": "String",
        "text": "String",
        "number": "Float",
        "integer": "Int",
        "float": "Float",
        "boolean": "Boolean",
        "date": "DateTime",
        "datetime": "DateTime",
        "timestamp": "DateTime",
        "uuid": "String",
        "email": "String",
        "url": "String",
        "phone": "String",
        "json": "Json",
        "jsonb": "Json",
    }

    def __init__(self, tables: list[dict[str, Any]]):
        self.tables = tables

    def generate_prisma_schema(self) -> str:
        """Generate Prisma schema.prisma file"""
        schema_lines = [
            "// Auto-generated Prisma schema from Blueprint",
            "// DO NOT EDIT - regenerate from Blueprint",
            "",
            "generator client {",
            '  provider = "prisma-client-js"',
            "}",
            "",
            "datasource db {",
            '  provider = "postgresql"',
            '  url      = env("DATABASE_URL")',
            "}",
            "",
        ]

        for table in self.tables:
            schema_lines.extend(self._generate_model(table))
            schema_lines.append("")

        return "\n".join(schema_lines)

    def _generate_model(self, table: dict[str, Any]) -> list[str]:
        """Generate a single Prisma model"""
        model_name = self._to_pascal_case(table["name"])
        lines = [f"model {model_name} {{"]

        # Generate fields
        for field in table["fields"]:
            lines.append("  " + self._generate_field(field, table))

        # Add timestamps if enabled
        if table.get("timestamps", True):
            lines.append('  createdAt DateTime @default(now()) @map("created_at")')
            lines.append('  updatedAt DateTime @updatedAt @map("updated_at")')

        # Add soft delete if enabled
        if table.get("softDelete", False):
            lines.append('  deletedAt DateTime? @map("deleted_at")')

        # Add tenant scoping if enabled
        if table.get("tenantScoped", True):
            lines.append('  tenantId  String @map("tenant_id")')
            lines.append('  @@index([tenantId])')

        # Map to table name (snake_case)
        lines.append(f'  @@map("{table["name"]}")')

        lines.append("}")
        return lines

    def _generate_field(self, field: dict[str, Any], table: dict[str, Any]) -> str:
        """Generate a single Prisma field"""
        name = field["name"]
        field_type = self.TYPE_MAPPING.get(field["type"], "String")

        # Handle optional fields
        if not field.get("required", False) and not field.get("primary", False):
            field_type += "?"

        # Attributes
        attrs = []

        if field.get("primary"):
            if field["type"] == "uuid":
                attrs.append("@id @default(uuid())")
            else:
                attrs.append("@id @default(autoincrement())")

        elif field.get("default"):
            default = field["default"]
            if isinstance(default, str):
                if default == "now()":
                    attrs.append("@default(now())")
                else:
                    attrs.append(f'@default("{default}")')
            elif isinstance(default, bool):
                attrs.append(f"@default({str(default).lower()})")
            else:
                attrs.append(f"@default({default})")

        if field.get("unique"):
            attrs.append("@unique")

        # Map to snake_case DB column
        if name != self._to_snake_case(name):
            attrs.append(f'@map("{self._to_snake_case(name)}")')

        attrs_str = " ".join(attrs)
        return f"{name} {field_type} {attrs_str}".strip()

    def generate_sqlmodel_models(self) -> str:
        """Generate SQLModel models (Python) for FastAPI"""
        lines = [
            '"""Auto-generated SQLModel models from Blueprint"""',
            "# DO NOT EDIT - regenerate from Blueprint",
            "",
            "from datetime import datetime",
            "from uuid import UUID, uuid4",
            "from sqlmodel import Field, SQLModel",
            "from typing import Optional",
            "",
        ]

        for table in self.tables:
            lines.extend(self._generate_sqlmodel(table))
            lines.append("")

        return "\n".join(lines)

    def _generate_sqlmodel(self, table: dict[str, Any]) -> list[str]:
        """Generate a single SQLModel class"""
        model_name = self._to_pascal_case(table["name"])
        lines = [
            f"class {model_name}(SQLModel, table=True):",
            f'    __tablename__ = "{table["name"]}"',
            "",
        ]

        # Generate fields
        for field in table["fields"]:
            lines.append("    " + self._generate_sqlmodel_field(field))

        # Add timestamps
        if table.get("timestamps", True):
            lines.append("    created_at: datetime = Field(default_factory=datetime.utcnow)")
            lines.append("    updated_at: datetime = Field(default_factory=datetime.utcnow)")

        # Add soft delete
        if table.get("softDelete", False):
            lines.append("    deleted_at: Optional[datetime] = None")

        # Add tenant scoping
        if table.get("tenantScoped", True):
            lines.append("    tenant_id: UUID = Field(index=True)")

        return lines

    def _generate_sqlmodel_field(self, field: dict[str, Any]) -> str:
        """Generate a single SQLModel field"""
        name = field["name"]
        py_type = self._to_python_type(field["type"])

        # Handle optional
        if not field.get("required", False) and not field.get("primary", False):
            py_type = f"Optional[{py_type}]"

        # Field attributes
        attrs: list[str] = []

        if field.get("primary"):
            if field["type"] == "uuid":
                attrs.append("default_factory=uuid4")
                attrs.append("primary_key=True")
            else:
                attrs.append("primary_key=True")

        if field.get("unique"):
            attrs.append("unique=True")

        if field.get("default"):
            default = field["default"]
            if isinstance(default, str) and default != "now()":
                attrs.append(f'default="{default}"')

        attrs_str = ", ".join(attrs) if attrs else ""
        if attrs_str:
            return f"{name}: {py_type} = Field({attrs_str})"
        return f"{name}: {py_type}"

    @staticmethod
    def _to_python_type(bp_type: str) -> str:
        """Convert Blueprint type to Python type"""
        mapping = {
            "string": "str",
            "text": "str",
            "number": "float",
            "integer": "int",
            "float": "float",
            "boolean": "bool",
            "date": "datetime",
            "datetime": "datetime",
            "timestamp": "datetime",
            "uuid": "UUID",
            "email": "str",
            "url": "str",
            "phone": "str",
            "json": "dict",
            "jsonb": "dict",
        }
        return mapping.get(bp_type, "str")

    @staticmethod
    def _to_pascal_case(snake_str: str) -> str:
        """Convert snake_case to PascalCase"""
        return "".join(word.capitalize() for word in snake_str.split("_"))

    @staticmethod
    def _to_snake_case(camel_str: str) -> str:
        """Convert camelCase to snake_case"""
        result = [camel_str[0].lower()]
        for char in camel_str[1:]:
            if char.isupper():
                result.extend(["_", char.lower()])
            else:
                result.append(char)
        return "".join(result)
