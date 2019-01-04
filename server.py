# --*-- coding:utf-8 --*--

import tornado.web
import tornado.websocket
import tornado.template
import tornado.ioloop
import tornado.gen
import os

PORT = 8181
HOST = "127.0.0.1"

class Handler(tornado.web.RequestHandler):
	def get(self):
		self.render(os.path.join(os.path.dirname(__file__), "index.html"))


class HTTPHandler(tornado.web.RequestHandler):
	def get(self):
		loader = tornado.template.Loader(".")
		self.write(loader.load(os.path.join(os.path.dirname(__file__),
            "index.html")).generate(host=HOST, port=PORT))

class WebSocketsHandler(tornado.websocket.WebSocketHandler):
	clients = []
	
	def open(self):
		print("socket opened")

	def on_message(self, m):
		print("get message")
        

	def on_close(self):
		print("socket closed")


if __name__ == "__main__":
	settings = {"static_path": os.path.join(os.path.dirname(__file__), "static")}
	app = tornado.web.Application([
		(r"/", HTTPHandler),
		(r"/ws", WebSocketsHandler),
		(r"/(.*)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
	], **settings)
	app.listen(PORT)
	
	main_loop = tornado.ioloop.IOLoop.instance()
	main_loop.start()