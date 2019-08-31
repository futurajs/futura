.PHONY: all
all: build

# Distribution
.PHONY: build
build:
	$(MAKE) -C ../../
	@npm run build --silent

# Development
.PHONY: develop
develop:
	$(MAKE) -C ../../
	@npm start --silent

# Clean
.PHONY: clean
clean:
	$(RM) -R _build/
