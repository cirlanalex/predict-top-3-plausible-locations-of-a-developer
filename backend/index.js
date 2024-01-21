const express = require('express');
const app = express();
const cors = require('cors');

const regionRouter = require('./routes/regionRouter');

const PORT_OPEN = process.env.PORT_OPEN;
const HOST_OPEN = process.env.HOST_OPEN;
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
const HOST_TO_SHOW = HOST === "0.0.0.0" ? "localhost" : HOST;

app.use(cors());

app.use('/region', regionRouter);

app.listen(PORT_OPEN, HOST_OPEN, () => {
    console.log(`Backend server listening on http://${HOST_TO_SHOW}:${PORT}`);
    console.log('Some endpoints to try:');
    console.log(`http://${HOST_TO_SHOW}:${PORT}/region/cirlanalex/getRegionByWebsite`);
    console.log(`http://${HOST_TO_SHOW}:${PORT}/region/cirlanalex/getRegionByEmail`);
    console.log(`http://${HOST_TO_SHOW}:${PORT}/region/cirlanalex/getRegionByLocation`);
    console.log(`http://${HOST_TO_SHOW}:${PORT}/region/ViorelMocanu/getRegionByLanguage`);
    console.log(`http://${HOST_TO_SHOW}:${PORT}/region/cirlanalex/getRegionByTimezone`);
    console.log(`http://${HOST_TO_SHOW}:${PORT}/region/cirlanalex/getRegionByAll`);
});