"""
Codegen Engine - Blueprint to Code Generation

This module handles code generation from Blueprint specifications to
Next.js + FastAPI applications.

Architecture:
    Blueprint (YAML/JSON)
        ↓
    Parser (validate with Zod schemas)
        ↓
    Generators (database, api, ui, workflows)
        ↓
    Templates (Jinja2 templates)
        ↓
    Generated Code (Next.js + FastAPI)

Generators:
    - DatabaseGenerator: Blueprint.database → Prisma schema + SQLModel models
    - APIGenerator: Blueprint.api → FastAPI routes + OpenAPI
    - UIGenerator: Blueprint.ui → Next.js pages + components
    - WorkflowGenerator: Blueprint.workflows → Temporal workflows
"""

from .blueprint_parser import BlueprintParser
from .database_generator import DatabaseGenerator
from .api_generator import APIGenerator
from .ui_generator import UIGenerator
from .codegen_engine import CodegenEngine

__all__ = [
    "BlueprintParser",
    "DatabaseGenerator",
    "APIGenerator",
    "UIGenerator",
    "CodegenEngine",
]
