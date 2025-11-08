"""Codegen Engine - Main orchestrator for code generation"""

from pathlib import Path
from typing import Any

from .blueprint_parser import BlueprintParser
from .database_generator import DatabaseGenerator
from .api_generator import APIGenerator
from .ui_generator import UIGenerator


class CodegenEngine:
    """Main code generation engine - orchestrates all generators"""

    def __init__(self, blueprint: dict[str, Any] | str | Path):
        """
        Initialize codegen engine

        Args:
            blueprint: Blueprint dict, JSON string, or file path
        """
        if isinstance(blueprint, dict):
            self.parser = BlueprintParser(blueprint)
        elif isinstance(blueprint, (str, Path)):
            self.parser = BlueprintParser.from_file(blueprint)
        else:
            raise ValueError("blueprint must be dict, str, or Path")

    def validate(self) -> tuple[bool, list[str]]:
        """Validate Blueprint"""
        return self.parser.validate()

    def generate_all(self, output_dir: str | Path) -> dict[str, str]:
        """
        Generate all code (database, API, UI)

        Returns:
            Dict mapping file paths to generated code
        """
        output = Path(output_dir)
        generated: dict[str, str] = {}

        # Validate first
        valid, errors = self.validate()
        if not valid:
            raise ValueError(f"Blueprint validation failed: {errors}")

        # Generate database code
        db_code = self.generate_database()
        generated.update(db_code)

        # Generate API code
        api_code = self.generate_api()
        generated.update(api_code)

        # Generate UI code
        ui_code = self.generate_ui()
        generated.update(ui_code)

        return generated

    def generate_database(self) -> dict[str, str]:
        """Generate database code (Prisma + SQLModel)"""
        tables = self.parser.get_database_tables()
        generator = DatabaseGenerator(tables)

        return {
            "prisma/schema.prisma": generator.generate_prisma_schema(),
            "api/models.py": generator.generate_sqlmodel_models(),
        }

    def generate_api(self) -> dict[str, str]:
        """Generate API code (FastAPI routes)"""
        endpoints = self.parser.get_api_endpoints()
        tables = self.parser.get_database_tables()
        generator = APIGenerator(endpoints, tables)

        return {
            "api/routes.py": generator.generate_routes(),
        }

    def generate_ui(self) -> dict[str, str]:
        """Generate UI code (Next.js pages)"""
        pages = self.parser.get_ui_pages()
        tables = self.parser.get_database_tables()
        generator = UIGenerator(pages, tables)

        generated = {}
        for page in pages:
            # Convert path to file path (e.g., /customers → app/customers/page.tsx)
            path = page["path"].strip("/")
            if not path:
                path = "page"
            else:
                path = f"{path}/page"

            file_path = f"web/app/{path}.tsx"
            generated[file_path] = generator.generate_page(page)

        return generated

    def write_all(self, output_dir: str | Path) -> None:
        """Generate and write all files to disk"""
        generated = self.generate_all(output_dir)

        for file_path, content in generated.items():
            full_path = Path(output_dir) / file_path
            full_path.parent.mkdir(parents=True, exist_ok=True)

            with full_path.open("w") as f:
                f.write(content)

            print(f"✅ Generated: {file_path}")

    def get_metadata(self) -> dict[str, Any]:
        """Get Blueprint metadata"""
        return self.parser.get_metadata()


def generate_from_blueprint(
    blueprint_path: str | Path, output_dir: str | Path
) -> dict[str, str]:
    """
    Convenience function to generate code from Blueprint file

    Args:
        blueprint_path: Path to Blueprint YAML/JSON file
        output_dir: Output directory for generated code

    Returns:
        Dict mapping file paths to generated code
    """
    engine = CodegenEngine(blueprint_path)
    return engine.generate_all(output_dir)
