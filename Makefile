install:
	# yarn build
	cp build/static/css/main.*.css ../t-rex/src/webserver/static/viewer.css
	sed -e 's!http://127.0.0.1:6767!!g' -e 's!sourceMappingURL=.*.map!!g' build/static/js/main.*.js >../t-rex/src/webserver/static/viewer.js

test:
	cp build/static/css/main.*.css ../t-rex/public/main.css
	sed -e 's!http://127.0.0.1:6767!!g' -e 's!sourceMappingURL=.*.map!!g' build/static/js/main.*.js >../t-rex/public/main.js
