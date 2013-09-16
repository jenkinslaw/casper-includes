.PHONY: default test selftest jshint

default: test

test: selftest jshint

selftest:
ifdef CASPERJS
	$(CASPERJS) test --testSlow='yes' --ignore-ssl-errors='yes' --casperIncludes="." --includes="Eval.js" tests/
else 
	casperjs test --testSlow='yes' --ignore-ssl-errors='yes' --casperIncludes="." --includes="Eval.js" tests/
endif

jshint:
	jshint .
