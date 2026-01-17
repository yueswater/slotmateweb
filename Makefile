APP_NAME := slotmateweb
NODE_ENV ?= development
PORT ?= 5173

NPM := npm

.DEFAULT_GOAL := help

help:
	@echo ""
	@echo "Usage: make <target>"
	@echo ""
	@echo "install        Install dependencies"
	@echo "dev            Start dev server"
	@echo "build          Build for production"
	@echo "preview        Preview production build"
	@echo "lint           Run ESLint"
	@echo "format         Run Prettier"
	@echo "clean          Remove build artifacts"
	@echo "reinstall      Reinstall dependencies"
	@echo ""

install:
	$(NPM) install

reinstall: clean
	rm -rf node_modules package-lock.json
	$(NPM) install

dev:
	$(NPM) run dev

build:
	$(NPM) run build

preview:
	$(NPM) run preview

lint:
	$(NPM) run lint

format:
	$(NPM) run format || true

clean:
	rm -rf dist .vite

info:
	@echo "App: $(APP_NAME)"
	@echo "Env: $(NODE_ENV)"
	@echo "Port: $(PORT)"

tree:
	tree -I "node_modules|.nuxt|.git"