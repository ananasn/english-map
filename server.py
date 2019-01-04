# --*-- coding:utf-8 --*--

import os

import tornado.gen
import tornado.ioloop
import tornado.template
import tornado.web
import tornado.websocket

PORT = 8181
HOST = "127.0.0.1"


class Handler(tornado.web.RequestHandler):
    def get(self):
        self.render(os.path.join(os.path.dirname(__file__), "index.html"))


if __name__ == "__main__":
    settings = {"static_path": os.path.join(os.path.dirname(__file__), "static")}
    app = tornado.web.Application([
        (r"/", Handler),
        (r"/(.*)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
    ], **settings)
    app.listen(PORT)

    main_loop = tornado.ioloop.IOLoop.instance()
    main_loop.start()
