"""API Generator - Generates FastAPI routes from Blueprint.api"""

from typing import Any


class APIGenerator:
    """Generates FastAPI routes and endpoints from Blueprint API spec"""

    def __init__(self, endpoints: list[dict[str, Any]], tables: list[dict[str, Any]]):
        self.endpoints = endpoints
        self.tables = {t["name"]: t for t in tables}

    def generate_routes(self) -> str:
        """Generate FastAPI routes file"""
        lines = [
            '"""Auto-generated API routes from Blueprint"""',
            "# DO NOT EDIT - regenerate from Blueprint",
            "",
            "from fastapi import APIRouter, Depends, HTTPException, Query",
            "from sqlmodel import Session, select",
            "from typing import List",
            "from uuid import UUID",
            "",
            "from ..database import get_session",
            "from ..models import *",
            "from ..auth import get_current_user, User",
            "",
            "router = APIRouter()",
            "",
        ]

        for endpoint in self.endpoints:
            lines.extend(self._generate_endpoint(endpoint))
            lines.append("")

        return "\n".join(lines)

    def _generate_endpoint(self, endpoint: dict[str, Any]) -> list[str]:
        """Generate a single FastAPI endpoint"""
        path = endpoint["path"]
        method = endpoint["method"].lower()
        table_name = endpoint.get("table")

        if not table_name:
            # Custom endpoint - generate stub
            return self._generate_custom_endpoint(endpoint)

        # CRUD endpoint
        if method == "get" and "{" not in path:
            return self._generate_list_endpoint(endpoint, table_name)
        elif method == "get" and "{" in path:
            return self._generate_get_endpoint(endpoint, table_name)
        elif method == "post":
            return self._generate_create_endpoint(endpoint, table_name)
        elif method == "put" or method == "patch":
            return self._generate_update_endpoint(endpoint, table_name)
        elif method == "delete":
            return self._generate_delete_endpoint(endpoint, table_name)

        return []

    def _generate_list_endpoint(
        self, endpoint: dict[str, Any], table_name: str
    ) -> list[str]:
        """Generate GET /resources (list) endpoint"""
        model_name = self._to_pascal_case(table_name)
        func_name = f"list_{table_name}"
        paginated = endpoint.get("paginated", False)

        lines = [f'@router.get("{endpoint["path"]}", response_model=List[{model_name}])']

        if endpoint.get("auth") == "required":
            lines.append(
                f"async def {func_name}(session: Session = Depends(get_session), user: User = Depends(get_current_user)):"
            )
        else:
            lines.append(f"async def {func_name}(session: Session = Depends(get_session)):")

        if paginated:
            lines.extend(
                [
                    "    # TODO: Add pagination (limit, offset)",
                    f"    statement = select({model_name})",
                    "    # TODO: Add tenant filtering",
                    "    results = session.exec(statement).all()",
                    "    return results",
                ]
            )
        else:
            lines.extend(
                [
                    f"    statement = select({model_name})",
                    "    # TODO: Add tenant filtering",
                    "    results = session.exec(statement).all()",
                    "    return results",
                ]
            )

        return lines

    def _generate_get_endpoint(
        self, endpoint: dict[str, Any], table_name: str
    ) -> list[str]:
        """Generate GET /resources/{id} (detail) endpoint"""
        model_name = self._to_pascal_case(table_name)
        func_name = f"get_{table_name}_by_id"
        resource_id = "resource_id"

        lines = [
            f'@router.get("{endpoint["path"]}", response_model={model_name})',
            f"async def {func_name}({resource_id}: UUID, session: Session = Depends(get_session), user: User = Depends(get_current_user)):",
            f"    statement = select({model_name}).where({model_name}.id == {resource_id})",
            "    # TODO: Add tenant filtering",
            "    result = session.exec(statement).first()",
            "    if not result:",
            '        raise HTTPException(status_code=404, detail="Not found")',
            "    return result",
        ]

        return lines

    def _generate_create_endpoint(
        self, endpoint: dict[str, Any], table_name: str
    ) -> list[str]:
        """Generate POST /resources (create) endpoint"""
        model_name = self._to_pascal_case(table_name)
        func_name = f"create_{table_name}"

        lines = [
            f'@router.post("{endpoint["path"]}", response_model={model_name}, status_code=201)',
            f"async def {func_name}(data: {model_name}, session: Session = Depends(get_session), user: User = Depends(get_current_user)):",
            "    # TODO: Set tenant_id from user",
            "    # data.tenant_id = user.tenant_id",
            "    session.add(data)",
            "    session.commit()",
            "    session.refresh(data)",
            "    return data",
        ]

        return lines

    def _generate_update_endpoint(
        self, endpoint: dict[str, Any], table_name: str
    ) -> list[str]:
        """Generate PUT /resources/{id} (update) endpoint"""
        model_name = self._to_pascal_case(table_name)
        func_name = f"update_{table_name}"

        lines = [
            f'@router.put("{endpoint["path"]}", response_model={model_name})',
            f"async def {func_name}(resource_id: UUID, data: {model_name}, session: Session = Depends(get_session), user: User = Depends(get_current_user)):",
            f"    statement = select({model_name}).where({model_name}.id == resource_id)",
            "    # TODO: Add tenant filtering",
            "    result = session.exec(statement).first()",
            "    if not result:",
            '        raise HTTPException(status_code=404, detail="Not found")',
            "    # TODO: Update fields from data",
            "    session.add(result)",
            "    session.commit()",
            "    session.refresh(result)",
            "    return result",
        ]

        return lines

    def _generate_delete_endpoint(
        self, endpoint: dict[str, Any], table_name: str
    ) -> list[str]:
        """Generate DELETE /resources/{id} (delete) endpoint"""
        model_name = self._to_pascal_case(table_name)
        func_name = f"delete_{table_name}"

        lines = [
            f'@router.delete("{endpoint["path"]}", status_code=204)',
            f"async def {func_name}(resource_id: UUID, session: Session = Depends(get_session), user: User = Depends(get_current_user)):",
            f"    statement = select({model_name}).where({model_name}.id == resource_id)",
            "    # TODO: Add tenant filtering",
            "    result = session.exec(statement).first()",
            "    if not result:",
            '        raise HTTPException(status_code=404, detail="Not found")',
            "    session.delete(result)",
            "    session.commit()",
            "    return None",
        ]

        return lines

    def _generate_custom_endpoint(self, endpoint: dict[str, Any]) -> list[str]:
        """Generate custom endpoint stub"""
        func_name = f"custom_{endpoint['path'].replace('/', '_').strip('_')}"
        method = endpoint["method"].lower()

        return [
            f'@router.{method}("{endpoint["path"]}")',
            f"async def {func_name}():",
            '    # TODO: Implement custom logic',
            '    return {"message": "Not implemented"}',
        ]

    @staticmethod
    def _to_pascal_case(snake_str: str) -> str:
        """Convert snake_case to PascalCase"""
        return "".join(word.capitalize() for word in snake_str.split("_"))
