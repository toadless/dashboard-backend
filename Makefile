.ONESHELL: # Make should use 1 shell so directories work as intended
.DELETE_ON_ERROR: # Fail fast if a command fails

ROOT_DIR := $(PWD)

all: clean build after

clean:
	@echo 'Cleaning up before building...'
	cd $(ROOT_DIR)
	rm -rf build/
	mkdir build/

build: clean
	@echo 'Building the backend'
	npx tsc

after:
	@echo 'Built! Wrote to build/'