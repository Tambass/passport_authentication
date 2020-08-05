const express = require("express");

const app = express();

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 1987;

app.listen(PORT, console.log(`Ecoute le port : ${PORT}`));
