install:
	# yarn build
	sed -e 's!http://127.0.0.1:6767!!g' dist/src.*.css >../t-rex/t-rex-webserver/src/static/viewer.css
	sed -e 's!http://127.0.0.1:6767!!g' -e 's!sourceMappingURL=.*.map!!g' dist/src.*.js >../t-rex/t-rex-webserver/src/static/viewer.js

test:
	sed -e 's!http://127.0.0.1:6767!!g' dist/src.*.css >../t-rex/public/viewer.css
	sed -e 's!http://127.0.0.1:6767!!g' -e 's!sourceMappingURL=.*.map!!g' dist/static/js/main.*.js >../t-rex/public/main.js
