install:
	# yarn build
	sed -e 's!http://127.0.0.1:6767!!g' build/static/css/main.*.css >../t-rex/t-rex-webserver/src/static/viewer.css
	sed -e 's!http://127.0.0.1:6767!!g' -e 's!sourceMappingURL=.*.map!!g' build/static/js/main.*.js >../t-rex/t-rex-webserver/src/static/viewer.js

test:
	sed -e 's!http://127.0.0.1:6767!!g' >../t-rex/public/main.css
	sed -e 's!http://127.0.0.1:6767!!g' -e 's!sourceMappingURL=.*.map!!g' build/static/js/main.*.js >../t-rex/public/main.js
