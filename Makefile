.PHONY: all
all: build

# Build
.PHONY: build
build: node_modules
	@npm run build

.PHONY: build
clean-build: clean node_modules
	$(MAKE) build

# Publish
.PHONY: publish.prelease
publish.prelease: clean-build
	@lerna publish prerelease

# Clean
.PHONY: clean distclean
clean: node_modules
	@npm run clean

distclean: clean
	$(RM) -R node_modules

# Internals
node_modules: package.json $(wildcard packages/*/package.json)
	npm prune
	npm install
	touch "$@"
