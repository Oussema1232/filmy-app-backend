const express = require("express");
const winston = require("winston");

const app = express();

require("./startup/database")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/validate")();


const port = process.env.PORT || 3001;
const server = app.listen(port, winston.info(`connecting on PORT ${port}`));

module.exports = server;
