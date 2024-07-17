const express = require("express");
const config = require("./config");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 20,
    },
  })
);

const rfid = require("./routes/rfid");
const student = require("./routes/student");
const instructor = require("./routes/instructor");
const attendance = require("./routes/attendance");
const admin = require("./routes/admin");

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  clients.add(ws);

  ws.on('message', (message) => {
    console.log('Received message:', message);
  });

  ws.on('close', (code, reason) => {
    clients.delete(ws);
    console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
  });

  ws.on('error', (error) => {
    clients.delete(ws);
    console.error('WebSocket error:', error);
  });
});

app.broadcast = (message) => {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

app.use("/rfid", rfid);
app.use("/student", student);
app.use("/instructor", instructor);
app.use("/attendance", attendance);
app.use("/admin", admin);

server.listen(config.port, () =>
  console.log(`Server is running on http://localhost:${config.port}`)
);
