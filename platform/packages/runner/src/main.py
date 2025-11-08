"""
Appkod Runner - Serverless Runtime for Generated Apps

Multi-tenant runtime that executes generated applications with:
- Multi-tenant isolation (RLS, per-tenant KMS)
- RBAC/ABAC enforcement (OPA integration)
- Request routing per tenant
- Audit logging
- Cost tracking per tenant
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Appkod Runner",
    description="Serverless Runtime for Generated Applications",
    version="0.0.1",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Will be restricted per tenant in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "ok", "service": "appkod-runner", "version": "0.0.1"}


@app.get("/health")
async def health() -> dict[str, str]:
    """Health check for orchestration."""
    return {"status": "healthy"}


# Placeholder - will be populated with multi-tenant routing in Phase 1
