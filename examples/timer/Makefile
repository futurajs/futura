.PHONY: all
all: build

# Distribution
.PHONY: build
build: node_modules
	@npm run build --silent

# Development
.PHONY: develop
develop: node_modules
	@npm start --silent

# Clean
.PHONY: clean distclean
clean:
	$(RM) -R _build/

distclean: clean
	$(RM) -R node_modules

# Internals
node_modules: package.json
	lerna bootstrap
	touch "$@"
