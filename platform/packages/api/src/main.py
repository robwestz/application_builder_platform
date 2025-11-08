"""
Appkod Platform API - FastAPI backend

Main entry point for the platform API.
Handles:
- Blueprint validation and storage
- Codegen orchestration
- Connector management
- Tenant management
- Auth/authz integration (Keycloak + OPA)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Appkod Platform API",
    description="Universal Builder Platform - Backend API",
    version="0.0.1",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "ok", "service": "appkod-api", "version": "0.0.1"}


@app.get("/health")
async def health() -> dict[str, str]:
    """Health check for orchestration."""
    return {"status": "healthy"}


# Placeholder - will be populated with routes in Phase 1
