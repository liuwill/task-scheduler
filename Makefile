install:
	npm install

server:
	make install && npm run build && npm run dev
