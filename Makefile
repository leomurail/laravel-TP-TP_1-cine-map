.PHONY: help install setup dev server vite queue worker mcp lint test seed migrate db-reset

help: ## Display this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies (Composer, NPM)
	composer install
	npm install

setup: install ## Setup the project (env, key, database)
	cp -n .env.example .env || true
	php artisan key:generate
	touch database/database.sqlite
	php artisan migrate --seed

dev: ## Run all development services using concurrently
	npm run dev

server: ## Run only the Laravel server
	php artisan serve

vite: ## Run only the Vite development server
	npm run dev

queue: ## Run the queue worker
	php artisan queue:work

worker: queue ## Alias for queue

mcp: ## Run the MCP server (Artisan)
	php artisan mcp:start cinemap

lint: ## Run Laravel Pint to fix code style
	./vendor/bin/pint

test: ## Run tests
	php artisan test

seed: ## Seed the database
	php artisan db:seed

migrate: ## Run database migrations
	php artisan migrate

db-reset: ## Reset the database (migrate:fresh --seed)
	php artisan migrate:fresh --seed
