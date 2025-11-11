.PHONY: help install dev build test lint format clean docker-up docker-down db-migrate

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	pnpm install
	cd services && pip install -e ".[dev]"

dev: ## Start development servers
	docker compose up -d
	pnpm dev

build: ## Build all packages
	pnpm build

test: ## Run all tests
	pnpm test
	cd services && pytest

test-integration: ## Run integration tests
	docker compose up -d
	sleep 5
	cd services && pytest -m integration

lint: ## Lint all code
	pnpm lint
	cd services && ruff check . && black --check . && isort --check .

format: ## Format all code
	pnpm format
	cd services && ruff check --fix . && black . && isort .

typecheck: ## Run type checking
	pnpm typecheck
	cd services && mypy .

clean: ## Clean build artifacts
	pnpm clean
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true

docker-up: ## Start local infrastructure
	docker compose up -d

docker-down: ## Stop local infrastructure
	docker compose down

docker-logs: ## View docker logs
	docker compose logs -f

db-migrate: ## Run database migrations
	cd services && alembic upgrade head

db-seed: ## Seed database with test data
	cd services && python scripts/seed.py

security-scan: ## Run security scans
	trivy fs --severity HIGH,CRITICAL .
	semgrep --config auto .

proto-gen: ## Generate code from proto files
	cd packages/proto && buf generate

docs: ## Generate documentation
	cd docs && mkdocs build

docs-serve: ## Serve documentation locally
	cd docs && mkdocs serve
