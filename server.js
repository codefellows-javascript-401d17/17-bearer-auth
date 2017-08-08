const express = require('express');
const debug = require('debug')('friendster:server.js');


const PORT = process.env.PORT || 8000;
const app = express();

app.listen(PORT, () => debug(`Server on PORT ${PORT}`));
