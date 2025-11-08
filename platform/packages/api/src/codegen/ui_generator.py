"""UI Generator - Generates Next.js pages from Blueprint.ui"""

from typing import Any


class UIGenerator:
    """Generates Next.js pages and components from Blueprint UI spec"""

    def __init__(self, pages: list[dict[str, Any]], tables: list[dict[str, Any]]):
        self.pages = pages
        self.tables = {t["name"]: t for t in tables}

    def generate_page(self, page: dict[str, Any]) -> str:
        """Generate a single Next.js page"""
        lines = [
            "// Auto-generated Next.js page from Blueprint",
            "// DO NOT EDIT - regenerate from Blueprint",
            "",
            "'use client';",
            "",
            "import { useEffect, useState } from 'react';",
            "import { Button } from '@/components/ui/button';",
            "import { Table } from '@/components/ui/table';",
            "",
            f"export default function {self._to_pascal_case(page['title'].replace(' ', ''))}Page() {{",
            "  const [data, setData] = useState([]);",
            "  const [loading, setLoading] = useState(true);",
            "",
            "  useEffect(() => {",
            "    fetchData();",
            "  }, []);",
            "",
            "  const fetchData = async () => {",
            "    setLoading(true);",
            "    try {",
            f"      const response = await fetch('/api{page['path']}');",
            "      const json = await response.json();",
            "      setData(json);",
            "    } catch (error) {",
            "      console.error('Error fetching data:', error);",
            "    } finally {",
            "      setLoading(false);",
            "    }",
            "  };",
            "",
            "  return (",
            "    <div className=\"container mx-auto p-6\">",
            f"      <h1 className=\"text-3xl font-bold mb-6\">{page['title']}</h1>",
            "",
        ]

        # Generate components
        for component in page.get("components", []):
            lines.extend(self._generate_component(component, indent=6))

        lines.extend(
            [
                "    </div>",
                "  );",
                "}",
            ]
        )

        return "\n".join(lines)

    def _generate_component(self, component: dict[str, Any], indent: int = 0) -> list[str]:
        """Generate a single UI component"""
        comp_type = component["type"]
        prefix = " " * indent

        if comp_type == "table":
            return self._generate_table_component(component, prefix)
        elif comp_type == "button":
            return self._generate_button_component(component, prefix)
        elif comp_type == "form":
            return self._generate_form_component(component, prefix)
        else:
            return [f'{prefix}<div>TODO: {comp_type} component</div>']

    def _generate_table_component(self, component: dict[str, Any], prefix: str) -> list[str]:
        """Generate table component"""
        columns = component.get("columns", [])

        lines = [
            f"{prefix}<div className=\"border rounded-lg\">",
            f"{prefix}  {{loading ? (",
            f"{prefix}    <div>Loading...</div>",
            f"{prefix}  ) : (",
            f"{prefix}    <table className=\"w-full\">",
            f"{prefix}      <thead>",
            f"{prefix}        <tr>",
        ]

        # Table headers
        for col in columns:
            lines.append(
                f"{prefix}          <th className=\"text-left p-4\">{col.title()}</th>"
            )

        lines.extend(
            [
                f"{prefix}        </tr>",
                f"{prefix}      </thead>",
                f"{prefix}      <tbody>",
                f"{prefix}        {{data.map((row: any, idx: number) => (",
                f"{prefix}          <tr key={{idx}}>",
            ]
        )

        # Table cells
        for col in columns:
            lines.append(f"{prefix}            <td className=\"p-4\">{{row.{col}}}</td>")

        lines.extend(
            [
                f"{prefix}          </tr>",
                f"{prefix}        ))}",
                f"{prefix}      </tbody>",
                f"{prefix}    </table>",
                f"{prefix}  )}}",
                f"{prefix}</div>",
            ]
        )

        return lines

    def _generate_button_component(self, component: dict[str, Any], prefix: str) -> list[str]:
        """Generate button component"""
        return [
            f"{prefix}<Button onClick={{() => console.log('clicked')}}>",
            f"{prefix}  {component.get('props', {}).get('text', 'Button')}",
            f"{prefix}</Button>",
        ]

    def _generate_form_component(self, component: dict[str, Any], prefix: str) -> list[str]:
        """Generate form component"""
        return [
            f"{prefix}<form>",
            f"{prefix}  {{/* TODO: Generate form fields */}}",
            f"{prefix}  <Button type=\"submit\">Submit</Button>",
            f"{prefix}</form>",
        ]

    @staticmethod
    def _to_pascal_case(snake_str: str) -> str:
        """Convert snake_case to PascalCase"""
        return "".join(word.capitalize() for word in snake_str.split("_"))
