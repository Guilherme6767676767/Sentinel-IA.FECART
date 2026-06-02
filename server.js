const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = Number(process.env.PORT || 3000);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH"]
    }
  });

  global.io = io;

  io.on("connection", (socket) => {
    socket.emit("sentinel:connected", { ok: true });
  });

  httpServer.listen(port, () => {
    console.log(`Sentinel IA rodando em http://${hostname}:${port}`);
  });
});
