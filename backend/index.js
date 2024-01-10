const express = require('express');
const app = express();
const cors = require('cors');

const regionRouter = require('./routes/regionRouter');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
const HOST_TO_SHOW = HOST === "0.0.0.0" ? "localhost" : HOST;
const PORT_TO_SHOW = PORT === process.env.PORT_TO_SHOW || PORT;

app.use(cors());

app.use('/region', regionRouter);

app.listen(PORT, HOST, () => {
    console.log(`Backend server listening on http://${HOST_TO_SHOW}:${PORT_TO_SHOW}`);
});