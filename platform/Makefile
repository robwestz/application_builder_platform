.PHONY: help install clean build test lint typecheck dev-web dev-api dev-all docker-up docker-down

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "Appkod Platform - Makefile Commands"
	@echo "===================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies (Node + Python)
	@echo "📦 Installing Node dependencies..."
	npm install
	@echo "🐍 Installing Python dependencies for API..."
	cd packages/api && pip install -e ".[dev]"
	@echo "🐍 Installing Python dependencies for Runner..."
	cd packages/runner && pip install -e ".[dev]"
	@echo "✅ All dependencies installed!"

clean: ## Clean all build artifacts and dependencies
	@echo "🧹 Cleaning..."
	npm run clean
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name '*.pyc' -delete 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .coverage -exec rm -rf {} + 2>/dev/null || true
	@echo "✅ Clean complete!"

build: ## Build all packages
	@echo "🔨 Building all packages..."
	npm run build
	@echo "✅ Build complete!"

test: ## Run all tests
	@echo "🧪 Running tests..."
	npm run test
	@echo "✅ Tests complete!"

lint: ## Lint all code
	@echo "🔍 Linting..."
	npm run lint
	cd packages/api && ruff check .
	cd packages/runner && ruff check .
	@echo "✅ Lint complete!"

typecheck: ## Type check all code
	@echo "🔍 Type checking..."
	npm run typecheck
	cd packages/api && mypy .
	cd packages/runner && mypy .
	@echo "✅ Type check complete!"

validate: ## Run all validation (lint + typecheck + test)
	@echo "✅ Running full validation pipeline..."
	$(MAKE) lint
	$(MAKE) typecheck
	$(MAKE) test
	@echo "🎉 All validation passed!"

dev-web: ## Start Next.js web app in dev mode
	@echo "🌐 Starting web app..."
	npm run dev:web

dev-api: ## Start FastAPI backend in dev mode
	@echo "🚀 Starting API..."
	npm run dev:api

dev-all: ## Start all services (requires docker-compose)
	@echo "🚀 Starting all services via docker-compose..."
	docker-compose up

docker-up: ## Start docker-compose services
	@echo "🐳 Starting Docker services..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "📊 Web: http://localhost:3000"
	@echo "📊 API: http://localhost:8000"
	@echo "📊 Runner: http://localhost:8001"

docker-down: ## Stop docker-compose services
	@echo "🐳 Stopping Docker services..."
	docker-compose down
	@echo "✅ Services stopped!"

docker-logs: ## Tail docker-compose logs
	docker-compose logs -f

docker-rebuild: ## Rebuild and restart docker services
	@echo "🔨 Rebuilding Docker images..."
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	@echo "✅ Rebuild complete!"

format: ## Format all code
	@echo "✨ Formatting code..."
	npm run format --workspaces --if-present
	cd packages/api && ruff format .
	cd packages/runner && ruff format .
	@echo "✅ Formatting complete!"

contracts-codegen: ## Generate TypeScript types from contracts
	@echo "🔧 Generating contract types..."
	cd packages/contracts && npm run build
	@echo "✅ Contract codegen complete!"

security-scan: ## Run security scans (Trivy)
	@echo "🔒 Running security scans..."
	trivy fs --severity HIGH,CRITICAL .
	@echo "✅ Security scan complete!"

db-migrate: ## Run database migrations
	@echo "📊 Running database migrations..."
	cd packages/api && alembic upgrade head
	@echo "✅ Migrations complete!"

db-reset: ## Reset database (WARNING: deletes all data)
	@echo "⚠️  WARNING: This will delete all database data!"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	cd packages/api && alembic downgrade base && alembic upgrade head
	@echo "✅ Database reset complete!"
