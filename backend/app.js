const express = require("express");
const config = require("./config");
const session = require('express-session');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser")

const app = express();
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json())

app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        secure:false,
        maxAge:1000 * 60 * 15
    }
}));

app.use(express.json());

const rfid = require("./routes/rfid");
const student = require("./routes/student");
const instructor = require("./routes/instructor");
const attendance = require("./routes/attendance");

app.use("/rfid", rfid);
app.use("/student", student);
app.use("/instructor", instructor);
app.use("/attendance", attendance);

app.listen(config.port, () => console.log(`Server is running on http://localhost:${config.port}`));
