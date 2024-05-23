const express = require('express');
const { google } = require('googleapis');
const app = express();
const port = 3000;
const cors = require("cors");

const keyFilename = "./key.json";

const auth = new google.auth.GoogleAuth({
    keyFilename,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly']
});

const analyticsreporting = google.analyticsreporting({
    version: 'v4',
    auth
});

app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"]
}));

app.get('/getAllData', async (req, res) => {
    let { metrics, dimensions, startDate, endDate, timeGranularity } = req.query;

    // Ensure metrics and dimensions are arrays (single query param won't automatically be an array)
    if (!Array.isArray(metrics)) metrics = [metrics];
    if (!Array.isArray(dimensions)) dimensions = [dimensions];

    // Add time granularity dimension
    let timeDimension;
    switch (timeGranularity) {
        case 'day':
            timeDimension = 'ga:date';
            break;
        case 'month':
            timeDimension = 'ga:yearMonth';
            break;
        case 'year':
            timeDimension = 'ga:year';
            break;
        default:
            res.status(400).send("Invalid time granularity");
            return;
    }
    dimensions.push(timeDimension);

    let allData = [];
    let pageToken = null;
    let morePagesExist = true;

    while (morePagesExist) {
        try {
            const response = await analyticsreporting.reports.batchGet({
                requestBody: {
                    reportRequests: [{
                        viewId: "",
                        dateRanges: [{
                            startDate,
                            endDate
                        }],
                        metrics: metrics.map(expression => ({ expression })),
                        dimensions: dimensions.map(name => ({ name })),
                        pageToken: pageToken
                    }]
                }
            });

            const reportData = response.data.reports[0].data;
            if (reportData.rows) {
                allData.push(...reportData.rows);
            }
            pageToken = response.data.reports[0].nextPageToken;
            morePagesExist = !!pageToken;
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).send("Failed to fetch data");
            return;
        }
    }

    res.json(allData);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
