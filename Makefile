.PHONY: default test selftest jshint

default: test

test: selftest jshint

selftest:
	casperjs test --testSlow='yes' --ignore-ssl-errors='yes' --casperIncludes="." --includes="Eval.js" tests/

jshint:
	jshint .
