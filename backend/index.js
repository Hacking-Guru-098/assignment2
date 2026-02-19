const express = require("express");
const os = require("os");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/free-mem", (req, res) => {
    res.json({ data: os.freemem() });
});

app.get("/total-mem", (req, res) => {
    res.json({ data: os.totalmem() });
});

app.get("/cpu-arch", (req, res) => {
    res.json({ data: os.arch() });
});

app.get("/user-info", (req, res) => {
    res.json({ data: os.userInfo() });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
