"""Blueprint Parser - Validates and parses Blueprint JSON/YAML"""

import json
import yaml
from typing import Any
from pathlib import Path


class BlueprintParser:
    """Parses and validates Blueprint specifications"""

    def __init__(self, blueprint_data: dict[str, Any] | None = None):
        self.blueprint = blueprint_data or {}

    @classmethod
    def from_file(cls, file_path: str | Path) -> "BlueprintParser":
        """Load Blueprint from YAML or JSON file"""
        path = Path(file_path)

        with path.open() as f:
            if path.suffix in [".yaml", ".yml"]:
                data = yaml.safe_load(f)
            elif path.suffix == ".json":
                data = json.load(f)
            else:
                raise ValueError(f"Unsupported file type: {path.suffix}")

        return cls(data)

    @classmethod
    def from_json(cls, json_str: str) -> "BlueprintParser":
        """Load Blueprint from JSON string"""
        return cls(json.loads(json_str))

    def validate(self) -> tuple[bool, list[str]]:
        """
        Validate Blueprint against schema

        In production, this would call TypeScript validation via Zod schema.
        For Phase 0, we do basic structure validation.
        """
        errors: list[str] = []

        # Required fields
        if "version" not in self.blueprint:
            errors.append("Missing required field: version")
        if "name" not in self.blueprint:
            errors.append("Missing required field: name")
        if "database" not in self.blueprint:
            errors.append("Missing required field: database")
        if "ui" not in self.blueprint:
            errors.append("Missing required field: ui")
        if "api" not in self.blueprint:
            errors.append("Missing required field: api")

        # Validate database
        if "database" in self.blueprint:
            db = self.blueprint["database"]
            if "tables" not in db or not db["tables"]:
                errors.append("database.tables is required and must not be empty")

        # Validate UI
        if "ui" in self.blueprint:
            ui = self.blueprint["ui"]
            if "pages" not in ui or not ui["pages"]:
                errors.append("ui.pages is required and must not be empty")

        # Validate API
        if "api" in self.blueprint:
            api = self.blueprint["api"]
            if "endpoints" not in api or not api["endpoints"]:
                errors.append("api.endpoints is required and must not be empty")

        return (len(errors) == 0, errors)

    def get_database_tables(self) -> list[dict[str, Any]]:
        """Extract database tables from Blueprint"""
        return self.blueprint.get("database", {}).get("tables", [])

    def get_api_endpoints(self) -> list[dict[str, Any]]:
        """Extract API endpoints from Blueprint"""
        return self.blueprint.get("api", {}).get("endpoints", [])

    def get_ui_pages(self) -> list[dict[str, Any]]:
        """Extract UI pages from Blueprint"""
        return self.blueprint.get("ui", {}).get("pages", [])

    def get_workflows(self) -> list[dict[str, Any]]:
        """Extract workflows from Blueprint"""
        return self.blueprint.get("workflows", [])

    def get_metadata(self) -> dict[str, Any]:
        """Extract metadata (version, name, description, author)"""
        return {
            "version": self.blueprint.get("version", "1.0"),
            "name": self.blueprint.get("name", "Untitled"),
            "description": self.blueprint.get("description", ""),
            "author": self.blueprint.get("author", ""),
        }
